import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import userEvent from "@testing-library/user-event";
import { useRouter, useSearchParams } from "next/navigation";
import { PlaylistFilter } from "../index";
import { mockPlaylist, mockPlaylist2 } from "@/test/fixtures/youtube";

describe("PlaylistFilter", () => {
  it("renders 'All Videos' pill plus playlist pills", () => {
    render(<PlaylistFilter playlists={[mockPlaylist, mockPlaylist2]} />);

    expect(
      screen.getByRole("button", { name: "Show all videos" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: `Filter by ${mockPlaylist.title}, ${mockPlaylist.itemCount} videos`,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: `Filter by ${mockPlaylist2.title}, ${mockPlaylist2.itemCount} videos`,
      })
    ).toBeInTheDocument();
  });

  it("'All Videos' is pressed when no playlist is selected", () => {
    render(<PlaylistFilter playlists={[mockPlaylist]} />);

    expect(
      screen.getByRole("button", { name: "Show all videos" })
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("shows playlist as pressed when selected via search params", () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams(`playlist=${mockPlaylist.id}`) as ReturnType<
        typeof useSearchParams
      >
    );

    render(<PlaylistFilter playlists={[mockPlaylist]} />);

    expect(
      screen.getByRole("button", {
        name: `Filter by ${mockPlaylist.title}, ${mockPlaylist.itemCount} videos`,
      })
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: "Show all videos" })
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("calls router.push when a playlist pill is clicked", async () => {
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
    render(<PlaylistFilter playlists={[mockPlaylist]} />);

    await user.click(
      screen.getByRole("button", {
        name: `Filter by ${mockPlaylist.title}, ${mockPlaylist.itemCount} videos`,
      })
    );

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining(`playlist=${mockPlaylist.id}`),
      { scroll: false }
    );
  });

  it("displays item count for each playlist", () => {
    render(<PlaylistFilter playlists={[mockPlaylist]} />);

    expect(screen.getByText(`(${mockPlaylist.itemCount})`)).toBeInTheDocument();
  });

  it("renders empty state with just 'All Videos'", () => {
    render(<PlaylistFilter playlists={[]} />);

    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(
      screen.getByRole("button", { name: "Show all videos" })
    ).toBeInTheDocument();
  });
});
