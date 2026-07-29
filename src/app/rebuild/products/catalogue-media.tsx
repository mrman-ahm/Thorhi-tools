import type { RuntimeProduct } from "@/lib/rebuild-catalogue";
import { CatalogueSprite } from "./catalogue-sprite";
import styles from "./catalogue-media.module.css";

type CatalogueMediaProps = {
  product: Pick<RuntimeProduct, "id" | "code" | "name" | "imageSprite">;
  className?: string;
  labelled?: boolean;
  priority?: boolean;
};

export function CatalogueMedia({
  product,
  className = "",
  labelled = false,
  priority = false,
}: CatalogueMediaProps) {
  const source = `/catalogue/products/${product.id}.avif`;

  return (
    <span className={`${styles.media} ${className}`.trim()}>
      <CatalogueSprite
        product={product}
        className={styles.fallback}
      />
      {/* Pre-optimized AVIF avoids image-optimizer runtime and client JavaScript. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.image}
        src={source}
        alt={labelled ? `${product.name}, catalogue code ${product.code}` : ""}
        width="1200"
        height="900"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
      />
    </span>
  );
}
