/**
 * Shiki Syntax Highlighter
 *
 * Singleton pattern to avoid expensive re-initialization.
 */

import { createHighlighter, type Highlighter } from "shiki";

// Singleton promise - avoids re-creating highlighter
let highlighterPromise: Promise<Highlighter> | null = null;

// Theme configuration matching site's dark design
export const SHIKI_THEME = "github-dark";

// Languages to preload (common in smart home/tech content)
const PRELOADED_LANGUAGES = [
  "typescript",
  "javascript",
  "tsx",
  "jsx",
  "json",
  "yaml",
  "bash",
  "shell",
  "css",
  "html",
  "markdown",
  "python",
  "go",
  "dockerfile",
  "sql",
] as const;

/**
 * Get or create the Shiki highlighter instance.
 * Uses singleton pattern to avoid expensive re-initialization.
 */
export async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [SHIKI_THEME],
      langs: [...PRELOADED_LANGUAGES],
    });
  }

  return highlighterPromise;
}

/**
 * Load additional language on demand (for less common languages)
 */
export async function loadLanguage(lang: string): Promise<boolean> {
  try {
    const highlighter = await getHighlighter();
    const loadedLangs = highlighter.getLoadedLanguages();

    if (!loadedLangs.includes(lang as (typeof loadedLangs)[number])) {
      await highlighter.loadLanguage(
        lang as Parameters<Highlighter["loadLanguage"]>[0]
      );
    }
    return true;
  } catch {
    console.warn(`Failed to load language: ${lang}, falling back to plaintext`);
    return false;
  }
}
