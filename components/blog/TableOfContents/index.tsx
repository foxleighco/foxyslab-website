/**
 * Table of Contents Component
 *
 * Renders a nested table of contents from extracted headings.
 */

"use client";

import { useState, useEffect } from "react";
import type { TocHeading, TocTree } from "@/types/blog";
import styles from "./styles.module.css";

interface TableOfContentsProps {
  headings: TocHeading[];
  tocTree: TocTree[];
}

function TocItem({ item, activeId }: { item: TocTree; activeId: string }) {
  const isActive = item.heading.id === activeId;
  const indent = (item.heading.level - 2) * 16;

  return (
    <li>
      <a
        href={`#${item.heading.id}`}
        className={`${styles.link} ${isActive ? styles.linkActive : ""}`}
        style={{ paddingLeft: `${indent}px` }}
        onClick={(e) => {
          e.preventDefault();
          const element = document.getElementById(item.heading.id);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
            // Update URL without triggering navigation
            window.history.pushState(null, "", `#${item.heading.id}`);
          }
        }}
      >
        {item.heading.text}
      </a>
      {item.children.length > 0 && (
        <ul>
          {item.children.map((child) => (
            <TocItem key={child.heading.id} item={child} activeId={activeId} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function TableOfContents({ headings, tocTree }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -80% 0px",
        threshold: 0,
      }
    );

    // Observe all heading elements
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  if (tocTree.length === 0) {
    return null;
  }

  return (
    <nav
      className={styles.nav}
      aria-label="Table of contents"
    >
      <h2 className={styles.heading}>
        On This Page
      </h2>
      <ul className={styles.list}>
        {tocTree.map((item) => (
          <TocItem key={item.heading.id} item={item} activeId={activeId} />
        ))}
      </ul>
    </nav>
  );
}

/**
 * Simple flat TOC (alternative for smaller screens)
 */
export function SimpleToc({ headings }: { headings: TocHeading[] }) {
  if (headings.length === 0) {
    return null;
  }

  return (
    <nav
      className={styles.nav}
      aria-label="Table of contents"
    >
      <h2 className={styles.heading}>
        Contents
      </h2>
      <ul className={styles.list}>
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={styles.link}
              style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
