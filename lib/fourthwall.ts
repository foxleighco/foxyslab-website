import * as Sentry from "@sentry/nextjs";
import { unstable_cache } from "next/cache";
import type { FourthwallProduct, ShopProductPreview } from "@/types/fourthwall";

const STOREFRONT_API_BASE = "https://storefront-api.fourthwall.com/v1";
const CACHE_TTL_SECONDS = 3600;

type ApiResult<T> =
  { success: true; data: T } | { success: false; error: string };

function getStorefrontToken(): string {
  return process.env.FOURTHWALL_STOREFRONT_TOKEN || "";
}

/**
 * Shuffle an array using Fisher-Yates
 */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Keeps only the fields the site renders. See ShopProductPreview. */
export function toPreview(product: FourthwallProduct): ShopProductPreview {
  const image = product.images?.[0];

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    image: image
      ? {
          id: image.id,
          url: image.url,
          width: image.width,
          height: image.height,
        }
      : null,
    price: product.variants?.[0]?.unitPrice ?? null,
  };
}

/**
 * Fetches and projects the catalogue.
 *
 * The fetch itself is deliberately uncached. Caching it stored the full ~1.7MB
 * response, which routinely crossed Next's 2MB data-cache ceiling — and once it
 * does, the write is rejected and the catalogue is refetched on *every* render,
 * silently, with only a log line to show for it. Caching the projection instead
 * stores about 5KB, comfortably clear of the limit.
 */
async function fetchProductPreviews(): Promise<ShopProductPreview[]> {
  const url = `${STOREFRONT_API_BASE}/collections/all/products?storefront_token=${encodeURIComponent(getStorefrontToken())}`;
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Fourthwall API error: ${response.status}`);
  }

  const data = await response.json();
  return (data.results ?? []).map(toPreview);
}

/*
 * The whole catalogue is cached, not the subset the homepage shows, so that the
 * random pick below still varies between renders instead of freezing for an
 * hour.
 */
const getCachedProductPreviews = unstable_cache(
  fetchProductPreviews,
  ["fourthwall-product-previews"],
  { revalidate: CACHE_TTL_SECONDS, tags: ["fourthwall-products"] }
);

/**
 * Fetch products from the Fourthwall store.
 * Returns a random subset when `count` is specified.
 */
export async function getProducts(
  count?: number
): Promise<ApiResult<ShopProductPreview[]>> {
  return Sentry.startSpan(
    {
      op: "fourthwall.api",
      name: "getProducts",
    },
    async (span) => {
      try {
        if (!getStorefrontToken()) {
          return { success: false, error: "No storefront token configured" };
        }

        const products = await getCachedProductPreviews();
        span.setAttribute("fourthwall.product_count", products.length);

        const result = count ? shuffle(products).slice(0, count) : products;
        return { success: true, data: result };
      } catch (error) {
        Sentry.captureException(error);
        const message =
          error instanceof Error
            ? error.message
            : "Unknown error fetching products";
        console.error("Error fetching Fourthwall products:", error);
        return { success: false, error: message };
      }
    }
  );
}
