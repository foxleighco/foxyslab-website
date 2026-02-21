import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
import { PostCard } from "../index";
import { mockPostMeta, mockFeaturedPostMeta } from "@/test/fixtures/blog";

describe("PostCard", () => {
  it("renders post title", () => {
    render(<PostCard post={mockPostMeta} />);
    expect(
      screen.getByText("Getting Started with Home Assistant")
    ).toBeInTheDocument();
  });

  it("renders excerpt", () => {
    render(<PostCard post={mockPostMeta} />);
    expect(
      screen.getByText(mockPostMeta.excerpt)
    ).toBeInTheDocument();
  });

  it("renders reading time badge", () => {
    render(<PostCard post={mockPostMeta} />);
    expect(screen.getByText("5 min read")).toBeInTheDocument();
  });

  it("links to blog post slug", () => {
    render(<PostCard post={mockPostMeta} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute(
      "href",
      `/blog/${mockPostMeta.slug}`
    );
  });

  it("renders author name", () => {
    render(<PostCard post={mockPostMeta} />);
    expect(screen.getByText("Alexander Foxleigh")).toBeInTheDocument();
  });

  it("renders tags", () => {
    render(<PostCard post={mockPostMeta} />);
    expect(screen.getByText("home-assistant")).toBeInTheDocument();
    expect(screen.getByText("smart-home")).toBeInTheDocument();
    expect(screen.getByText("tutorial")).toBeInTheDocument();
  });

  it("shows featured badge for featured posts", () => {
    render(<PostCard post={mockFeaturedPostMeta} />);
    expect(screen.getByText("Featured")).toBeInTheDocument();
  });

  it("does not show featured badge for non-featured posts", () => {
    render(<PostCard post={mockPostMeta} />);
    expect(screen.queryByText("Featured")).not.toBeInTheDocument();
  });

  it("shows category when present", () => {
    render(<PostCard post={mockFeaturedPostMeta} />);
    expect(screen.getByText("Reviews")).toBeInTheDocument();
  });

  it("hides category when absent", () => {
    render(<PostCard post={mockPostMeta} />);
    expect(screen.queryByText("Reviews")).not.toBeInTheDocument();
  });

  it("shows +N indicator when more than 3 tags", () => {
    render(<PostCard post={mockFeaturedPostMeta} />);
    // mockFeaturedPostMeta has 4 tags, so shows 3 + "+1"
    expect(screen.getByText("+1")).toBeInTheDocument();
  });

  it("formats date in en-GB format", () => {
    render(<PostCard post={mockPostMeta} />);
    // 2025-06-15 in en-GB = "15 Jun 2025"
    expect(screen.getByText("15 Jun 2025")).toBeInTheDocument();
  });
});
