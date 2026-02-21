import type { YouTubeVideo, YouTubePlaylist } from "@/types/youtube";

export const mockVideo: YouTubeVideo = {
  id: "abc123",
  title: "Getting Started with Home Assistant",
  description: "Learn how to set up Home Assistant from scratch.",
  thumbnail: "https://i.ytimg.com/vi/abc123/maxresdefault.jpg",
  publishedAt: "2025-06-15T12:00:00Z",
  viewCount: "15000",
  likeCount: "850",
  commentCount: "42",
  duration: "PT12M30S",
  url: "https://www.youtube.com/watch?v=abc123",
};

export const mockVideo2: YouTubeVideo = {
  id: "def456",
  title: "Smart Lighting Guide",
  description: "Everything you need to know about smart lighting.",
  thumbnail: "https://i.ytimg.com/vi/def456/maxresdefault.jpg",
  publishedAt: "2025-07-01T14:00:00Z",
  viewCount: "8500",
  likeCount: "420",
  commentCount: "28",
  duration: "PT8M15S",
  url: "https://www.youtube.com/watch?v=def456",
};

export const mockPlaylist: YouTubePlaylist = {
  id: "PLabc123",
  title: "Home Assistant Tutorials",
  description: "Complete Home Assistant tutorial series.",
  thumbnail: "https://i.ytimg.com/vi/abc123/maxresdefault.jpg",
  itemCount: 12,
};

export const mockPlaylist2: YouTubePlaylist = {
  id: "PLdef456",
  title: "Smart Home Basics",
  description: "Getting started with smart home technology.",
  thumbnail: "https://i.ytimg.com/vi/def456/maxresdefault.jpg",
  itemCount: 8,
};
