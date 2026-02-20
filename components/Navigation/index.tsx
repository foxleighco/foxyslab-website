import Link from "next/link";
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
