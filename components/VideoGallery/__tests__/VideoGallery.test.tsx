import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import userEvent from "@testing-library/user-event";
import { useRouter, useSearchParams } from "next/navigation";
import { VideoGallery } from "../index";
import { mockVideo, mockVideo2 } from "@/test/fixtures/youtube";
import type { YouTubeVideo } from "@/types/youtube";

function buildVideos(count: number): YouTubeVideo[] {
  return Array.from({ length: count }, (_, i) => ({
    ...mockVideo,
    id: `video-${i}`,
    title: `Video ${i + 1}`,
  }));
}

const playlists = [
  { id: "PL1", title: "Tutorials", slug: "tutorials", itemCount: 2 },
  { id: "PL2", title: "Reviews", slug: "reviews", itemCount: 1 },
];

const playlistVideoMap: Record<string, string[]> = {
  PL1: [mockVideo.id, mockVideo2.id],
  PL2: [mockVideo2.id],
};

const playlistSlugMap: Record<string, string> = {
  tutorials: "PL1",
  reviews: "PL2",
};

const defaultProps = {
  videos: [mockVideo, mockVideo2],
  playlists,
  playlistVideoMap,
  playlistSlugMap,
};

describe("VideoGallery", () => {
  it("renders all videos when no playlist is selected", () => {
    render(<VideoGallery {...defaultProps} />);

    expect(screen.getByText(mockVideo.title)).toBeInTheDocument();
    expect(screen.getByText(mockVideo2.title)).toBeInTheDocument();
  });

  it("renders page header with 'All Videos' when no filter active", () => {
    render(<VideoGallery {...defaultProps} />);

    expect(
      screen.getByRole("heading", { name: "All Videos" })
    ).toBeInTheDocument();
  });

  it("filters videos when playlist slug is in URL", () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams("playlist=reviews") as ReturnType<
        typeof useSearchParams
      >
    );

    render(<VideoGallery {...defaultProps} />);

    expect(screen.getByText(mockVideo2.title)).toBeInTheDocument();
    expect(screen.queryByText(mockVideo.title)).not.toBeInTheDocument();
  });

  it("shows all videos when URL contains an invalid slug", () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams("playlist=nonexistent") as ReturnType<
        typeof useSearchParams
      >
    );

    render(<VideoGallery {...defaultProps} />);

    expect(screen.getByText(mockVideo.title)).toBeInTheDocument();
    expect(screen.getByText(mockVideo2.title)).toBeInTheDocument();
  });

  it("calls router.push with slug when playlist is selected", async () => {
    const mockPush = vi.fn();
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    });

    const user = userEvent.setup();
    render(<VideoGallery {...defaultProps} />);

    await user.click(
      screen.getByRole("button", {
        name: "Tutorials (2)",
      })
    );

    expect(mockPush).toHaveBeenCalledWith("/videos?playlist=tutorials", {
      scroll: false,
    });
  });

  it("does not show pagination when 12 or fewer videos", () => {
    render(<VideoGallery {...defaultProps} />);

    expect(
      screen.queryByRole("navigation", { name: "Video pagination" })
    ).not.toBeInTheDocument();
  });

  it("shows pagination when more than 12 videos", () => {
    const manyVideos = buildVideos(15);

    render(
      <VideoGallery
        {...defaultProps}
        videos={manyVideos}
        playlistVideoMap={{}}
        playlistSlugMap={{}}
      />
    );

    expect(
      screen.getByRole("navigation", { name: "Video pagination" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Page 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Page 2")).toBeInTheDocument();
  });

  it("shows empty state when filtered playlist has no matching videos", () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams("playlist=tutorials") as ReturnType<
        typeof useSearchParams
      >
    );

    render(
      <VideoGallery
        {...defaultProps}
        videos={[]}
        playlistVideoMap={{ PL1: ["nonexistent"] }}
      />
    );

    expect(
      screen.getByText("No videos in this playlist yet")
    ).toBeInTheDocument();
  });

  /*
   * The filter runs over the video list already in the browser rather than an
   * index built at deploy time, which is what keeps results as fresh as the
   * page. These cover the behaviour that decides whether it feels like a search
   * box or an annoyance.
   */
  describe("text filter", () => {
    it("narrows the list as you type", async () => {
      const user = userEvent.setup();
      render(<VideoGallery {...defaultProps} />);

      await user.type(screen.getByRole("searchbox"), "lighting");

      expect(screen.getByText("Smart Lighting Guide")).toBeInTheDocument();
      expect(
        screen.queryByText("Getting Started with Home Assistant")
      ).not.toBeInTheDocument();
    });

    it("matches each word separately rather than the whole phrase", async () => {
      // "assistant home" appears in no title in that order. Requiring the
      // phrase contiguously meant real queries returned nothing.
      const user = userEvent.setup();
      render(<VideoGallery {...defaultProps} />);

      await user.type(screen.getByRole("searchbox"), "assistant home");

      expect(
        screen.getByText("Getting Started with Home Assistant")
      ).toBeInTheDocument();
    });

    it("searches descriptions, not just titles", async () => {
      const user = userEvent.setup();
      render(<VideoGallery {...defaultProps} />);

      await user.type(screen.getByRole("searchbox"), "from scratch");

      expect(
        screen.getByText("Getting Started with Home Assistant")
      ).toBeInTheDocument();
      expect(
        screen.queryByText("Smart Lighting Guide")
      ).not.toBeInTheDocument();
    });

    it("ignores case", async () => {
      const user = userEvent.setup();
      render(<VideoGallery {...defaultProps} />);

      await user.type(screen.getByRole("searchbox"), "SMART LIGHTING");

      expect(screen.getByText("Smart Lighting Guide")).toBeInTheDocument();
    });

    it("announces the result count", async () => {
      const user = userEvent.setup();
      render(<VideoGallery {...defaultProps} />);

      expect(screen.getByRole("status")).toHaveTextContent("2 videos");

      await user.type(screen.getByRole("searchbox"), "lighting");

      expect(screen.getByRole("status")).toHaveTextContent("1 video of 2");
    });

    it("restores everything when cleared", async () => {
      const user = userEvent.setup();
      render(<VideoGallery {...defaultProps} />);

      await user.type(screen.getByRole("searchbox"), "lighting");
      await user.click(screen.getByRole("button", { name: /clear/i }));

      expect(
        screen.getByText("Getting Started with Home Assistant")
      ).toBeInTheDocument();
      expect(screen.getByRole("searchbox")).toHaveValue("");
    });

    it("shows no clear button until there is something to clear", () => {
      render(<VideoGallery {...defaultProps} />);
      expect(screen.queryByRole("button", { name: /clear/i })).toBeNull();
    });

    it("handles a query matching nothing", async () => {
      const user = userEvent.setup();
      render(<VideoGallery {...defaultProps} />);

      await user.type(screen.getByRole("searchbox"), "qqqzzz");

      expect(screen.getByRole("status")).toHaveTextContent("0 videos of 2");
      expect(
        screen.queryByText("Smart Lighting Guide")
      ).not.toBeInTheDocument();
    });
  });
});
