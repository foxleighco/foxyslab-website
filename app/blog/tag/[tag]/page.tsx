import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllBlogPosts, getAllTags } from "@/lib/blog";
import { FeedItem } from "@/components/blog/FeedItem";
import { PageHeader } from "@/components/PageHeader";
import { pageMetadata, canonicalUrl } from "@/lib/seo";
import { getBreadcrumbSchema, jsonLd } from "@/lib/structured-data";
import styles from "../../styles.module.css";

interface PageProps {
  params: Promise<{ tag: string }>;
}

/*
 * Every tag is derived from published frontmatter, so anything else is not a
 * tag. Same reasoning as the other dynamic routes: without this, unknown tags
 * render on demand and return HTTP 200 with the not-found UI.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  const result = await getAllTags();
  if (!result.success) return [];

  return result.data.map((tag) => ({ tag: encodeURIComponent(tag) }));
}

/** Tags are lowercase slugs in frontmatter; this is only for display. */
function toTitle(tag: string): string {
  return tag
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const label = toTitle(decoded);

  return pageMetadata({
    title: `${label} | Foxy's Lab Blog`,
    description: `Every Foxy's Lab article tagged ${label} — smart home, homelab and tech writing on the subject.`,
    path: `/blog/tag/${tag}`,
  });
}

export const revalidate = 3600;

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);

  const result = await getAllBlogPosts({ tag: decoded, status: "published" });

  // A tag with no posts should not exist, since the list is built from posts.
  if (!result.success || result.data.length === 0) {
    notFound();
  }

  const posts = result.data;
  const label = toTitle(decoded);

  const breadcrumbSchema = jsonLd(
    getBreadcrumbSchema([
      { name: "Home", url: canonicalUrl("/") },
      { name: "Blog", url: canonicalUrl("/blog") },
      { name: label, url: canonicalUrl(`/blog/tag/${tag}`) },
    ])
  );

  return (
    <div className={`container ${styles.page}`}>
      {/*
        JSON-LD uses dangerouslySetInnerHTML by design: the content is generated
        server-side from trusted repo content, never user input.
      */}
      <script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbSchema }}
      />

      <PageHeader
        title={
          <>
            Tagged <span className="gradient-text">{label}</span>
          </>
        }
        subtitle={`${posts.length} ${posts.length === 1 ? "article" : "articles"} on this subject`}
      />

      <div className={styles.tagCloud}>
        <Link href="/blog" className={styles.tag}>
          ← All posts
        </Link>
      </div>

      <div className={styles.blogGrid}>
        {posts.map((post) => (
          <FeedItem key={post.slug} item={post} headingLevel={2} />
        ))}
      </div>
    </div>
  );
}
