import type { Metadata } from "next";
import { siteConfig } from "@/site.config";

/**
 * Builds page metadata from a single source of truth.
 *
 * Every route was repeating its title and description three times — once at the
 * top level, once for Open Graph, once for Twitter — with the URL hardcoded
 * alongside. Predictably they drifted: `/enquiries`, `/resources` and `/refer`
 * had no Open Graph tags at all, so sharing them produced a bare link, and only
 * `/supporters` declared a canonical.
 *
 * Canonicals matter here beyond tidiness: the `/refer/*` short links and any
 * `?utm_*` campaign parameters both produce alternate URLs for the same page,
 * and without a canonical those split ranking signals.
 */
export interface PageMetadataOptions {
  title: string;
  description: string;
  /** Site-relative, with a leading slash: "/videos". */
  path: string;
  /** Defaults to the site OG image. */
  image?: string;
  type?: "website" | "article";
  /** Set for pages that should not be indexed, e.g. thin redirect pages. */
  noIndex?: boolean;
}

export function pageMetadata({
  title,
  description,
  path,
  image = siteConfig.ogImage,
  type = "website",
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const url = canonicalUrl(path);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}

/** Absolute URL for a site-relative path. Trailing slashes are dropped. */
export function canonicalUrl(path: string): string {
  const base = siteConfig.url.replace(/\/$/, "");
  if (path === "/") return base;
  return `${base}/${path.replace(/^\//, "").replace(/\/$/, "")}`;
}
