"use client";

import { useId } from "react";
import { PlaylistInfo } from "@/types/youtube";
import styles from "./styles.module.css";

interface PlaylistFilterProps {
  playlists: PlaylistInfo[];
  activeSlug: string | null;
  onSelect: (slug: string | null) => void;
}

/**
 * Playlist filter.
 *
 * A native select rather than a row of pills. Ten playlists with names of very
 * uneven length made a ragged block that dominated the page above the grid, and
 * every playlist added made it worse — a control that grows with the content it
 * filters is the wrong shape here.
 *
 * Native rather than a custom dropdown on purpose: it is keyboard accessible
 * with no focus management of ours, and gets the platform picker on mobile,
 * which beats anything worth hand-rolling for this. Only the closed state is
 * styleable, which is a fair trade.
 *
 * The counts stay in the option text, so the accessible name matches what is
 * shown — the WCAG 2.5.3 problem the old pills had, avoided by construction
 * this time rather than by removing an aria-label.
 */
export function PlaylistFilter({
  playlists,
  activeSlug,
  onSelect,
}: PlaylistFilterProps) {
  const selectId = useId();

  return (
    <div className={styles.wrapper}>
      <label htmlFor={selectId} className={styles.label}>
        Playlist
      </label>

      <div className={styles.field}>
        <select
          id={selectId}
          value={activeSlug ?? ""}
          onChange={(event) => onSelect(event.target.value || null)}
          className={styles.select}
        >
          <option value="">All videos</option>
          {playlists.map((playlist) => (
            <option key={playlist.id} value={playlist.slug}>
              {playlist.title} ({playlist.itemCount})
            </option>
          ))}
        </select>

        <svg
          className={styles.chevron}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
