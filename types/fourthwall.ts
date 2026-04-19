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

export interface FourthwallProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: FourthwallImage[];
  variants: FourthwallVariant[];
}
