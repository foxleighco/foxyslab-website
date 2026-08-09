/**
 * Collapsible Code Blocks
 *
 * Long code blocks (flow exports, config dumps) dominate an article when
 * printed in full. This wraps anything over a line threshold in a <details>
 * element so it starts collapsed, with a summary saying what it is and how
 * long it is.
 *
 * It runs before the Shiki plugin, which then highlights the <pre> in place
 * inside the <details>.
 *
 * Collapsing is pure HTML, so it still works with JavaScript disabled. The
 * copy button is added on top by the CodeBlockActions client component.
 */

import type { Root as HastRoot, Element, ElementContent } from "hast";
import { visit } from "unist-util-visit";

/**
 * Blocks longer than this get collapsed.
 *
 * Exported because reading time depends on it: a collapsed block is reference
 * material the reader opts into, not something they read on the way past.
 */
export const COLLAPSE_THRESHOLD = 25;

const DEFAULT_THRESHOLD = COLLAPSE_THRESHOLD;

// Friendly names for the languages we actually use
const LANGUAGE_LABELS: Record<string, string> = {
  json: "JSON",
  javascript: "JavaScript",
  js: "JavaScript",
  typescript: "TypeScript",
  ts: "TypeScript",
  bash: "shell commands",
  sh: "shell commands",
  yaml: "YAML",
  xml: "XML",
  html: "HTML",
  css: "CSS",
  text: "text",
};

export interface CollapseOptions {
  /** Minimum number of lines before a block is collapsed. */
  threshold?: number;
}

/**
 * Count the lines of a block of source.
 *
 * Exported so reading time can measure a block exactly as this plugin does.
 * The two must agree: if they disagree about a block's length they can also
 * disagree about whether it is past COLLAPSE_THRESHOLD, and a block that
 * renders open would then be dropped from the reading estimate (or vice versa).
 *
 * Trailing newlines don't produce rendered lines, so they aren't counted.
 */
export function countSourceLines(raw: string): number {
  const trimmed = raw.replace(/\n+$/, "");
  return trimmed === "" ? 0 : trimmed.split("\n").length;
}

/** Count the lines of source inside a <code> element. */
function countLines(codeNode: Element): number {
  let raw = "";
  visit(codeNode, "text", (textNode: { value: string }) => {
    raw += textNode.value;
  });
  return countSourceLines(raw);
}

function getLanguage(codeNode: Element): string {
  const className = (codeNode.properties?.className as string[]) || [];
  return (
    className
      .find((c) => c.startsWith("language-"))
      ?.replace("language-", "") || "text"
  );
}

function el(
  tagName: string,
  properties: Record<string, unknown>,
  children: ElementContent[]
): Element {
  return { type: "element", tagName, properties, children } as Element;
}

export function rehypeCollapseLongCode(options: CollapseOptions = {}) {
  const threshold = options.threshold ?? DEFAULT_THRESHOLD;

  return () => {
    return (tree: HastRoot) => {
      visit(tree, "element", (node: Element, index, parent) => {
        if (node.tagName !== "pre") return;
        if (parent == null || index == null) return;
        // already wrapped on a previous visit
        if (node.properties?.dataCollapsible) return;

        const codeNode = node.children[0] as Element | undefined;
        if (!codeNode || codeNode.tagName !== "code") return;

        const lines = countLines(codeNode);
        if (lines <= threshold) return;

        const lang = getLanguage(codeNode);
        const label = LANGUAGE_LABELS[lang] ?? "code";

        node.properties = { ...node.properties, dataCollapsible: "true" };

        const details = el("details", { className: ["code-collapse"] }, [
          el("summary", { className: ["code-collapse-summary"] }, [
            el("span", { className: ["code-collapse-label"] }, [
              { type: "text", value: `${label} (${lines} lines)` },
            ]),
            // filled in by CSS so it can reflect the open/closed state
            el("span", { className: ["code-collapse-hint"] }, []),
          ]),
          node as ElementContent,
        ]);

        parent.children[index] = details as ElementContent;
      });
    };
  };
}
