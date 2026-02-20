import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";
import * as postmark from "postmark";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";
import { siteConfig } from "@/site.config";

const { logger } = Sentry;

const POSTMARK_API_KEY = process.env.POSTMARK_API_KEY;
const POSTMARK_FROM = process.env.POSTMARK_FROM;
const POSTMARK_TO = process.env.POSTMARK_TO;

// Valid enquiry types from config
const validEnquiryTypes = siteConfig.enquiries.types.map((t) => t.value) as string[];

// Form validation schema
const enquirySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(254, "Email must be less than 254 characters")
    .trim()
    .toLowerCase(),
  company: z
    .string()
    .max(100, "Company name must be less than 100 characters")
    .trim()
    .optional()
    .transform((val) => val || undefined),
  enquiryType: z
    .string()
    .refine((val) => validEnquiryTypes.includes(val), {
      message: "Please select an enquiry type",
    }),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(5000, "Message must be less than 5000 characters")
    .trim(),
  // Honeypot field - should always be empty
  website: z.string().max(0, "Bot detected").optional(),
});

type EnquiryData = z.infer<typeof enquirySchema>;

function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  return "unknown";
}

function getEnquiryTypeLabel(value: string): string {
  const type = siteConfig.enquiries.types.find((t) => t.value === value);
  return type?.label || value;
}

function formatEmailBody(data: EnquiryData): string {
  return `
New enquiry from ${siteConfig.name} website

Name: ${data.name}
Email: ${data.email}
Company: ${data.company || "Not provided"}
Enquiry Type: ${getEnquiryTypeLabel(data.enquiryType)}

Message:
${data.message}

---
This email was sent from the enquiry form at ${siteConfig.url}/enquiries
  `.trim();
}

function formatEmailHtml(data: EnquiryData): string {
  // Security: all user input is escaped via escapeHtml before insertion
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #d32365, #df5a13); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; }
    .value { margin-top: 4px; }
    .message { background: white; padding: 15px; border-radius: 4px; border: 1px solid #eee; white-space: pre-wrap; }
    .footer { margin-top: 20px; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">New Enquiry</h1>
      <p style="margin: 5px 0 0 0; opacity: 0.9;">${getEnquiryTypeLabel(data.enquiryType)}</p>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Name</div>
        <div class="value">${escapeHtml(data.name)}</div>
      </div>
      <div class="field">
        <div class="label">Email</div>
        <div class="value"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></div>
      </div>
      <div class="field">
        <div class="label">Company</div>
        <div class="value">${escapeHtml(data.company || "Not provided")}</div>
      </div>
      <div class="field">
        <div class="label">Message</div>
        <div class="message">${escapeHtml(data.message)}</div>
      </div>
      <div class="footer">
        Sent from <a href="${siteConfig.url}/enquiries">${siteConfig.name}</a>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: NextRequest) {
  try {
    if (!POSTMARK_API_KEY || !POSTMARK_FROM || !POSTMARK_TO) {
      logger.error("Missing Postmark environment variables (POSTMARK_API_KEY, POSTMARK_FROM, POSTMARK_TO)");
      return NextResponse.json(
        { error: "Contact form is not configured. Please try again later." },
        { status: 503 }
      );
    }

    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(
      `enquiry:${clientIP}`,
      siteConfig.enquiries.rateLimitPerHour,
      60 * 60 * 1000
    );

    if (!rateLimit.success) {
      logger.warn("Enquiry rate limit reached", { clientIP });
      return NextResponse.json(
        {
          error: `Too many requests. Please try again in ${Math.ceil(rateLimit.resetIn / 60)} minutes.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.resetIn),
          },
        }
      );
    }

    // Parse and validate request body
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const validationResult = enquirySchema.safeParse(body);

    if (!validationResult.success) {
      const issues = validationResult.error.issues;
      const errors = issues.map((e) => e.message);
      return NextResponse.json(
        { error: errors[0], errors },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Honeypot check - if website field has content, it's likely a bot
    if (data.website) {
      logger.info("Honeypot triggered on enquiry form", { clientIP });
      // Silently accept but don't send email (don't reveal bot detection)
      return NextResponse.json({ success: true });
    }

    // Send email via Postmark
    await Sentry.startSpan(
      {
        op: "http.client",
        name: "POST Postmark send email",
      },
      async (span) => {
        const client = new postmark.ServerClient(POSTMARK_API_KEY);

        span.setAttribute("enquiry.type", data.enquiryType);

        await client.sendEmail({
          From: POSTMARK_FROM,
          To: POSTMARK_TO,
          ReplyTo: data.email,
          Subject: `[${getEnquiryTypeLabel(data.enquiryType)}] New enquiry from ${data.name}`,
          TextBody: formatEmailBody(data),
          HtmlBody: formatEmailHtml(data),
          MessageStream: "outbound",
        });
      }
    );

    logger.info("Enquiry sent successfully", { enquiryType: data.enquiryType });

    return NextResponse.json({
      success: true,
      message: "Thank you for your enquiry. We'll get back to you soon!",
    });
  } catch (error) {
    Sentry.captureException(error);
    logger.error(logger.fmt`Enquiry form error: ${error}`);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
