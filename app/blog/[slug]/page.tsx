import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getAllPostSlugs, getAdjacentPosts } from "@/lib/blog";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { siteConfig } from "@/site.config";
import styles from "./styles.module.css";

// Revalidate every 30 minutes
export const revalidate = 1800;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all posts
export async function generateStaticParams() {
  const result = await getAllPostSlugs();

  if (!result.success) {
    return [];
  }

  return result.data.map((slug) => ({
    slug: slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getBlogPostBySlug(slug);

  if (!result.success) {
    return {
      title: "Post Not Found | Foxy's Lab",
    };
  }

  const post = result.data;
  const { frontmatter } = post;

  return {
    title: `${frontmatter.title} | Foxy's Lab Blog`,
    description: frontmatter.description,
    authors: [{ name: frontmatter.author }],
    openGraph: {
      type: "article",
      title: frontmatter.title,
      description: frontmatter.description,
      publishedTime: new Date(frontmatter.publishedAt).toISOString(),
      modifiedTime: frontmatter.updatedAt
        ? new Date(frontmatter.updatedAt).toISOString()
        : undefined,
      tags: frontmatter.tags,
      images: frontmatter.heroImage
        ? [
            {
              url: frontmatter.heroImage,
              width: 1200,
              height: 630,
              alt: frontmatter.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: frontmatter.title,
      description: frontmatter.description,
      images: frontmatter.heroImage ? [frontmatter.heroImage] : undefined,
    },
  };
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/*
 * SECURITY NOTE: Blog post HTML is generated at build time from trusted local
 * markdown files via the remark/rehype pipeline (lib/blog.ts). No user-supplied
 * content is rendered, so using innerHTML for the rendered blog body is safe.
 */

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  if (!siteConfig.features.blog) notFound();

  const { slug } = await params;
  const result = await getBlogPostBySlug(slug);

  if (!result.success) {
    notFound();
  }

  const post = result.data;
  const { frontmatter, html, headings, tocTree, readingTime } = post;

  // Get adjacent posts for navigation
  const adjacentResult = await getAdjacentPosts(slug);
  const adjacent = adjacentResult.success ? adjacentResult.data : {};

  return (
    <article className={`container ${styles.page}`}>
      {/* Back link */}
      <div className={styles.backLink}>
        <Link
          href="/blog"
          className={styles.backLinkAnchor}
        >
          <svg
            className={styles.backIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Blog
        </Link>
      </div>

      <div className={styles.layout}>
        {/* Main content */}
        <div>
          {/* Header */}
          <header style={{ marginBottom: "2rem" }}>
            {/* Category */}
            {frontmatter.category && (
              <div className={styles.categoryLabel}>
                <span className={styles.categoryText}>
                  {frontmatter.category}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className={styles.postTitle}>
              {frontmatter.title}
            </h1>

            {/* Description */}
            <p className={styles.postDescription}>
              {frontmatter.description}
            </p>

            {/* Meta */}
            <div className={styles.postMeta}>
              <span>{frontmatter.author}</span>
              <span className={styles.dot} />
              <span>{formatDate(new Date(frontmatter.publishedAt))}</span>
              <span className={styles.dot} />
              <span>{readingTime.text}</span>
              {frontmatter.updatedAt && (
                <>
                  <span className={styles.dot} />
                  <span>
                    Updated {formatDate(new Date(frontmatter.updatedAt))}
                  </span>
                </>
              )}
            </div>

            {/* Tags */}
            {frontmatter.tags.length > 0 && (
              <div className={styles.postTags}>
                {frontmatter.tags.map((tag) => (
                  <span
                    key={tag}
                    className={styles.postTag}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Hero Image */}
          {frontmatter.heroImage && (
            <div className={styles.heroImage}>
              <Image
                src={frontmatter.heroImage}
                alt={frontmatter.title}
                fill
                className={styles.heroImageEl}
                priority
                sizes="(max-width: 1024px) 100vw, 800px"
              />
            </div>
          )}

          {/* Mobile TOC */}
          {headings.length > 2 && (
            <div className={styles.mobileToc}>
              <TableOfContents headings={headings} tocTree={tocTree} />
            </div>
          )}

          {/* Article content — trusted HTML from local markdown, see security note above */}
          <div className={styles.articleCard}>
            <div
              className={`prose ${styles.proseContent}`}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>

          {/* Related Video */}
          {frontmatter.videoId && (
            <div className={styles.relatedVideo}>
              <h3 className={styles.relatedVideoTitle}>Watch the Video</h3>
              <a
                href={`https://www.youtube.com/watch?v=${frontmatter.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.relatedVideoLink}
              >
                <svg
                  className={styles.relatedVideoIcon}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                Watch on YouTube
              </a>
            </div>
          )}

          {/* Post Navigation */}
          {(adjacent.prev || adjacent.next) && (
            <nav className={styles.postNav}>
              {adjacent.prev && (
                <Link
                  href={`/blog/${adjacent.prev.slug}`}
                  className={styles.postNavLink}
                >
                  <span className={styles.postNavLabel}>
                    Previous
                  </span>
                  <p className={styles.postNavTitle}>
                    {adjacent.prev.frontmatter.title}
                  </p>
                </Link>
              )}
              {adjacent.next && (
                <Link
                  href={`/blog/${adjacent.next.slug}`}
                  className={styles.postNavLinkRight}
                >
                  <span className={styles.postNavLabel}>
                    Next
                  </span>
                  <p className={styles.postNavTitle}>
                    {adjacent.next.frontmatter.title}
                  </p>
                </Link>
              )}
            </nav>
          )}
        </div>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSticky}>
            {/* TOC */}
            {headings.length > 2 && (
              <TableOfContents headings={headings} tocTree={tocTree} />
            )}

            {/* Share */}
            <div className={styles.shareBox}>
              <h3 className={styles.shareTitle}>
                Share
              </h3>
              <div className={styles.shareLinks}>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(frontmatter.title)}&url=${encodeURIComponent(`${siteConfig.url}/blog/${slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.shareLink}
                  aria-label="Share on Twitter"
                >
                  <svg className={styles.shareIcon} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${siteConfig.url}/blog/${slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.shareLink}
                  aria-label="Share on LinkedIn"
                >
                  <svg className={styles.shareIcon} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Subscribe CTA */}
            <div className={styles.subscribeBox}>
              <h3 className={styles.subscribeTitle}>Enjoy this content?</h3>
              <p className={styles.subscribeText}>
                Subscribe to the channel for more tutorials and guides.
              </p>
              <a
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.subscribeLink}
              >
                Subscribe
              </a>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
