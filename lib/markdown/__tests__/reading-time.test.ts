import { describe, it, expect } from "vitest";
import { calculateReadingTime, generateExcerpt } from "../reading-time";

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
    const longText = "This is a really long sentence that goes on and on and should eventually be truncated at some word boundary.";
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
