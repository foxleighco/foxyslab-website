/**
 * Blog Data Layer
 *
 * Functions for fetching and managing blog posts.
 * Follows the same patterns as lib/youtube.ts
 */

import fs from "fs/promises";
import path from "path";
import {
  processMarkdown,
  parseMarkdownMeta,
  toBlogPost,
  toBlogPostMeta,
} from "./markdown";
import type {
  BlogPost,
  BlogPostMeta,
  BlogQueryOptions,
  FeedItem,
} from "@/types/blog";

// Re-use ApiResult pattern from youtube.ts
export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// Content directories
const BLOG_DIR = path.join(process.cwd(), "content/blog");
const COMMUNITY_DIR = path.join(BLOG_DIR, "community");

/**
 * Check if a directory exists
 */
async function directoryExists(dir: string): Promise<boolean> {
  try {
    const stat = await fs.stat(dir);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Recursively find all markdown files in a directory
 */
async function findMarkdownFiles(dir: string): Promise<string[]> {
  const files: string[] = [];

  if (!(await directoryExists(dir))) {
    return files;
  }

  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Skip community directory when scanning main blog dir
      // (it's handled separately)
      if (entry.name !== "community") {
        files.push(...(await findMarkdownFiles(fullPath)));
      }
    } else if (entry.name.endsWith(".md") || entry.name.endsWith(".mdx")) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Generate slug from file path
 */
function filePathToSlug(filePath: string, baseDir: string): string {
  const relativePath = path.relative(baseDir, filePath);
  return relativePath
    .replace(/\.(md|mdx)$/, "")
    .replace(/\\/g, "/"); // Normalize path separators
}

/**
 * Get all blog post metadata (lightweight, for listings)
 */
export async function getAllBlogPosts(
  options?: BlogQueryOptions
): Promise<ApiResult<BlogPostMeta[]>> {
  try {
    const posts: BlogPostMeta[] = [];

    // Get markdown posts from main blog directory
    const blogFiles = await findMarkdownFiles(BLOG_DIR);

    for (const filePath of blogFiles) {
      const content = await fs.readFile(filePath, "utf-8");
      const result = parseMarkdownMeta(content);

      if (!result.success) {
        console.warn(`Skipping ${filePath}: ${result.error}`);
        continue;
      }

      const slug = filePathToSlug(filePath, BLOG_DIR);
      posts.push(toBlogPostMeta(slug, result.data));
    }

    // Get community posts
    const communityFiles = await findMarkdownFiles(COMMUNITY_DIR);

    for (const filePath of communityFiles) {
      const content = await fs.readFile(filePath, "utf-8");
      const result = parseMarkdownMeta(content);

      if (!result.success) {
        console.warn(`Skipping community post ${filePath}: ${result.error}`);
        continue;
      }

      const slug = "community/" + filePathToSlug(filePath, COMMUNITY_DIR);
      posts.push({
        ...toBlogPostMeta(slug, result.data),
        source: "community",
      });
    }

    // Apply filters
    let filtered = posts;

    // Filter by status (default: published only in production)
    if (options?.status === "all") {
      // Include all
    } else if (options?.status === "draft") {
      filtered = filtered.filter((p) => p.frontmatter.status === "draft");
    } else {
      // Default: published only (or drafts in development)
      const includeDrafts = process.env.NODE_ENV !== "production";
      filtered = filtered.filter(
        (p) => p.frontmatter.status === "published" || includeDrafts
      );
    }

    // Filter by source
    if (options?.source) {
      filtered = filtered.filter((p) => p.source === options.source);
    }

    // Filter by tag
    if (options?.tag) {
      const tag = options.tag.toLowerCase();
      filtered = filtered.filter((p) =>
        p.frontmatter.tags.some((t) => t.toLowerCase() === tag)
      );
    }

    // Filter by category
    if (options?.category) {
      const category = options.category.toLowerCase();
      filtered = filtered.filter(
        (p) => p.frontmatter.category?.toLowerCase() === category
      );
    }

    // Filter by featured
    if (options?.featured !== undefined) {
      filtered = filtered.filter(
        (p) => p.frontmatter.featured === options.featured
      );
    }

    // Sort by date (newest first)
    filtered.sort(
      (a, b) =>
        new Date(b.frontmatter.publishedAt).getTime() -
        new Date(a.frontmatter.publishedAt).getTime()
    );

    // Apply pagination
    const offset = options?.offset ?? 0;
    const limit = options?.limit ?? filtered.length;
    const paginated = filtered.slice(offset, offset + limit);

    return { success: true, data: paginated };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error loading posts";
    console.error("Error loading blog posts:", error);
    return { success: false, error: message };
  }
}

/**
 * Get a single blog post by slug (with full HTML content)
 */
export async function getBlogPostBySlug(
  slug: string
): Promise<ApiResult<BlogPost>> {
  try {
    // Determine if this is a community post
    const isCommunity = slug.startsWith("community/");
    const baseDir = isCommunity ? COMMUNITY_DIR : BLOG_DIR;
    const actualSlug = isCommunity ? slug.replace("community/", "") : slug;

    // Try both .md and .mdx extensions
    const possiblePaths = [
      path.join(baseDir, `${actualSlug}.md`),
      path.join(baseDir, `${actualSlug}.mdx`),
    ];

    let filePath: string | null = null;
    for (const p of possiblePaths) {
      try {
        await fs.access(p);
        filePath = p;
        break;
      } catch {
        // File doesn't exist, try next
      }
    }

    if (!filePath) {
      return { success: false, error: `Post not found: ${slug}` };
    }

    const content = await fs.readFile(filePath, "utf-8");
    const result = await processMarkdown(content);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    // Check draft status in production
    if (
      process.env.NODE_ENV === "production" &&
      result.data.frontmatter.status === "draft"
    ) {
      return { success: false, error: `Post not found: ${slug}` };
    }

    return { success: true, data: toBlogPost(slug, result.data) };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error loading post";
    console.error(`Error loading post ${slug}:`, error);
    return { success: false, error: message };
  }
}

/**
 * Get all unique tags from all posts
 */
export async function getAllTags(): Promise<ApiResult<string[]>> {
  const postsResult = await getAllBlogPosts({ status: "published" });

  if (!postsResult.success) {
    return postsResult as ApiResult<string[]>;
  }

  const tagSet = new Set<string>();
  for (const post of postsResult.data) {
    post.frontmatter.tags.forEach((tag) => tagSet.add(tag));
  }

  const tags = Array.from(tagSet).sort();
  return { success: true, data: tags };
}

/**
 * Get all unique categories from all posts
 */
export async function getAllCategories(): Promise<ApiResult<string[]>> {
  const postsResult = await getAllBlogPosts({ status: "published" });

  if (!postsResult.success) {
    return postsResult as ApiResult<string[]>;
  }

  const categorySet = new Set<string>();
  for (const post of postsResult.data) {
    if (post.frontmatter.category) {
      categorySet.add(post.frontmatter.category);
    }
  }

  const categories = Array.from(categorySet).sort();
  return { success: true, data: categories };
}

/**
 * Get all post slugs (for generateStaticParams)
 */
export async function getAllPostSlugs(): Promise<ApiResult<string[]>> {
  const postsResult = await getAllBlogPosts({ status: "all" });

  if (!postsResult.success) {
    return postsResult as ApiResult<string[]>;
  }

  const slugs = postsResult.data.map((post) => post.slug);
  return { success: true, data: slugs };
}

/**
 * Get featured posts
 */
export async function getFeaturedPosts(
  limit?: number
): Promise<ApiResult<BlogPostMeta[]>> {
  return getAllBlogPosts({
    featured: true,
    limit,
  });
}

/**
 * Get recent posts for widgets/sidebar
 */
export async function getRecentPosts(
  limit: number = 5
): Promise<ApiResult<BlogPostMeta[]>> {
  return getAllBlogPosts({
    limit,
    status: "published",
  });
}

/**
 * Get adjacent posts for navigation
 */
export async function getAdjacentPosts(
  currentSlug: string
): Promise<ApiResult<{ prev?: BlogPostMeta; next?: BlogPostMeta }>> {
  const postsResult = await getAllBlogPosts({ status: "published" });

  if (!postsResult.success) {
    return { success: false, error: postsResult.error };
  }

  const posts = postsResult.data;
  const currentIndex = posts.findIndex((p) => p.slug === currentSlug);

  if (currentIndex === -1) {
    return { success: true, data: {} };
  }

  return {
    success: true,
    data: {
      prev: currentIndex > 0 ? posts[currentIndex - 1] : undefined,
      next: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : undefined,
    },
  };
}

/**
 * Get unified feed (for combined blog/community view)
 */
export async function getUnifiedFeed(
  options?: BlogQueryOptions
): Promise<ApiResult<FeedItem[]>> {
  return getAllBlogPosts(options);
}
