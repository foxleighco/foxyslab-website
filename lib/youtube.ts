import { YouTubeVideo, YouTubeChannel } from "@/types/youtube";

const CHANNEL_HANDLE = "foxyslab";
const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

function getApiKey(): string {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey && process.env.NODE_ENV === "production") {
    throw new Error("YOUTUBE_API_KEY is required in production");
  }
  return apiKey || "";
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
}

interface YouTubeApiPlaylistResponse {
  items?: Array<{
    snippet: {
      resourceId: {
        videoId: string;
      };
    };
  }>;
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
}

async function getChannelData(): Promise<YouTubeApiChannelResponse["items"]> {
  const apiKey = getApiKey();
  if (!apiKey) return undefined;

  const response = await fetch(
    `${YOUTUBE_API_BASE}/channels?part=snippet,statistics,contentDetails&forHandle=${CHANNEL_HANDLE}&key=${apiKey}`,
    { next: { revalidate: 3600 } }
  );

  if (!response.ok) {
    console.error("Failed to fetch channel data:", response.statusText);
    return undefined;
  }

  const data: YouTubeApiChannelResponse = await response.json();
  return data.items;
}

export async function getLatestVideos(maxResults: number = 6): Promise<YouTubeVideo[]> {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.warn("No YouTube API key provided, returning empty array");
    return [];
  }

  try {
    // Get channel data to find uploads playlist
    const channelItems = await getChannelData();
    if (!channelItems || channelItems.length === 0) {
      console.error("Channel not found");
      return [];
    }

    const uploadsPlaylistId = channelItems[0].contentDetails.relatedPlaylists.uploads;

    // Get video IDs from uploads playlist
    const playlistResponse = await fetch(
      `${YOUTUBE_API_BASE}/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&key=${apiKey}`,
      { next: { revalidate: 1800 } }
    );

    if (!playlistResponse.ok) {
      console.error("Failed to fetch playlist:", playlistResponse.statusText);
      return [];
    }

    const playlistData: YouTubeApiPlaylistResponse = await playlistResponse.json();
    if (!playlistData.items || playlistData.items.length === 0) {
      return [];
    }

    const videoIds = playlistData.items
      .map((item) => item.snippet.resourceId.videoId)
      .join(",");

    // Get full video details
    const videosResponse = await fetch(
      `${YOUTUBE_API_BASE}/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${apiKey}`,
      { next: { revalidate: 1800 } }
    );

    if (!videosResponse.ok) {
      console.error("Failed to fetch video details:", videosResponse.statusText);
      return [];
    }

    const videosData: YouTubeApiVideoResponse = await videosResponse.json();
    if (!videosData.items) {
      return [];
    }

    return videosData.items.map((video) => ({
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
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return [];
  }
}

export async function getChannelInfo(): Promise<YouTubeChannel | null> {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.warn("No YouTube API key provided");
    return null;
  }

  try {
    const channelItems = await getChannelData();
    if (!channelItems || channelItems.length === 0) {
      return null;
    }

    const channel = channelItems[0];
    return {
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
    };
  } catch (error) {
    console.error("Error fetching channel info:", error);
    return null;
  }
}

export function formatViewCount(count: string): string {
  const num = parseInt(count);
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return count;
}

export function formatDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return "0:00";

  const hours = (match[1] || "").replace("H", "");
  const minutes = (match[2] || "").replace("M", "");
  const seconds = (match[3] || "0").replace("S", "");

  if (hours) {
    return `${hours}:${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
  }
  return `${minutes || "0"}:${seconds.padStart(2, "0")}`;
}
