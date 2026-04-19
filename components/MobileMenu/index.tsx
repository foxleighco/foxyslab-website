"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { siteConfig, NavLink } from "@/site.config";
import styles from "./styles.module.css";

interface MobileMenuProps {
  links: readonly NavLink[];
}

export function MobileMenu({ links }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Escape key closes the menu
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  // Focus trap: keep Tab cycling within menu when open
  useEffect(() => {
    if (!isOpen || !menuRef.current) return;

    const menu = menuRef.current;
    const focusable = menu.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    // Focus the first link when menu opens
    first.focus();

    function handleTab(e: KeyboardEvent) {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    menu.addEventListener("keydown", handleTab);
    return () => menu.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile menu button */}
      <button
        ref={toggleRef}
        onClick={() => setIsOpen(!isOpen)}
        className={styles.toggle}
        aria-label={isOpen ? "Close menu" : "Open menu"}
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
          aria-hidden="true"
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
        <nav
          ref={menuRef}
          className={styles.menu}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          data-testid="mobile-menu"
        >
          <div className={styles.menuLinks}>
            {links.map((link) =>
              "external" in link && link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                  onClick={close}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={styles.link}
                  onClick={close}
                >
                  {link.label}
                </Link>
              )
            )}
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
        </nav>
      )}
    </>
  );
}
