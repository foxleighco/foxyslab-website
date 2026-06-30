import referData from "@/data/refer.json";

export interface ReferLink {
  /** The short slug exposed at /refer/<slug>. */
  slug: string;
  /** The destination URL visitors are redirected to. */
  url: string;
  /** Optional human-readable note about where this points. */
  description?: string;
  /** Retired links can be disabled without deleting them. Defaults to true. */
  enabled?: boolean;
}

export const referLinks: ReferLink[] = referData as ReferLink[];

// Build-time guard: fail fast if two entries share a slug (case-insensitive),
// which would otherwise silently shadow one of them. Runs when the module is
// first imported (including during `next build` and the test suite).
const seenSlugs = new Set<string>();
for (const link of referLinks) {
  const key = link.slug.trim().toLowerCase();
  if (seenSlugs.has(key)) {
    throw new Error(
      `Duplicate refer slug in data/refer.json: "${link.slug}". Slugs must be unique.`
    );
  }
  seenSlugs.add(key);
}

/**
 * Look up an active referral link by slug (case-insensitive, trimmed).
 * Disabled links are treated as not found so they fall back gracefully.
 */
export function getReferLink(slug: string): ReferLink | undefined {
  const normalised = slug.trim().toLowerCase();
  const link = referLinks.find((l) => l.slug.toLowerCase() === normalised);
  if (!link || link.enabled === false) {
    return undefined;
  }
  return link;
}
