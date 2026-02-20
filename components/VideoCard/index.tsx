import Image from "next/image";
import { YouTubeVideo } from "@/types/youtube";
import { formatViewCount, formatDuration } from "@/lib/youtube";
import styles from "./styles.module.css";

interface VideoCardProps {
  video: YouTubeVideo;
}

export function VideoCard({ video }: VideoCardProps) {
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
            className={styles.thumbnailImage}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className={styles.duration}>
            {formatDuration(video.duration)}
          </div>
        </div>

        {/* Content */}
        <div>
          <h3 className={styles.title}>
            {video.title}
          </h3>
          <p className={styles.description}>
            {video.description}
          </p>
          <div className={styles.meta}>
            <span>{formatViewCount(video.viewCount)} views</span>
            <span>{formatViewCount(video.likeCount)} likes</span>
          </div>
        </div>
      </a>
    </article>
  );
}
