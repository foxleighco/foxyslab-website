import { Metadata } from "next";
import {
  getLatestVideos,
  getPlaylists,
  getPlaylistVideoIds,
  toPlaylistSlug,
} from "@/lib/youtube";
import { VideoGallery } from "@/components/VideoGallery";
import { siteConfig } from "@/site.config";
import styles from "./styles.module.css";

export const metadata: Metadata = {
  title: "Videos | Foxy's Lab",
  description:
    "Watch all the latest smart home tutorials, automation guides, and tech education videos from Foxy's Lab.",
};

export default async function VideosPage() {
  const [videosResult, playlistsResult] = await Promise.all([
    getLatestVideos(200),
    getPlaylists(),
  ]);

  if (!videosResult.success) {
    console.error("[VideosPage] Failed to load videos:", videosResult.error);
    return (
      <div className={`container ${styles.page}`}>
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>
            <svg
              className={styles.errorIconSvg}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className={styles.errorTitle}>Unable to load videos right now</p>
          <p className={styles.errorSubtitle}>
            Please try again later or visit our YouTube channel directly.
          </p>
          <a href="/videos" className={styles.retryLink}>
            Try Again
          </a>
        </div>
      </div>
    );
  }

  const videos = videosResult.data;
  const playlists = playlistsResult.success ? playlistsResult.data : [];

  // Fetch video IDs for each playlist in parallel
  const playlistIdResults = await Promise.all(
    playlists.map((p) => getPlaylistVideoIds(p.id))
  );

  // Build lookup maps
  const playlistVideoMap: Record<string, string[]> = {};
  const playlistSlugMap: Record<string, string> = {};
  const playlistInfos = playlists.map((p, i) => {
    const slug = toPlaylistSlug(p.title);
    const videoIds = playlistIdResults[i].success
      ? playlistIdResults[i].data
      : [];

    playlistVideoMap[p.id] = videoIds;
    playlistSlugMap[slug] = p.id;

    // Count how many of these videos are in our fetched set (after Shorts filtering)
    const videoIdSet = new Set(videos.map((v) => v.id));
    const filteredCount = videoIds.filter((id) => videoIdSet.has(id)).length;

    return {
      id: p.id,
      title: p.title,
      slug,
      itemCount: filteredCount,
    };
  });

  // Only include playlists that have at least one matching video
  const visiblePlaylists = playlistInfos.filter((p) => p.itemCount > 0);

  return (
    <div className={`container ${styles.page}`}>
      <VideoGallery
        videos={videos}
        playlists={visiblePlaylists}
        playlistVideoMap={playlistVideoMap}
        playlistSlugMap={playlistSlugMap}
      />

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
