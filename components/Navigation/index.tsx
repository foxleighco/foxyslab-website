import Link from "next/link";
import Image from "next/image";
import { MobileMenu } from "../MobileMenu";
import { siteConfig } from "@/site.config";
import styles from "./styles.module.css";

export function Navigation() {
  const navLinks = siteConfig.navigation.main.filter(
    (link) => link.href !== "/blog" || siteConfig.features.blog
  );

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className={styles.inner}>
          {/* Logo */}
          <Link href="/" className={styles.logoLink}>
            <div className={styles.logoWrap}>
              <Image
                src="/images/foxys-lab-logo-round.png"
                alt="Foxy's Lab Logo"
                width={40}
                height={40}
                className={styles.logoImage}
                priority
              />
            </div>
            <span className={`${styles.logoText} gradient-text`}>
              Foxy&apos;s Lab
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className={styles.desktopNav}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={styles.navLink}
              >
                {link.label}
                <span className={styles.navLinkUnderline} />
              </Link>
            ))}
            <a
              href={siteConfig.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.cta} gradient-primary`}
              aria-label={siteConfig.navigation.cta.ariaLabel}
            >
              {siteConfig.navigation.cta.label}
            </a>
          </div>

          {/* Mobile menu */}
          <MobileMenu links={navLinks} />
        </div>
      </div>
    </nav>
  );
}
