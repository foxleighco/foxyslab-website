/**
 * Resources Data Layer
 *
 * Functions for fetching and managing resource pages (kit lists, etc.).
 * Follows the same patterns as lib/blog.ts
 */

import * as Sentry from "@sentry/nextjs";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import type {
  Resource,
  ResourceMeta,
  ResourceProduct,
  ResourceFrontmatter,
} from "@/types/resource";

export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

const RESOURCES_DIR = path.join(process.cwd(), "content/resources");

/**
 * Parse a resource markdown file into frontmatter, intro text, and products
 */
function parseResourceFile(rawContent: string): {
  frontmatter: ResourceFrontmatter;
  intro: string;
  products: ResourceProduct[];
} {
  const { data, content } = matter(rawContent);

  const frontmatter = data as ResourceFrontmatter;

  // Split on the products marker
  const parts = content.split("<!--products-->");
  const intro = parts[0].trim();

  let products: ResourceProduct[] = [];
  if (parts[1]) {
    const jsonStr = parts[1].trim();
    products = JSON.parse(jsonStr);
  }

  return { frontmatter, intro, products };
}

/**
 * Get all resource metadata (for listing page)
 */
export async function getAllResources(): Promise<ApiResult<ResourceMeta[]>> {
  return Sentry.startSpan(
    { op: "resources.query", name: "getAllResources" },
    async (span) => {
      try {
        let files: string[];
        try {
          const entries = await fs.readdir(RESOURCES_DIR);
          files = entries.filter(
            (f) => f.endsWith(".md") || f.endsWith(".mdx")
          );
        } catch {
          // Directory doesn't exist yet
          return { success: true, data: [] };
        }

        const resources: ResourceMeta[] = [];

        for (const file of files) {
          const filePath = path.join(RESOURCES_DIR, file);
          const raw = await fs.readFile(filePath, "utf-8");
          const { frontmatter, products } = parseResourceFile(raw);
          const slug = file.replace(/\.(md|mdx)$/, "");

          resources.push({
            slug,
            frontmatter,
            productCount: products.length,
          });
        }

        // Sort by date (newest first)
        resources.sort(
          (a, b) =>
            new Date(b.frontmatter.publishedAt).getTime() -
            new Date(a.frontmatter.publishedAt).getTime()
        );

        span.setAttribute("resources.count", resources.length);
        return { success: true, data: resources };
      } catch (error) {
        Sentry.captureException(error);
        const message =
          error instanceof Error
            ? error.message
            : "Unknown error loading resources";
        console.error("Error loading resources:", error);
        return { success: false, error: message };
      }
    }
  );
}

/**
 * Get a single resource by slug
 */
export async function getResourceBySlug(
  slug: string
): Promise<ApiResult<Resource>> {
  return Sentry.startSpan(
    { op: "resources.query", name: "getResourceBySlug" },
    async (span) => {
      span.setAttribute("resources.slug", slug);

      try {
        const possiblePaths = [
          path.join(RESOURCES_DIR, `${slug}.md`),
          path.join(RESOURCES_DIR, `${slug}.mdx`),
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
          return { success: false, error: `Resource not found: ${slug}` };
        }

        const raw = await fs.readFile(filePath, "utf-8");
        const { frontmatter, intro, products } = parseResourceFile(raw);

        return {
          success: true,
          data: { slug, frontmatter, intro, products },
        };
      } catch (error) {
        Sentry.captureException(error);
        const message =
          error instanceof Error
            ? error.message
            : "Unknown error loading resource";
        console.error(`Error loading resource ${slug}:`, error);
        return { success: false, error: message };
      }
    }
  );
}

/**
 * Get all resource slugs (for generateStaticParams)
 */
export async function getAllResourceSlugs(): Promise<ApiResult<string[]>> {
  const result = await getAllResources();

  if (!result.success) {
    return result as ApiResult<string[]>;
  }

  return { success: true, data: result.data.map((r) => r.slug) };
}
