import Image from "next/image";
import Link from "next/link";
import { VideoCard } from "@/components/VideoCard";
import { Newsletter } from "@/components/Newsletter";
import { getLatestVideos } from "@/lib/youtube";
import { siteConfig } from "@/site.config";

export default async function Home() {
  const videosResult = await getLatestVideos(6);
  const videos = videosResult.success ? videosResult.data : [];

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/background.png"
            alt=""
            fill
            className="object-cover opacity-80"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 via-secondary/80 to-secondary" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative w-32 h-32 md:w-40 md:h-40">
              <Image
                src="/images/foxys-lab-logo-round.png"
                alt="Foxy's Lab"
                fill
                className="rounded-full object-cover ring-4 ring-primary/50"
                priority
              />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            Welcome to{" "}
            <span className="gradient-text">Foxy&apos;s Lab</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto text-balance">
            Your ultimate destination for smart home technology, automation tutorials,
            and cutting-edge tech education.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={siteConfig.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 gradient-primary rounded-full text-white font-bold text-lg hover:opacity-90 transition-opacity"
            >
              Subscribe on YouTube
            </a>
            <Link
              href="/videos"
              className="px-8 py-4 border-2 border-primary text-primary rounded-full font-bold text-lg hover:bg-primary hover:text-white transition-colors"
            >
              Watch Videos
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-primary"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Latest Videos Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Latest Videos
          </h2>
          <Link
            href="/videos"
            className="text-primary hover:text-primary/80 transition-colors font-semibold"
          >
            View All →
          </Link>
        </div>

        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-white/70 mb-4">Unable to load videos at this time.</p>
            <a
              href={siteConfig.social.youtubeVideos}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 gradient-primary rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              Watch on YouTube
            </a>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          What You&apos;ll Learn
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-secondary/50 border border-primary/20 rounded-xl p-8 hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Smart Home Basics</h3>
            <p className="text-white/70">
              From choosing devices to setting up your first automation, we cover everything you need to get started.
            </p>
          </div>

          <div className="bg-secondary/50 border border-primary/20 rounded-xl p-8 hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Advanced Automation</h3>
            <p className="text-white/70">
              Take your smart home to the next level with complex automations and custom integrations.
            </p>
          </div>

          <div className="bg-secondary/50 border border-primary/20 rounded-xl p-8 hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Security & Privacy</h3>
            <p className="text-white/70">
              Learn best practices for keeping your smart home secure and protecting your privacy.
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      {siteConfig.features.newsletter && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Newsletter />
        </section>
      )}
    </>
  );
}
