import Link from "next/link";
import { CatalogueMedia } from "@/app/rebuild/products/catalogue-media";
import type { RuntimeProduct } from "@/lib/rebuild-catalogue";
import { homeHeroCopy } from "@/rebuild/home-content";
import { HomeCatalogueSearch } from "./home-catalogue-search";
import styles from "./home-hero.module.css";

export type HomeHeroProps = {
  scissors: RuntimeProduct;
  productCount: number;
  variantCount: number;
};

export function HomeHero({
  scissors,
  productCount,
  variantCount,
}: HomeHeroProps) {
  return (
    <section
      className={styles.hero}
      data-home-hero
      data-redesign-hero
      aria-labelledby="rebuild-home-title"
    >
      <div className={styles.inner}>
        <div className={styles.copy}>
          <div className={styles.indexLine} aria-hidden="true">
            <span>THR / 01</span>
            <span>Instrument archive</span>
          </div>
          <p className={styles.kicker}>Sialkot, Pakistan</p>
          <h1 id="rebuild-home-title">{homeHeroCopy.title}</h1>
          <p className={styles.lead}>Instrument catalogue and inquiry desk.</p>
          <p className={styles.description}>{homeHeroCopy.description}</p>
          <div className={styles.actions}>
            <Link href="/rebuild/products">Browse instruments</Link>
            <Link href="/rebuild/inquiry">Build an inquiry</Link>
          </div>
        </div>

        <div className={styles.instrument} data-hero-instrument>
          <div className={styles.specimenIndex} aria-hidden="true">
            <span>Reference specimen</span>
            <code>{scissors.code}</code>
          </div>
          <CatalogueMedia product={scissors} priority labelled />
          <p>{scissors.name}</p>
        </div>

        <HomeCatalogueSearch />

        <dl className={styles.catalogueSummary} aria-label="Available catalogue data">
          <div>
            <dt>Product families</dt>
            <dd>{productCount}</dd>
          </div>
          <div>
            <dt>Variant codes</dt>
            <dd>{variantCount.toLocaleString("en-US")}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
