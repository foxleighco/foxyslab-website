import { Organization, WebSite, WithContext } from "schema-dts";
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
