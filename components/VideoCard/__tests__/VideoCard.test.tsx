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

  it("renders video description", () => {
    render(<VideoCard video={mockVideo} />);
    expect(
      screen.getByText("Learn how to set up Home Assistant from scratch.")
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

  it("links to YouTube with external link attributes", () => {
    render(<VideoCard video={mockVideo} />);
    const link = screen.getByRole("link");

    expect(link).toHaveAttribute("href", mockVideo.url);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
