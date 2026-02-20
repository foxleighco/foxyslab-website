import { Metadata } from "next";
import Image from "next/image";
import { Newsletter } from "@/components/Newsletter";
import { getChannelInfo, formatViewCount } from "@/lib/youtube";
import { newsletterFlag } from "@/app/flags";
import { siteConfig } from "@/site.config";
import styles from "./styles.module.css";

export const metadata: Metadata = {
  title: "About | Foxy's Lab",
  description: "Learn more about Foxy's Lab and our mission to make smart home technology accessible to everyone.",
};

export default async function AboutPage() {
  const [channelResult, showNewsletter] = await Promise.all([
    getChannelInfo(),
    newsletterFlag(),
  ]);
  const channel = channelResult.success ? channelResult.data : null;
  return (
    <div className={`container-md ${styles.page}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.logoWrap}>
          <div className={styles.logoContainer}>
            <Image
              src="/images/foxys-lab-logo-round.png"
              alt="Foxy's Lab"
              fill
              className={styles.logo}
            />
          </div>
        </div>
        <h1 className={styles.title}>
          About <span className="gradient-text">Foxy&apos;s Lab</span>
        </h1>
        <p className={styles.subtitle}>
          Making smart home technology accessible to everyone
        </p>
      </div>

      {/* Mission */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Our Mission</h2>
        <div>
          <p className={styles.missionText}>
            At Foxy&apos;s Lab, we believe that smart home technology should be accessible,
            understandable, and fun for everyone. Whether you&apos;re just getting started
            with your first smart bulb or building complex home automation systems,
            we&apos;re here to guide you every step of the way.
          </p>
          <p className={styles.missionText}>
            Our goal is to demystify smart home technology through clear, practical
            tutorials that you can follow along with. We focus on real-world applications,
            security best practices, and helping you make informed decisions about the
            technology you bring into your home.
          </p>
        </div>
      </section>

      {/* What We Cover */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>What We Cover</h2>
        <div className={styles.topicGrid}>
          <div className={styles.topicCard}>
            <h3 className={styles.topicTitle}>Smart Home Platforms</h3>
            <p className={styles.topicDescription}>
              Home Assistant, SmartThings, Google Home, Amazon Alexa, and more.
            </p>
          </div>
          <div className={styles.topicCard}>
            <h3 className={styles.topicTitle}>Device Reviews</h3>
            <p className={styles.topicDescription}>
              Honest reviews of smart devices, sensors, and automation hardware.
            </p>
          </div>
          <div className={styles.topicCard}>
            <h3 className={styles.topicTitle}>Automation Tutorials</h3>
            <p className={styles.topicDescription}>
              Step-by-step guides for creating useful automations and integrations.
            </p>
          </div>
          <div className={styles.topicCard}>
            <h3 className={styles.topicTitle}>Security & Privacy</h3>
            <p className={styles.topicDescription}>
              Best practices for keeping your smart home secure and private.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.section}>
        <div className={styles.statsGrid}>
          <div>
            <div className={`${styles.statValue} gradient-text`}>
              {channel ? formatViewCount(channel.subscriberCount) : "—"}
            </div>
            <div className={styles.statLabel}>Subscribers</div>
          </div>
          <div>
            <div className={`${styles.statValue} gradient-text`}>
              {channel ? channel.videoCount : "—"}
            </div>
            <div className={styles.statLabel}>Videos</div>
          </div>
          <div>
            <div className={`${styles.statValue} gradient-text`}>
              {channel ? formatViewCount(channel.viewCount) : "—"}
            </div>
            <div className={styles.statLabel}>Views</div>
          </div>
          <div>
            <div className={`${styles.statValue} gradient-text`}>100%</div>
            <div className={styles.statLabel}>Passion</div>
          </div>
        </div>
      </section>

      {/* Community */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Join Our Community</h2>
        <div className={styles.communityCard}>
          <p className={styles.communityText}>
            We&apos;re more than just a YouTube channel - we&apos;re a community of smart
            home enthusiasts sharing knowledge, troubleshooting together, and pushing
            the boundaries of home automation.
          </p>
          <div className={styles.communityButtons}>
            <a
              href={siteConfig.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Subscribe on YouTube
            </a>
            <a
              href={siteConfig.social.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              Join Discord
            </a>
            <a
              href={siteConfig.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              Follow on X
            </a>
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      {showNewsletter && (
        <section>
          <Newsletter />
        </section>
      )}
    </div>
  );
}
