export interface FourthwallImage {
  id: string;
  url: string;
  width: number;
  height: number;
}

export interface FourthwallPrice {
  value: number;
  currency: string;
}

export interface FourthwallVariant {
  id: string;
  name: string;
  unitPrice: FourthwallPrice;
}

/** Shape returned by the storefront API. Large — see ShopProductPreview. */
export interface FourthwallProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: FourthwallImage[];
  variants: FourthwallVariant[];
}

/**
 * What the site actually renders for a product: one image and one price.
 *
 * The storefront returns every image and every variant — around 56 and 49 per
 * product respectively, which is 1.6MB for ten products and one variant field
 * alone accounting for 324KB. All but the first of each is discarded on
 * render, so keeping them only served to push the payload past Next's 2MB
 * data-cache ceiling, at which point nothing was cached at all.
 *
 * Projecting to this shape first takes the cached payload to roughly 5KB.
 */
export interface ShopProductPreview {
  id: string;
  name: string;
  slug: string;
  image: FourthwallImage | null;
  price: FourthwallPrice | null;
}
