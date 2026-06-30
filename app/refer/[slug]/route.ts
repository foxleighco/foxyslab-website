import { NextRequest, NextResponse } from "next/server";
import { getReferLink } from "@/lib/refer";
import { trackServerEvent } from "@/lib/ga";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

/**
 * Short-link / referral redirector.
 *
 * /refer/<slug> redirects to the destination configured in data/refer.json.
 * The slug is decoupled from the destination, so links baked into videos stay
 * valid even when the target URL changes — just update the entry on our side.
 *
 * A route handler (rather than a page) is used so the redirect is a clean
 * server-side 307; Next's page-level redirect() renders an HTML interstitial
 * for external URLs. Unknown, disabled, or malformed entries fall through to
 * the branded /refer fallback page.
 */
export async function GET(request: NextRequest, { params }: RouteContext) {
  const { slug } = await params;
  const link = getReferLink(slug);

  if (!link || !/^https?:\/\//i.test(link.url)) {
    return NextResponse.redirect(new URL("/refer", request.url), 307);
  }

  await trackServerEvent("refer_click", { slug: link.slug.toLowerCase() });

  // 307 (temporary) so clients don't cache the old target.
  return NextResponse.redirect(link.url, 307);
}
