import { Suspense } from "react";
import { Metadata } from "next";
import { getAllResources } from "@/lib/resources";
import { ResourceCard } from "@/components/ResourceCard";
import { PageHeader } from "@/components/PageHeader";
import styles from "./styles.module.css";

export const metadata: Metadata = {
  title: "Resources | Foxy's Lab",
  description:
    "Kits, tools, and software recommendations for smart home, homelab, and tech projects.",
};

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

  return (
    <div className={styles.grid}>
      {resources.map((resource) => (
        <ResourceCard key={resource.slug} resource={resource} />
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
