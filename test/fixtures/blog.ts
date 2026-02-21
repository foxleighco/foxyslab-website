import type { BlogPostMeta, TocHeading, ReadingTime } from "@/types/blog";
import type { Frontmatter } from "@/lib/markdown/frontmatter";

export const mockReadingTime: ReadingTime = {
  minutes: 5,
  text: "5 min read",
  words: 1000,
};

export const mockFrontmatter: Frontmatter = {
  title: "Getting Started with Home Assistant",
  description: "A comprehensive guide to setting up Home Assistant.",
  publishedAt: new Date("2025-06-15"),
  tags: ["home-assistant", "smart-home", "tutorial"],
  author: "Alexander Foxleigh",
  featured: false,
  status: "published",
};

export const mockFeaturedFrontmatter: Frontmatter = {
  title: "Top 10 Smart Home Devices of 2025",
  description: "Our picks for the best smart home devices this year.",
  publishedAt: new Date("2025-07-01"),
  tags: ["smart-home", "reviews", "best-of", "2025"],
  author: "Alexander Foxleigh",
  category: "Reviews",
  featured: true,
  status: "published",
  heroImage: "/images/blog/top-10-devices.jpg",
};

export const mockPostMeta: BlogPostMeta = {
  slug: "getting-started-home-assistant",
  frontmatter: mockFrontmatter,
  excerpt: "A comprehensive guide to setting up Home Assistant from scratch.",
  readingTime: mockReadingTime,
};

export const mockFeaturedPostMeta: BlogPostMeta = {
  slug: "top-10-smart-home-devices-2025",
  frontmatter: mockFeaturedFrontmatter,
  excerpt:
    "Our picks for the best smart home devices this year, from smart speakers to...",
  readingTime: { minutes: 8, text: "8 min read", words: 1600 },
};

export const mockHeadings: TocHeading[] = [
  { id: "introduction", text: "Introduction", level: 2 },
  { id: "installation", text: "Installation", level: 2 },
  { id: "docker-install", text: "Docker Install", level: 3 },
  { id: "native-install", text: "Native Install", level: 3 },
  { id: "configuration", text: "Configuration", level: 2 },
];
