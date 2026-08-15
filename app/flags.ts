import { flag } from "flags/next";

/*
 * This module is passed wholesale to `getProviderData()`, which requires every
 * export to be a flag definition — so nothing else can live here. The build-time
 * newsletter value lives in `lib/feature-flags.ts`; see the note there for why
 * the layout must not evaluate a flag.
 */

/**
 * Retained so the flag stays visible and documented in the Vercel Toolbar, and
 * as the entry point if newsletter visibility ever needs to vary per request.
 * Do not call this from the root layout — see `lib/feature-flags.ts`.
 */
export const newsletterFlag = flag<boolean>({
  key: "newsletter",
  defaultValue: false,
  description: "Show newsletter signup sections",
  decide() {
    return process.env.FLAG_NEWSLETTER === "true";
  },
});
