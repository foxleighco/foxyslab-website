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
          src="/images/foxys-lab-logo-round.png"
          alt="Foxy's Lab"
          fill
          className={styles.logoImage}
        />
      </div>
      <div className={styles.text}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
    </div>
  );
}
