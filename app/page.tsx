import Image from "next/image";
import Link from "next/link";
import { VideoCard } from "@/components/VideoCard";
import { Newsletter } from "@/components/Newsletter";
import { TransparentVideo } from "@/components/TransparentVideo";
import { getLatestVideos } from "@/lib/youtube";
import { newsletterFlag } from "@/app/flags";
import { siteConfig } from "@/site.config";
import styles from "./styles.module.css";

const labCoatClips = Array.from(
  { length: 7 },
  (_, i) => `/lab-coat-clips/lab-coat-clip-${i + 1}`
);

export const dynamic = "force-dynamic";

export default async function Home() {
  const [videosResult, showNewsletter] = await Promise.all([
    getLatestVideos(6),
    newsletterFlag(),
  ]);
  const videos = videosResult.success ? videosResult.data : [];

  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        {/* Two-column Content */}
        <div className={styles.heroContent}>
          {/* Left column - Video (hidden on mobile) */}
          <div className={styles.heroVideoCol}>
            <TransparentVideo
              clips={labCoatClips}
              className={styles.heroVideo}
              alt="Foxy's Lab coat animation"
            />
          </div>

          {/* Right column - Text content */}
          <div className={styles.heroTextCol}>
            <div className={styles.heroLogoWrap}>
              <div className={styles.heroLogo}>
                <Image
                  src="/images/foxys-lab-logo-round.png"
                  alt="Foxy's Lab"
                  fill
                  className={styles.heroLogoImage}
                  priority
                />
              </div>
            </div>

            <h1 className={styles.heroTitle}>
              Welcome to
              <br />
              <span className="gradient-text">Foxy&apos;s Lab</span>
            </h1>

            <p className={`${styles.heroSubtitle} text-balance`}>
              Your ultimate destination for smart home technology, automation
              tutorials, and cutting-edge tech education.
            </p>

            <div className={styles.heroButtons}>
              <a
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn-primary ${styles.heroPrimaryBtn}`}
              >
                Subscribe on YouTube
              </a>
              <Link
                href="/videos"
                className={`btn-outline ${styles.heroOutlineBtn}`}
              >
                Watch Videos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Videos Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Latest Videos</h2>
          <Link href="/videos" className={styles.viewAllLink}>
            View All →
          </Link>
        </div>

        {videos.length > 0 ? (
          <div className={styles.videoGrid}>
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>
              Unable to load videos at this time.
            </p>
            <a
              href={siteConfig.social.youtubeVideos}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Watch on YouTube
            </a>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className={styles.section}>
        <h2 className={styles.featuresTitle}>What You&apos;ll Learn</h2>

        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={`${styles.featureIcon} gradient-primary`}>
              <svg
                className={styles.featureIconSvg}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Smart Home Basics</h3>
            <p className={styles.featureText}>
              From choosing devices to setting up your first automation, we
              cover everything you need to get started.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={`${styles.featureIcon} gradient-primary`}>
              <svg
                className={styles.featureIconSvg}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Advanced Automation</h3>
            <p className={styles.featureText}>
              Take your smart home to the next level with complex automations
              and custom integrations.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={`${styles.featureIcon} gradient-primary`}>
              <svg
                className={styles.featureIconSvg}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Security & Privacy</h3>
            <p className={styles.featureText}>
              Learn best practices for keeping your smart home secure and
              protecting your privacy.
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      {showNewsletter && (
        <section className={styles.section}>
          <Newsletter />
        </section>
      )}
    </>
  );
}
