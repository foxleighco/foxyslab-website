"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig, NavLink } from "@/site.config";
import styles from "./styles.module.css";

interface MobileMenuProps {
  links: readonly NavLink[];
}

export function MobileMenu({ links }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.toggle}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <svg
          className={styles.icon}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className={styles.menu} data-testid="mobile-menu">
          <div className={styles.menuLinks}>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={styles.link}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
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
        </div>
      )}
    </>
  );
}
