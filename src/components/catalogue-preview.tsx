"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ProductCard } from "@/components/catalogue-ui";
import { useInquiry } from "@/components/inquiry-provider";
import type { Product } from "@/lib/catalogue";

export type PreviewProduct = Product;

export function ProductCatalogue({ products }: { products: readonly PreviewProduct[] }) {
  return <div className="product-grid catalogue-editorial-grid v3-home-product-grid">
    {products.map(product => <ProductCard product={product} key={product.id} />)}
  </div>;
}

export function SavedInquiryPanel({ products }: { products: readonly PreviewProduct[] }) {
  const { items } = useInquiry();
  const savedProducts = useMemo(
    () => products.filter(product => items.some(item => item.code === product.code)),
    [products, items]
  );
  const itemLabel = savedProducts.length === 1 ? "ITEM" : "ITEMS";

  return <aside className="saved-panel" aria-labelledby="saved-inquiry-title">
    <small>{savedProducts.length} {itemLabel} SAVED</small>
    <h3 id="saved-inquiry-title">Continue the inquiry</h3>
    <p>Selected products remain available while browsing the catalogue.</p>
    {savedProducts.length === 0 ? <div className="saved-empty">
      <strong>No products selected yet.</strong>
      <span>Add products above to build a structured inquiry.</span>
    </div> : savedProducts.map(product => {
      const item = items.find(entry => entry.code === product.code);
      return <div className="saved-row" key={product.code}>
        <span><strong>{product.name}</strong><code>{product.code}</code></span>
        <b>Qty {item?.quantity ?? 1}</b>
      </div>;
    })}
    <Link
      className={`button positive full ${savedProducts.length === 0 ? "is-disabled" : ""}`}
      aria-disabled={savedProducts.length === 0}
      tabIndex={savedProducts.length === 0 ? -1 : undefined}
      href={savedProducts.length === 0 ? "#products" : "/inquiry"}
    >Review inquiry</Link>
  </aside>;
}
