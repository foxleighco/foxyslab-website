import Link from "next/link";
import type { ResourceMeta } from "@/types/resource";
import styles from "./styles.module.css";

interface ResourceCardProps {
  resource: ResourceMeta;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const { frontmatter, slug, productCount } = resource;

  return (
    <article className={styles.card}>
      <Link href={`/resources/${slug}`} className={styles.link}>
        <div className={styles.iconWrap}>
          <svg
            className={styles.icon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <div>
          <span className={styles.category}>{frontmatter.category}</span>
          <h3 className={styles.title}>{frontmatter.title}</h3>
          <p className={styles.description}>{frontmatter.description}</p>
          <span className={styles.meta}>
            {productCount} {productCount === 1 ? "item" : "items"}
          </span>
        </div>
      </Link>
    </article>
  );
}
