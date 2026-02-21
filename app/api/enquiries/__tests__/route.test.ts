import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock postmark before importing route — use class for constructor compatibility
vi.mock("postmark", () => ({
  ServerClient: class MockServerClient {
    sendEmail = vi.fn().mockResolvedValue({ MessageID: "test-id" });
  },
}));

// Mock rate-limit module
vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn().mockReturnValue({
    success: true,
    remaining: 4,
    resetIn: 3600,
  }),
}));

const validBody = {
  name: "John Doe",
  email: "john@example.com",
  company: "Acme Inc",
  enquiryType: "product-review",
  message: "I would like to discuss a product review opportunity with you.",
  website: "",
};

function createRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/enquiries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": "127.0.0.1",
    },
    body: JSON.stringify(body),
  });
}

async function importRoute() {
  const mod = await import("../route");
  return mod.POST;
}

describe("POST /api/enquiries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();

    // Set env vars for postmark (before dynamic import)
    process.env.POSTMARK_API_KEY = "test-api-key";
    process.env.POSTMARK_FROM = "from@test.com";
    process.env.POSTMARK_TO = "to@test.com";
  });

  it("returns 200 for valid submission", async () => {
    const { checkRateLimit } = await import("@/lib/rate-limit");
    vi.mocked(checkRateLimit).mockReturnValue({
      success: true,
      remaining: 4,
      resetIn: 3600,
    });

    const POST = await importRoute();
    const response = await POST(createRequest(validBody));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it("returns 400 for invalid email", async () => {
    const { checkRateLimit } = await import("@/lib/rate-limit");
    vi.mocked(checkRateLimit).mockReturnValue({
      success: true,
      remaining: 4,
      resetIn: 3600,
    });

    const POST = await importRoute();
    const response = await POST(
      createRequest({ ...validBody, email: "not-an-email" })
    );

    expect(response.status).toBe(400);
  });

  it("returns 400 for short name", async () => {
    const { checkRateLimit } = await import("@/lib/rate-limit");
    vi.mocked(checkRateLimit).mockReturnValue({
      success: true,
      remaining: 4,
      resetIn: 3600,
    });

    const POST = await importRoute();
    const response = await POST(createRequest({ ...validBody, name: "J" }));

    expect(response.status).toBe(400);
  });

  it("returns 400 for short message", async () => {
    const { checkRateLimit } = await import("@/lib/rate-limit");
    vi.mocked(checkRateLimit).mockReturnValue({
      success: true,
      remaining: 4,
      resetIn: 3600,
    });

    const POST = await importRoute();
    const response = await POST(
      createRequest({ ...validBody, message: "Too short" })
    );

    expect(response.status).toBe(400);
  });

  it("returns 400 for invalid enquiry type", async () => {
    const { checkRateLimit } = await import("@/lib/rate-limit");
    vi.mocked(checkRateLimit).mockReturnValue({
      success: true,
      remaining: 4,
      resetIn: 3600,
    });

    const POST = await importRoute();
    const response = await POST(
      createRequest({ ...validBody, enquiryType: "invalid-type" })
    );

    expect(response.status).toBe(400);
  });

  it("returns 400 for invalid JSON body", async () => {
    const { checkRateLimit } = await import("@/lib/rate-limit");
    vi.mocked(checkRateLimit).mockReturnValue({
      success: true,
      remaining: 4,
      resetIn: 3600,
    });

    const POST = await importRoute();
    const request = new NextRequest(
      "http://localhost:3000/api/enquiries",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "not json",
      }
    );

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("rejects honeypot-filled submissions at validation", async () => {
    const { checkRateLimit } = await import("@/lib/rate-limit");
    vi.mocked(checkRateLimit).mockReturnValue({
      success: true,
      remaining: 4,
      resetIn: 3600,
    });

    const POST = await importRoute();
    const response = await POST(
      createRequest({ ...validBody, website: "http://spam.com" })
    );

    // Zod schema enforces website.max(0) — non-empty honeypot fails validation
    expect(response.status).toBe(400);
  });

  it("returns 429 when rate limited", async () => {
    const { checkRateLimit } = await import("@/lib/rate-limit");
    vi.mocked(checkRateLimit).mockReturnValue({
      success: false,
      remaining: 0,
      resetIn: 1800,
    });

    const POST = await importRoute();
    const response = await POST(createRequest(validBody));

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("1800");
  });

  it("returns 503 when postmark is not configured", async () => {
    delete process.env.POSTMARK_API_KEY;

    const POST = await importRoute();
    const response = await POST(createRequest(validBody));

    expect(response.status).toBe(503);
  });
});
