import { describe, it, expect } from "vitest";
import { calculateReadingTime, generateExcerpt } from "../reading-time";
import { COLLAPSE_THRESHOLD, countSourceLines } from "../code-blocks";

describe("calculateReadingTime", () => {
  it("returns minimum 1 minute for short content", () => {
    const result = calculateReadingTime("Hello world.");
    expect(result.minutes).toBe(1);
    expect(result.text).toBe("1 min read");
  });

  it("calculates based on word count at 200 wpm", () => {
    // 600 words at 200 wpm = 3 minutes
    const words = Array(600).fill("word").join(" ");
    const result = calculateReadingTime(words);
    expect(result.minutes).toBe(3);
    expect(result.words).toBe(600);
  });

  it("strips frontmatter before counting", () => {
    const content = `---
title: Test
---
Hello world.`;
    const result = calculateReadingTime(content);
    expect(result.words).toBe(2);
  });

  it("accounts for code blocks taking extra time", () => {
    const proseOnly = Array(200).fill("word").join(" ");
    const withCode =
      proseOnly +
      "\n```javascript\nconst a = 1;\nconst b = 2;\nconst c = 3;\nconst d = 4;\nconst e = 5;\n```";

    const proseTime = calculateReadingTime(proseOnly);
    const codeTime = calculateReadingTime(withCode);

    expect(codeTime.minutes).toBeGreaterThanOrEqual(proseTime.minutes);
  });

  it("returns plural text for multiple minutes", () => {
    const words = Array(600).fill("word").join(" ");
    const result = calculateReadingTime(words);
    expect(result.text).toBe("3 min read");
  });
});

describe("generateExcerpt", () => {
  it("returns full text if under max length", () => {
    const result = generateExcerpt("A short text.", 160);
    expect(result).toBe("A short text.");
  });

  it("truncates at word boundary with ellipsis", () => {
    const longText =
      "This is a really long sentence that goes on and on and should eventually be truncated at some word boundary.";
    const result = generateExcerpt(longText, 50);
    expect(result.length).toBeLessThanOrEqual(53); // 50 + "..."
    expect(result).toMatch(/\.\.\.$/);
  });

  it("strips markdown formatting", () => {
    const markdown = "# Heading\n\n**Bold text** and *italic text*.";
    const result = generateExcerpt(markdown);
    expect(result).not.toContain("#");
    expect(result).not.toContain("*");
  });

  it("strips frontmatter", () => {
    const content = `---
title: Test
---
The actual content here.`;
    const result = generateExcerpt(content);
    expect(result).not.toContain("title");
    expect(result).toContain("actual content");
  });

  it("removes code blocks", () => {
    const content = "Before code.\n```js\nconst x = 1;\n```\nAfter code.";
    const result = generateExcerpt(content);
    expect(result).not.toContain("const");
    expect(result).toContain("Before code");
    expect(result).toContain("After code");
  });
});

describe("calculateReadingTime and collapsed code blocks", () => {
  it("ignores blocks long enough to render collapsed", () => {
    const prose = "word ".repeat(200);
    const longBlock = "```json\n" + "x\n".repeat(400) + "```";

    // the long block is collapsed on the page, so it adds nothing
    expect(calculateReadingTime(prose + "\n\n" + longBlock).minutes).toBe(
      calculateReadingTime(prose).minutes
    );
  });

  it("still counts short blocks, which render inline", () => {
    const prose = "word ".repeat(200);
    const shortBlock = "```javascript\n" + "const a = 1;\n".repeat(10) + "```";

    expect(
      calculateReadingTime(prose + "\n\n" + shortBlock).minutes
    ).toBeGreaterThan(calculateReadingTime(prose).minutes);
  });

  it("does not let a pile of collapsed blocks inflate the estimate", () => {
    const prose = "word ".repeat(1000);
    const block = "```json\n" + "x\n".repeat(150) + "```";
    const many = prose + "\n\n" + Array(36).fill(block).join("\n\n");

    expect(calculateReadingTime(many).minutes).toBe(
      calculateReadingTime(prose).minutes
    );
  });

  it("measures a block the same way the collapse plugin does", () => {
    // Trailing blank lines produce no rendered lines, so they must not push a
    // block over the threshold here when the plugin would still render it open.
    const prose = "word ".repeat(200);
    const body = "const a = 1;\n".repeat(COLLAPSE_THRESHOLD - 1);
    const padded = "```javascript\n" + body + "\n\n\n```";

    const lines = countSourceLines(body + "\n\n\n");
    expect(lines).toBeLessThanOrEqual(COLLAPSE_THRESHOLD);

    // Still under the threshold, so it renders inline and must be counted.
    expect(
      calculateReadingTime(prose + "\n\n" + padded).minutes
    ).toBeGreaterThan(calculateReadingTime(prose).minutes);
  });
});

describe("countSourceLines", () => {
  it("ignores trailing newlines", () => {
    expect(countSourceLines("a\nb\nc")).toBe(3);
    expect(countSourceLines("a\nb\nc\n")).toBe(3);
    expect(countSourceLines("a\nb\nc\n\n\n")).toBe(3);
  });

  it("counts an empty block as no lines", () => {
    expect(countSourceLines("")).toBe(0);
    expect(countSourceLines("\n\n")).toBe(0);
  });

  it("counts blank lines inside a block", () => {
    expect(countSourceLines("a\n\nb")).toBe(3);
  });
});
