import Image from "next/image";
import type { FourthwallProduct } from "@/types/fourthwall";
import { siteConfig } from "@/site.config";
import styles from "./styles.module.css";

interface ShopPreviewProps {
  products: FourthwallProduct[];
}

function formatPrice(value: number, currency: string): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
  }).format(value);
}

export function ShopPreview({ products }: ShopPreviewProps) {
  if (products.length === 0) return null;

  return (
    <div className={styles.grid}>
      {products.map((product) => {
        const image = product.images[0];
        const price = product.variants[0]?.unitPrice;

        return (
          <a
            key={product.id}
            href={`${siteConfig.social.shop}/products/${product.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.card}
          >
            {image && (
              <div className={styles.imageWrap}>
                <Image
                  src={image.url}
                  alt={product.name}
                  width={image.width}
                  height={image.height}
                  className={styles.image}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            )}
            <div className={styles.info}>
              <h3 className={styles.name}>{product.name}</h3>
              {price && (
                <span className={styles.price}>
                  {formatPrice(price.value, price.currency)}
                </span>
              )}
              <span className={styles.cta}>View in Store</span>
            </div>
          </a>
        );
      })}
    </div>
  );
}
