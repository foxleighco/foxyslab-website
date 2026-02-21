/**
 * Site Configuration
 *
 * Central configuration file for site-wide settings.
 * Update these values to customize the site.
 */

export const siteConfig = {
  // Site Identity
  name: "Foxy's Lab",
  tagline: "Smart Home, Homelab & Tech",
  description:
    "Foxy's Lab — honest smart home and homelab reviews, local control advocacy, and beginner-friendly tech tutorials from a bloke who tests everything in his actual house.",
  shortDescription:
    "Smart home and homelab tech, honest opinions, and a healthy distrust of cloud-only devices.",

  // URLs
  url: "https://www.foxyslab.com",
  logo: "/images/foxys-lab-logo-round.png",
  ogImage: "/images/foxys-lab-logo-round.png",

  // Author / Creator
  author: {
    name: "Alexander Foxleigh",
    twitter: "@foxleigh81",
  },

  // Social Media Links
  social: {
    youtube: "https://www.youtube.com/@foxyslab",
    youtubeVideos: "https://www.youtube.com/@foxyslab/videos",
    twitter: "https://x.com/foxleigh81",
    github: "https://github.com/foxleigh81",
    patreon: "https://www.patreon.com/c/foxyslab",
    discord: "https://discord.gg/tPdaADbM2N",
    kofi: "https://ko-fi.com/foxyslab",
    kit: "https://kit.co/foxleigh81",
  },

  // YouTube Channel Configuration
  youtube: {
    channelHandle: "foxyslab",
    // Minimum video duration (seconds) to filter out Shorts
    minVideoDuration: 180,
  },

  // Navigation Links
  navigation: {
    main: [
      { href: "/", label: "Home" },
      { href: "/blog", label: "Blog" },
      { href: "/videos", label: "Videos" },
      { href: "/about", label: "About" },
      { href: "/enquiries", label: "Enquiries" },
    ],
    // CTA button in navigation
    cta: {
      label: "Subscribe",
      ariaLabel: "Subscribe on YouTube",
    },
  },

  // SEO Defaults
  seo: {
    locale: "en_US",
    type: "website",
    keywords: [
      "smart home",
      "home automation",
      "tech education",
      "YouTube",
      "tutorials",
      "IoT",
      "Home Assistant",
    ],
  },

  // Blog Configuration
  blog: {
    postsPerPage: 12,
    excerptLength: 160,
    defaultAuthor: "Alexander Foxleigh",
  },

  // Enquiries / Contact Configuration
  enquiries: {
    // Email address to receive enquiries (set in ENQUIRIES_EMAIL env var)
    // Types of enquiries accepted
    types: [
      { value: "product-review", label: "Product Review Request" },
      { value: "sponsorship", label: "Sponsorship Opportunity" },
      { value: "collaboration", label: "Collaboration" },
      { value: "media", label: "Media / Press Inquiry" },
      { value: "other", label: "Other" },
    ],
    // Rate limit: max submissions per IP per hour
    rateLimitPerHour: 5,
  },
} as const;

// Type exports for use in components
export type SiteConfig = typeof siteConfig;
export type NavLink = (typeof siteConfig.navigation.main)[number];
export type SocialLinks = typeof siteConfig.social;
