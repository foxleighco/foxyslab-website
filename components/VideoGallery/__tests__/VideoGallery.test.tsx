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
        name: "Filter by Tutorials, 2 videos",
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
});
