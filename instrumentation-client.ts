// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  integrations: [
    Sentry.consoleLoggingIntegration({ levels: ["warn", "error"] }),
  ],

  // Sample 20% of traces in production, 100% in development
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Disable automatic PII collection (IPs, usernames, etc.) for privacy
  sendDefaultPii: false,
});

/*
 * Session Replay is loaded on demand rather than bundled.
 *
 * Bundling it cost 40kB of First Load JS on every page — 17% of the total —
 * to record 10% of sessions. Fetching it from Sentry's CDN keeps the feature
 * and the sampling rates exactly as they were, at 1kB of bundle instead.
 *
 * This needs `https://browser.sentry-cdn.com` in script-src and `blob:` in
 * worker-src (Replay compresses in a worker); both are in the CSP in
 * next.config.ts. Without them this fails silently, which is what was already
 * happening to the worker before this change.
 *
 * Failure to load is deliberately non-fatal: no replay is an acceptable
 * outcome, breaking the page over it is not.
 */
void Sentry.lazyLoadIntegration("replayIntegration")
  .then((replayIntegration) => {
    Sentry.addIntegration(replayIntegration());
  })
  .catch(() => {
    // CDN unreachable or blocked. Errors and traces still report normally.
  });

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
