import { describe, it, expect } from "vitest";
// Plain .mjs, shared with the prebuild scripts.
import { isDraft, parseFrontmatter } from "../../scripts/lib/frontmatter.mjs";

/**
 * Tests the draft rule the sitemap and RSS generators share.
 *
 * The feed and sitemap tests compare generated output against the posts on
 * disk. That catches disagreement between the two, but it cannot prove the
 * draft rule works while no draft exists in the repo — the check would pass
 * vacuously and keep passing if the generators stopped excluding drafts.
 * Raised in review on the Phase 6 PR.
 *
 * Testing the rule directly with fixtures removes that dependency.
 */

const post = (frontmatter: string, body = "") =>
  `---\n${frontmatter}\n---\n\n${body}`;

describe("frontmatter helpers used by the build scripts", () => {
  it("treats a post with status: draft as a draft", () => {
    expect(isDraft(post('title: "X"\nstatus: "draft"'))).toBe(true);
    expect(isDraft(post("title: X\nstatus: draft"))).toBe(true);
  });

  it("treats a published post as published", () => {
    expect(isDraft(post('title: "X"\nstatus: "published"'))).toBe(false);
  });

  it("treats a post with no status as published", () => {
    expect(isDraft(post('title: "X"'))).toBe(false);
  });

  /*
   * The rule used to be a regex over the whole file. The Node-RED article is
   * largely YAML and JSON snippets, so a body line beginning `status: draft` is
   * entirely plausible — and would have silently dropped a published post from
   * both the feed and the sitemap.
   */
  it("ignores a status line in the body", () => {
    const source = post(
      'title: "Node-RED nodes"\nstatus: "published"',
      ["Here is an example flow:", "", "```yaml", "status: draft", "```"].join(
        "\n"
      )
    );

    expect(isDraft(source)).toBe(false);
  });

  it("ignores frontmatter-looking text that isn't frontmatter", () => {
    // No leading block, so there is nothing to read.
    expect(isDraft("status: draft\n\n# A post")).toBe(false);
    expect(parseFrontmatter("no frontmatter here")).toBeNull();
  });

  it("reads the scalar fields the generators rely on", () => {
    const fields = parseFrontmatter(
      post('title: "A Post"\npublishedAt: 2026-01-01\ndescription: "Hello"')
    );

    expect(fields).toMatchObject({
      title: "A Post",
      publishedAt: "2026-01-01",
      description: "Hello",
    });
  });
});
