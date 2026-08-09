/**
 * Table of Contents Component
 *
 * Renders a nested table of contents from extracted headings, with scroll-spy
 * highlighting and a reading-progress rail.
 *
 * Two variants:
 *   sidebar — sticky desktop column, height-capped and internally scrollable.
 *   inline  — mobile, collapsed into a <details> so a long TOC doesn't sit
 *             between the reader and the article.
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { TocHeading, TocTree } from "@/types/blog";
import styles from "./styles.module.css";

// How far down the viewport a heading must be before it counts as "current".
// Roughly clears the fixed nav so the highlight matches what you're reading.
const ACTIVE_OFFSET = 140;

interface TableOfContentsProps {
  headings: TocHeading[];
  tocTree: TocTree[];
  variant?: "sidebar" | "inline";
}

function TocItem({ item, activeId }: { item: TocTree; activeId: string }) {
  const isActive = item.heading.id === activeId;

  return (
    <li>
      <a
        href={`#${item.heading.id}`}
        data-toc-id={item.heading.id}
        data-level={item.heading.level}
        aria-current={isActive ? "location" : undefined}
        className={`${styles.link} ${isActive ? styles.linkActive : ""}`}
        onClick={(e) => {
          e.preventDefault();
          const element = document.getElementById(item.heading.id);
          if (!element) return;
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          window.history.pushState(null, "", `#${item.heading.id}`);
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

export function TableOfContents({
  headings,
  tocTree,
  variant = "sidebar",
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [progress, setProgress] = useState(0);
  // How far down the *list* the active entry sits. The rail fill uses this
  // rather than reading progress, so the glowing dot always caps the spine.
  // (Reading progress can't be reused here: sections vary enormously in length,
  // so "39% through the article" can be the 61st percent of the contents.)
  const [railRatio, setRailRatio] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  /**
   * Track the current section and reading progress.
   *
   * Deliberately not an IntersectionObserver: with ~50 headings, entries fire
   * per-threshold-crossing and the "last one to intersect" is often not the one
   * you're actually reading — and nothing fires at all once you're past the last
   * heading. Reading positions directly on scroll is simpler and always right.
   */
  useEffect(() => {
    if (headings.length === 0) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const elements = headings
        .map((h) => document.getElementById(h.id))
        .filter((el): el is HTMLElement => el !== null);
      if (elements.length === 0) return;

      // Current section = the last heading that has passed the offset line.
      let current = elements[0].id;
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= ACTIVE_OFFSET) current = el.id;
        else break;
      }

      // Within a screen of the bottom, pin to the final heading — otherwise the
      // last short section can never become active.
      const doc = document.documentElement;
      const remaining = doc.scrollHeight - window.scrollY - window.innerHeight;
      if (remaining < 80) current = elements[elements.length - 1].id;

      setActiveId((prev) => (prev === current ? prev : current));

      // Progress across the article body, not the whole page, so the rail isn't
      // skewed by the header and footer.
      const article = document.getElementById("article-content");
      let ratio: number;
      if (article) {
        const top = article.offsetTop;
        const span = article.offsetHeight - window.innerHeight * 0.5;
        ratio = span > 0 ? (window.scrollY - top + ACTIVE_OFFSET) / span : 1;
      } else {
        const span = doc.scrollHeight - window.innerHeight;
        ratio = span > 0 ? window.scrollY / span : 1;
      }
      const clamped = Math.min(1, Math.max(0, ratio));
      setProgress((prev) =>
        Math.abs(prev - clamped) < 0.004 ? prev : clamped
      );
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [headings]);

  /**
   * Keep the active entry visible inside the TOC's own scroll box.
   *
   * Scrolls the container directly rather than using scrollIntoView, which
   * would also scroll the page and fight the reader.
   */
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !activeId) return;

    const link = scroller.querySelector<HTMLElement>(
      `[data-toc-id="${CSS.escape(activeId)}"]`
    );
    if (!link) return;

    // Fill the rail down to the middle of the active entry. offsetTop is
    // relative to .track, which is the only positioned ancestor.
    const track = trackRef.current;
    if (track && track.offsetHeight > 0) {
      const ratio =
        (link.offsetTop + link.offsetHeight / 2) / track.offsetHeight;
      setRailRatio(Math.min(1, Math.max(0, ratio)));
    }

    const linkTop = link.offsetTop;
    const linkBottom = linkTop + link.offsetHeight;
    const viewTop = scroller.scrollTop;
    const viewBottom = viewTop + scroller.clientHeight;
    const margin = 48;

    // Only intervene when the active item has drifted outside a comfortable band.
    if (linkTop < viewTop + margin || linkBottom > viewBottom - margin) {
      scroller.scrollTo({
        top: Math.max(0, linkTop - scroller.clientHeight / 2),
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    }
  }, [activeId]);

  // Flag which ends of the list are reached, so the CSS can drop the edge fade.
  const [edges, setEdges] = useState({ top: true, bottom: false });
  const updateEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const atTop = el.scrollTop <= 2;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
    setEdges((prev) =>
      prev.top === atTop && prev.bottom === atBottom
        ? prev
        : { top: atTop, bottom: atBottom }
    );
  }, []);

  useEffect(() => {
    updateEdges();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges, { passive: true });
    return () => {
      el.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, [updateEdges, tocTree]);

  if (tocTree.length === 0) return null;

  const pct = Math.round(progress * 100);

  const body = (
    <div
      ref={scrollerRef}
      className={styles.scroller}
      data-at-top={edges.top}
      data-at-bottom={edges.bottom}
    >
      <div
        ref={trackRef}
        className={styles.track}
        style={{ "--toc-progress": railRatio } as React.CSSProperties}
      >
        <div className={styles.railFill} aria-hidden="true" />
        <ul className={styles.list}>
          {tocTree.map((item) => (
            <TocItem key={item.heading.id} item={item} activeId={activeId} />
          ))}
        </ul>
      </div>
    </div>
  );

  if (variant === "inline") {
    return (
      <details className={`${styles.nav} ${styles.inline} ${styles.details}`}>
        <summary className={styles.summary}>
          <span className={styles.heading}>On This Page</span>
          <span className={styles.summaryCount}>
            {headings.length} sections
          </span>
        </summary>
        <nav aria-label="Table of contents">{body}</nav>
      </details>
    );
  }

  return (
    <nav
      className={`${styles.nav} ${styles.sidebar}`}
      aria-label="Table of contents"
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>On This Page</h2>
        <span
          className={styles.readout}
          aria-live="off"
          title={`${pct}% through the article`}
        >
          {pct}%
        </span>
      </div>
      {body}
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
      className={`${styles.nav} ${styles.sidebar}`}
      aria-label="Table of contents"
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>Contents</h2>
      </div>
      <ul className={styles.list}>
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              data-level={heading.level}
              className={styles.link}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
