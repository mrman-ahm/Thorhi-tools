"use client";

import Link from "next/link";
import { useState } from "react";
import { useInquiry } from "@/components/inquiry-provider";
import { productHref, type CatalogueDocument, type Product } from "@/lib/catalogue";

export function SeedDataNotice() {
  return <aside className="seed-notice" role="note"><strong>Demonstration catalogue data</strong><span>Names and codes on this development build are seed records pending approval and migration.</span></aside>;
}

export function Breadcrumbs({ items }: { items: readonly { label: string; href?: string }[] }) {
  return <nav className="breadcrumbs" aria-label="Breadcrumb"><ol>{items.map((item, index) => <li key={`${item.label}-${index}`}>{item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}</li>)}</ol></nav>;
}

export function ProductImage({ product, compact = false }: { product: Product; compact?: boolean }) {
  return <div className={`catalogue-image ${compact ? "compact" : ""} state-${product.imageState}`} role="img" aria-label={product.imageState === "available" ? product.name : `Temporary image placeholder for ${product.name}`}><span>{product.imageState === "missing" ? "Image unavailable" : "Replaceable product image"}</span><code>{product.code}</code></div>;
}

export function AddProductButton({ product, className = "" }: { product: Product; className?: string }) {
  const { items, addProduct } = useInquiry();
  const [announcement, setAnnouncement] = useState("");
  const added = items.some(item => item.code === product.code);

  const handleAdd = () => {
    const result = addProduct({ productId: product.id, code: product.code, name: product.name });
    setAnnouncement(result === "added" ? `${product.name} added to the inquiry.` : `${product.name} is already in the inquiry.`);
  };

  return <>
    <span className="visually-hidden" aria-live="polite">{announcement}</span>
    <button type="button" className={`button product-action ${added ? "positive" : "primary"} ${className}`} aria-pressed={added} onClick={handleAdd}>{added ? "Added to inquiry ✓" : "Add to inquiry"}</button>
  </>;
}

export function ProductInquiryControls({ product }: { product: Product }) {
  const { items, addProduct, updateItem } = useInquiry();
  const existing = items.find(item => item.code === product.code);
  const [quantity, setQuantity] = useState(existing?.quantity ?? 1);
  const [note, setNote] = useState(existing?.note ?? "");
  const [announcement, setAnnouncement] = useState("");

  const add = () => {
    const result = addProduct({ productId: product.id, code: product.code, name: product.name });
    updateItem(product.code, { quantity, note });
    setAnnouncement(result === "added" ? `${product.name} added with quantity ${quantity}.` : `${product.name} inquiry details updated.`);
  };

  return <div className="product-purchase-actions">
    <span className="visually-hidden" aria-live="polite">{announcement}</span>
    <label htmlFor="detail-quantity">Quantity for inquiry</label>
    <input id="detail-quantity" type="number" min="1" max="9999" value={quantity} onChange={event => setQuantity(Math.max(1, Math.min(9999, Number(event.target.value) || 1)))} />
    <button type="button" className={`button product-action ${existing ? "positive" : "primary"}`} onClick={add}>{existing ? "Update inquiry details" : "Add to inquiry"}</button>
    <label htmlFor="detail-note">Product-specific note</label>
    <textarea id="detail-note" value={note} onChange={event => setNote(event.target.value)} placeholder="Optional requirement or equivalent reference" />
  </div>;
}

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  return <article className={`product-card catalogue-product-card ${compact ? "compact" : ""}`}>
    <Link href={productHref(product)} aria-label={`View ${product.name}`}><ProductImage product={product} compact={compact} /></Link>
    <small>{product.division.toUpperCase()} · {product.family.replaceAll("-", " ").toUpperCase()}</small>
    <h3><Link href={productHref(product)}>{product.name}</Link></h3>
    <code>{product.code}</code>
    <p>{product.status === "seed" ? "Seed record · specifications pending approval" : product.description}</p>
    <div className="card-actions"><Link className="button secondary" href={productHref(product)}>View details</Link><AddProductButton product={product} /></div>
  </article>;
}

export function DocumentList({ documents }: { documents: readonly CatalogueDocument[] }) {
  if (documents.length === 0) return <p className="empty-copy">No approved product documents are available yet.</p>;
  return <div className="document-list">{documents.map(document => <article className="document-row" key={document.title}><span><strong>{document.title}</strong><small>{document.fileType} · {document.fileSize ?? "metadata pending"}{document.updatedAt ? ` · updated ${document.updatedAt}` : ""}</small></span>{document.status === "available" && document.href ? <Link href={document.href}>Open</Link> : <span className="status-chip">Pending verification</span>}</article>)}</div>;
}

export function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  return <button className="copy-code" type="button" onClick={copy}><code>{code}</code><span>{copied ? "Copied" : "Copy code"}</span></button>;
}
