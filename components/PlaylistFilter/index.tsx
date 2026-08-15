"use client";

import { PlaylistInfo } from "@/types/youtube";
import styles from "./styles.module.css";

interface PlaylistFilterProps {
  playlists: PlaylistInfo[];
  activeSlug: string | null;
  onSelect: (slug: string | null) => void;
}

export function PlaylistFilter({
  playlists,
  activeSlug,
  onSelect,
}: PlaylistFilterProps) {
  return (
    <div
      className={styles.wrapper}
      role="navigation"
      aria-label="Filter videos by playlist"
    >
      <div className={styles.pills}>
        {/*
          No aria-label on these buttons. An accessible name that doesn't
          contain the visible text breaks WCAG 2.5.3 (Label in Name): someone
          using voice control says what they can see — "click Uncontrolled
          Conditions" — and nothing matches if the name is "Filter by
          Uncontrolled Conditions, 4 videos".

          The count stays part of the name rather than aria-hidden, so the
          name and the visible text are the same string. The "filter" framing
          is carried by the navigation landmark wrapping these, which is where
          that context belongs anyway.
        */}
        <button
          onClick={() => onSelect(null)}
          aria-pressed={!activeSlug}
          className={`${styles.pill} ${!activeSlug ? styles.pillActive : styles.pillInactive}`}
        >
          All Videos
        </button>
        {playlists.map((playlist) => {
          const isActive = activeSlug === playlist.slug;

          return (
            <button
              key={playlist.id}
              onClick={() => onSelect(playlist.slug)}
              aria-pressed={isActive}
              className={`${styles.pill} ${isActive ? styles.pillActive : styles.pillInactive}`}
            >
              {/* Explicit space: without it the accessible name runs together
                  as "Title(12)", since the gap is only CSS margin. */}
              {playlist.title}{" "}
              <span className={styles.count}>({playlist.itemCount})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
