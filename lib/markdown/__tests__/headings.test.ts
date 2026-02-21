import { describe, it, expect } from "vitest";
import { extractHeadings, buildTocTree } from "../headings";
import type { Root, Heading } from "mdast";
import type { TocHeading } from "@/types/blog";

function makeHeading(depth: 1 | 2 | 3 | 4 | 5 | 6, text: string): Heading {
  return {
    type: "heading",
    depth,
    children: [{ type: "text", value: text }],
  };
}

function makeTree(...headings: Heading[]): Root {
  return { type: "root", children: headings };
}

describe("extractHeadings", () => {
  it("extracts h2-h4 headings from AST", () => {
    const tree = makeTree(
      makeHeading(2, "Introduction"),
      makeHeading(3, "Sub Section"),
      makeHeading(4, "Detail")
    );

    const result = extractHeadings(tree);

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({
      id: "introduction",
      text: "Introduction",
      level: 2,
    });
    expect(result[1]).toEqual({
      id: "sub-section",
      text: "Sub Section",
      level: 3,
    });
    expect(result[2]).toEqual({
      id: "detail",
      text: "Detail",
      level: 4,
    });
  });

  it("skips h1 headings", () => {
    const tree = makeTree(
      makeHeading(1, "Title"),
      makeHeading(2, "Section")
    );

    const result = extractHeadings(tree);

    expect(result).toHaveLength(1);
    expect(result[0].text).toBe("Section");
  });

  it("skips h5 and h6 headings", () => {
    const tree = makeTree(
      makeHeading(2, "Section"),
      makeHeading(5, "Too Deep"),
      makeHeading(6, "Way Too Deep")
    );

    const result = extractHeadings(tree);

    expect(result).toHaveLength(1);
  });

  it("handles duplicate heading text with unique slugs", () => {
    const tree = makeTree(
      makeHeading(2, "Section"),
      makeHeading(2, "Section"),
      makeHeading(2, "Section")
    );

    const result = extractHeadings(tree);

    expect(result[0].id).toBe("section");
    expect(result[1].id).toBe("section-1");
    expect(result[2].id).toBe("section-2");
  });

  it("slugifies heading text correctly", () => {
    const tree = makeTree(
      makeHeading(2, "Hello World!"),
      makeHeading(2, "With   Multiple   Spaces")
    );

    const result = extractHeadings(tree);

    expect(result[0].id).toBe("hello-world");
    expect(result[1].id).toBe("with-multiple-spaces");
  });
});

describe("buildTocTree", () => {
  it("nests h3 under h2", () => {
    const headings: TocHeading[] = [
      { id: "intro", text: "Intro", level: 2 },
      { id: "detail", text: "Detail", level: 3 },
    ];

    const tree = buildTocTree(headings);

    expect(tree).toHaveLength(1);
    expect(tree[0].heading.text).toBe("Intro");
    expect(tree[0].children).toHaveLength(1);
    expect(tree[0].children[0].heading.text).toBe("Detail");
  });

  it("creates sibling h2 nodes", () => {
    const headings: TocHeading[] = [
      { id: "a", text: "A", level: 2 },
      { id: "b", text: "B", level: 2 },
    ];

    const tree = buildTocTree(headings);

    expect(tree).toHaveLength(2);
  });

  it("nests h4 under h3 under h2", () => {
    const headings: TocHeading[] = [
      { id: "section", text: "Section", level: 2 },
      { id: "sub", text: "Sub", level: 3 },
      { id: "detail", text: "Detail", level: 4 },
    ];

    const tree = buildTocTree(headings);

    expect(tree).toHaveLength(1);
    expect(tree[0].children).toHaveLength(1);
    expect(tree[0].children[0].children).toHaveLength(1);
    expect(tree[0].children[0].children[0].heading.text).toBe("Detail");
  });

  it("handles empty headings array", () => {
    const tree = buildTocTree([]);
    expect(tree).toEqual([]);
  });
});
