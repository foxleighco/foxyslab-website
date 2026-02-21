import { describe, it, expect } from "vitest";
import { parseFrontmatter } from "../frontmatter";

const validFrontmatter = {
  title: "Test Post",
  description: "A test blog post",
  publishedAt: "2025-06-15",
  tags: ["test", "blog"],
};

describe("parseFrontmatter", () => {
  it("parses valid frontmatter", () => {
    const result = parseFrontmatter(validFrontmatter);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("Test Post");
      expect(result.data.description).toBe("A test blog post");
      expect(result.data.tags).toEqual(["test", "blog"]);
      expect(result.data.publishedAt).toBeInstanceOf(Date);
    }
  });

  it("applies defaults for optional fields", () => {
    const result = parseFrontmatter(validFrontmatter);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.featured).toBe(false);
      expect(result.data.status).toBe("draft");
      expect(typeof result.data.author).toBe("string");
    }
  });

  it("rejects missing required fields", () => {
    const result = parseFrontmatter({ title: "Only Title" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Invalid frontmatter");
    }
  });

  it("rejects empty title", () => {
    const result = parseFrontmatter({
      ...validFrontmatter,
      title: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects title exceeding 200 characters", () => {
    const result = parseFrontmatter({
      ...validFrontmatter,
      title: "a".repeat(201),
    });

    expect(result.success).toBe(false);
  });

  it("rejects empty tags array", () => {
    const result = parseFrontmatter({
      ...validFrontmatter,
      tags: [],
    });

    expect(result.success).toBe(false);
  });

  it("rejects more than 10 tags", () => {
    const result = parseFrontmatter({
      ...validFrontmatter,
      tags: Array(11).fill("tag"),
    });

    expect(result.success).toBe(false);
  });

  it("accepts valid status values", () => {
    const draft = parseFrontmatter({ ...validFrontmatter, status: "draft" });
    const published = parseFrontmatter({
      ...validFrontmatter,
      status: "published",
    });

    expect(draft.success).toBe(true);
    expect(published.success).toBe(true);
  });

  it("rejects invalid status values", () => {
    const result = parseFrontmatter({
      ...validFrontmatter,
      status: "archived",
    });

    expect(result.success).toBe(false);
  });

  it("coerces date strings to Date objects", () => {
    const result = parseFrontmatter(validFrontmatter);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.publishedAt).toBeInstanceOf(Date);
    }
  });

  it("returns issues array on validation failure", () => {
    const result = parseFrontmatter({});

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.issues).toBeDefined();
      expect(result.issues!.length).toBeGreaterThan(0);
    }
  });
});
