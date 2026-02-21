// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
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

  // Disable automatic PII collection (IPs, usernames, etc.) for privacy
  sendDefaultPii: false,
});
