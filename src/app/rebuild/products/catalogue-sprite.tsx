import type { CSSProperties } from "react";
import { rebuildCatalogue, type RuntimeProduct } from "@/lib/rebuild-catalogue";
import styles from "../rebuild.module.css";

type CatalogueSpriteProps = {
  product: Pick<RuntimeProduct, "code" | "name" | "imageSprite">;
  className?: string;
  labelled?: boolean;
};

export function CatalogueSprite({
  product,
  className = "",
  labelled = false
}: CatalogueSpriteProps) {
  const { columns, rows, path } = rebuildCatalogue.assetManifest;
  const x = product.imageSprite.column / (columns - 1) * 100;
  const y = product.imageSprite.row / (rows - 1) * 100;
  const style = {
    "--catalogue-sprite-url": `url("${path}")`,
    "--catalogue-sprite-size": `${columns * 100}% ${rows * 100}%`,
    "--catalogue-sprite-position": `${x}% ${y}%`
  } as CSSProperties;

  return <span
    className={`${styles.catalogueSprite} ${className}`.trim()}
    role={labelled ? "img" : undefined}
    aria-label={labelled ? `${product.name}, catalogue code ${product.code}` : undefined}
    aria-hidden={labelled ? undefined : true}
    style={style}
  >
    <span className={styles.spriteFallback}>{product.code}</span>
    <span className={styles.spriteImage} />
  </span>;
}
