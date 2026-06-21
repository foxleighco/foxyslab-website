import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { partners } from "@/lib/partners";
import styles from "./styles.module.css";

export const metadata: Metadata = {
  title: "Partners | Foxy's Lab",
  description:
    "The brands Foxy's Lab has partnered with, plus current affiliate deals and discounts worth knowing about.",
  openGraph: {
    type: "website",
    title: "Partners | Foxy's Lab",
    description:
      "The brands Foxy's Lab has partnered with, plus current affiliate deals and discounts worth knowing about.",
    url: "https://www.foxyslab.com/partners",
  },
  twitter: {
    card: "summary_large_image",
    title: "Partners | Foxy's Lab",
    description:
      "The brands Foxy's Lab has partnered with, plus current affiliate deals and discounts worth knowing about.",
  },
};

export default function PartnersPage() {
  return (
    <div className={`container-md ${styles.page}`}>
      <PageHeader
        title={
          <>
            Our <span className="gradient-text">Partners</span>
          </>
        }
        subtitle="The brands we've teamed up with, and the affiliate deals currently on offer"
      />

      <section className={styles.intro}>
        <p className={styles.introText}>
          Foxy&apos;s Lab works with a handful of brands whose products we
          actually use and recommend. This page is where you&apos;ll find them —
          alongside any active affiliate deals or discount codes that might save
          you a few quid. Every partnership here has to pass the same bar: would
          I happily run this in my own house? If the answer is no, it
          doesn&apos;t make the cut.
        </p>
      </section>

      <section className={styles.grid}>
        {partners.map((partner) => (
          <article key={partner.slug} className={styles.card}>
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
                sizes="(max-width: 768px) 80vw, 300px"
                className={styles.logo}
              />
            </div>
            <h2 className={styles.cardTitle}>{partner.name}</h2>
            <p className={styles.cardDescription}>{partner.shortDescription}</p>
            <Link
              href={`/partners/${partner.slug}`}
              className={`btn-outline ${styles.cardButton}`}
            >
              View partner page
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
