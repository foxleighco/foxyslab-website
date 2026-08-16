import { Metadata } from "next";
import { Suspense } from "react";
import { pageMetadata, canonicalUrl } from "@/lib/seo";
import {
  getVideoListSchema,
  getBreadcrumbSchema,
  jsonLd,
} from "@/lib/structured-data";
import {
  getLatestVideos,
  getPlaylists,
  getPlaylistVideoIds,
  toPlaylistSlug,
} from "@/lib/youtube";
import { VideoGallery } from "@/components/VideoGallery";
import { PageHeader } from "@/components/PageHeader";
import { siteConfig } from "@/site.config";
import styles from "./styles.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Videos | Foxy's Lab",
  description:
    "Watch all the latest smart home tutorials, automation guides, and tech education videos from Foxy's Lab.",
  path: "/videos",
});

export const revalidate = 3600;

export default async function VideosPage() {
  const [videosResult, playlistsResult] = await Promise.all([
    getLatestVideos(200),
    getPlaylists(),
  ]);

  if (!videosResult.success) {
    console.error("[VideosPage] Failed to load videos:", videosResult.error);
    return (
      <div className={`container ${styles.page}`}>
        <PageHeader
          title="All Videos"
          subtitle="Browse through our complete collection of tutorials and guides"
        />
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
  const videoIdSet = new Set(videos.map((v) => v.id));
  const usedSlugs = new Set<string>();

  const playlistInfos = playlists.map((p, i) => {
    let slug = toPlaylistSlug(p.title, p.id);

    // Disambiguate collisions by appending a suffix from the playlist ID
    if (usedSlugs.has(slug)) {
      slug = `${slug}-${p.id.slice(-6).toLowerCase()}`;
    }
    usedSlugs.add(slug);

    const videoIds = playlistIdResults[i].success
      ? playlistIdResults[i].data
      : [];

    playlistVideoMap[p.id] = videoIds;
    playlistSlugMap[slug] = p.id;

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

  /*
   * Only the first 30 are described. The full list is 200 videos, and a
   * multi-hundred-KB JSON-LD blob on every request costs more than the tail of
   * it could ever return in rich results.
   */
  const videoListSchema = jsonLd(
    getVideoListSchema(
      videos.slice(0, 30).map((video) => ({
        title: video.title,
        description: video.description,
        videoId: video.id,
        publishedAt: video.publishedAt,
      }))
    )
  );

  const breadcrumbSchema = jsonLd(
    getBreadcrumbSchema([
      { name: "Home", url: canonicalUrl("/") },
      { name: "Videos", url: canonicalUrl("/videos") },
    ])
  );

  return (
    <div className={`container ${styles.page}`}>
      {/*
        JSON-LD uses dangerouslySetInnerHTML by design: the content is
        generated server-side from trusted config and content, never user
        input. A plain <script> rather than next/script — the latter injects
        client-side, so the markup only existed in the RSC payload and never
        reached crawlers that don't run JavaScript.
      */}
      <script
        id="video-list-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: videoListSchema }}
      />
      <script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbSchema }}
      />
      {/*
        VideoGallery reads search params for playlist filtering. Without a
        Suspense boundary around it, Next bails the *whole route* out to client
        rendering — which is why this page's server HTML contained no h1, no
        structured data and no markup at all, only an RSC payload.

        The fallback renders the unfiltered heading server-side, which is the
        state that matches the canonical URL. The client swaps in the
        playlist-specific title once it takes over.
      */}
      <Suspense
        fallback={
          <PageHeader
            title="All Videos"
            subtitle="Browse through our complete collection of tutorials and guides"
          />
        }
      >
        <VideoGallery
          videos={videos}
          playlists={visiblePlaylists}
          playlistVideoMap={playlistVideoMap}
          playlistSlugMap={playlistSlugMap}
        />
      </Suspense>

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
