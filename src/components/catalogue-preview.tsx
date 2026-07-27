"use client";

import Link from "next/link";
import { ProductCard } from "@/components/catalogue-ui";
import { useInquiry } from "@/components/inquiry-provider";
import type { Product } from "@/lib/catalogue";

export type PreviewProduct = Product;

export function ProductCatalogue({ products }: { products: readonly PreviewProduct[] }) {
  return <div className="product-grid catalogue-editorial-grid v3-home-product-grid">
    {products.map(product => <ProductCard product={product} key={product.id} />)}
  </div>;
}

export function SavedInquiryPanel() {
  const { items } = useInquiry();
  const itemLabel = items.length === 1 ? "ITEM" : "ITEMS";

  return <aside className="saved-panel" aria-labelledby="saved-inquiry-title">
    <small>{items.length} {itemLabel} SAVED</small>
    <h3 id="saved-inquiry-title">Continue the inquiry</h3>
    <p>Selected products remain available while browsing the catalogue.</p>
    {items.length === 0 ? <div className="saved-empty">
      <strong>No products selected yet.</strong>
      <span>Add products above to build a structured inquiry.</span>
    </div> : items.map(item => <div className="saved-row" key={item.code}>
      <span>
        <strong>{item.name}</strong>
        <code>{item.code}</code>
        {item.manual ? <small>Unlisted reference</small> : null}
      </span>
      <b>Qty {item.quantity}</b>
    </div>)}
    <Link
      className={`button positive full ${items.length === 0 ? "is-disabled" : ""}`}
      aria-disabled={items.length === 0}
      tabIndex={items.length === 0 ? -1 : undefined}
      href={items.length === 0 ? "#products" : "/inquiry"}
    >Review inquiry</Link>
  </aside>;
}
