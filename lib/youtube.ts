import { YouTubeVideo, YouTubeChannel, YouTubePlaylist } from "@/types/youtube";
import { siteConfig } from "@/site.config";

const CHANNEL_HANDLE = siteConfig.youtube.channelHandle;
const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

// Minimum duration in seconds to not be considered a Short
const MIN_VIDEO_DURATION_SECONDS = siteConfig.youtube.minVideoDuration;

// Status codes that are worth retrying
const RETRYABLE_STATUS_CODES = [429, 500, 502, 503, 504];

// Result types for proper error handling
export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

function getApiKey(): string {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey && process.env.NODE_ENV === "production") {
    throw new Error("YOUTUBE_API_KEY is required in production");
  }
  return apiKey || "";
}

/**
 * Parse ISO 8601 duration to seconds
 * e.g., PT1H30M45S -> 5445 seconds
 */
function parseDurationToSeconds(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);

  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Check if a video is a YouTube Short (< 61 seconds)
 */
function isShort(duration: string): boolean {
  const seconds = parseDurationToSeconds(duration);
  return seconds < MIN_VIDEO_DURATION_SECONDS;
}

/**
 * Fetch with retry logic and exponential backoff
 * Only retries on server errors and rate limits, not client errors
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit & { next?: { revalidate: number } },
  retries: number = MAX_RETRIES
): Promise<Response> {
  let lastError: Error | null = null;
  let lastResponse: Response | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url, options);

      // Don't retry client errors (4xx except 429)
      if (!response.ok && !RETRYABLE_STATUS_CODES.includes(response.status)) {
        return response;
      }

      // If rate limited or server error, retry with backoff
      if (!response.ok && attempt < retries - 1) {
        lastResponse = response;
        const delay = RETRY_DELAY_MS * Math.pow(2, attempt);
        console.warn(
          `Request failed with ${response.status}, retrying in ${delay}ms (attempt ${attempt + 1}/${retries})...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < retries - 1) {
        const delay = RETRY_DELAY_MS * Math.pow(2, attempt);
        console.warn(`Fetch error, retrying in ${delay}ms:`, error);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // Return last response if we have one, otherwise throw
  if (lastResponse) {
    return lastResponse;
  }
  throw lastError || new Error("Failed to fetch after retries");
}

interface YouTubeApiChannelResponse {
  items?: Array<{
    id: string;
    snippet: {
      title: string;
      description: string;
      thumbnails: {
        default?: { url: string };
        medium?: { url: string };
        high?: { url: string };
      };
    };
    statistics: {
      subscriberCount: string;
      videoCount: string;
      viewCount: string;
    };
    contentDetails: {
      relatedPlaylists: {
        uploads: string;
      };
    };
  }>;
  error?: {
    message: string;
    code: number;
  };
}

interface YouTubeApiPlaylistItemsResponse {
  items?: Array<{
    snippet: {
      resourceId: {
        videoId: string;
      };
    };
  }>;
  error?: {
    message: string;
    code: number;
  };
}

interface YouTubeApiVideoResponse {
  items?: Array<{
    id: string;
    snippet: {
      title: string;
      description: string;
      publishedAt: string;
      thumbnails: {
        default?: { url: string };
        medium?: { url: string };
        high?: { url: string };
        maxres?: { url: string };
      };
    };
    statistics: {
      viewCount: string;
      likeCount: string;
    };
    contentDetails: {
      duration: string;
    };
  }>;
  error?: {
    message: string;
    code: number;
  };
}

interface YouTubeApiPlaylistsResponse {
  items?: Array<{
    id: string;
    snippet: {
      title: string;
      description: string;
      thumbnails: {
        default?: { url: string };
        medium?: { url: string };
        high?: { url: string };
      };
    };
    contentDetails: {
      itemCount: number;
    };
  }>;
  error?: {
    message: string;
    code: number;
  };
}

/**
 * Get channel data - relies on Next.js fetch cache for deduplication
 */
