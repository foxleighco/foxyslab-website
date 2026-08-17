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
  thumbnail: z.string().optional(),
  /**
   * The video this post is the companion to. Shown as an embed at the top, and
   * used to link the video back here from the video listings.
   */
  videoId: z.string().optional(),
  /**
   * Every video this post is the companion to, for articles covering a series.
   * Takes precedence over `videoId`, matching how resources already work.
   *
   * This exists because one post covering three videos could previously only
   * declare one of them, so the other two had no route back to the article —
   * which read as arbitrary rather than as the gap it was.
   */
  videoIds: z.array(z.string()).optional(),

  // Related content
  relatedPosts: z.array(z.string()).optional(),
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
