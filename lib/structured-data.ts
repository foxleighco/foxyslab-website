import {
  Organization,
  WebSite,
  Article,
  BreadcrumbList,
  VideoObject,
  WithContext,
} from "schema-dts";
import { siteConfig } from "@/site.config";

export function getOrganizationSchema(): WithContext<Organization> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.logo}`,
    sameAs: [
      siteConfig.social.youtube,
      siteConfig.social.twitter,
      siteConfig.social.github,
      siteConfig.social.discord,
      siteConfig.social.patreon,
    ],
    description: `${siteConfig.tagline} YouTube Channel`,
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
