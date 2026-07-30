import Link from "next/link";
import type { CSSProperties } from "react";
import type { RuntimeProduct } from "@/lib/rebuild-catalogue";
import { CatalogueMedia } from "./catalogue-media";
import styles from "./catalogue.module.css";

export type CatalogueProductEntryProps = {
  product: RuntimeProduct;
  detailHref: string;
  inquiryQuantity: number;
  resultOrder: number;
  onAdd: (product: RuntimeProduct) => void;
};

export function CatalogueProductEntry({
  product,
  detailHref,
  inquiryQuantity,
  resultOrder,
  onAdd,
}: CatalogueProductEntryProps) {
  const divisionLabel =
    product.division === "dental" ? "Dental & Orthodontic" : "Surgical";
  const variantLabel = product.variants.length
    ? `${product.variants.length} ${
        product.variants.length === 1 ? "variant code" : "variant codes"
      }`
    : "Single catalogue code";

  return (
    <article
      className={styles.productEntry}
      data-product-entry
      style={{ "--result-order": resultOrder } as CSSProperties}
    >
      <Link
        href={detailHref}
        className={styles.entryStage}
        aria-label={`View ${product.name}, catalogue code ${product.code}`}
      >
        <CatalogueMedia product={product} className={styles.entryMedia} />
        <span className={styles.entryCode}>{product.code}</span>
        <span className={styles.entryView}>
          View instrument <b aria-hidden="true">↗</b>
        </span>
      </Link>

      <div className={styles.entryCopy}>
        <div className={styles.entryTaxonomy}>
          <span>{divisionLabel}</span>
          <span>{product.familyLabel}</span>
        </div>
        <h2>
          <Link href={detailHref}>{product.name}</Link>
        </h2>
        <div className={styles.entryFooter}>
          <span>{variantLabel}</span>
          <button
            type="button"
            data-selected={inquiryQuantity > 0}
            onClick={() => onAdd(product)}
          >
            {inquiryQuantity > 0
              ? `Add another · ${inquiryQuantity}`
              : "Add to Inquiry"}
          </button>
        </div>
      </div>
    </article>
  );
}
