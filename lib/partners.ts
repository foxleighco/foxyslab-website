import partnersData from "@/data/partners.json";

export interface PartnerColors {
  primary: string;
  secondary: string;
}

export interface PartnerDiscount {
  code: string;
  description: string;
  /** Optional affiliate/checkout link that pre-applies the code. */
  link?: string;
}

export interface Partner {
  slug: string;
  name: string;
  logo: string;
  website: string;
  colors: PartnerColors;
  shortDescription: string;
  intro: string;
  /** YouTube watch URLs featuring this partner. */
  videos?: string[];
  /** Discount codes offered through the partnership. */
  discounts?: PartnerDiscount[];
  /** Partners that aren't live yet are hidden from the site. Defaults to true. */
  enabled?: boolean;
}

/** Extract the 11-character video ID from a YouTube watch/share URL. */
export function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/
  );
  return match ? match[1] : null;
}

export const partners: Partner[] = (partnersData as Partner[]).filter(
  (p) => p.enabled !== false
);

export function getPartnerBySlug(slug: string): Partner | undefined {
  return partners.find((p) => p.slug === slug);
}