async function getChannelData(): Promise<ApiResult<YouTubeApiChannelResponse["items"]>> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { success: false, error: "No API key configured" };
  }

  try {
    const response = await fetchWithRetry(
      `${YOUTUBE_API_BASE}/channels?part=snippet,statistics,contentDetails&forHandle=${CHANNEL_HANDLE}&key=${apiKey}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      console.error(`[YouTube] Channel API error: ${response.status} ${response.statusText}`);
      return {
        success: false,
        error: `YouTube API error: ${response.status} ${response.statusText}`,
      };
    }

    const data: YouTubeApiChannelResponse = await response.json();

    if (data.error) {
      return { success: false, error: data.error.message };
    }

    if (!data.items || data.items.length === 0) {
      return { success: false, error: "Channel not found" };
    }

    return { success: true, data: data.items };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching channel data:", message);
    return { success: false, error: message };
  }
}

/**
 * Fetch video details by IDs and filter out Shorts
 */
async function fetchVideoDetails(
  videoIds: string[],
  apiKey: string,
  filterShorts: boolean = true
): Promise<ApiResult<YouTubeVideo[]>> {
  if (videoIds.length === 0) {
    return { success: true, data: [] };
  }

  try {
    const response = await fetchWithRetry(
      `${YOUTUBE_API_BASE}/videos?part=snippet,statistics,contentDetails&id=${videoIds.join(",")}&key=${apiKey}`,
      { next: { revalidate: 1800 } }
    );

    if (!response.ok) {
      console.error(`[YouTube] Video details API error: ${response.status} ${response.statusText}`);
      return {
        success: false,
        error: `Failed to fetch video details: ${response.status}`,
      };
    }

    const data: YouTubeApiVideoResponse = await response.json();

    if (data.error) {
      return { success: false, error: data.error.message };
    }

    if (!data.items) {
      return { success: true, data: [] };
    }

    const videos = data.items
      .filter((video) => !filterShorts || !isShort(video.contentDetails.duration))
      .map((video) => ({
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnail:
          video.snippet.thumbnails.maxres?.url ||
          video.snippet.thumbnails.high?.url ||
          video.snippet.thumbnails.medium?.url ||
          video.snippet.thumbnails.default?.url ||
          "/images/foxys-lab-logo-round.png",
        publishedAt: video.snippet.publishedAt,
        viewCount: video.statistics.viewCount || "0",
        likeCount: video.statistics.likeCount || "0",
        duration: video.contentDetails.duration,
        url: `https://www.youtube.com/watch?v=${video.id}`,
      }));

    return { success: true, data: videos };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching video details:", message);
    return { success: false, error: message };
  }
}

export async function getLatestVideos(maxResults: number = 6): Promise<ApiResult<YouTubeVideo[]>> {
  const apiKey = getApiKey();

  if (!apiKey) {
    return { success: false, error: "No YouTube API key configured" };
  }

  const channelResult = await getChannelData();
  if (!channelResult.success) {
    return { success: false, error: channelResult.error };
  }

  const uploadsPlaylistId = channelResult.data![0].contentDetails.relatedPlaylists.uploads;

  // Fetch more videos than needed to account for filtered Shorts
  const fetchCount = Math.min(maxResults * 2, 50);

  try {
    const playlistResponse = await fetchWithRetry(
      `${YOUTUBE_API_BASE}/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${fetchCount}&key=${apiKey}`,
      { next: { revalidate: 1800 } }
    );

    if (!playlistResponse.ok) {
      console.error(`[YouTube] Uploads API error: ${playlistResponse.status} ${playlistResponse.statusText}`);
      return {
        success: false,
        error: `Failed to fetch uploads: ${playlistResponse.status}`,
      };
    }

    const playlistData: YouTubeApiPlaylistItemsResponse = await playlistResponse.json();

    if (playlistData.error) {
      console.error("[YouTube] Uploads API returned error:", playlistData.error.message);
      return { success: false, error: playlistData.error.message };
    }

    if (!playlistData.items || playlistData.items.length === 0) {
      return { success: true, data: [] };
    }

    const videoIds = playlistData.items.map((item) => item.snippet.resourceId.videoId);
    const videosResult = await fetchVideoDetails(videoIds, apiKey, true);

    if (!videosResult.success) {
      return videosResult;
    }

    // Return only the requested number of videos
    return { success: true, data: videosResult.data.slice(0, maxResults) };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[YouTube] Error fetching latest videos:", message);
    return { success: false, error: message };
  }
}

