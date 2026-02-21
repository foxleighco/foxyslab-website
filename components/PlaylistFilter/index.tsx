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
        <button
          onClick={() => onSelect(null)}
          aria-pressed={!activeSlug}
          aria-label="Show all videos"
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
              aria-label={`Filter by ${playlist.title}, ${playlist.itemCount} videos`}
              className={`${styles.pill} ${isActive ? styles.pillActive : styles.pillInactive}`}
            >
              {playlist.title}
              <span className={styles.count} aria-hidden="true">
                ({playlist.itemCount})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
