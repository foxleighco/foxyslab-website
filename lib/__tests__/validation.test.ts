import { describe, it, expect } from "vitest";
import { isValidEmail, sanitizeInput } from "../validation";

describe("isValidEmail", () => {
  it("accepts valid email addresses", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
    expect(isValidEmail("first.last@domain.co.uk")).toBe(true);
    expect(isValidEmail("user+tag@example.com")).toBe(true);
  });

  it("rejects invalid email addresses", () => {
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(isValidEmail("@domain.com")).toBe(false);
    expect(isValidEmail("user@")).toBe(false);
    expect(isValidEmail("user @example.com")).toBe(false);
  });
});

describe("sanitizeInput", () => {
  it("trims whitespace", () => {
    expect(sanitizeInput("  hello  ")).toBe("hello");
  });

  it("removes angle brackets", () => {
    expect(sanitizeInput("<script>alert('xss')</script>")).toBe(
      "scriptalert('xss')/script"
    );
  });

  it("limits length to 255 characters", () => {
    const long = "a".repeat(300);
    expect(sanitizeInput(long)).toHaveLength(255);
  });

  it("handles empty strings", () => {
    expect(sanitizeInput("")).toBe("");
  });

  it("preserves normal text", () => {
    expect(sanitizeInput("Hello World")).toBe("Hello World");
  });
});
