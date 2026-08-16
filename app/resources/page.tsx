import { Suspense } from "react";
import { canonicalUrl } from "@/lib/seo";
import { getBreadcrumbSchema } from "@/lib/structured-data";
import { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getAllResources } from "@/lib/resources";
import { ResourceCard } from "@/components/ResourceCard";
import { PageHeader } from "@/components/PageHeader";
import styles from "./styles.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Resources | Foxy's Lab",
  description:
    "Kits, tools, and software recommendations for smart home, homelab, and tech projects.",
  path: "/resources",
});

export const revalidate = 3600;

async function ResourceGrid() {
  const result = await getAllResources();

  if (!result.success) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyTitle}>Unable to load resources</p>
        <p className={styles.emptySubtitle}>{result.error}</p>
      </div>
    );
  }

  const resources = result.data;

  if (resources.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyTitle}>No resources yet</p>
        <p className={styles.emptySubtitle}>Check back soon!</p>
      </div>
    );
  }

  const breadcrumbSchema = JSON.stringify(
    getBreadcrumbSchema([
      { name: "Home", url: canonicalUrl("/") },
      { name: "Resources", url: canonicalUrl("/resources") },
    ])
  );

  return (
    <div className={styles.grid}>
      {/*
        JSON-LD uses dangerouslySetInnerHTML by design: the content is
        generated server-side from trusted config and content, never user
        input. A plain <script> rather than next/script — the latter injects
        client-side, so the markup only existed in the RSC payload and never
        reached crawlers that don't run JavaScript.
      */}
      <script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbSchema }}
      />{" "}
      {resources.map((resource) => (
        <ResourceCard
          key={resource.slug}
          resource={resource}
          headingLevel={2}
        />
      ))}
    </div>
  );
}

function ResourceGridSkeleton() {
  const SKELETON_COUNT = 4;
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading resources...</span>
      <div className={styles.grid}>
        {[...Array(SKELETON_COUNT)].map((_, i) => (
          <div key={i} className={styles.skeleton}>
            <div className={styles.skeletonIcon} />
            <div className={styles.skeletonCategory} />
            <div className={styles.skeletonTitle} />
            <div className={styles.skeletonText} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  return (
    <div className={`container ${styles.page}`}>
      <PageHeader
        title={<span className="gradient-text">Resources</span>}
        subtitle="Kits, tools, and software I use and recommend. Tried, tested, and used in my own setup."
      />

      <Suspense fallback={<ResourceGridSkeleton />}>
        <ResourceGrid />
      </Suspense>
    </div>
  );
}
