"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { YouTubePlaylist } from "@/types/youtube";
import styles from "./styles.module.css";

interface PlaylistFilterProps {
  playlists: YouTubePlaylist[];
}

export function PlaylistFilter({ playlists }: PlaylistFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPlaylist = searchParams.get("playlist");
  const [isPending, startTransition] = useTransition();

  const handleFilterClick = (playlistId: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (playlistId) {
      params.set("playlist", playlistId);
    } else {
      params.delete("playlist");
    }

    startTransition(() => {
      router.push(`/videos?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className={styles.wrapper} role="navigation" aria-label="Filter videos by playlist">
      <div className={styles.pills}>
        <button
          onClick={() => handleFilterClick(null)}
          disabled={isPending}
          aria-pressed={!currentPlaylist}
          aria-label="Show all videos"
          className={`${styles.pill} ${!currentPlaylist ? styles.pillActive : styles.pillInactive}`}
        >
          {isPending && !currentPlaylist ? (
            <span className={styles.loading}>
              <svg className={styles.spinner} viewBox="0 0 24 24">
                <circle className={styles.spinnerBg} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className={styles.spinnerFg} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Loading...
            </span>
          ) : (
            "All Videos"
          )}
        </button>
        {playlists.map((playlist) => {
          const isActive = currentPlaylist === playlist.id;
          const isLoading = isPending && isActive;

          return (
            <button
              key={playlist.id}
              onClick={() => handleFilterClick(playlist.id)}
              disabled={isPending}
              aria-pressed={isActive}
              aria-label={`Filter by ${playlist.title}, ${playlist.itemCount} videos`}
              className={`${styles.pill} ${isActive ? styles.pillActive : styles.pillInactive}`}
            >
              {isLoading ? (
                <span className={styles.loading}>
                  <svg className={styles.spinner} viewBox="0 0 24 24">
                    <circle className={styles.spinnerBg} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className={styles.spinnerFg} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Loading...
                </span>
              ) : (
                <>
                  {playlist.title}
                  <span className={styles.count} aria-hidden="true">
                    ({playlist.itemCount})
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>
      {isPending && (
        <div className="sr-only" role="status" aria-live="polite">
          Loading videos...
        </div>
      )}
    </div>
  );
}
