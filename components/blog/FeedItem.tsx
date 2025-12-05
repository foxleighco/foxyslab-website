/**
 * Feed Item Component
 *
 * Renders a blog post card in the feed.
 */

import type { BlogPostMeta } from "@/types/blog";
import { PostCard } from "./PostCard";

interface FeedItemProps {
  item: BlogPostMeta;
}

export function FeedItem({ item }: FeedItemProps) {
  return <PostCard post={item} />;
}
