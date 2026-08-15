/**
 * Root-level short links (permalinks).
 *
 * Gives stable, memorable URLs like foxyslab.com/discord that redirect to
 * whatever the destination currently is. The point is that the short URL can be
 * said out loud in a video or printed on something, while the destination stays
 * editable — Discord invites in particular expire and get regenerated.
 *
 * Destinations come from siteConfig.social so there's one source of truth: fix
 * the invite there and both the site's own links and this permalink follow.
 *
 * These are wired up as redirects in next.config.ts rather than a route
 * handler. Next matches redirects before routing, so only the configured slugs
 * are intercepted and every other path still reaches the normal router and the
 * branded 404. A catch-all `app/[slug]/route.ts` would swallow every unmatched
 * path instead.
 *
 * Note: unlike /refer/<slug>, these aren't click-tracked, because a redirect
 * never reaches application code. Move a slug to a route handler if you need
 * numbers on it.
 *
 * To add one: put the destination in siteConfig.social, add an entry below,
 * and make sure the slug isn't a real page (a test enforces that).
 */

// Relative rather than the "@/" alias: this module is imported by
// next.config.ts, which Next loads outside the tsconfig path mapping.
import { siteConfig } from "../site.config";

export interface ShortLink {
  /** Path segment exposed at the site root, e.g. "discord" for /discord. */
  slug: string;
  /** Absolute destination URL. */
  url: string;
  /** Why this exists / where it points. */
  description: string;
}

export const shortLinks: ShortLink[] = [
  {
    slug: "discord",
    url: siteConfig.social.discord,
    description:
      "Current Discord invite. Invites expire and get regenerated, so this is the link to share rather than the raw invite.",
  },
  {
    slug: "youtube",
    url: siteConfig.social.youtube,
    description: "YouTube channel.",
  },
  {
    slug: "patreon",
    url: siteConfig.social.patreon,
    description: "Patreon page.",
  },
  {
    slug: "kofi",
    url: siteConfig.social.kofi,
    description: "Ko-fi page, for one-off support.",
  },
  {
    slug: "github",
    url: siteConfig.social.github,
    description: "GitHub profile.",
  },
  {
    slug: "twitter",
    url: siteConfig.social.twitter,
    description: "X / Twitter profile.",
  },
];

/**
 * Fail the build on a bad entry rather than shipping a dead permalink.
 * Runs on import, which includes `next build` and the test suite.
 */
const seen = new Set<string>();
for (const link of shortLinks) {
  // Validate the slug exactly as written, not a normalised copy of it. The
  // redirect source is built from the raw value, so normalising here would let
  // " Discord " pass and then emit `source: "/ Discord "`.
  if (!/^[a-z0-9-]+$/.test(link.slug)) {
    throw new Error(
      `Invalid short-link slug ${JSON.stringify(link.slug)}: use lowercase ` +
        `letters, numbers and hyphens only, with no surrounding whitespace.`
    );
  }
  if (seen.has(link.slug)) {
    throw new Error(
      `Duplicate short-link slug "${link.slug}" in lib/short-links.ts. Slugs must be unique.`
    );
  }
  if (!/^https?:\/\//i.test(link.url)) {
    throw new Error(
      `Short-link "${link.slug}" has a non-absolute destination: ${link.url}`
    );
  }
  seen.add(link.slug);
}

/**
 * Redirect entries for next.config.ts.
 *
 * Temporary (307) on purpose: destinations change, and a permanent redirect
 * gets cached by browsers indefinitely — a stale Discord invite that no amount
 * of redeploying would clear from someone's browser.
 */
export function shortLinkRedirects() {
  return shortLinks.map((link) => ({
    source: `/${link.slug}`,
    destination: link.url,
    permanent: false as const,
  }));
}
