import Link from "next/link";
import Image from "next/image";
import { MobileMenu } from "./MobileMenu";
import { siteConfig } from "@/site.config";

export function Navigation() {
  const navLinks = siteConfig.navigation.main.filter(
    (link) => link.href !== "/blog" || siteConfig.features.blog
  );

  return (
    <nav className="sticky top-0 z-50 bg-secondary/95 backdrop-blur-sm border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 transition-transform group-hover:scale-110">
              <Image
                src="/images/foxys-lab-logo-round.png"
                alt="Foxy's Lab Logo"
                width={40}
                height={40}
                className="rounded-full object-cover"
                priority
              />
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block">
              Foxy&apos;s Lab
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/80 hover:text-white transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            ))}
            <a
              href={siteConfig.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 gradient-primary rounded-full text-white font-semibold hover:opacity-90 transition-opacity"
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
