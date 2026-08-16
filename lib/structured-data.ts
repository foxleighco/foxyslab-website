import {
  Organization,
  WebSite,
  Article,
  BreadcrumbList,
  VideoObject,
  ItemList,
  Person,
  WithContext,
} from "schema-dts";
import { siteConfig } from "@/site.config";

/**
 * The profiles that establish this is the same entity across the web.
 *
 * Shared between the Organization and the Person: the channel and the man
 * behind it are the same brand in practice, and search engines reconcile them
 * through overlapping `sameAs` links.
 */
const SOCIAL_PROFILES = [
  siteConfig.social.youtube,
  siteConfig.social.twitter,
  siteConfig.social.github,
  siteConfig.social.discord,
  siteConfig.social.patreon,
  siteConfig.social.instagram,
];

export function getOrganizationSchema(): WithContext<Organization> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.logo}`,
    sameAs: SOCIAL_PROFILES,
    description: `${siteConfig.tagline} YouTube Channel`,
  };
}

/**
 * The person behind the channel.
 *
 * A personality-led channel is an entity search engines want to resolve, and
 * without this there was nothing tying the name to the site — only an
 * Organization. `sameAs` is what lets the profiles, the channel and the site be
 * recognised as one thing rather than several.
 */
export function getPersonSchema(): WithContext<Person> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.author.name,
    url: `${siteConfig.url}/about`,
    image: `${siteConfig.url}/images/foxy-portrait.webp`,
    sameAs: SOCIAL_PROFILES,
    jobTitle: "Content Creator",
    worksFor: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

/**
 * A video listing as an ordered list of VideoObjects.
 *
 * `/videos` is the largest body of content on the site and carried no
 * structured data at all, so none of it was eligible for video rich results.
 * ItemList is the shape Google expects for a page that *lists* videos, as
 * opposed to a page that hosts one.
 */
export function getVideoListSchema(
  videos: {
    title: string;
    description: string;
    videoId: string;
    publishedAt: Date | string;
  }[]
): WithContext<ItemList> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: videos.map((video, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "VideoObject",
        name: video.title,
        description: video.description,
        thumbnailUrl: `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`,
        uploadDate: new Date(video.publishedAt).toISOString(),
        embedUrl: `https://www.youtube-nocookie.com/embed/${video.videoId}`,
        contentUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
      },
    })),
  };
}

export function getWebsiteSchema(): WithContext<WebSite> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
  };
}

export function getArticleSchema(opts: {
  title: string;
  description: string;
  slug: string;
  author: string;
  publishedAt: Date | string;
  updatedAt?: Date | string;
  tags: string[];
  heroImage?: string;
}): WithContext<Article> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    url: `${siteConfig.url}/blog/${opts.slug}`,
    author: {
      "@type": "Person",
      name: opts.author,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}${siteConfig.logo}`,
      },
    },
    datePublished: new Date(opts.publishedAt).toISOString(),
    ...(opts.updatedAt && {
      dateModified: new Date(opts.updatedAt).toISOString(),
    }),
    keywords: opts.tags.join(", "),
    ...(opts.heroImage && {
      image: opts.heroImage.startsWith("/")
        ? `${siteConfig.url}${opts.heroImage}`
        : opts.heroImage,
    }),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/blog/${opts.slug}`,
    },
  };
}

export function getBreadcrumbSchema(
  items: { name: string; url: string }[]
): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getVideoObjectSchema(opts: {
  title: string;
  description: string;
  videoId: string;
  uploadDate: Date | string;
}): WithContext<VideoObject> {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: opts.title,
    description: opts.description,
    thumbnailUrl: `https://img.youtube.com/vi/${opts.videoId}/maxresdefault.jpg`,
    uploadDate: new Date(opts.uploadDate).toISOString(),
    embedUrl: `https://www.youtube-nocookie.com/embed/${opts.videoId}`,
    contentUrl: `https://www.youtube.com/watch?v=${opts.videoId}`,
  };
}
