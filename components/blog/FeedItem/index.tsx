/**
 * Feed Item Component
 *
 * Renders a blog post card in the feed.
 */

import type { BlogPostMeta } from "@/types/blog";
import { PostCard } from "../PostCard";

interface FeedItemProps {
  item: BlogPostMeta;
  headingLevel?: 2 | 3;
}

export function FeedItem({ item, headingLevel }: FeedItemProps) {
  return <PostCard post={item} headingLevel={headingLevel} />;
}
