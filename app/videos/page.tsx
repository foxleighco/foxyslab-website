import { Suspense } from "react";
import { Metadata } from "next";
import { VideoCard } from "@/components/VideoCard";
import { PlaylistFilter } from "@/components/PlaylistFilter";
import { getLatestVideos, getPlaylists, getPlaylistVideos } from "@/lib/youtube";
import { siteConfig } from "@/site.config";

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
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-white/70 text-lg mb-2">Unable to load videos</p>
        <p className="text-white/50 text-sm mb-4">{result.error}</p>
        <a
          href="/videos"
          className="inline-block px-6 py-2 bg-primary rounded-full font-semibold hover:bg-primary/80 transition-colors"
        >
          Try Again
        </a>
      </div>
    );
  }

  const videos = result.data;

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/50 mb-4">
          <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-white/70 text-lg">No videos in this playlist yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(SKELETON_COUNT)].map((_, i) => (
          <div
            key={i}
            className="bg-secondary/50 rounded-xl aspect-video animate-pulse"
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {currentPlaylist ? currentPlaylist.title : "All Videos"}
        </h1>
        <p className="text-xl text-white/70">
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
        <div className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-yellow-500 text-sm">
            Unable to load playlist filters. Showing all videos.
          </p>
        </div>
      )}

      {/* Video Grid - Key prop forces re-render when playlist changes */}
      <Suspense key={playlistId || "all"} fallback={<VideoGridSkeleton />}>
        <VideoGrid playlistId={playlistId} />
      </Suspense>

      {/* View on YouTube */}
      <div className="mt-12 text-center">
        <a
          href={siteConfig.social.youtubeVideos}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-4 gradient-primary rounded-full font-bold hover:opacity-90 transition-opacity"
        >
          View All on YouTube
        </a>
      </div>
    </div>
  );
}
