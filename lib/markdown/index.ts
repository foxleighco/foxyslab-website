/**
 * Markdown Processing Library
 *
 * Main exports for the markdown processing pipeline.
 */

// Main processing functions
export {
  processMarkdown,
  parseMarkdownMeta,
  toBlogPost,
  toBlogPostMeta,
  type ProcessedMarkdown,
  type MarkdownResult,
  type MarkdownMetaResult,
  type ParsedMeta,
} from "./processor";

// Frontmatter types and utilities
export {
  frontmatterSchema,
  parseFrontmatter,
  type Frontmatter,
  type FrontmatterInput,
  type FrontmatterResult,
} from "./frontmatter";

// TOC utilities
export { extractHeadings, buildTocTree } from "./headings";

// Reading time and excerpt
export { calculateReadingTime, generateExcerpt } from "./reading-time";

// Highlighter (for advanced use cases)
export { getHighlighter, loadLanguage, SHIKI_THEME } from "./highlighter";
