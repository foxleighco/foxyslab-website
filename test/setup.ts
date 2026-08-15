import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import { createElement } from "react";
import { config as loadEnv } from "dotenv";

// Vitest doesn't read .env. Load it so tests gated on a real credential (the
// live Fourthwall image-host check) can run locally instead of always skipping.
// Existing env vars win, so CI secrets aren't overwritten.
loadEnv({ override: false });

// Explicit cleanup for happy-dom
afterEach(() => {
  cleanup();
});

// Mock @sentry/nextjs
vi.mock("@sentry/nextjs", () => {
  const logger = {
    trace: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
    fmt: (strings: TemplateStringsArray, ...values: unknown[]) =>
      strings.reduce((result, str, i) => result + str + (values[i] ?? ""), ""),
  };

  return {
    default: {},
    init: vi.fn(),
    captureException: vi.fn(),
    startSpan: vi.fn(
      (_options: unknown, callback: (span: unknown) => unknown) => {
        const mockSpan = { setAttribute: vi.fn() };
        return callback(mockSpan);
      }
    ),
    logger,
    withSentry: vi.fn((handler: unknown) => handler),
    consoleLoggingIntegration: vi.fn(),
  };
});

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  })),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  usePathname: vi.fn(() => "/"),
  useSelectedLayoutSegment: vi.fn(() => null),
  redirect: vi.fn(),
  notFound: vi.fn(),
}));

/*
 * Mock next/image — returns React element.
 *
 * `priority` is translated rather than discarded, because it is the prop that
 * decides whether an image is eager or lazy, and therefore whether it can be
 * the LCP. Swallowing it meant no test could tell the two apart, so a
 * lazily-loaded LCP image — worth real seconds — looked identical to a
 * correctly prioritised one.
 *
 * `fill` is still dropped: it only produces layout styles, and passing it
 * through would just trigger an unknown-prop warning.
 */
vi.mock("next/image", () => ({
  default: function MockImage(props: Record<string, unknown>) {
    const { fill: _fill, priority, ...rest } = props;
    /*
     * Matches how the real component signals priority: it *omits* `loading`
     * rather than setting "eager", and sets fetchpriority while the image is
     * in flight. Asserting on "eager" would pass here and mean nothing in a
     * browser.
     */
    return createElement("img", {
      ...(priority ? { fetchPriority: "high" } : { loading: "lazy" }),
      ...rest,
    });
  },
}));

// Mock next/link — returns React element
vi.mock("next/link", () => ({
  default: function MockLink({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) {
    return createElement("a", { href, ...rest }, children);
  },
}));
