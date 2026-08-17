import Image from "next/image";
import Link from "next/link";
import { YouTubeVideo } from "@/types/youtube";
import { formatViewCount, formatDuration } from "@/lib/youtube";
import styles from "./styles.module.css";

interface VideoCardProps {
  video: YouTubeVideo;
  /**
   * Marks this card's thumbnail as the LCP candidate, so it is preloaded
   * rather than lazily fetched. Set it on the first card of a grid only —
   * on `/videos` the first thumbnail *is* the LCP element, and lazy-loading it
   * delayed the largest paint behind everything else on the page. Applying it
   * to more than one card just spends the same priority on images the visitor
   * may never scroll to.
   */
  priority?: boolean;
  /**
   * Heading level for the card title.
   *
   * Cards sit under an `<h2>` section heading on the homepage, so `h3` is
   * right there. On the listing pages they sit directly under the page `<h1>`
   * with nothing in between, where `h3` skips a level and breaks heading
   * navigation for screen reader users. The level belongs to the context, not
   * the card, so the caller decides.
   */
  headingLevel?: 2 | 3;
  /**
   * Slug of the companion article, when one exists.
   *
   * Posts already link out to their video via `videoId` in frontmatter; this is
   * the return journey, which had no route at all. Someone landing on the video
   * list had no way of knowing a written version existed.
   */
  articleSlug?: string;
}

export function VideoCard({
  video,
  priority = false,
  headingLevel = 3,
  articleSlug,
}: VideoCardProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <article className={styles.card}>
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
      >
        {/* Thumbnail */}
        <div className={styles.thumbnail}>
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            priority={priority}
            className={styles.thumbnailImage}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className={styles.duration}>
            {formatDuration(video.duration)}
          </div>
        </div>

        {/* Content */}
        <div>
          <Heading className={styles.title}>{video.title}</Heading>
          <div className={styles.meta}>
            <span>{formatViewCount(video.viewCount)} views</span>
            <span>{formatViewCount(video.likeCount)} likes</span>
            <span>{formatViewCount(video.commentCount)} comments</span>
          </div>
        </div>
      </a>

      {/*
        Deliberately a sibling of the card link, not a child. The whole card is
        an anchor to YouTube, and an anchor inside an anchor is invalid HTML —
        browsers recover from it unpredictably and it is ambiguous to keyboard
        and screen reader users either way.
      */}
      {articleSlug && (
        <Link href={`/blog/${articleSlug}`} className={styles.articleLink}>
          Read the article
          <span aria-hidden="true" className={styles.articleArrow}>
            →
          </span>
          <span className="sr-only"> about {video.title}</span>
        </Link>
      )}
    </article>
  );
}
