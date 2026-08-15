/**
 * Support Options
 *
 * The ways people can support the channel, as shown on /supporters.
 *
 * Content lives in `data/support.json` so tiers and perks can be edited without
 * touching the page. Patreon's tiers in particular are expected to change, and
 * they should only ever need updating in that one file.
 */

import supportData from "@/data/support.json";

export interface SupportTier {
  name: string;
  /**
   * Formatted with its currency symbol, e.g. "£5".
   *
   * Optional: YouTube prices memberships per region, so there's no single
   * figure worth printing. Those tiers omit it and the card renders without
   * a price line rather than showing a misleading one.
   */
  price?: string;
  /** e.g. "per month". Only meaningful alongside a price. */
  cadence?: string;
  /** Highlights the tier as the recommended one. At most one per option. */
  popular?: boolean;
  summary: string;
  /** Omitted for tiers that are deliberately support-only. */
  perks?: string[];
}

export interface SupportOption {
  id: string;
  name: string;
  /** Short label for the commitment, e.g. "One-off" or "Monthly". */
  kind: string;
  headline: string;
  summary: string;
  /** Paragraphs of body copy. */
  body?: string[];
  /** Perks for options without tiers. Tiered options carry perks per tier. */
  perks?: string[];
  /** Caveat or clarification shown under the perks. */
  perksNote?: string;
  currencyNote?: string;
  tiers?: SupportTier[];
  ctaLabel: string;
  url: string;
}

export const supportOptions: SupportOption[] = (
  supportData as { options: SupportOption[] }
).options;

export function getSupportOption(id: string): SupportOption | undefined {
  return supportOptions.find((o) => o.id === id);
}
