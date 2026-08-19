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

/*
 * The filter was a row of toggle pills and is now a select, so these assert
 * option semantics rather than `aria-pressed` buttons. The behaviour under test
 * is unchanged: choosing a playlist reports its slug, choosing the default
 * reports null.
 */
describe("PlaylistFilter", () => {
  it("is a labelled control", () => {
    render(
      <PlaylistFilter
        playlists={[mockPlaylist]}
        activeSlug={null}
        onSelect={vi.fn()}
      />
    );

    expect(screen.getByLabelText("Playlist")).toBeInTheDocument();
  });

  it("offers every playlist plus a default", () => {
    render(
      <PlaylistFilter
        playlists={[mockPlaylist, mockPlaylist2]}
        activeSlug={null}
        onSelect={vi.fn()}
      />
    );

    expect(
      screen.getByRole("option", { name: "All videos" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", {
        name: `${mockPlaylist.title} (${mockPlaylist.itemCount})`,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", {
        name: `${mockPlaylist2.title} (${mockPlaylist2.itemCount})`,
      })
    ).toBeInTheDocument();
  });

  it("shows all videos by default", () => {
    render(
      <PlaylistFilter
        playlists={[mockPlaylist]}
        activeSlug={null}
        onSelect={vi.fn()}
      />
    );

    expect(screen.getByLabelText("Playlist")).toHaveValue("");
  });

  it("reflects the active playlist", () => {
    render(
      <PlaylistFilter
        playlists={[mockPlaylist]}
        activeSlug={mockPlaylist.slug}
        onSelect={vi.fn()}
      />
    );

    expect(screen.getByLabelText("Playlist")).toHaveValue(mockPlaylist.slug);
  });

  it("reports the slug when a playlist is chosen", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();

    render(
      <PlaylistFilter
        playlists={[mockPlaylist]}
        activeSlug={null}
        onSelect={onSelect}
      />
    );

    await user.selectOptions(screen.getByLabelText("Playlist"), [
      mockPlaylist.slug,
    ]);

    expect(onSelect).toHaveBeenCalledWith(mockPlaylist.slug);
  });

  it("reports null when the default is chosen", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();

    render(
      <PlaylistFilter
        playlists={[mockPlaylist]}
        activeSlug={mockPlaylist.slug}
        onSelect={onSelect}
      />
    );

    await user.selectOptions(screen.getByLabelText("Playlist"), [""]);

    // Empty string is the option's value; the caller wants an explicit null.
    expect(onSelect).toHaveBeenCalledWith(null);
  });

  it("shows the video count alongside each playlist", () => {
    render(
      <PlaylistFilter
        playlists={[mockPlaylist]}
        activeSlug={null}
        onSelect={vi.fn()}
      />
    );

    expect(
      screen.getByRole("option", {
        name: `${mockPlaylist.title} (${mockPlaylist.itemCount})`,
      })
    ).toBeInTheDocument();
  });

  it("still offers the default when there are no playlists", () => {
    render(
      <PlaylistFilter playlists={[]} activeSlug={null} onSelect={vi.fn()} />
    );

    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(
      screen.getByRole("option", { name: "All videos" })
    ).toBeInTheDocument();
  });
});
