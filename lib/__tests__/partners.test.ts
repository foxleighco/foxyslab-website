import { describe, it, expect } from "vitest";
import { getYouTubeId } from "../partners";

describe("getYouTubeId", () => {
  it("extracts the id from a standard watch URL", () => {
    expect(getYouTubeId("https://www.youtube.com/watch?v=B_fv-evtqXs")).toBe(
      "B_fv-evtqXs"
    );
  });

  it("extracts the id when other query params are present", () => {
    expect(
      getYouTubeId("https://www.youtube.com/watch?v=B_fv-evtqXs&t=42s")
    ).toBe("B_fv-evtqXs");
  });

  it("extracts the id from a youtu.be short URL", () => {
    expect(getYouTubeId("https://youtu.be/q8gowSrn7Bg")).toBe("q8gowSrn7Bg");
  });

  it("extracts the id from an embed URL", () => {
    expect(
      getYouTubeId("https://www.youtube-nocookie.com/embed/1xiExZwlxfQ")
    ).toBe("1xiExZwlxfQ");
  });

  it("handles ids containing hyphens and underscores", () => {
    expect(getYouTubeId("https://www.youtube.com/watch?v=-WO3XpxX9_Y")).toBe(
      "-WO3XpxX9_Y"
    );
  });

  it("returns null for a URL without a video id", () => {
    expect(getYouTubeId("https://www.youtube.com/@foxyslab")).toBeNull();
  });

  it("returns null for an unrelated URL", () => {
    expect(getYouTubeId("https://example.com/not-a-video")).toBeNull();
  });
});
