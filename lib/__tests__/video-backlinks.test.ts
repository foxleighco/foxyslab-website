import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

/**
 * Keeps declared companion videos in step with the ones a post actually embeds.
 *
 * Backlinks are deliberately explicit: a video links to an article only because
 * the article's frontmatter names it. Nothing inspects titles or infers
 * relationships. The cost of that is drift — an article can embed a video and
 * forget to declare it, and the video then has no route back with nothing to
 * signal the omission.
 *
 * That is not hypothetical. `node-red-nodes-explained` covers a three-part
 * series but declared only part one, so parts two and three had no backlink,
 * which read as arbitrary rather than as the gap it was.
 *
 * This turns that failure mode into a failing test instead of something you
 * notice months later on the live site.
 */

const BLOG_DIR = join(__dirname, "..", "..", "content", "blog");

/** Video IDs declared in frontmatter, via `videoIds` or the older `videoId`. */
function declaredVideos(source: string): string[] {
  const block = source.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";

  const many = block.match(/^videoIds:\s*\[(.*?)\]/m);
  if (many) {
    return many[1]
      .split(",")
      .map((id) => id.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  }

  const one = block.match(/^videoId:\s*["']?([A-Za-z0-9_-]{11})["']?/m);
  return one ? [one[1]] : [];
}

/**
 * Video IDs embedded in the body via a ```youtube fence.
 *
 * PLACEHOLDER is the plugin's marker for a video that hasn't gone live, so it
 * is not a real ID and must not be required in frontmatter.
 */
function embeddedVideos(source: string): string[] {
  const ids = [...source.matchAll(/```youtube\n([A-Za-z0-9_-]+)/g)].map(
    (match) => match[1]
  );
  return [...new Set(ids)].filter(
    (id) => id !== "PLACEHOLDER" && /^[A-Za-z0-9_-]{11}$/.test(id)
  );
}

const posts = readdirSync(BLOG_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => ({
    slug: entry.name,
    source: readFileSync(join(BLOG_DIR, entry.name, "index.md"), "utf8"),
  }));

describe("video backlinks", () => {
  it("has posts to check", () => {
    expect(posts.length).toBeGreaterThan(0);
  });

  it.each(posts.map((p) => p.slug))(
    "%s declares every video it embeds",
    (slug) => {
      const { source } = posts.find((p) => p.slug === slug)!;
      const declared = declaredVideos(source);
      const missing = embeddedVideos(source).filter(
        (id) => !declared.includes(id)
      );

      // A video embedded but not declared gets no link back to this article.
      expect(missing).toEqual([]);
    }
  );

  it("declares all three parts of the Node-RED series", () => {
    // The case that prompted this: one article, three videos, one declared.
    const { source } = posts.find(
      (p) => p.slug === "node-red-nodes-explained"
    )!;

    expect(declaredVideos(source)).toEqual(
      expect.arrayContaining(["rq9jzgeZ3G8", "mjCOosMBd84", "8cZrrImYKVY"])
    );
  });
});
