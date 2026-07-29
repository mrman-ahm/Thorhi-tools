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
    >
      <header className={styles.sectionHeading}>
        <h2 id="selected-families-title">Selected instrument families</h2>
        <Link href="/rebuild/products">View the complete catalogue</Link>
      </header>

      <div className={styles.productGrid}>
        {products.map((product) => (
          <article key={product.id}>
            <Link href={`/rebuild/products/${product.id}`}>
              <span className={styles.productMedia}>
                <CatalogueMedia product={product} labelled />
              </span>
              <span className={styles.productMeta}>
                <span>
                  <code>{product.code}</code>
                  <small>{product.division}</small>
                </span>
                <strong>{product.name}</strong>
                <em>{product.familyLabel}</em>
                <small>
                  {product.variants.length} {product.variants.length === 1 ? "variant" : "variants"}
                </small>
              </span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
