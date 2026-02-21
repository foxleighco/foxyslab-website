import { describe, it, expect } from "vitest";
import { getOrganizationSchema, getWebsiteSchema } from "../structured-data";
import { siteConfig } from "@/site.config";

describe("getOrganizationSchema", () => {
  it("returns valid Organization JSON-LD", () => {
    const schema = getOrganizationSchema();

    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("Organization");
    expect(schema.name).toBe(siteConfig.name);
    expect(schema.url).toBe(siteConfig.url);
    expect(schema.logo).toBe(`${siteConfig.url}${siteConfig.logo}`);
  });

  it("includes all social media links", () => {
    const schema = getOrganizationSchema();

    expect(schema.sameAs).toContain(siteConfig.social.youtube);
    expect(schema.sameAs).toContain(siteConfig.social.twitter);
    expect(schema.sameAs).toContain(siteConfig.social.github);
  });
});

describe("getWebsiteSchema", () => {
  it("returns valid WebSite JSON-LD", () => {
    const schema = getWebsiteSchema();

    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("WebSite");
    expect(schema.name).toBe(siteConfig.name);
    expect(schema.url).toBe(siteConfig.url);
    expect(schema.description).toBe(siteConfig.description);
  });

  it("includes publisher info", () => {
    const schema = getWebsiteSchema();

    expect(schema.publisher).toEqual({
      "@type": "Organization",
      name: siteConfig.name,
    });
  });
});
