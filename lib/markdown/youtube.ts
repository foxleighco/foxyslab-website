/**
 * YouTube Embed Plugin
 *
 * Raw HTML is deliberately disabled in the markdown pipeline, so posts cannot
 * drop an <iframe> straight into the body. This plugin gives them a safe way to
 * embed a video part-way through an article instead of only at the top via the
 * `videoId` frontmatter field.
 *
 * Usage in markdown: a fenced block tagged `youtube`, containing the video ID
 * and an optional title on the following line:
 *
 *     ```youtube
 *     dQw4w9WgXcQ
 *     Some video title
 *     ```
 *
 * Use the literal ID `PLACEHOLDER` for a video that has not gone live yet; it
 * renders a visible "coming soon" box instead of a broken player.
 */

import type { Root as HastRoot, Element } from "hast";
import { visit } from "unist-util-visit";

// YouTube IDs are exactly 11 characters of [A-Za-z0-9_-]
const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;
const PLACEHOLDER = "PLACEHOLDER";

/** Escape text destined for an HTML attribute or text node. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface YouTubeBlock {
  id: string;
  title: string;
  isPlaceholder: boolean;
}

/**
 * Parse the body of a ```youtube fence.
 * Returns null when the content is not a usable video reference.
 */
export function parseYouTubeBlock(raw: string): YouTubeBlock | null {
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return null;

  const [id, ...rest] = lines;
  const title = rest.join(" ").trim();

  if (id === PLACEHOLDER) {
    return { id, title, isPlaceholder: true };
  }

  if (!VIDEO_ID.test(id)) return null;

  return { id, title, isPlaceholder: false };
}

/** Build the HTML for a parsed block. */
export function renderYouTubeBlock(block: YouTubeBlock): string {
  const title = block.title || "YouTube video";

  if (block.isPlaceholder) {
    return [
      '<div class="video-embed video-embed-placeholder">',
      `<p class="video-embed-placeholder-title">${escapeHtml(title)}</p>`,
      '<p class="video-embed-placeholder-note">The video goes live shortly. This player will appear here.</p>',
      "</div>",
    ].join("");
  }

  // youtube-nocookie keeps this consistent with the frontmatter embed
  return [
    '<div class="video-embed">',
    `<iframe src="https://www.youtube-nocookie.com/embed/${block.id}"`,
    ` title="${escapeHtml(title)}"`,
    ' loading="lazy"',
    ' allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"',
    " allowfullscreen></iframe>",
    "</div>",
  ].join("");
}

/**
 * Rehype plugin: replace `pre > code.language-youtube` blocks with an embed.
 *
 * Must run before the Shiki plugin, otherwise the fence is treated as an
 * unknown language and left as a plain code block.
 */
export function rehypeYouTube() {
  return () => {
    return (tree: HastRoot) => {
      visit(tree, "element", (node: Element) => {
        if (node.tagName !== "pre") return;

        const codeNode = node.children[0] as Element | undefined;
        if (!codeNode || codeNode.tagName !== "code") return;

        const className = (codeNode.properties?.className as string[]) || [];
        if (!className.includes("language-youtube")) return;

        let raw = "";
        visit(codeNode, "text", (textNode: { value: string }) => {
          raw += textNode.value;
        });

        const block = parseYouTubeBlock(raw);
        // Leave anything unrecognised alone rather than emitting a broken embed
        if (!block) return;

        node.tagName = "div";
        node.properties = { className: ["video-embed-wrapper"] };
        node.children = [
          {
            type: "raw",
            value: renderYouTubeBlock(block),
          } as unknown as Element,
        ];
      });
    };
  };
}
