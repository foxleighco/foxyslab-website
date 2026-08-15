# syntax=docker/dockerfile:1
FROM node:22-alpine AS base

# Stage 1: Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Non-secret build inputs. These are fine as ARGs: the flags are booleans and
# NEXT_PUBLIC_GA_ID is served to browsers by definition.
ARG FLAG_BLOG=false
ARG FLAG_NEWSLETTER=false
ARG NEXT_PUBLIC_GA_ID
ENV NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID
ENV FLAG_BLOG=$FLAG_BLOG
ENV FLAG_NEWSLETTER=$FLAG_NEWSLETTER

# These are mounted rather than passed as ARGs. All three are needed at build
# time — the YouTube pages and the homepage shop are prerendered, and the
# layout encrypts flag definitions — but an ARG is recorded in image history
# and an ENV persists in layer metadata, so either would outlive the build.
# A secret mount exists only for the duration of this RUN.
#
# The `|| true` keeps a missing secret from failing at `cat`, so it surfaces as
# the application's own error instead: a build with no key is meant to fail
# loudly, but with a message that says what to do about it. Note that a
# placeholder value would not — see lib/youtube.ts.
#
# Worth knowing: BuildKit excludes secret *contents* from the cache key, so
# changing a secret alone does not invalidate this layer. After rotating a key,
# build with --no-cache to be sure it is actually picked up.
RUN --mount=type=secret,id=youtube_api_key \
    --mount=type=secret,id=flags_secret \
    --mount=type=secret,id=fourthwall_storefront_token \
    YOUTUBE_API_KEY="$(cat /run/secrets/youtube_api_key 2>/dev/null || true)" \
    FLAGS_SECRET="$(cat /run/secrets/flags_secret 2>/dev/null || true)" \
    FOURTHWALL_STOREFRONT_TOKEN="$(cat /run/secrets/fourthwall_storefront_token 2>/dev/null || true)" \
    npm run build

# Stage 3: Production runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
