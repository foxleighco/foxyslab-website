/**
 * Feed Item Component
 *
 * Discriminated union renderer for blog feed items.
 * Renders the appropriate card based on post source.
 */

import type { FeedItem as FeedItemType, CommunityPostMeta } from "@/types/blog";
import { PostCard } from "./PostCard";
import { CommunityPostCard } from "./CommunityPostCard";
import { isCommunityPost } from "@/types/blog";

interface FeedItemProps {
  item: FeedItemType;
}

export function FeedItem({ item }: FeedItemProps) {
  if (isCommunityPost(item)) {
    return <CommunityPostCard post={item as CommunityPostMeta} />;
  }

  return <PostCard post={item} />;
}
