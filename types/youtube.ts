export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: string;
  likeCount: string;
  commentCount: string;
  duration: string;
  url: string;
}

export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  subscriberCount: string;
  videoCount: string;
  viewCount: string;
  commentCount?: string;
  thumbnail: string;
}

export interface YouTubePlaylist {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  itemCount: number;
}

export interface PlaylistInfo {
  id: string;
  title: string;
  slug: string;
  itemCount: number;
}
