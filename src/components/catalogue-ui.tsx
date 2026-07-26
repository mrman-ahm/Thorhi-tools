"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { useInquiry } from "@/components/inquiry-provider";
import { catalogueCounts, productHref, type CatalogueDocument, type Product, type ProductVariant } from "@/lib/catalogue";

export function SeedDataNotice() {
  return <aside className="seed-notice catalogue-seed-notice" role="note"><span className="seed-mark" aria-hidden="true">SOURCE / FM</span><div><strong>Client-supplied catalogue data</strong><span>{catalogueCounts.products} instrument groups and {catalogueCounts.variants} documented variants are imported from the supplied FineMed catalogues. Verify critical dimensions before regulatory or technical publication.</span></div></aside>;
}

export function Breadcrumbs({ items }: { items: readonly { label: string; href?: string }[] }) {
  return <nav className="breadcrumbs catalogue-breadcrumbs" aria-label="Breadcrumb"><ol>{items.map((item, index) => <li key={`${item.label}-${index}`}>{item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}</li>)}</ol></nav>;
}

function spriteStyle(product: Product) {
  const sprite = product.imageSprite;
  if (!sprite) return undefined;
  return {
    "--sprite-columns": sprite.columns,
    "--sprite-rows": sprite.rows,
    "--sprite-column": sprite.column,
    "--sprite-row": sprite.row
  } as CSSProperties;
}

export function ProductImage({ product, compact = false }: { product: Product; compact?: boolean }) {
  const available = product.imageState === "available" && product.image && product.imageSprite;
  const label = available ? product.name : `Image unavailable for ${product.name}`;
  const sprite = product.imageSprite;

  return <div className={`catalogue-image catalogue-object-visual ${compact ? "compact" : ""} state-${product.imageState}`} role="img" aria-label={label} style={spriteStyle(product)}>
    {available && sprite ? <Image
      className="catalogue-sprite-image"
      src={product.image as string}
      alt=""
      aria-hidden="true"
      width={sprite.columns * sprite.cellSize}
      height={sprite.rows * sprite.cellSize}
      sizes="(max-width: 720px) 100vw, 25vw"
      unoptimized
    /> : <>
      <span className="catalogue-object-grid" aria-hidden="true" />
      <span className="catalogue-object-form" aria-hidden="true"><i className="object-arm one" /><i className="object-arm two" /><i className="object-joint" /><i className="object-ring one" /><i className="object-ring two" /></span>
    </>}
    <span className="catalogue-object-status">{available ? `${product.variants.length} documented ${product.variants.length === 1 ? "variant" : "variants"}` : "Image unavailable"}</span>
    <code>{product.code}</code>
  </div>;
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
    <button type="button" className={`button product-action catalogue-inquiry-action ${added ? "positive" : "primary"} ${className}`} aria-label={`${added ? "Added to inquiry" : "Add to inquiry"}: ${product.name}`} aria-pressed={added} onClick={handleAdd}><span>{added ? "Added to inquiry" : "Add to inquiry"}</span><b aria-hidden="true">{added ? "✓" : "+"}</b></button>
  </>;
}

