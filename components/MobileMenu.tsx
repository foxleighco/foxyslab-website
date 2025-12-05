"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig, NavLink } from "@/site.config";

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
        className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <svg
          className="w-6 h-6"
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
        <div className="md:hidden py-4 border-t border-primary/20">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/80 hover:text-white transition-colors px-4 py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={siteConfig.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 gradient-primary rounded-full text-white font-semibold hover:opacity-90 transition-opacity mx-4 text-center"
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
