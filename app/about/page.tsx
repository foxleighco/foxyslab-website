import { Metadata } from "next";
import { Newsletter } from "@/components/Newsletter";
import { PageHeader } from "@/components/PageHeader";
import {
  getChannelInfo,
  getLatestVideos,
  formatViewCount,
} from "@/lib/youtube";
import { newsletterFlag } from "@/app/flags";
import { siteConfig } from "@/site.config";
import styles from "./styles.module.css";

export const metadata: Metadata = {
  title: "About | Foxy's Lab",
  description:
    "Meet the person behind Foxy's Lab — a smart home and homelab obsessive with strong opinions about local control and far too many Zigbee devices.",
};

export default async function AboutPage() {
  const [channelResult, videosResult, showNewsletter] = await Promise.all([
    getChannelInfo(),
    getLatestVideos(50),
    newsletterFlag(),
  ]);
  const channel = channelResult.success ? channelResult.data : null;
  const totalComments = videosResult.success
    ? videosResult.data
        .reduce((sum, v) => sum + parseInt(v.commentCount, 10), 0)
        .toString()
    : "0";
  return (
    <div className={`container-md ${styles.page}`}>
      <PageHeader
        title={
          <>
            About <span className="gradient-text">Foxy&apos;s Lab</span>
          </>
        }
        subtitle="One person, too many smart devices, a server rack that won't stop growing, and some strong opinions about local control"
      />

      {/* About */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>What&apos;s This All About?</h2>
        <div>
          <p className={styles.missionText}>
            I started Foxy&apos;s Lab in September 2025, originally to impress a
            prospective employer (honestly). Turns out I loved making videos, so
            I kept going. What began as a bit of a career stunt turned into
            something I genuinely care about.
          </p>
          <p className={styles.missionText}>
            The channel covers smart home tech and homelabs in roughly equal
            measure, with the occasional bit of general tech thrown in when
            something catches my eye. My thing is local control. I think your
            smart home should work when your internet goes down. I think your
            data should stay in your house. And I think you shouldn&apos;t need
            a monthly subscription for a light switch to function. That
            doesn&apos;t mean I reject anything cloud-based — if the cloud
            genuinely adds value for you (not just for the company selling it),
            that&apos;s fine. But if a device stops working the moment a server
            goes offline for no good reason, I&apos;m going to have opinions
            about that.
          </p>
        </div>
      </section>

      {/* What I Cover */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>What I Cover</h2>
        <div className={styles.topicGrid}>
          <div className={styles.topicCard}>
            <h3 className={styles.topicTitle}>Smart Home & Homelab</h3>
            <p className={styles.topicDescription}>
              Home Assistant, self-hosted services, server builds, and the
              platforms that tie it all together. These two worlds overlap more
              than most people realise, and I cover both in equal measure.
            </p>
          </div>
          <div className={styles.topicCard}>
            <h3 className={styles.topicTitle}>Device Reviews</h3>
            <p className={styles.topicDescription}>
              Whether I bought it, got sent it, or it&apos;s part of a paid deal
              — every product gets the same honest shake. If a fifty quid sensor
              falls apart after a month, you&apos;ll be the first to know.
            </p>
          </div>
          <div className={styles.topicCard}>
            <h3 className={styles.topicTitle}>Automation Tutorials</h3>
            <p className={styles.topicDescription}>
              Practical, follow-along guides for smart home automations, homelab
              setups, and self-hosted services. I try to explain the
              &apos;why&apos; as well as the &apos;how&apos;, because
              understanding what you&apos;re building matters more than just
              copying my YAML.
            </p>
          </div>
          <div className={styles.topicCard}>
            <h3 className={styles.topicTitle}>Security & Privacy</h3>
            <p className={styles.topicDescription}>
              Your smart home and your homelab shouldn&apos;t be a liability. I
              talk about keeping things local, choosing devices and services
              that respect your privacy, and why that cheap camera from a brand
              you&apos;ve never heard of might not be the bargain it seems.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>The Story So Far</h2>
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
            <div className={`${styles.statValue} gradient-text`}>
              {totalComments !== "0" ? formatViewCount(totalComments) : "—"}
            </div>
            <div className={styles.statLabel}>Comments</div>
          </div>
        </div>
        <p className={styles.statsSubtext}>
          Still early days — but every video is made with care, and I&apos;d
          rather grow slowly with an audience that actually finds this useful
          than chase numbers with clickbait.
        </p>
      </section>

      {/* Community */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Come Say Hello</h2>
        <div className={styles.communityCard}>
          <p className={styles.communityText}>
            I&apos;m building a community around this channel and honestly,
            it&apos;s one of the best bits. The Discord has a mix of seasoned
            smart home and homelab tinkerers and complete beginners, and
            everyone&apos;s been lovely so far. If you want to chat about Home
            Assistant, show off your server rack, argue about the best Zigbee
            coordinator, or just lurk and learn — you&apos;re welcome.
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
