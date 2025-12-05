/**
 * Community Post Card Component
 *
 * Displays a YouTube community post preview.
 * Styled differently from regular blog posts.
 */

import Link from "next/link";
import type { CommunityPostMeta } from "@/types/blog";

interface CommunityPostCardProps {
  post: CommunityPostMeta;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function CommunityPostCard({ post }: CommunityPostCardProps) {
  const { frontmatter, slug, excerpt } = post;

  return (
    <article className="group">
      <Link href={`/blog/${slug}`} className="block">
        <div className="bg-secondary/50 border border-primary/20 rounded-xl p-6 hover:border-primary/40 transition-colors">
          {/* Community badge */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-red-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-red-400 uppercase tracking-wide">
              Community Post
            </span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {frontmatter.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-white/60 mb-4 line-clamp-3">{excerpt}</p>

          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-white/40">
            <span>{formatDate(new Date(frontmatter.publishedAt))}</span>
            {post.youtubeUrl && (
              <span className="text-primary hover:underline">
                View on YouTube
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
