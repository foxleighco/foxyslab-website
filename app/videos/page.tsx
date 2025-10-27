import { Metadata } from "next";
import { VideoCard } from "@/components/VideoCard";
import { getLatestVideos } from "@/lib/youtube";

export const metadata: Metadata = {
  title: "Videos | Foxy's Lab",
  description: "Watch all the latest smart home tutorials, automation guides, and tech education videos from Foxy's Lab.",
};

export default async function VideosPage() {
  const videos = await getLatestVideos(12);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          All Videos
        </h1>
        <p className="text-xl text-white/70">
          Browse through our complete collection of tutorials and guides
        </p>
      </div>

      {/* Filter/Sort Options (Future Enhancement) */}
      <div className="mb-8 flex flex-wrap gap-4">
        <button className="px-6 py-2 bg-primary rounded-full font-semibold">
          All Videos
        </button>
        <button className="px-6 py-2 bg-secondary/50 border border-primary/30 rounded-full hover:border-primary/50 transition-colors">
          Tutorials
        </button>
        <button className="px-6 py-2 bg-secondary/50 border border-primary/30 rounded-full hover:border-primary/50 transition-colors">
          Reviews
        </button>
        <button className="px-6 py-2 bg-secondary/50 border border-primary/30 rounded-full hover:border-primary/50 transition-colors">
          Automation
        </button>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      {/* Load More (Future Enhancement) */}
      <div className="mt-12 text-center">
        <a
          href="https://www.youtube.com/@foxyslab/videos"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-4 gradient-primary rounded-full font-bold hover:opacity-90 transition-opacity"
        >
          View All on YouTube
        </a>
      </div>
    </div>
  );
}
