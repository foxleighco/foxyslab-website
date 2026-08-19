"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useId } from "react";
import { YouTubeVideo, PlaylistInfo } from "@/types/youtube";
import { VideoCard } from "@/components/VideoCard";
import { PlaylistFilter } from "@/components/data-input/PlaylistFilter";
import { PageHeader } from "@/components/PageHeader";
import styles from "./styles.module.css";

const VIDEOS_PER_PAGE = 12;

interface VideoGalleryProps {
  videos: YouTubeVideo[];
  playlists: PlaylistInfo[];
  playlistVideoMap: Record<string, string[]>;
  playlistSlugMap: Record<string, string>;
  /** videoId -> blog slug, for videos that have a companion article. */
  articleSlugByVideoId?: Record<string, string>;
}

export function VideoGallery({
  videos,
  playlists,
  playlistVideoMap,
  playlistSlugMap,
  articleSlugByVideoId = {},
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

  /*
   * Held in component state rather than the URL, unlike the playlist. Pushing a
   * route on every keystroke would spam history and re-run the router for a
   * filter over an array that is already in memory. The trade is that a typed
   * query is not shareable, which matters far less than the playlist being so.
   */
  const [query, setQuery] = useState("");
  const searchInputId = useId();

  const playlistVideos = useMemo(() => {
    if (!activePlaylistId) return videos;

    const videoIds = playlistVideoMap[activePlaylistId];
    if (!videoIds) return videos;

    const idSet = new Set(videoIds);
    return videos.filter((v) => idSet.has(v.id));
  }, [videos, activePlaylistId, playlistVideoMap]);

  /*
   * Filters the list already in the browser rather than an index built at
   * deploy time, so results are exactly as fresh as the page — which ISR keeps
   * within the hour. A new video is findable without a rebuild.
   */
  const filteredVideos = useMemo(() => {
    /*
     * Every word must appear somewhere, rather than the whole phrase appearing
     * contiguously. Matching the raw string meant "node-red basics" found
     * nothing, because no title contains those two words adjacent — which is
     * not how anyone expects a search box to behave.
     */
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return playlistVideos;

    return playlistVideos.filter((video) => {
      const haystack = `${video.title} ${video.description}`.toLowerCase();
      return terms.every((term) => haystack.includes(term));
    });
  }, [playlistVideos, query]);

  /*
   * A query can shrink the list below the current page, which would otherwise
   * leave the visitor on an empty page wondering where everything went.
   */
  const totalPages = Math.ceil(filteredVideos.length / VIDEOS_PER_PAGE);
  /*
   * Clamped rather than reset. Forcing page 1 whenever a query was present made
   * the pagination inert mid-search: 18 results span two pages and the second
   * was unreachable. Clamping still rescues anyone whose current page vanished
   * as the list narrowed.
   */
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
        /*
         * The count is whatever survived both filters, so calling it the
         * playlist total is wrong the moment someone types. Say which filter
         * produced the number rather than asserting the wrong one.
         */
        subtitle={
          query
            ? `${filteredVideos.length} ${
                filteredVideos.length === 1 ? "video matches" : "videos match"
              } "${query}"${activePlaylist ? " in this playlist" : ""}`
            : activePlaylist
              ? `${filteredVideos.length} ${
                  filteredVideos.length === 1 ? "video" : "videos"
                } in this playlist`
              : "Browse through our complete collection of tutorials and guides"
        }
      />

      <div className={styles.filters}>
        <div className={styles.searchRow}>
          <label htmlFor={searchInputId} className="sr-only">
            Search videos by title or description
          </label>
          <div className={styles.searchField}>
            <svg
              className={styles.searchIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" strokeLinecap="round" />
            </svg>
            <input
              id={searchInputId}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search ${playlistVideos.length} ${
                playlistVideos.length === 1 ? "video" : "videos"
              }`}
              className={`${styles.searchInput} ${
                query ? styles.searchInputClearable : ""
              }`}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className={styles.clearButton}
              >
                Clear<span className="sr-only"> search</span>
              </button>
            )}
          </div>

          {playlists.length > 0 && (
            <PlaylistFilter
              /*
               * Normalised: the raw param is whatever is in the URL, and an
               * unknown slug leaves a controlled select with no matching
               * option — blank, while the grid shows everything. The gallery
               * already treats an unknown slug as "no filter"; this makes the
               * control agree with it.
               */
              activeSlug={activePlaylistId ? activeSlug : null}
              playlists={playlists}
              onSelect={handlePlaylistSelect}
            />
          )}
        </div>

        {/*
          Kept as a live region after the visible count was removed. Sighted
          users see the grid change as they type; without this, screen reader
          users would get no feedback at all until they went exploring for it.
        */}
        <p className="sr-only" role="status" aria-live="polite">
          {filteredVideos.length}
          {filteredVideos.length === 1 ? " video" : " videos"}
          {query || activePlaylist ? ` of ${videos.length}` : ""}
        </p>
      </div>

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
          {/*
            An empty grid now has two causes. Telling someone their search
            found nothing is useful; telling them the playlist is empty when
            it is not just sends them looking for a fault that isn't there.
          */}
          <p className={styles.emptyText}>
            {query
              ? `No videos match "${query}"`
              : "No videos in this playlist yet"}
          </p>
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className={styles.emptyAction}
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          <div className={styles.videoGrid}>
            {paginatedVideos.map((video, index) => (
              <VideoCard
                key={video.id}
                video={video}
                /* First thumbnail in the grid is the LCP element on this page.
                   Only the first — see the prop's note in VideoCard. */
                priority={index === 0}
                /* Directly under the page h1 — no section heading between. */
                headingLevel={2}
                articleSlug={articleSlugByVideoId[video.id]}
              />
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
