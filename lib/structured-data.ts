import { Organization, WebSite, WithContext } from "schema-dts";

export function getOrganizationSchema(): WithContext<Organization> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Foxy's Lab",
    url: "https://foxyslab.com",
    logo: "https://foxyslab.com/images/foxys-lab-logo-round.png",
    sameAs: [
      "https://www.youtube.com/@foxyslab",
      "https://twitter.com/foxyslab",
      "https://github.com/foxleigh81",
    ],
    description: "Smart Home & Tech Education YouTube Channel",
  };
}

export function getWebsiteSchema(): WithContext<WebSite> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Foxy's Lab",
    url: "https://foxyslab.com",
    description: "Expert tutorials on smart home technology and tech education",
    publisher: {
      "@type": "Organization",
      name: "Foxy's Lab",
    },
  };
}
