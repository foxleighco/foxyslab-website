import Image from "next/image";
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
}

export function VideoCard({
  video,
  priority = false,
  headingLevel = 3,
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
    </article>
  );
}
