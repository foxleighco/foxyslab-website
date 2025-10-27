import Image from "next/image";
import Link from "next/link";
import { YouTubeVideo } from "@/types/youtube";
import { formatViewCount, formatDuration } from "@/lib/youtube";

interface VideoCardProps {
  video: YouTubeVideo;
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <article className="group">
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {/* Thumbnail */}
        <div className="relative aspect-video rounded-lg overflow-hidden mb-3 bg-secondary/50">
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-semibold">
            {formatDuration(video.duration)}
          </div>
        </div>

        {/* Content */}
        <div>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {video.title}
          </h3>
          <p className="text-sm text-white/60 mb-2 line-clamp-2">
            {video.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <span>{formatViewCount(video.viewCount)} views</span>
            <span>{formatViewCount(video.likeCount)} likes</span>
          </div>
        </div>
      </a>
    </article>
  );
}
