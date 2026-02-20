import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllBlogPosts, getAllTags } from "@/lib/blog";
import { FeedItem } from "@/components/blog/FeedItem";
import { siteConfig } from "@/site.config";

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
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
          <svg
            className="w-8 h-8 text-red-500"
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
        <p className="text-white/70 text-lg mb-2">Unable to load posts</p>
        <p className="text-white/50 text-sm mb-4">{result.error}</p>
        <Link
          href="/blog"
          className="inline-block px-6 py-2 bg-primary rounded-full font-semibold hover:bg-primary/80 transition-colors"
        >
          Try Again
        </Link>
      </div>
    );
  }

  const posts = result.data;

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/50 mb-4">
          <svg
            className="w-8 h-8 text-white/50"
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
        <p className="text-white/70 text-lg mb-2">No posts yet</p>
        <p className="text-white/50 text-sm">Check back soon for new content!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(SKELETON_COUNT)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-secondary/50 rounded-xl aspect-video mb-4" />
            <div className="h-4 bg-secondary/50 rounded w-1/4 mb-3" />
            <div className="h-6 bg-secondary/50 rounded w-3/4 mb-2" />
            <div className="h-4 bg-secondary/50 rounded w-full mb-2" />
            <div className="h-4 bg-secondary/50 rounded w-2/3" />
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
    <div className="flex flex-wrap gap-2">
      {result.data.map((tag) => (
        <span
          key={tag}
          className="text-sm px-3 py-1 bg-secondary/50 border border-primary/20 rounded-full text-white/70 hover:border-primary/40 hover:text-white transition-colors cursor-pointer"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

export default async function BlogPage() {
  if (!siteConfig.features.blog) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="gradient-text">Blog</span>
        </h1>
        <p className="text-xl text-white/70 max-w-2xl">
          Articles, tutorials, and updates about smart home technology, home
          automation, and the latest in tech education.
        </p>
      </div>

      {/* Tags */}
      <div className="mb-8">
        <Suspense fallback={null}>
          <TagCloud />
        </Suspense>
      </div>

      {/* Blog Grid */}
      <Suspense fallback={<BlogGridSkeleton />}>
        <BlogGrid />
      </Suspense>

      {/* View on YouTube */}
      <div className="mt-12 text-center">
        <p className="text-white/50 mb-4">Want more content?</p>
        <a
          href={siteConfig.social.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-4 gradient-primary rounded-full font-bold hover:opacity-90 transition-opacity"
        >
          Subscribe on YouTube
        </a>
      </div>
    </div>
  );
}
