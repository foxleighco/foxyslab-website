import { describe, it, expect } from "vitest";
import { jsonLd, getVideoListSchema } from "../structured-data";

/**
 * Guards the escaping in `jsonLd`.
 *
 * The video schema is built from YouTube titles and descriptions — external
 * input, embedded into the page with `dangerouslySetInnerHTML`. Plain
 * `JSON.stringify` leaves `<` untouched, so a title containing `</script>`
 * closes the tag early and everything after it is parsed as HTML. Raised in
 * review on the Phase 5 PR.
 */

const BREAKOUT = "Cool video </script><img src=x onerror=alert(1)>";

describe("jsonLd", () => {
  it("prevents a string from closing the script tag", () => {
    const output = jsonLd({ name: BREAKOUT });

    expect(output).not.toContain("</script>");
    expect(output).not.toContain("<");
    expect(output).toContain("\\u003c");
  });

  it("round-trips to the original value", () => {
    // The escapes are plain JSON, so consumers see exactly what was passed in.
    expect(JSON.parse(jsonLd({ name: BREAKOUT })).name).toBe(BREAKOUT);
  });

  it("escapes the line separators that are valid JSON but break JavaScript", () => {
    const output = jsonLd({ name: "a b c" });

    expect(output).not.toContain(" ");
    expect(output).not.toContain(" ");
    expect(JSON.parse(output).name).toBe("a b c");
  });

  it("escapes ampersands so entities can't be introduced", () => {
    expect(jsonLd({ name: "Tom & Jerry" })).toContain("\\u0026");
  });

  it("keeps a real video schema parseable end to end", () => {
    const output = jsonLd(
      getVideoListSchema([
        {
          title: BREAKOUT,
          description: "Contains </script> too",
          videoId: "abc123",
          publishedAt: "2026-01-01",
        },
      ])
    );

    expect(output).not.toContain("</script>");

    const parsed = JSON.parse(output);
    expect(parsed["@type"]).toBe("ItemList");
    expect(parsed.itemListElement[0].item.name).toBe(BREAKOUT);
  });
});
