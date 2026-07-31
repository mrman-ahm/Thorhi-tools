import Link from "next/link";
import { CatalogueMedia } from "@/app/rebuild/products/catalogue-media";
import type { RuntimeProduct } from "@/lib/rebuild-catalogue";
import styles from "./home-sections.module.css";

export type HomeSelectedFamiliesProps = {
  products: readonly RuntimeProduct[];
};

export function HomeSelectedFamilies({ products }: HomeSelectedFamiliesProps) {
  return (
    <section
      className={styles.selected}
      aria-labelledby="selected-families-title"
      aria-label="Selected instrument families"
      data-home-selected
      data-redesign-section
    >
      <header className={styles.sectionHeading}>
        <div>
          <p>03 / Catalogue selection</p>
          <h2 id="selected-families-title">Selected instrument families</h2>
        </div>
        <Link href="/rebuild/products">View the complete catalogue</Link>
      </header>

      <div className={styles.productGrid}>
        {products.map((product, index) => (
          <article key={product.id}>
            <Link href={`/rebuild/products/${product.id}`}>
              <span className={styles.productMedia}>
                <CatalogueMedia product={product} labelled />
              </span>
              <span className={styles.productMeta}>
                <span className={styles.productIndex}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <code>{product.code}</code>
                </span>
                <strong>{product.name}</strong>
                <em>{product.familyLabel}</em>
                <span className={styles.productFooter}>
                  <small>{product.division}</small>
                  <small>{product.variants.length} variants</small>
                  <b aria-hidden="true">↗</b>
                </span>
              </span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
