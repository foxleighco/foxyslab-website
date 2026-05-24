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
