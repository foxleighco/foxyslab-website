import type { Page } from "@playwright/test";

/**
 * Wait until React has hydrated the given element.
 *
 * Server-rendered markup is interactive-looking long before React attaches to
 * it. Acting in that window is silently lossy: `fill()` sets the DOM value and
 * dispatches an input event, but with no listener attached yet React's state
 * stays empty, so a subsequent submit validates against nothing. `click()` has
 * the same problem, though it hides better because Playwright retries it.
 *
 * There's no standard "hydrated" signal, so this checks for the internal
 * properties React attaches to every DOM node it manages (`__reactFiber$…`,
 * `__reactProps$…`). They're absent in the SSR HTML and appear on hydration,
 * which makes them a precise marker. If React ever renames them this fails
 * loudly on a timeout rather than going quiet.
 *
 * Only needed for client components. Plain links and server-rendered content
 * work before hydration.
 */
export async function waitForHydration(
  page: Page,
  selector: string
): Promise<void> {
  await page.waitForFunction(
    (sel) => {
      const el = document.querySelector(sel);
      if (!el) return false;
      return Object.keys(el).some((key) => key.startsWith("__react"));
    },
    selector,
    { timeout: 15_000 }
  );
}