export async function getChannelInfo(): Promise<ApiResult<YouTubeChannel>> {
  const apiKey = getApiKey();

  if (!apiKey) {
    return { success: false, error: "No YouTube API key configured" };
  }

  const channelResult = await getChannelData();
  if (!channelResult.success) {
    return { success: false, error: channelResult.error };
  }

  const channel = channelResult.data![0];
  return {
    success: true,
    data: {
      id: channel.id,
      title: channel.snippet.title,
      description: channel.snippet.description,
      subscriberCount: channel.statistics.subscriberCount,
      videoCount: channel.statistics.videoCount,
      viewCount: channel.statistics.viewCount,
      thumbnail:
        channel.snippet.thumbnails.high?.url ||
        channel.snippet.thumbnails.medium?.url ||
        channel.snippet.thumbnails.default?.url ||
        "/images/foxys-lab-logo-round.png",
    },
  };
}

export async function getPlaylists(): Promise<ApiResult<YouTubePlaylist[]>> {
  const apiKey = getApiKey();

  if (!apiKey) {
    return { success: false, error: "No YouTube API key configured" };
  }

  const channelResult = await getChannelData();
  if (!channelResult.success) {
    return { success: false, error: channelResult.error };
  }

  const channelId = channelResult.data![0].id;

  try {
    const response = await fetchWithRetry(
      `${YOUTUBE_API_BASE}/playlists?part=snippet,contentDetails&channelId=${channelId}&maxResults=25&key=${apiKey}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      console.error(`[YouTube] Playlists API error: ${response.status} ${response.statusText}`);
      return {
        success: false,
        error: `Failed to fetch playlists: ${response.status}`,
      };
    }

    const data: YouTubeApiPlaylistsResponse = await response.json();

    if (data.error) {
      console.error("[YouTube] Playlists API returned error:", data.error.message);
      return { success: false, error: data.error.message };
    }

    if (!data.items) {
      return { success: true, data: [] };
    }

    const playlists = data.items.map((playlist) => ({
      id: playlist.id,
      title: playlist.snippet.title,
      description: playlist.snippet.description,
      thumbnail:
        playlist.snippet.thumbnails.high?.url ||
        playlist.snippet.thumbnails.medium?.url ||
        playlist.snippet.thumbnails.default?.url ||
        "/images/foxys-lab-logo-round.png",
      itemCount: playlist.contentDetails.itemCount,
    }));

    return { success: true, data: playlists };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching playlists:", message);
    return { success: false, error: message };
  }
}

// Validate YouTube playlist ID format
const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]+$/;

export async function getPlaylistVideos(
  playlistId: string,
  maxResults: number = 50
): Promise<ApiResult<YouTubeVideo[]>> {
  const apiKey = getApiKey();

  if (!apiKey) {
    return { success: false, error: "No YouTube API key configured" };
  }

  if (!playlistId || !YOUTUBE_ID_REGEX.test(playlistId)) {
    return { success: false, error: "Invalid playlist ID format" };
  }

  try {
    const playlistResponse = await fetchWithRetry(
      `${YOUTUBE_API_BASE}/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${maxResults}&key=${apiKey}`,
      { next: { revalidate: 1800 } }
    );

    if (!playlistResponse.ok) {
      console.error(`[YouTube] Playlist videos API error: ${playlistResponse.status} ${playlistResponse.statusText}`);
      return {
        success: false,
        error: `Failed to fetch playlist: ${playlistResponse.status}`,
      };
    }

    const playlistData: YouTubeApiPlaylistItemsResponse = await playlistResponse.json();

    if (playlistData.error) {
      console.error("[YouTube] Playlist videos API returned error:", playlistData.error.message);
      return { success: false, error: playlistData.error.message };
    }

    if (!playlistData.items || playlistData.items.length === 0) {
      return { success: true, data: [] };
    }

    const videoIds = playlistData.items.map((item) => item.snippet.resourceId.videoId);
    return await fetchVideoDetails(videoIds, apiKey, true);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching playlist videos:", message);
    return { success: false, error: message };
  }
}

export function formatViewCount(count: string): string {
  const num = parseInt(count);
  if (isNaN(num)) return "0";
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return count;
}

export function formatDuration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";

  const hours = match[1] || "";
  const minutes = match[2] || "0";
  const seconds = match[3] || "0";

  if (hours) {
    return `${hours}:${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.padStart(2, "0")}`;
}
