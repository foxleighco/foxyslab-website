/**
 * Markdown Processor Pipeline
 *
 * Full processing pipeline using unified, remark, rehype, and Shiki.
 */

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeStringify from "rehype-stringify";
import matter from "gray-matter";
import type { Root as MdastRoot } from "mdast";
import type { Root as HastRoot, Element } from "hast";
import { visit } from "unist-util-visit";

import { getHighlighter, SHIKI_THEME } from "./highlighter";
import {
  parseFrontmatter,
  type Frontmatter,
  isCommunityFrontmatter,
} from "./frontmatter";
import { extractHeadings, buildTocTree } from "./headings";
import { calculateReadingTime, generateExcerpt } from "./reading-time";
import type {
  BlogPost,
  BlogPostMeta,
  TocHeading,
  TocTree,
  ReadingTime,
  BlogPostSource,
} from "@/types/blog";

// Processed markdown result
export interface ProcessedMarkdown {
  frontmatter: Frontmatter;
  html: string;
  excerpt: string;
  headings: TocHeading[];
  tocTree: TocTree[];
  readingTime: ReadingTime;
  source: BlogPostSource;
}

// Result type following ApiResult pattern
export type MarkdownResult =
  | { success: true; data: ProcessedMarkdown }
  | { success: false; error: string };

// Metadata-only result (for listings)
export type MarkdownMetaResult =
  | {
      success: true;
      data: {
        frontmatter: Frontmatter;
        excerpt: string;
        readingTime: ReadingTime;
        source: BlogPostSource;
      };
    }
  | { success: false; error: string };

/**
 * Custom rehype plugin for Shiki syntax highlighting
 */
function createRehypeShiki(highlighter: Awaited<ReturnType<typeof getHighlighter>>) {
  return () => {
    return async (tree: HastRoot) => {
      const codeBlocks: { node: Element; lang: string; code: string }[] = [];

      // Collect all code blocks
      visit(tree, "element", (node: Element) => {
        if (
          node.tagName === "pre" &&
          node.children[0] &&
          (node.children[0] as Element).tagName === "code"
        ) {
          const codeNode = node.children[0] as Element;
          const className = (codeNode.properties?.className as string[]) || [];
          const lang =
            className
              .find((c) => c.startsWith("language-"))
              ?.replace("language-", "") || "text";

          // Get code text
          let code = "";
          visit(codeNode, "text", (textNode: { value: string }) => {
            code += textNode.value;
          });

          codeBlocks.push({ node, lang, code });
        }
      });

      // Process code blocks with Shiki
      for (const { node, lang, code } of codeBlocks) {
        try {
          const html = highlighter.codeToHtml(code.trim(), {
            lang,
            theme: SHIKI_THEME,
          });

          // Replace pre content with highlighted HTML
          node.tagName = "div";
          node.properties = {
            className: ["code-block", `language-${lang}`],
          };
          node.children = [
            {
              type: "raw",
              value: html,
            } as unknown as Element,
          ];
        } catch {
          // If language not supported, fall back to plain code
          console.warn(`Shiki: Language "${lang}" not supported, using plain text`);
        }
      }
    };
  };
}

/**
 * Process markdown content with full pipeline:
 * 1. Parse frontmatter with gray-matter
 * 2. Validate frontmatter with Zod
 * 3. Parse markdown to mdast
 * 4. Extract headings for TOC
 * 5. Calculate reading time
 * 6. Transform to HTML with syntax highlighting
 */
export async function processMarkdown(
  rawContent: string
): Promise<MarkdownResult> {
  try {
    // Step 1: Parse frontmatter
    const { data: rawFrontmatter, content } = matter(rawContent);

    // Step 2: Validate frontmatter
    const frontmatterResult = parseFrontmatter(rawFrontmatter);
    if (!frontmatterResult.success) {
      return {
        success: false,
        error: frontmatterResult.error,
      };
    }

    const frontmatter = frontmatterResult.data;

    // Step 3: Parse markdown to mdast for heading extraction
    const mdastProcessor = unified().use(remarkParse).use(remarkGfm);
    const mdastTree = mdastProcessor.parse(content) as MdastRoot;

    // Step 4: Extract headings for TOC
    const headings = extractHeadings(mdastTree);
    const tocTree = buildTocTree(headings);

    // Step 5: Calculate reading time and excerpt
    const readingTime = calculateReadingTime(content);
    const excerpt = generateExcerpt(content);

    // Step 6: Get Shiki highlighter
    const highlighter = await getHighlighter();

    // Step 7: Create full processor with syntax highlighting
    const htmlProcessor = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: false })
      .use(rehypeSlug)
      .use(rehypeAutolinkHeadings, {
        behavior: "wrap",
        properties: {
          className: ["heading-anchor"],
        },
      })
      .use(createRehypeShiki(highlighter))
      .use(rehypeStringify, { allowDangerousHtml: true });

    // Step 8: Process to HTML
    const file = await htmlProcessor.process(content);
    const html = String(file);

    // Determine source type
    const source: BlogPostSource = isCommunityFrontmatter(frontmatter)
      ? "community"
      : "markdown";

    return {
      success: true,
      data: {
        frontmatter,
        html,
        excerpt,
        headings,
        tocTree,
        readingTime,
        source,
      },
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error processing markdown";
    console.error("Markdown processing error:", error);
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Lightweight frontmatter-only parsing (for listing pages)
 * Skips expensive HTML processing
 */
export function parseMarkdownMeta(rawContent: string): MarkdownMetaResult {
  try {
    const { data: rawFrontmatter, content } = matter(rawContent);
    const frontmatterResult = parseFrontmatter(rawFrontmatter);

    if (!frontmatterResult.success) {
      return {
        success: false,
        error: frontmatterResult.error,
      };
    }

    const frontmatter = frontmatterResult.data;
    const readingTime = calculateReadingTime(content);
    const excerpt = generateExcerpt(content);
    const source: BlogPostSource = isCommunityFrontmatter(frontmatter)
      ? "community"
      : "markdown";

    return {
      success: true,
      data: {
        frontmatter,
        excerpt,
        readingTime,
        source,
      },
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error parsing markdown";
    return {
      success: false,
      error: `Failed to parse markdown: ${message}`,
    };
  }
}

/**
 * Convert processed markdown to BlogPost type
 */
export function toBlogPost(
  slug: string,
  processed: ProcessedMarkdown
): BlogPost {
  return {
    slug,
    source: processed.source,
    frontmatter: processed.frontmatter,
    html: processed.html,
    excerpt: processed.excerpt,
    headings: processed.headings,
    tocTree: processed.tocTree,
    readingTime: processed.readingTime,
  };
}

// Type for parsed markdown metadata
export interface ParsedMeta {
  frontmatter: Frontmatter;
  excerpt: string;
  readingTime: ReadingTime;
  source: BlogPostSource;
}

/**
 * Convert parsed metadata to BlogPostMeta type
 */
export function toBlogPostMeta(
  slug: string,
  meta: ParsedMeta
): BlogPostMeta {
  return {
    slug,
    source: meta.source,
    frontmatter: meta.frontmatter,
    excerpt: meta.excerpt,
    readingTime: meta.readingTime,
  };
}
