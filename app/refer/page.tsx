import type { Metadata } from "next";
import Link from "next/link";
import styles from "./styles.module.css";

export const metadata: Metadata = {
  title: "Link unavailable | Foxy's Lab",
  description: "This Foxy's Lab short link has moved or expired.",
  robots: { index: false, follow: false },
};

export default function ReferFallbackPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={`${styles.title} gradient-text`}>Link unavailable</h1>
        <p className={styles.message}>
          This short link has moved, expired, or never existed. No harm done —
          let&apos;s get you back on track.
        </p>
        <Link href="/" className="btn-primary">
          Go to Foxy&apos;s Lab
        </Link>
      </div>
    </div>
  );
}
