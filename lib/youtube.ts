import { YouTubeVideo, YouTubeChannel } from "@/types/youtube";

const CHANNEL_ID = "UCoxyslab"; // Replace with actual channel ID

function getApiKey(): string {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey && process.env.NODE_ENV === "production") {
    throw new Error("YOUTUBE_API_KEY is required in production");
  }
  return apiKey || "";
}

// Mock data for development (replace with real API calls when API key is available)
export async function getLatestVideos(maxResults: number = 6): Promise<YouTubeVideo[]> {
  // In production, use YouTube Data API v3
  // For now, returning mock data
  return [
    {
      id: "video1",
      title: "Getting Started with Home Assistant",
      description: "Learn how to set up Home Assistant from scratch and create your first automation.",
      thumbnail: "/images/foxys-lab-logo-round.png",
      publishedAt: new Date().toISOString(),
      viewCount: "15000",
      likeCount: "1200",
      duration: "PT15M30S",
      url: "https://www.youtube.com/@foxyslab",
    },
    {
      id: "video2",
      title: "Smart Home Security: Best Practices",
      description: "Protect your smart home with these essential security tips and tricks.",
      thumbnail: "/images/foxys-lab-logo-round.png",
      publishedAt: new Date().toISOString(),
      viewCount: "12000",
      likeCount: "980",
      duration: "PT12M45S",
      url: "https://www.youtube.com/@foxyslab",
    },
    {
      id: "video3",
      title: "Building Custom Automations",
      description: "Advanced automation techniques to make your smart home truly intelligent.",
      thumbnail: "/images/foxys-lab-logo-round.png",
      publishedAt: new Date().toISOString(),
      viewCount: "18000",
      likeCount: "1500",
      duration: "PT20M15S",
      url: "https://www.youtube.com/@foxyslab",
    },
  ];
}

export async function getChannelInfo(): Promise<YouTubeChannel> {
  // Mock data - replace with real API call
  return {
    id: CHANNEL_ID,
    title: "Foxy's Lab",
    description: "Smart Home & Tech Education",
    subscriberCount: "50000",
    videoCount: "150",
    viewCount: "2000000",
    thumbnail: "/images/foxys-lab-logo-round.png",
  };
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
