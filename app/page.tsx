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
              Smart home and homelab tech without the corporate waffle. Honest
              reviews, local control advocacy, and the occasional
              strongly-worded opinion about cloud-dependent tat.
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

      {/* Meet Foxy */}
      <section className={styles.section}>
        <div className={styles.introCard}>
          <h2 className={styles.introTitle}>Who&apos;s This Then?</h2>
          <p className={styles.introText}>
            I&apos;m Foxy — I cover smart home tech, homelabs, and the
            occasional bit of general tech that catches my eye. I started this
            channel because I got fed up watching reviews that gloss over the
            important stuff: does it work locally? Will the company still exist
            in two years? Can you set it up without losing a weekend? Everything
            here gets tested in my actual home (for better or worse), every
            opinion is mine, and if something&apos;s rubbish, I&apos;ll tell
            you.
          </p>
          <p className={styles.introCatchphrase}>
            So... go grab a coffee, I&apos;ll get one too and then we&apos;ll
            get into it.
          </p>
        </div>
      </section>

      {/* What's on the Channel */}
      <section className={styles.section}>
        <h2 className={styles.featuresTitle}>What&apos;s on the Channel</h2>

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
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Local Control Matters</h3>
            <p className={styles.featureText}>
              I&apos;m a firm believer that your smart home and your homelab
              should work even when your internet doesn&apos;t. A big chunk of
              what I do is about keeping your data and your devices under your
              own roof.
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
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Honest Reviews</h3>
            <p className={styles.featureText}>
              I test smart home gear, homelab hardware, and the odd bit of
              general tech, then tell you what I honestly think — whether I
              bought it, was sent it, or it&apos;s part of a sponsorship. Every
              product gets the same honest treatment. If it&apos;s brilliant,
              I&apos;ll say so. If it&apos;s a waste of fifty quid, I&apos;ll
              say that too.
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
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className={styles.featureTitle}>What the Heck?!</h3>
            <p className={styles.featureText}>
              My beginner-friendly series that explains smart home and homelab
              concepts in plain English. Zigbee, Z-Wave, Docker, VLANs — all the
              jargon that makes your eyes glaze over, broken down without the
              condescension.
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
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Tutorials & Tinkering</h3>
            <p className={styles.featureText}>
              Step-by-step guides for people who want to get their hands dirty.
              Home Assistant setups, homelab builds, self-hosted services, and
              automations that actually make your life easier.
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
