/**
 * Build-time feature flag values.
 *
 * These are plain constants rather than `flags/next` flags on purpose. Calling
 * a flag reads cookies (the toolbar needs them for per-request overrides), and
 * anything rendered in the root layout — the Footer, in our case — would then
 * opt *every* route in the app into dynamic rendering.
 *
 * That was happening: it silently defeated the `revalidate` exports on every
 * page and forced `Cache-Control: private, no-cache, no-store` site-wide, so
 * no CDN could cache a page and the browser could not restore one from
 * bfcache on back/forward navigation.
 *
 * Nothing is lost by reading the environment directly here. `newsletterFlag`'s
 * `decide()` takes no per-request input, so its result is fixed for the whole
 * deployment either way.
 *
 * If a flag ever needs genuine per-request behaviour, evaluate it in a client
 * component or in an individual route — never in the root layout.
 */
export const showNewsletter = process.env.FLAG_NEWSLETTER === "true";
