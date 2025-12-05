/**
 * Blog Post Card Component
 *
 * Displays a blog post preview in the listing grid.
 * Follows the VideoCard.tsx pattern.
 */

import Image from "next/image";
import Link from "next/link";
import type { BlogPostMeta } from "@/types/blog";

interface PostCardProps {
  post: BlogPostMeta;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function PostCard({ post }: PostCardProps) {
  const { frontmatter, slug, excerpt, readingTime } = post;

  return (
    <article className="group">
      <Link href={`/blog/${slug}`} className="block">
        {/* Thumbnail */}
        {frontmatter.heroImage ? (
          <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-secondary/50">
            <Image
              src={frontmatter.heroImage}
              alt={frontmatter.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Reading time badge */}
            <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-semibold">
              {readingTime.text}
            </div>
            {/* Featured badge */}
            {frontmatter.featured && (
              <div className="absolute top-2 left-2 bg-accent-yellow text-secondary px-2 py-1 rounded text-xs font-semibold">
                Featured
              </div>
            )}
          </div>
        ) : (
          <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-primary/20 to-secondary/50 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-white/20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            {/* Reading time badge */}
            <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-semibold">
              {readingTime.text}
            </div>
            {/* Featured badge */}
            {frontmatter.featured && (
              <div className="absolute top-2 left-2 bg-accent-yellow text-secondary px-2 py-1 rounded text-xs font-semibold">
                Featured
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div>
          {/* Category */}
          {frontmatter.category && (
            <div className="mb-2">
              <span className="text-xs font-medium text-primary uppercase tracking-wide">
                {frontmatter.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {frontmatter.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-white/60 mb-3 line-clamp-2">{excerpt}</p>

          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-white/40">
            <span>{formatDate(new Date(frontmatter.publishedAt))}</span>
            <span className="w-1 h-1 bg-white/40 rounded-full" />
            <span>{frontmatter.author}</span>
          </div>

          {/* Tags */}
          {frontmatter.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {frontmatter.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-secondary/50 rounded-full text-white/60"
                >
                  {tag}
                </span>
              ))}
              {frontmatter.tags.length > 3 && (
                <span className="text-xs px-2 py-1 text-white/40">
                  +{frontmatter.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
