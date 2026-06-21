import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { getPartnerBySlug, getYouTubeId, partners } from "@/lib/partners";
import styles from "./styles.module.css";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return partners.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const partner = getPartnerBySlug(slug);
  if (!partner) return {};

  const title = `${partner.name} | Foxy's Lab Partners`;
  return {
    title,
    description: partner.shortDescription,
    openGraph: {
      type: "website",
      title,
      description: partner.shortDescription,
      url: `https://www.foxyslab.com/partners/${partner.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: partner.shortDescription,
    },
  };
}

export default async function PartnerPage({ params }: PageProps) {
  const { slug } = await params;
  const partner = getPartnerBySlug(slug);

  if (!partner) {
    notFound();
  }

  const videoIds = (partner.videos ?? [])
    .map((url) => ({ url, id: getYouTubeId(url) }))
    .filter((v): v is { url: string; id: string } => v.id !== null);
  const discounts = partner.discounts ?? [];

  return (
    <div className={`container-md ${styles.page}`}>
      <PageHeader
        title={<span className="gradient-text">{partner.name}</span>}
        subtitle={partner.shortDescription}
      />

      <div
        className={styles.logoWrap}
        style={{
          background: partner.colors.primary,
          borderColor: partner.colors.secondary,
        }}
      >
        <Image
          src={partner.logo}
          alt={`${partner.name} logo`}
          fill
          sizes="(max-width: 768px) 80vw, 400px"
          className={styles.logo}
          priority
        />
      </div>

      <section className={styles.section}>
        <p className={styles.intro}>{partner.intro}</p>
      </section>

      {discounts.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Discounts</h2>
          <ul className={styles.discountList}>
            {discounts.map((discount) => (
              <li key={discount.code} className={styles.discount}>
                <span className={styles.discountCode}>{discount.code}</span>
                <p className={styles.discountDescription}>
                  {discount.description}
                </p>
                {discount.link && (
                  <a
                    href={discount.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`btn-outline ${styles.discountLink}`}
                  >
                    Shop with this code
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {videoIds.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Videos</h2>
          <div className={styles.videoGrid}>
            {videoIds.map(({ id, url }, index) => (
              <div key={`${url}-${index}`} className={styles.videoEmbed}>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${id}`}
                  title={
                    videoIds.length > 1
                      ? `${partner.name} video ${index + 1}`
                      : `${partner.name} video`
                  }
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
                <span className="sr-only">{url}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className={styles.section}>
        <a
          href={partner.website}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          Visit {partner.name}
        </a>
      </section>

      <section className={styles.section}>
        <Link href="/partners" className={styles.back}>
          ← Back to all partners
        </Link>
      </section>
    </div>
  );
}
