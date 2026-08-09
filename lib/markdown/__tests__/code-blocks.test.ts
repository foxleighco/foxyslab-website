import { describe, it, expect } from "vitest";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { rehypeCollapseLongCode } from "../code-blocks";

function render(markdown: string, threshold?: number): string {
  return String(
    unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeCollapseLongCode(threshold ? { threshold } : {}))
      .use(rehypeStringify)
      .processSync(markdown)
  );
}

const longJson = "```json\n" + '  "a": 1,\n'.repeat(40) + "```";
const shortJs = "```javascript\nconst a = 1;\nreturn a;\n```";

describe("rehypeCollapseLongCode", () => {
  it("wraps a long block in a collapsed details element", () => {
    const html = render(longJson);

    expect(html).toContain("<details");
    expect(html).toContain("code-collapse");
    expect(html).toContain("<summary");
    // details with no open attribute starts closed
    expect(html).not.toContain("<details open");
  });

  it("labels the block with its language and line count", () => {
    const html = render(longJson);

    expect(html).toContain("JSON (40 lines)");
  });

  it("leaves short blocks alone", () => {
    const html = render(shortJs);

    expect(html).not.toContain("<details");
    expect(html).toContain("<pre>");
  });

  it("respects a custom threshold", () => {
    // 2 lines of code, threshold of 1
    expect(render(shortJs, 1)).toContain("<details");
    expect(render(shortJs, 99)).not.toContain("<details");
  });

  it("keeps the code intact inside the wrapper", () => {
    const html = render("```json\n" + "line\n".repeat(30) + "```");

    expect(html).toContain("<pre");
    expect((html.match(/line/g) || []).length).toBeGreaterThanOrEqual(30);
  });

  it("falls back to a generic label for unknown languages", () => {
    const html = render("```brainfuck\n" + "+\n".repeat(30) + "```");

    expect(html).toContain("code (30 lines)");
  });

  it("does not double-wrap on repeated runs", () => {
    const once = render(longJson);
    const twice = String(
      unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeCollapseLongCode())
        .use(rehypeCollapseLongCode())
        .use(rehypeStringify)
        .processSync(longJson)
    );

    expect((once.match(/<details/g) || []).length).toBe(1);
    expect((twice.match(/<details/g) || []).length).toBe(1);
  });
});
