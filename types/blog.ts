/**
 * Blog Type Definitions
 *
 * Types for blog posts, frontmatter, and the unified feed.
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

// Source discriminator for feed items
export type BlogPostSource = "markdown" | "community";

// Full blog post with rendered content
export interface BlogPost {
  slug: string;
  source: BlogPostSource;
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
  source: BlogPostSource;
  frontmatter: Frontmatter;
  excerpt: string;
  readingTime: ReadingTime;
}

// Community post specific fields (extends base)
export interface CommunityPostMeta extends BlogPostMeta {
  source: "community";
  youtubePostId?: string;
  youtubeUrl?: string;
}

// Unified feed item (discriminated union for type safety)
export type FeedItem = BlogPostMeta | CommunityPostMeta;

// Filter options for querying posts
export interface BlogQueryOptions {
  limit?: number;
  offset?: number;
  tag?: string;
  category?: string;
  status?: "draft" | "published" | "all";
  featured?: boolean;
  source?: BlogPostSource;
}

// Type guards for discriminated unions
export function isCommunityPost(item: FeedItem): item is CommunityPostMeta {
  return item.source === "community";
}

export function isMarkdownPost(item: FeedItem): item is BlogPostMeta {
  return item.source === "markdown";
}
