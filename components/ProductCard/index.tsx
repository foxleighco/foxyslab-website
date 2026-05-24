"use client";

import { useState } from "react";
import Image from "next/image";
import type { ResourceProduct } from "@/types/resource";
import { ProductModal } from "@/components/ProductModal";
import styles from "./styles.module.css";

interface ProductCardProps {
  product: ResourceProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const [showModal, setShowModal] = useState(false);

  function handleCardClick() {
    setShowModal(true);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setShowModal(true);
    }
  }

  return (
    <>
      <div
        className={styles.card}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${product.name}`}
      >
        <div className={styles.imageWrap}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
        <div className={styles.content}>
          <h3 className={styles.name}>{product.name}</h3>
          {product.description && (
            <p className={styles.description}>{product.description}</p>
          )}
          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.cta}
            onClick={(e) => e.stopPropagation()}
          >
            View on Amazon
            <svg
              className={styles.ctaIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>

      {showModal && (
        <ProductModal product={product} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
