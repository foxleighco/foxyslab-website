import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import userEvent from "@testing-library/user-event";
import { PlaylistFilter } from "../index";

const mockPlaylist = {
  id: "PLabc123",
  title: "Home Assistant Tutorials",
  slug: "home-assistant-tutorials",
  itemCount: 12,
};

const mockPlaylist2 = {
  id: "PLdef456",
  title: "Smart Home Basics",
  slug: "smart-home-basics",
  itemCount: 8,
};

describe("PlaylistFilter", () => {
  it("renders 'All Videos' pill plus playlist pills", () => {
    render(
      <PlaylistFilter
        playlists={[mockPlaylist, mockPlaylist2]}
        activeSlug={null}
        onSelect={vi.fn()}
      />
    );

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
    render(
      <PlaylistFilter
        playlists={[mockPlaylist]}
        activeSlug={null}
        onSelect={vi.fn()}
      />
    );

    expect(
      screen.getByRole("button", { name: "Show all videos" })
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("shows playlist as pressed when activeSlug matches", () => {
    render(
      <PlaylistFilter
        playlists={[mockPlaylist]}
        activeSlug={mockPlaylist.slug}
        onSelect={vi.fn()}
      />
    );

    expect(
      screen.getByRole("button", {
        name: `Filter by ${mockPlaylist.title}, ${mockPlaylist.itemCount} videos`,
      })
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: "Show all videos" })
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onSelect with slug when a playlist pill is clicked", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();

    render(
      <PlaylistFilter
        playlists={[mockPlaylist]}
        activeSlug={null}
        onSelect={onSelect}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: `Filter by ${mockPlaylist.title}, ${mockPlaylist.itemCount} videos`,
      })
    );

    expect(onSelect).toHaveBeenCalledWith(mockPlaylist.slug);
  });

  it("calls onSelect with null when 'All Videos' is clicked", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();

    render(
      <PlaylistFilter
        playlists={[mockPlaylist]}
        activeSlug={mockPlaylist.slug}
        onSelect={onSelect}
      />
    );

    await user.click(screen.getByRole("button", { name: "Show all videos" }));

    expect(onSelect).toHaveBeenCalledWith(null);
  });

  it("displays item count for each playlist", () => {
    render(
      <PlaylistFilter
        playlists={[mockPlaylist]}
        activeSlug={null}
        onSelect={vi.fn()}
      />
    );

    expect(screen.getByText(`(${mockPlaylist.itemCount})`)).toBeInTheDocument();
  });

  it("renders empty state with just 'All Videos'", () => {
    render(
      <PlaylistFilter playlists={[]} activeSlug={null} onSelect={vi.fn()} />
    );

    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(
      screen.getByRole("button", { name: "Show all videos" })
    ).toBeInTheDocument();
  });
});
