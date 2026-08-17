/**
 * Minimal frontmatter reading, shared by the sitemap and RSS generators.
 *
 * These run in `prebuild` and cannot import `lib/blog`: that module is
 * TypeScript with path aliases and Sentry instrumentation, none of which a
 * plain node script can load. So the rule for "what is a draft" lives here
 * once, rather than being re-implemented — and subtly differently — in each
 * generator.
 *
 * The parsing is deliberately shallow. It only needs a handful of scalar
 * fields; anything structured (tag arrays, nested objects) is left to the real
 * content pipeline.
 */

/** Returns the frontmatter block's raw text, or null if there isn't one. */
export function frontmatterBlock(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  return match ? match[1] : null;
}

/** Scalar frontmatter fields as a flat object. */
export function parseFrontmatter(source) {
  const block = frontmatterBlock(source);
  if (block === null) return null;

  const fields = {};
  for (const line of block.split("\n")) {
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (!match) continue;
    fields[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
  }
  return fields;
}

/**
 * Whether a post is a draft.
 *
 * Scoped to the frontmatter block on purpose. A previous version matched
 * `/^status:\s*["']?draft/m` against the whole file, which would classify a
 * published post as a draft if its body happened to contain a line beginning
 * `status: draft` — entirely plausible here, given the Node-RED article is
 * largely YAML and JSON snippets.
 */
export function isDraft(source) {
  const fields = parseFrontmatter(source);
  if (!fields) return false;
  return fields.status === "draft";
}
