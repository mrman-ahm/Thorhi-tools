"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export type PreviewProduct = {
  family: string;
  name: string;
  code: string;
};

const storageKey = "throhi-inquiry";
const updateEvent = "throhi:inquiry-updated";

function readSavedCodes() {
  try {
    const stored = window.localStorage.getItem(storageKey);
    return stored ? (JSON.parse(stored) as string[]) : [];
  } catch {
    return [];
  }
}

function persist(codes: string[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(codes));
  window.dispatchEvent(new Event(updateEvent));
}

function useSavedCodes() {
  const [savedCodes, setSavedCodes] = useState<string[]>([]);

  useEffect(() => {
    const refresh = () => setSavedCodes(readSavedCodes());
    refresh();
    window.addEventListener(updateEvent, refresh);
    return () => window.removeEventListener(updateEvent, refresh);
  }, []);

  return [savedCodes, setSavedCodes] as const;
}

export function ProductCatalogue({ products }: { products: readonly PreviewProduct[] }) {
  const [savedCodes, setSavedCodes] = useSavedCodes();
  const [announcement, setAnnouncement] = useState("");

  const addProduct = (product: PreviewProduct) => {
    if (savedCodes.includes(product.code)) {
      setAnnouncement(`${product.name} is already in the inquiry.`);
      return;
    }
    const next = [...savedCodes, product.code];
    setSavedCodes(next);
    persist(next);
    setAnnouncement(`${product.name} added to the inquiry.`);
  };

  return <>
    <p className="visually-hidden" aria-live="polite">{announcement}</p>
    <div className="product-grid">
      {products.map(product => {
        const added = savedCodes.includes(product.code);
        return <article className="product-card" key={product.code}>
          <div className="product-image" role="img" aria-label={`Temporary image placeholder for ${product.name}`}><span>Product image</span></div>
          <small>{product.family}</small>
          <h3>{product.name}</h3>
          <code>{product.code}</code>
          <p>Variant data pending verification</p>
          <button type="button" className={`button product-action ${added ? "positive" : "primary"}`} aria-pressed={added} onClick={() => addProduct(product)}>{added ? "Added to inquiry ✓" : "Add to inquiry"}</button>
        </article>;
      })}
    </div>
  </>;
}

export function SavedInquiryPanel({ products }: { products: readonly PreviewProduct[] }) {
  const [savedCodes] = useSavedCodes();
  const savedProducts = useMemo(
    () => products.filter(product => savedCodes.includes(product.code)),
    [products, savedCodes]
  );

  return <aside className="saved-panel" aria-labelledby="saved-inquiry-title">
    <small>{savedProducts.length} ITEMS SAVED</small>
    <h3 id="saved-inquiry-title">Continue the inquiry</h3>
    <p>Selected products remain available while browsing the catalogue.</p>
    {savedProducts.length === 0 ? <div className="saved-empty"><strong>No products selected yet.</strong><span>Add products above to build a structured inquiry.</span></div> : savedProducts.map((product, index) => <div className="saved-row" key={product.code}><span><strong>{product.name}</strong><code>{product.code}</code></span><b>Qty {index + 1}</b></div>)}
    <Link className={`button positive full ${savedProducts.length === 0 ? "is-disabled" : ""}`} aria-disabled={savedProducts.length === 0} tabIndex={savedProducts.length === 0 ? -1 : undefined} href={savedProducts.length === 0 ? "#products" : "/inquiry"}>Review inquiry</Link>
  </aside>;
}
