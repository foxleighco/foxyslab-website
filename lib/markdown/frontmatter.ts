/**
 * Frontmatter Schema and Validation
 *
 * Uses Zod for runtime validation of markdown frontmatter.
 */

import { z } from "zod";
import { siteConfig } from "@/site.config";

// Frontmatter schema matching requirements
export const frontmatterSchema = z.object({
  // Required fields
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  publishedAt: z.coerce.date(),
  tags: z
    .array(z.string())
    .min(1, "At least one tag is required")
    .max(10, "Maximum 10 tags allowed"),

  // Optional fields with defaults
  updatedAt: z.coerce.date().optional(),
  author: z.string().default(siteConfig.author.name),
  category: z.string().optional(),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "published"]).default("draft"),

  // Optional media fields
  heroImage: z.string().optional(),
  videoId: z.string().optional(),

  // Related content
  relatedPosts: z.array(z.string()).optional(),

  // Community post fields (for synced YouTube posts)
  youtubePostId: z.string().optional(),
  youtubeUrl: z.string().url().optional(),
});

// Type inference from schema
export type FrontmatterInput = z.input<typeof frontmatterSchema>;
export type Frontmatter = z.output<typeof frontmatterSchema>;

// Result type following ApiResult pattern
export type FrontmatterResult =
  | { success: true; data: Frontmatter }
  | { success: false; error: string; issues?: z.ZodIssue[] };

/**
 * Parse and validate frontmatter data
 */
export function parseFrontmatter(data: unknown): FrontmatterResult {
  const result = frontmatterSchema.safeParse(data);

  if (!result.success) {
    const issues = result.error.issues;
    const errorMessage = issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");

    return {
      success: false,
      error: `Invalid frontmatter: ${errorMessage}`,
      issues,
    };
  }

  return { success: true, data: result.data };
}

/**
 * Check if frontmatter indicates a community post
 */
export function isCommunityFrontmatter(data: Frontmatter): boolean {
  return !!data.youtubePostId;
}
