import Image from "next/image";
import styles from "./styles.module.css";

interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <Image
          src="/images/foxys-lab-logo-round.webp"
          alt="Foxy's Lab"
          fill
          className={styles.logoImage}
          /* Matches .logo: 3.5rem below 768px, 6rem above. Without this,
             `fill` assumes 100vw and fetches a full-width variant. */
          sizes="(max-width: 767px) 56px, 96px"
        />
      </div>
      <div className={styles.text}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
    </div>
  );
}
