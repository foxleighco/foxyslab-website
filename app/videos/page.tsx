import { Suspense } from "react";
import { Metadata } from "next";
import { VideoCard } from "@/components/VideoCard";
import { PlaylistFilter } from "@/components/PlaylistFilter";
import { getLatestVideos, getPlaylists, getPlaylistVideos } from "@/lib/youtube";
import { siteConfig } from "@/site.config";
import styles from "./styles.module.css";

export const metadata: Metadata = {
  title: "Videos | Foxy's Lab",
  description: "Watch all the latest smart home tutorials, automation guides, and tech education videos from Foxy's Lab.",
};

interface VideosPageProps {
  searchParams: Promise<{ playlist?: string }>;
}

async function VideoGrid({ playlistId }: { playlistId?: string }) {
  const result = playlistId
    ? await getPlaylistVideos(playlistId)
    : await getLatestVideos(50);

  if (!result.success) {
    console.error("[VideoGrid] Failed to load videos:", result.error);
    return (
      <div className={styles.errorState}>
        <div className={styles.errorIcon}>
          <svg className={styles.errorIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className={styles.errorTitle}>Unable to load videos right now</p>
        <p className={styles.errorSubtitle}>Please try again later or visit our YouTube channel directly.</p>
        <a
          href="/videos"
          className={styles.retryLink}
        >
          Try Again
        </a>
      </div>
    );
  }

  const videos = result.data;

  if (videos.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <svg className={styles.emptyIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <p className={styles.emptyText}>No videos in this playlist yet</p>
      </div>
    );
  }

  return (
    <div className={styles.videoGrid}>
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}

function VideoGridSkeleton() {
  const SKELETON_COUNT = 6;
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading videos...</span>
      <div className={styles.videoGrid}>
        {[...Array(SKELETON_COUNT)].map((_, i) => (
          <div
            key={i}
            className={`${styles.skeletonCard} ${styles.skeleton}`}
          />
        ))}
      </div>
    </div>
  );
}

export default async function VideosPage({ searchParams }: VideosPageProps) {
  const params = await searchParams;
  const playlistId = params.playlist;
  const playlistsResult = await getPlaylists();

  // Even if playlists fail to load, we can still show videos
  const playlists = playlistsResult.success ? playlistsResult.data : [];

  const currentPlaylist = playlistId
    ? playlists.find((p) => p.id === playlistId)
    : null;

  return (
    <div className={`container ${styles.page}`}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          {currentPlaylist ? currentPlaylist.title : "All Videos"}
        </h1>
        <p className={styles.subtitle}>
          {currentPlaylist
            ? currentPlaylist.description || `${currentPlaylist.itemCount} videos in this playlist`
            : "Browse through our complete collection of tutorials and guides"}
        </p>
      </div>

      {/* Playlist Filter - No Suspense needed as playlists are already awaited */}
      {playlists.length > 0 && (
        <PlaylistFilter playlists={playlists} />
      )}

      {/* Show error if playlists failed but we still want to show videos */}
      {!playlistsResult.success && (
        <>
          {console.error("[VideosPage] Failed to load playlists:", playlistsResult.error)}
          <div className={styles.playlistWarning}>
            <p className={styles.playlistWarningText}>
              Unable to load playlist filters. Showing all videos.
            </p>
          </div>
        </>
      )}

      {/* Video Grid - Key prop forces re-render when playlist changes */}
      <Suspense key={playlistId || "all"} fallback={<VideoGridSkeleton />}>
        <VideoGrid playlistId={playlistId} />
      </Suspense>

      {/* View on YouTube */}
      <div className={styles.ctaWrapper}>
        <a
          href={siteConfig.social.youtubeVideos}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{ padding: "1rem 2rem", fontWeight: 700 }}
        >
          View All on YouTube
        </a>
      </div>
    </div>
  );
}
