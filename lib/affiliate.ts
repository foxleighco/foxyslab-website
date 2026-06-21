/**
 * Helpers for product/affiliate links.
 *
 * Client-safe (no Node APIs) so it can be imported by client components.
 */

/**
 * True when a product link points at Amazon, including `amzn.to`/`amzn.eu`
 * short links. Matches on the URL hostname (with boundary checks) rather than a
 * substring, so domains like `notamazon.com` are correctly excluded.
 */
export function isAmazonLink(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();

    // Short-link domains.
    if (host === "amzn.to" || host === "amzn.eu") {
      return true;
    }

    // Check the registrable domain's second level is exactly "amazon",
    // accounting for two-part TLDs (e.g. amazon.co.uk, amazon.com.au).
    const labels = host.split(".");
    const sld = labels[labels.length - 2];
    const thirdLevel = labels[labels.length - 3];
    const twoPartTld = new Set(["co", "com", "net", "org"]);

    return sld === "amazon" || (twoPartTld.has(sld) && thirdLevel === "amazon");
  } catch {
    return false;
  }
}
