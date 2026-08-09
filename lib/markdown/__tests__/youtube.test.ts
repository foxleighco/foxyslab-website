import { describe, it, expect } from "vitest";
import { parseYouTubeBlock, renderYouTubeBlock } from "../youtube";

describe("parseYouTubeBlock", () => {
  it("parses a bare video ID", () => {
    const result = parseYouTubeBlock("rq9jzgeZ3G8");

    expect(result).toEqual({
      id: "rq9jzgeZ3G8",
      title: "",
      isPlaceholder: false,
    });
  });

  it("parses an ID with a title on the next line", () => {
    const result = parseYouTubeBlock("mjCOosMBd84\nNetwork Nodes");

    expect(result).toEqual({
      id: "mjCOosMBd84",
      title: "Network Nodes",
      isPlaceholder: false,
    });
  });

  it("ignores surrounding whitespace and blank lines", () => {
    const result = parseYouTubeBlock("\n  rq9jzgeZ3G8  \n\n  A title  \n");

    expect(result?.id).toBe("rq9jzgeZ3G8");
    expect(result?.title).toBe("A title");
  });

  it("recognises the placeholder marker", () => {
    const result = parseYouTubeBlock("PLACEHOLDER\nPart 3");

    expect(result).toEqual({
      id: "PLACEHOLDER",
      title: "Part 3",
      isPlaceholder: true,
    });
  });

  it("rejects IDs that are the wrong length", () => {
    expect(parseYouTubeBlock("tooshort")).toBeNull();
    expect(parseYouTubeBlock("waaaaaaaaaaaaytoolong")).toBeNull();
  });

  it("rejects IDs containing invalid characters", () => {
    expect(parseYouTubeBlock("abc!defghij")).toBeNull();
    expect(parseYouTubeBlock('" onload="x')).toBeNull();
  });

  it("returns null for empty content", () => {
    expect(parseYouTubeBlock("")).toBeNull();
    expect(parseYouTubeBlock("   \n  ")).toBeNull();
  });
});

describe("renderYouTubeBlock", () => {
  it("renders a nocookie iframe for a valid video", () => {
    const html = renderYouTubeBlock({
      id: "rq9jzgeZ3G8",
      title: "Common and Function nodes",
      isPlaceholder: false,
    });

    expect(html).toContain(
      'src="https://www.youtube-nocookie.com/embed/rq9jzgeZ3G8"'
    );
    expect(html).toContain('title="Common and Function nodes"');
    expect(html).toContain('loading="lazy"');
    expect(html).toContain("allowfullscreen");
  });

  it("falls back to a generic title when none is given", () => {
    const html = renderYouTubeBlock({
      id: "rq9jzgeZ3G8",
      title: "",
      isPlaceholder: false,
    });

    expect(html).toContain('title="YouTube video"');
  });

  it("escapes HTML in the title", () => {
    const html = renderYouTubeBlock({
      id: "rq9jzgeZ3G8",
      title: 'Nasty"><script>alert(1)</script>',
      isPlaceholder: false,
    });

    expect(html).not.toContain("<script>");
    expect(html).toContain("&quot;");
    expect(html).toContain("&lt;script&gt;");
  });

  it("renders a placeholder box instead of an iframe", () => {
    const html = renderYouTubeBlock({
      id: "PLACEHOLDER",
      title: "Part 3",
      isPlaceholder: true,
    });

    expect(html).toContain("video-embed-placeholder");
    expect(html).toContain("Part 3");
    expect(html).not.toContain("<iframe");
  });
});
