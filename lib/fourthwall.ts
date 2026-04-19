import * as Sentry from "@sentry/nextjs";
import type { FourthwallProduct } from "@/types/fourthwall";

const STOREFRONT_API_BASE = "https://storefront-api.fourthwall.com/v1";

type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

function getStorefrontToken(): string {
  const token = process.env.FOURTHWALL_STOREFRONT_TOKEN;
  if (!token && process.env.NODE_ENV === "production") {
    throw new Error("FOURTHWALL_STOREFRONT_TOKEN is required in production");
  }
  return token || "";
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

/**
 * Fetch products from the Fourthwall store.
 * Returns a random subset when `count` is specified.
 */
export async function getProducts(
  count?: number
): Promise<ApiResult<FourthwallProduct[]>> {
  return Sentry.startSpan(
    {
      op: "fourthwall.api",
      name: "getProducts",
    },
    async (span) => {
      try {
        const token = getStorefrontToken();
        if (!token) {
          return { success: false, error: "No storefront token configured" };
        }

        const url = `${STOREFRONT_API_BASE}/collections/all/products?storefront_token=${token}`;
        const response = await fetch(url, {
          next: { revalidate: 3600 },
        });

        if (!response.ok) {
          const message = `Fourthwall API error: ${response.status}`;
          console.error(message);
          return { success: false, error: message };
        }

        const data = await response.json();
        const products: FourthwallProduct[] = (data.results ?? []).map(
          (p: FourthwallProduct) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            description: p.description,
            images: p.images,
            variants: p.variants,
          })
        );

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
