/**
 * Resource Type Definitions
 *
 * Types for resource pages (kit lists, software recommendations, etc.)
 */

export interface ResourceProduct {
  name: string;
  description: string;
  link: string;
  image: string;
  /** Optional grouping heading (e.g. "Hubs", "Sensors"). */
  category?: string;
}

export interface BrandStore {
  name: string;
  link: string;
}

export interface ResourceFrontmatter {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  category: string;
  featured?: boolean;
  videoId?: string;
  blogSlug?: string;
  blogTitle?: string;
  /** Brand store links shown as a subsection below the products. */
  brandStores?: BrandStore[];
}

export interface Resource {
  slug: string;
  frontmatter: ResourceFrontmatter;
  intro: string;
  products: ResourceProduct[];
}

export interface ResourceMeta {
  slug: string;
  frontmatter: ResourceFrontmatter;
  productCount: number;
}
