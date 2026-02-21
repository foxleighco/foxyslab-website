import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import { createElement } from "react";

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

// Mock next/image — returns React element
vi.mock("next/image", () => ({
  default: function MockImage(props: Record<string, unknown>) {
    const { fill: _fill, priority: _priority, ...rest } = props;
    return createElement("img", rest);
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
