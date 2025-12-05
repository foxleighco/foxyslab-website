/**
 * Site Configuration
 *
 * Central configuration file for site-wide settings.
 * Update these values to customize the site.
 */

export const siteConfig = {
  // Site Identity
  name: "Foxy's Lab",
  tagline: "Smart Home & Tech Education",
  description:
    "Join Foxy's Lab for expert tutorials on smart home technology, home automation, and tech education. Learn, build, and automate with confidence.",
  shortDescription: "Your guide to smart home technology, automation, and tech education.",

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
      { href: "/videos", label: "Videos" },
      { href: "/about", label: "About" },
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

  // Feature Flags
  features: {
    newsletter: true,
    // Set to true when newsletter service is connected
    newsletterEnabled: false,
  },
} as const;

// Type exports for use in components
export type SiteConfig = typeof siteConfig;
export type NavLink = (typeof siteConfig.navigation.main)[number];
export type SocialLinks = typeof siteConfig.social;
