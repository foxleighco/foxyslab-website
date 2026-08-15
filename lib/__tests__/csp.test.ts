import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Guards the Content-Security-Policy directives that third-party integrations
 * depend on.
 *
 * Every failure here is silent. `connect-src` was missing Sentry's ingest host
 * entirely, so client-side error reports were blocked by the browser and never
 * arrived — the site looked fine, Sentry simply stayed quiet. `worker-src` was
 * absent too, which blocked Session Replay's compression worker; the only
 * evidence was a console message on production that nobody was reading.
 *
 * Asserting on the config source rather than a served response keeps this in
 * the unit suite. It is coarse, but it fails when someone rewrites the header
 * without carrying an entry across, which is the realistic regression.
 */

const CONFIG = readFileSync(
  join(__dirname, "..", "..", "next.config.ts"),
  "utf8"
);

/** Pulls one directive out of the CSP string. */
function directive(name: string): string {
  // Strip the surrounding quotes, or the first directive keeps a leading `"`
  // and never matches.
  const csp = (CONFIG.match(/"default-src[^"]*"/)?.[0] ?? "").replace(
    /^"|"$/g,
    ""
  );
  const found = csp
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name} `));

  return found ?? "";
}

describe("content security policy", () => {
  it("allows Sentry to receive client-side reports", () => {
    // Without this, errors and traces are blocked in the browser and Sentry
    // reports nothing from the client — the exact bug this replaced.
    expect(directive("connect-src")).toContain("ingest.de.sentry.io");
  });

  it("allows Session Replay to load from Sentry's CDN", () => {
    // Replay is lazy-loaded rather than bundled; see instrumentation-client.ts.
    expect(directive("script-src")).toContain("browser.sentry-cdn.com");
  });

  it("allows blob workers, which Session Replay uses to compress", () => {
    expect(directive("worker-src")).toContain("blob:");
  });

  it("still restricts the defaults it is meant to restrict", () => {
    // Guards against someone "fixing" a CSP problem by loosening everything.
    expect(directive("default-src")).toBe("default-src 'self'");
    expect(directive("script-src")).not.toContain("*");
    expect(directive("connect-src")).not.toMatch(/\s\*(\s|$)/);
  });
});
