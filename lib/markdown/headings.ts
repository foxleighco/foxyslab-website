/**
 * Heading Extraction for Table of Contents
 *
 * Extracts headings from markdown AST for TOC generation.
 */

import type { Root, Heading, Text } from "mdast";
import { visit } from "unist-util-visit";
import type { TocHeading, TocTree } from "@/types/blog";

/**
 * Generate a URL-safe slug from heading text
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Collapse multiple hyphens
}

/**
 * Extract text content from heading node (handles nested elements)
 */
function getHeadingText(node: Heading): string {
  let text = "";

  visit(node, "text", (textNode: Text) => {
    text += textNode.value;
  });

  return text;
}

/**
 * Extract headings from mdast tree for TOC generation.
 * Returns headings h2-h4 with their text and slugified IDs.
 */
export function extractHeadings(tree: Root): TocHeading[] {
  const headings: TocHeading[] = [];
  const slugCounts = new Map<string, number>();

  visit(tree, "heading", (node: Heading) => {
    // Only include h2, h3, h4 for TOC (h1 is the title)
    if (node.depth >= 2 && node.depth <= 4) {
      const text = getHeadingText(node);
      let slug = slugify(text);

      // Handle duplicate slugs by appending a number
      const count = slugCounts.get(slug) || 0;
      if (count > 0) {
        slug = `${slug}-${count}`;
      }
      slugCounts.set(slugify(text), count + 1);

      headings.push({
        id: slug,
        text,
        level: node.depth as 2 | 3 | 4,
      });
    }
  });

  return headings;
}

/**
 * Build a nested TOC structure for hierarchical rendering
 */
export function buildTocTree(headings: TocHeading[]): TocTree[] {
  const root: TocTree[] = [];
  const stack: { level: number; children: TocTree[] }[] = [
    { level: 1, children: root },
  ];

  for (const heading of headings) {
    const node: TocTree = { heading, children: [] };

    // Pop stack until we find appropriate parent level
    while (stack.length > 1 && stack[stack.length - 1].level >= heading.level) {
      stack.pop();
    }

    // Add to current parent
    stack[stack.length - 1].children.push(node);

    // Push this node as potential parent for deeper headings
    stack.push({ level: heading.level, children: node.children });
  }

  return root;
}
