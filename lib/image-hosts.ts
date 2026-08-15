/**
 * Remote image hosts allowed through next/image.
 *
 * This lives here rather than inline in next.config.ts so tests can assert
 * against the real list instead of a copy that would quietly drift out of date.
 *
 * Why it matters: if a third party moves their CDN, next/image rejects the new
 * host with `400 "url" parameter is not allowed` and the images render blank.
 * There's no build error and no runtime exception — the page just looks broken.
 * That's exactly what happened when Fourthwall moved product images from
 * cdn.fourthwall.com to imgproxy.fourthwall.dev.
 */

export interface RemoteImagePattern {
  protocol: "https";
  hostname: string;
  /** Optional glob, matching next/image semantics: `*` one segment, `**` many. */
  pathname?: string;
}

export const REMOTE_IMAGE_PATTERNS: RemoteImagePattern[] = [
  { protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" },
  { protocol: "https", hostname: "img.youtube.com", pathname: "/vi/**" },
  // Fourthwall's older asset host. Kept alongside imgproxy: some assets still
  // reference it, and it may be served from either during a migration.
  { protocol: "https", hostname: "cdn.fourthwall.com" },
  // Current host for product images.
  { protocol: "https", hostname: "imgproxy.fourthwall.dev" },
];

/**
 * Representative image URLs the app depends on at runtime.
 *
 * Full URLs rather than bare hostnames, so the assertion also covers any
 * pathname restriction on the pattern — a host can be allowlisted and still
 * reject the paths we actually request.
 *
 * Tests assert every one of these passes, so removing or narrowing a pattern
 * something still relies on fails loudly.
 */
export const REQUIRED_IMAGE_URLS: { integration: string; url: string }[] = [
  {
    integration: "fourthwall (product images)",
    url: "https://imgproxy.fourthwall.dev/abc123/w:1920/sm:1/enc/AbCd/EfGh",
  },
  {
    integration: "fourthwall (legacy cdn)",
    url: "https://cdn.fourthwall.com/some/product.jpg",
  },
  {
    integration: "youtube (video thumbnails)",
    url: "https://i.ytimg.com/vi/rq9jzgeZ3G8/maxresdefault.jpg",
  },
  {
    integration: "youtube (alternate thumbnail host)",
    url: "https://img.youtube.com/vi/rq9jzgeZ3G8/hqdefault.jpg",
  },
];

/** Convert a next/image pathname glob into an anchored regex. */
function globToRegExp(glob: string): RegExp {
  let out = "";
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === "*") {
      if (glob[i + 1] === "*") {
        out += ".*";
        i++;
      } else {
        out += "[^/]*";
      }
    } else {
      out += c.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
    }
  }
  return new RegExp(`^${out}$`);
}

/**
 * Would next/image accept this URL?
 *
 * Mirrors the subset of matching we actually use: exact hostname, optional
 * pathname glob. Returns false for anything unparseable.
 */
export function isAllowedImageUrl(
  url: string,
  patterns: RemoteImagePattern[] = REMOTE_IMAGE_PATTERNS
): boolean {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }

  return patterns.some((p) => {
    if (`${p.protocol}:` !== parsed.protocol) return false;
    if (p.hostname !== parsed.hostname) return false;
    if (p.pathname && !globToRegExp(p.pathname).test(parsed.pathname)) {
      return false;
    }
    return true;
  });
}
