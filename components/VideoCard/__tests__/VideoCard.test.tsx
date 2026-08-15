import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
import { VideoCard } from "../index";
import { mockVideo } from "@/test/fixtures/youtube";

describe("VideoCard", () => {
  it("renders video title", () => {
    render(<VideoCard video={mockVideo} />);
    expect(
      screen.getByText("Getting Started with Home Assistant")
    ).toBeInTheDocument();
  });

  it("renders formatted view count", () => {
    render(<VideoCard video={mockVideo} />);
    expect(screen.getByText("15.0K views")).toBeInTheDocument();
  });

  it("renders formatted like count", () => {
    render(<VideoCard video={mockVideo} />);
    expect(screen.getByText("850 likes")).toBeInTheDocument();
  });

  it("renders formatted duration", () => {
    render(<VideoCard video={mockVideo} />);
    expect(screen.getByText("12:30")).toBeInTheDocument();
  });

  /*
   * The first thumbnail on /videos is the LCP element. It was lazy-loaded,
   * which deferred the largest paint behind the rest of the page — a
   * regression that costs real seconds while looking completely fine.
   */
  it("lazy-loads the thumbnail by default", () => {
    render(<VideoCard video={mockVideo} />);
    expect(screen.getByAltText(mockVideo.title)).toHaveAttribute(
      "loading",
      "lazy"
    );
  });

  it("eagerly loads the thumbnail when marked as the LCP candidate", () => {
    render(<VideoCard video={mockVideo} priority />);
    const img = screen.getByAltText(mockVideo.title);

    // next/image signals priority by omitting `loading`, not by setting
    // "eager" — verified against the rendered output in a real browser.
    expect(img).not.toHaveAttribute("loading");
    expect(img).toHaveAttribute("fetchpriority", "high");
  });

  it("links to YouTube with external link attributes", () => {
    render(<VideoCard video={mockVideo} />);
    const link = screen.getByRole("link");

    expect(link).toHaveAttribute("href", mockVideo.url);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
