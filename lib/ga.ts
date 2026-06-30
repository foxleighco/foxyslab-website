import * as Sentry from "@sentry/nextjs";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GA_API_SECRET = process.env.GA_API_SECRET;

/**
 * Send a server-side event to GA4 via the Measurement Protocol.
 *
 * Used where there's no rendered page for the browser gtag to fire on — e.g.
 * the /refer redirect handler. No-op unless both NEXT_PUBLIC_GA_ID and
 * GA_API_SECRET are configured. Failures are swallowed (reported to Sentry) and
 * a short timeout guarantees a slow/broken GA never delays the caller.
 */
export async function trackServerEvent(
  name: string,
  params: Record<string, string | number> = {}
): Promise<void> {
  if (!GA_ID || !GA_API_SECRET) {
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1000);

  try {
    await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${GA_ID}&api_secret=${GA_API_SECRET}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          client_id: crypto.randomUUID(),
          events: [{ name, params }],
        }),
      }
    );
  } catch (error) {
    Sentry.captureException(error);
  } finally {
    clearTimeout(timeout);
  }
}
