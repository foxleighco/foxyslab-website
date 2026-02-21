/**
 * Reading Time Calculation
 *
 * Estimates reading time based on word count and code blocks.
 */

import type { ReadingTime } from "@/types/blog";

// Average reading speed (words per minute)
const WORDS_PER_MINUTE = 200;

// Additional time for code blocks (seconds per line)
const CODE_LINE_TIME_SECONDS = 2;

/**
 * Calculate estimated reading time from markdown content.
 * Accounts for both prose and code blocks.
 */
export function calculateReadingTime(content: string): ReadingTime {
  // Remove frontmatter if present
  const contentWithoutFrontmatter = content.replace(/^---[\s\S]*?---/, "");

  // Separate code blocks from prose
  const codeBlockRegex = /```[\s\S]*?```/g;
  const codeBlocks = contentWithoutFrontmatter.match(codeBlockRegex) || [];
  const proseContent = contentWithoutFrontmatter.replace(codeBlockRegex, "");

  // Count words in prose (excluding markdown syntax)
  const cleanProse = proseContent
    .replace(/[#*_~`[\](){}|]/g, "") // Remove markdown syntax
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();

  const words = cleanProse
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  // Calculate time for prose
  const proseMinutes = words / WORDS_PER_MINUTE;

  // Calculate time for code (code takes longer to read/understand)
  const codeLines = codeBlocks.reduce((total, block) => {
    return total + block.split("\n").length - 2; // Subtract fence lines
  }, 0);
  const codeMinutes = (codeLines * CODE_LINE_TIME_SECONDS) / 60;

  // Total time
  const totalMinutes = Math.max(1, Math.ceil(proseMinutes + codeMinutes));

  return {
    minutes: totalMinutes,
    text: totalMinutes === 1 ? "1 min read" : `${totalMinutes} min read`,
    words,
  };
}

/**
 * Generate excerpt from markdown content
 */
export function generateExcerpt(
  content: string,
  maxLength: number = 160
): string {
  // Remove frontmatter
  const contentWithoutFrontmatter = content.replace(/^---[\s\S]*?---/, "");

  // Remove code blocks
  const withoutCode = contentWithoutFrontmatter.replace(/```[\s\S]*?```/g, "");

  // Remove markdown formatting
  const plainText = withoutCode
    .replace(/^#+\s+/gm, "") // Remove headings
    .replace(/[*_~`[\](){}|]/g, "") // Remove formatting
    .replace(/!\[.*?\]\(.*?\)/g, "") // Remove images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Convert links to text
    .replace(/\n+/g, " ") // Replace newlines with spaces
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  // Truncate at word boundary
  const truncated = plainText.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "...";
}
