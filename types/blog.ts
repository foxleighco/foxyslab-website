/**
 * Blog Type Definitions
 *
 * Types for blog posts and frontmatter.
 */

import type { z } from "zod";
import type { frontmatterSchema } from "@/lib/markdown/frontmatter";

// Inferred type from Zod schema
export type Frontmatter = z.infer<typeof frontmatterSchema>;

// Table of contents heading
export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3 | 4;
}

// Nested TOC tree structure
export interface TocTree {
  heading: TocHeading;
  children: TocTree[];
}

// Reading time result
export interface ReadingTime {
  minutes: number;
  text: string;
  words: number;
}

// Full blog post with rendered content
export interface BlogPost {
  slug: string;
  frontmatter: Frontmatter;
  html: string;
  excerpt: string;
  headings: TocHeading[];
  tocTree: TocTree[];
  readingTime: ReadingTime;
}

// Lightweight metadata for listing pages (no HTML processing)
export interface BlogPostMeta {
  slug: string;
  frontmatter: Frontmatter;
  excerpt: string;
  readingTime: ReadingTime;
}

// Filter options for querying posts
export interface BlogQueryOptions {
  limit?: number;
  offset?: number;
  tag?: string;
  category?: string;
  status?: "draft" | "published" | "all";
  featured?: boolean;
}
