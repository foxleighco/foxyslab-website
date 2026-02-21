"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { YouTubeVideo } from "@/types/youtube";
import { VideoCard } from "@/components/VideoCard";
import { PlaylistFilter } from "@/components/PlaylistFilter";
import { PageHeader } from "@/components/PageHeader";
import styles from "./styles.module.css";

const VIDEOS_PER_PAGE = 12;

interface PlaylistInfo {
  id: string;
  title: string;
  slug: string;
  itemCount: number;
}

interface VideoGalleryProps {
  videos: YouTubeVideo[];
  playlists: PlaylistInfo[];
  playlistVideoMap: Record<string, string[]>;
  playlistSlugMap: Record<string, string>;
}

export function VideoGallery({
  videos,
  playlists,
  playlistVideoMap,
  playlistSlugMap,
}: VideoGalleryProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeSlug = searchParams.get("playlist");
  const pageParam = searchParams.get("page");
  const currentPage = Math.max(1, parseInt(pageParam || "1", 10) || 1);

  const activePlaylistId = activeSlug
    ? playlistSlugMap[activeSlug] || null
    : null;

  const activePlaylist = activePlaylistId
    ? playlists.find((p) => p.id === activePlaylistId)
    : null;

  const filteredVideos = useMemo(() => {
    if (!activePlaylistId) return videos;

    const videoIds = playlistVideoMap[activePlaylistId];
    if (!videoIds) return videos;

    const idSet = new Set(videoIds);
    return videos.filter((v) => idSet.has(v.id));
  }, [videos, activePlaylistId, playlistVideoMap]);

  const totalPages = Math.ceil(filteredVideos.length / VIDEOS_PER_PAGE);
  const safePage = Math.min(currentPage, Math.max(1, totalPages));
  const startIndex = (safePage - 1) * VIDEOS_PER_PAGE;
  const paginatedVideos = filteredVideos.slice(
    startIndex,
    startIndex + VIDEOS_PER_PAGE
  );

  function updateUrl(slug: string | null, page: number) {
    const params = new URLSearchParams();
    if (slug) params.set("playlist", slug);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    router.push(qs ? `/videos?${qs}` : "/videos", { scroll: false });
  }

  function handlePlaylistSelect(slug: string | null) {
    updateUrl(slug, 1);
  }

  function handlePageChange(page: number) {
    updateUrl(activeSlug, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Generate page numbers with ellipsis for large ranges
  function getPageNumbers(): (number | "ellipsis")[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "ellipsis")[] = [1];

    if (safePage > 3) pages.push("ellipsis");

    const start = Math.max(2, safePage - 1);
    const end = Math.min(totalPages - 1, safePage + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (safePage < totalPages - 2) pages.push("ellipsis");

    pages.push(totalPages);
    return pages;
  }

  return (
    <>
      <PageHeader
        title={activePlaylist ? activePlaylist.title : "All Videos"}
        subtitle={
          activePlaylist
            ? `${filteredVideos.length} videos in this playlist`
            : "Browse through our complete collection of tutorials and guides"
        }
      />

      {playlists.length > 0 && (
        <PlaylistFilter
          playlists={playlists}
          activeSlug={activeSlug}
          onSelect={handlePlaylistSelect}
        />
      )}

      {paginatedVideos.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg
              className={styles.emptyIconSvg}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className={styles.emptyText}>No videos in this playlist yet</p>
        </div>
      ) : (
        <>
          <div className={styles.videoGrid}>
            {paginatedVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              className={styles.pagination}
              role="navigation"
              aria-label="Video pagination"
            >
              <button
                className={styles.pageNav}
                onClick={() => handlePageChange(safePage - 1)}
                disabled={safePage <= 1}
                aria-label="Previous page"
              >
                Prev
              </button>

              {getPageNumbers().map((item, index) =>
                item === "ellipsis" ? (
                  <span key={`ellipsis-${index}`} aria-hidden="true">
                    &hellip;
                  </span>
                ) : (
                  <button
                    key={item}
                    className={`${styles.pageButton} ${item === safePage ? styles.pageButtonActive : ""}`}
                    onClick={() => handlePageChange(item)}
                    aria-label={`Page ${item}`}
                    aria-current={item === safePage ? "page" : undefined}
                  >
                    {item}
                  </button>
                )
              )}

              <button
                className={styles.pageNav}
                onClick={() => handlePageChange(safePage + 1)}
                disabled={safePage >= totalPages}
                aria-label="Next page"
              >
                Next
              </button>
            </nav>
          )}
        </>
      )}
    </>
  );
}
