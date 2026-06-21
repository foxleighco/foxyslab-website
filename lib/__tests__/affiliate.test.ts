import { describe, it, expect } from "vitest";
import { isAmazonLink } from "../affiliate";

describe("isAmazonLink", () => {
  it("matches amzn.to short links", () => {
    expect(isAmazonLink("https://amzn.to/48TG4bp")).toBe(true);
  });

  it("matches amzn.eu short links", () => {
    expect(isAmazonLink("https://amzn.eu/d/abc123")).toBe(true);
  });

  it("matches amazon domains across TLDs and subdomains", () => {
    expect(isAmazonLink("https://www.amazon.co.uk/dp/B0CZJN14PG")).toBe(true);
    expect(isAmazonLink("https://amazon.com/gp/product/B0CK2FCG1K")).toBe(true);
    expect(isAmazonLink("https://www.amazon.de/dp/B000")).toBe(true);
  });

  it("does not match lookalike domains", () => {
    expect(isAmazonLink("https://notamazon.com/product")).toBe(false);
    expect(isAmazonLink("https://amazon.phishing.com/dp/x")).toBe(false);
  });

  it("does not match unrelated stores", () => {
    expect(
      isAmazonLink("https://www.repenic.com/discount/fox10?redirect=%2F")
    ).toBe(false);
  });

  it("returns false for invalid URLs", () => {
    expect(isAmazonLink("not a url")).toBe(false);
    expect(isAmazonLink("")).toBe(false);
  });
});