export function ProductInquiryControls({ product }: { product: Product }) {
  const { items, addProduct, updateItem } = useInquiry();
  const existing = items.find(item => item.code === product.code);
  const [quantity, setQuantity] = useState(existing?.quantity ?? 1);
  const [note, setNote] = useState(existing?.note ?? "");
  const [announcement, setAnnouncement] = useState("");

  const setSafeQuantity = (value: number) => setQuantity(Math.max(1, Math.min(9999, value || 1)));
  const add = () => {
    const result = addProduct({ productId: product.id, code: product.code, name: product.name });
    updateItem(product.code, { quantity, note });
    setAnnouncement(result === "added" ? `${product.name} added with quantity ${quantity}.` : `${product.name} inquiry details updated.`);
  };

  return <div className="product-purchase-actions catalogue-detail-actions">
    <span className="visually-hidden" aria-live="polite">{announcement}</span>
    <div className="detail-field quantity-field">
      <label htmlFor="detail-quantity">Quantity for inquiry</label>
      <div className="catalogue-quantity-control">
        <button type="button" aria-label={`Decrease quantity for ${product.name}`} disabled={quantity <= 1} onClick={() => setSafeQuantity(quantity - 1)}>−</button>
        <input id="detail-quantity" type="number" min="1" max="9999" inputMode="numeric" value={quantity} onChange={event => setSafeQuantity(Number(event.target.value))} />
        <button type="button" aria-label={`Increase quantity for ${product.name}`} disabled={quantity >= 9999} onClick={() => setSafeQuantity(quantity + 1)}>+</button>
      </div>
    </div>
    <div className="detail-field note-field"><label htmlFor="detail-note">Product-specific note</label><textarea id="detail-note" value={note} onChange={event => setNote(event.target.value)} placeholder="Optional requirement or equivalent reference" /></div>
    <button type="button" className={`button product-action catalogue-detail-submit ${existing ? "positive" : "primary"}`} aria-label={`${existing ? "Update inquiry details for" : "Add to inquiry"}: ${product.name}`} onClick={add}><span>{existing ? "Update inquiry details" : "Add to inquiry"}</span><b aria-hidden="true">↗</b></button>
  </div>;
}

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  return <article className={`product-card catalogue-product-card catalogue-object-card ${compact ? "compact" : ""}`}>
    <Link className="catalogue-card-media" href={productHref(product)} aria-label={`View ${product.name}`}><ProductImage product={product} compact={compact} /><span className="catalogue-card-open" aria-hidden="true">OPEN OBJECT ↗</span></Link>
    <div className="catalogue-card-body">
      <div className="catalogue-card-index"><small>{product.catalogue.toUpperCase()} · {product.family.replaceAll("-", " ").toUpperCase()}</small><code>{product.code}</code></div>
      <h3><Link href={productHref(product)}>{product.name}</Link></h3>
      <p>{product.variants.length} documented {product.variants.length === 1 ? "variant" : "variants"} · source page {product.sourcePdfPage}</p>
      <div className="card-actions catalogue-card-actions"><Link className="catalogue-text-link" href={productHref(product)}>View details <span aria-hidden="true">↗</span></Link><AddProductButton product={product} /></div>
    </div>
  </article>;
}

function ExactVariantAction({ product, variant }: { product: Product; variant: ProductVariant }) {
  const { items, addProduct } = useInquiry();
  const [announcement, setAnnouncement] = useState("");
  const added = items.some(item => item.code === variant.label);
  const variantName = `${product.name} — ${variant.label}`;

  const addVariant = () => {
    const result = addProduct({
      productId: `${product.id}:${variant.id}`,
      code: variant.label,
      name: variantName
    });
    setAnnouncement(result === "added"
      ? `${variant.label} added to the inquiry.`
      : `${variant.label} is already in the inquiry.`);
  };

  return <>
    <span className="visually-hidden" aria-live="polite">{announcement}</span>
    <button
      type="button"
      className={`catalogue-variant-action ${added ? "is-added" : ""}`}
      aria-label={`${added ? "Exact variant added" : "Add exact variant"}: ${variant.label} for ${product.name}`}
      aria-pressed={added}
      onClick={addVariant}
    ><span>{added ? "Added" : "Add exact code"}</span><b aria-hidden="true">{added ? "✓" : "+"}</b></button>
  </>;
}

export function ProductVariantTable({ product }: { product: Product }) {
  return <div className="catalogue-variant-table" role="region" aria-label={`Documented variants for ${product.name}`} tabIndex={0}>
    <table>
      <thead><tr><th scope="col">Code</th><th scope="col">Catalogue description</th><th scope="col">Source</th><th scope="col">Inquiry</th></tr></thead>
      <tbody>{product.variants.map(variant => <tr key={variant.id}><th scope="row"><code>{variant.label}</code></th><td>{variant.value}</td><td><span>PDF {variant.pdfPage ?? "—"}</span>{variant.printedPage ? <small>Printed {variant.printedPage}</small> : null}</td><td><ExactVariantAction product={product} variant={variant} /></td></tr>)}</tbody>
    </table>
  </div>;
}

export function DocumentList({ documents }: { documents: readonly CatalogueDocument[] }) {
  if (documents.length === 0) return <p className="empty-copy catalogue-document-empty">No approved product documents are available yet.</p>;
  return <div className="document-list catalogue-document-list">{documents.map((document, index) => <article className="document-row catalogue-document-row" key={document.title}><span className="document-index">{String(index + 1).padStart(2, "0")}</span><span><strong>{document.title}</strong><small>{document.fileType} · {document.fileSize ?? "metadata pending"}{document.updatedAt ? ` · updated ${document.updatedAt}` : ""}</small></span>{document.status === "available" && document.href ? <Link href={document.href}>Open ↗</Link> : <span className="status-chip">Pending verification</span>}</article>)}</div>;
}

export function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  return <button className={`copy-code catalogue-copy-code ${copied ? "is-copied" : ""}`} type="button" onClick={copy}><code>{code}</code><span>{copied ? "Copied" : "Copy code"}</span></button>;
}
