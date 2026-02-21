/**
 * Blog Post Card Component
 *
 * Displays a blog post preview in the listing grid.
 */

import Image from "next/image";
import Link from "next/link";
import type { BlogPostMeta } from "@/types/blog";
import styles from "./styles.module.css";

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
    <article className={styles.card}>
      <Link href={`/blog/${slug}`} className={styles.link}>
        {/* Thumbnail */}
        {frontmatter.heroImage ? (
          <div className={styles.thumbnail}>
            <Image
              src={frontmatter.heroImage}
              alt={frontmatter.title}
              fill
              className={styles.thumbnailImage}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Reading time badge */}
            <div className={styles.badge}>{readingTime.text}</div>
            {/* Featured badge */}
            {frontmatter.featured && (
              <div className={styles.featuredBadge}>Featured</div>
            )}
          </div>
        ) : (
          <div className={styles.thumbnailPlaceholder}>
            <svg
              className={styles.placeholderIcon}
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
            <div className={styles.badge}>{readingTime.text}</div>
            {/* Featured badge */}
            {frontmatter.featured && (
              <div className={styles.featuredBadge}>Featured</div>
            )}
          </div>
        )}

        {/* Content */}
        <div>
          {/* Category */}
          {frontmatter.category && (
            <div className={styles.categoryWrap}>
              <span className={styles.category}>{frontmatter.category}</span>
            </div>
          )}

          {/* Title */}
          <h3 className={styles.title}>{frontmatter.title}</h3>

          {/* Excerpt */}
          <p className={styles.excerpt}>{excerpt}</p>

          {/* Meta */}
          <div className={styles.meta}>
            <span>{formatDate(new Date(frontmatter.publishedAt))}</span>
            <span className={styles.dot} />
            <span>{frontmatter.author}</span>
          </div>

          {/* Tags */}
          {frontmatter.tags.length > 0 && (
            <div className={styles.tags}>
              {frontmatter.tags.slice(0, 3).map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
              {frontmatter.tags.length > 3 && (
                <span className={styles.tagMore}>
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
