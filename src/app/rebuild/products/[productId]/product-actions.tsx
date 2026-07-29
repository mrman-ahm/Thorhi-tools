"use client";

import Link from "next/link";
import { useState } from "react";
import { useInquiry } from "@/components/inquiry-provider";
import styles from "./product-detail.module.css";

type Product = { id: string; code: string; name: string };
type Variant = { id: string; code: string };

export function ProductActions({
  product,
  variant,
  compact = false,
}: {
  product: Product;
  variant?: Variant;
  compact?: boolean;
}) {
  const { items, addProduct } = useInquiry();
  const [announcement, setAnnouncement] = useState("");
  const key = variant ? `${product.id}:${variant.id}` : product.id;
  const existing = items.find((item) => item.key === key);

  const add = () => {
    const result = addProduct({
      productId: product.id,
      productCode: product.code,
      code: variant?.code ?? product.code,
      name: product.name,
      variantId: variant?.id,
      variantLabel: variant?.code,
    });
    setAnnouncement(
      result === "added"
        ? `${product.name} added to the Inquiry List.`
        : `${product.name} quantity increased in the Inquiry List.`
    );
  };

  if (compact) {
    return (
      <>
        <span className={styles.srOnly} aria-live="polite">{announcement}</span>
        <button
          className={styles.compactAdd}
          type="button"
          data-selected={Boolean(existing)}
          onClick={add}
        >
          {existing ? `Add another · ${existing.quantity}` : "Add variant"}
        </button>
      </>
    );
  }

  return (
    <div className={styles.detailActions}>
      <span className={styles.srOnly} aria-live="polite">{announcement}</span>
      <button type="button" data-selected={Boolean(existing)} onClick={add}>
        {existing ? `Add another · ${existing.quantity} in list` : "Add to Inquiry"}
      </button>
      <Link href="/rebuild/inquiry">Review Inquiry List</Link>
    </div>
  );
}
