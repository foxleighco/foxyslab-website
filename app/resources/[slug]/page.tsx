import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getResourceBySlug, getAllResourceSlugs } from "@/lib/resources";
import { ProductCard } from "@/components/ProductCard";
import styles from "./styles.module.css";

export const revalidate = 3600;

interface ResourcePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const result = await getAllResourceSlugs();

  if (!result.success) {
    return [];
  }

  return result.data.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ResourcePageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getResourceBySlug(slug);

  if (!result.success) {
    return { title: "Resource Not Found | Foxy's Lab" };
  }

  const { frontmatter } = result.data;

  return {
    title: `${frontmatter.title} | Foxy's Lab Resources`,
    description: frontmatter.description,
    openGraph: {
      type: "website",
      title: frontmatter.title,
      description: frontmatter.description,
      url: `https://www.foxyslab.com/resources/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: frontmatter.title,
      description: frontmatter.description,
    },
  };
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  const { slug } = await params;
  const result = await getResourceBySlug(slug);

  if (!result.success) {
    notFound();
  }

  const { frontmatter, intro, products } = result.data;

  // Group products by category, preserving first-seen order. Resources without
  // categories fall into a single unnamed group (rendered without a heading).
  const groups: { category: string; items: typeof products }[] = [];
  for (const product of products) {
    const category = product.category ?? "";
    let group = groups.find((g) => g.category === category);
    if (!group) {
      group = { category, items: [] };
      groups.push(group);
    }
    group.items.push(product);
  }

  const brandStores = frontmatter.brandStores ?? [];

  return (
    <div className={`container ${styles.page}`}>
      {/* Back link */}
      <div className={styles.backLink}>
        <Link href="/resources" className={styles.backLinkAnchor}>
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
          Back to Resources
        </Link>
      </div>

      {/* Header */}
      <header className={styles.header}>
        <span className={styles.category}>{frontmatter.category}</span>
        <h1 className={styles.title}>{frontmatter.title}</h1>
        <p className={styles.description}>{frontmatter.description}</p>
      </header>

      {/* Video Embed */}
      {frontmatter.videoId && (
        <div className={styles.videoEmbed}>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${frontmatter.videoId}`}
            title={`Video: ${frontmatter.title}`}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Blog Post Link */}
      {frontmatter.blogSlug && (
        <div className={styles.blogLink}>
          <svg
            className={styles.blogLinkIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <Link href={`/blog/${frontmatter.blogSlug}`}>
            {frontmatter.blogTitle || "Read the companion blog post"}
          </Link>
        </div>
      )}

      {/* Intro */}
      <div className={styles.intro}>
        {intro.split("\n\n").map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {/* Affiliate disclosure */}
      <p className={styles.disclosure}>
        Some of the links below are affiliate links. If you buy through them, I
        earn a small commission at no extra cost to you. It helps support the
        channel.
      </p>

      {/* Product groups */}
      {groups.map((group) => (
        <div
          key={group.category || "__uncategorized__"}
          className={styles.productSection}
        >
          {group.category && (
            <h2 className={styles.sectionTitle}>{group.category}</h2>
          )}
          <div className={styles.productGrid}>
            {group.items.map((product) => (
              <ProductCard key={product.link} product={product} />
            ))}
          </div>
        </div>
      ))}

      {/* Brand stores */}
      {brandStores.length > 0 && (
        <section className={styles.brandStores}>
          <h2 className={styles.sectionTitle}>Browse the brand stores</h2>
          <p className={styles.brandStoresIntro}>
            The links above are specific products I recommend. If you want to
            explore the full ranges — including Thread devices I haven&apos;t
            linked individually — head straight to the brands&apos; stores.
          </p>
          <ul className={styles.brandStoreList}>
            {brandStores.map((store) => (
              <li key={store.link}>
                <a
                  href={store.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                >
                  {store.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
