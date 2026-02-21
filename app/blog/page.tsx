import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllBlogPosts, getAllTags } from "@/lib/blog";
import { FeedItem } from "@/components/blog/FeedItem";
import { blogFlag } from "@/app/flags";
import { PageHeader } from "@/components/PageHeader";
import { siteConfig } from "@/site.config";
import styles from "./styles.module.css";

export const metadata: Metadata = {
  title: "Blog | Foxy's Lab",
  description:
    "Articles, tutorials, and updates about smart home technology, home automation, and tech education.",
};

// Revalidate every hour
export const revalidate = 3600;

async function BlogGrid() {
  const result = await getAllBlogPosts();

  if (!result.success) {
    return (
      <div className={styles.errorState}>
        <div className={styles.errorIcon}>
          <svg
            className={styles.errorIconSvg}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <p className={styles.errorTitle}>Unable to load posts</p>
        <p className={styles.errorSubtitle}>{result.error}</p>
        <Link
          href="/blog"
          className="btn-primary"
          style={{ padding: "0.5rem 1.5rem" }}
        >
          Try Again
        </Link>
      </div>
    );
  }

  const posts = result.data;

  if (posts.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <svg
            className={styles.emptyIconSvg}
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
        </div>
        <p className={styles.emptyTitle}>No posts yet</p>
        <p className={styles.emptySubtitle}>Check back soon for new content!</p>
      </div>
    );
  }

  return (
    <div className={styles.blogGrid}>
      {posts.map((post) => (
        <FeedItem key={post.slug} item={post} />
      ))}
    </div>
  );
}

function BlogGridSkeleton() {
  const SKELETON_COUNT = 6;
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading posts...</span>
      <div className={styles.blogGrid}>
        {[...Array(SKELETON_COUNT)].map((_, i) => (
          <div key={i} className={styles.skeleton}>
            <div className={styles.skeletonThumbnail} />
            <div className={styles.skeletonCategory} />
            <div className={styles.skeletonTitle} />
            <div className={styles.skeletonText} />
            <div className={styles.skeletonTextShort} />
          </div>
        ))}
      </div>
    </div>
  );
}

async function TagCloud() {
  const result = await getAllTags();

  if (!result.success || result.data.length === 0) {
    return null;
  }

  return (
    <div className={styles.tagList}>
      {result.data.map((tag) => (
        <span key={tag} className={styles.tag}>
          {tag}
        </span>
      ))}
    </div>
  );
}

export default async function BlogPage() {
  if (!(await blogFlag())) notFound();

  return (
    <div className={`container ${styles.page}`}>
      <PageHeader
        title={<span className="gradient-text">Blog</span>}
        subtitle="Articles, tutorials, and updates about smart home technology, home automation, and the latest in tech education."
      />

      {/* Tags */}
      <div className={styles.tagCloud}>
        <Suspense fallback={null}>
          <TagCloud />
        </Suspense>
      </div>

      {/* Blog Grid */}
      <Suspense fallback={<BlogGridSkeleton />}>
        <BlogGrid />
      </Suspense>

      {/* View on YouTube */}
      <div className={styles.ctaWrapper}>
        <p className={styles.ctaText}>Want more content?</p>
        <a
          href={siteConfig.social.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{ padding: "1rem 2rem", fontWeight: 700 }}
        >
          Subscribe on YouTube
        </a>
      </div>
    </div>
  );
}
