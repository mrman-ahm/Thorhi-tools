"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useInquiry } from "@/components/inquiry-provider";

export type PreviewProduct = {
  family: string;
  name: string;
  code: string;
};

export function ProductCatalogue({ products }: { products: readonly PreviewProduct[] }) {
  const { items, addProduct } = useInquiry();
  const [announcement, setAnnouncement] = useState("");

  const handleAdd = (product: PreviewProduct) => {
    const result = addProduct({ code: product.code, name: product.name });
    setAnnouncement(result === "added" ? `${product.name} added to the inquiry.` : `${product.name} is already in the inquiry.`);
  };

  return <>
    <p className="visually-hidden" aria-live="polite">{announcement}</p>
    <div className="product-grid">
      {products.map(product => {
        const added = items.some(item => item.code === product.code);
        return <article className="product-card" key={product.code}>
          <div className="product-image" role="img" aria-label={`Temporary image placeholder for ${product.name}`}><span>Product image</span></div>
          <small>{product.family}</small>
          <h3>{product.name}</h3>
          <code>{product.code}</code>
          <p>Variant data pending verification</p>
          <button type="button" className={`button product-action ${added ? "positive" : "primary"}`} aria-pressed={added} onClick={() => handleAdd(product)}>{added ? "Added to inquiry ✓" : "Add to inquiry"}</button>
        </article>;
      })}
    </div>
  </>;
}

export function SavedInquiryPanel({ products }: { products: readonly PreviewProduct[] }) {
  const { items } = useInquiry();
  const savedProducts = useMemo(() => products.filter(product => items.some(item => item.code === product.code)), [products, items]);
  const itemLabel = savedProducts.length === 1 ? "ITEM" : "ITEMS";

  return <aside className="saved-panel" aria-labelledby="saved-inquiry-title">
    <small>{savedProducts.length} {itemLabel} SAVED</small>
    <h3 id="saved-inquiry-title">Continue the inquiry</h3>
    <p>Selected products remain available while browsing the catalogue.</p>
    {savedProducts.length === 0 ? <div className="saved-empty"><strong>No products selected yet.</strong><span>Add products above to build a structured inquiry.</span></div> : savedProducts.map(product => {
      const item = items.find(entry => entry.code === product.code);
      return <div className="saved-row" key={product.code}><span><strong>{product.name}</strong><code>{product.code}</code></span><b>Qty {item?.quantity ?? 1}</b></div>;
    })}
    <Link className={`button positive full ${savedProducts.length === 0 ? "is-disabled" : ""}`} aria-disabled={savedProducts.length === 0} tabIndex={savedProducts.length === 0 ? -1 : undefined} href={savedProducts.length === 0 ? "#products" : "/inquiry"}>Review inquiry</Link>
  </aside>;
}
