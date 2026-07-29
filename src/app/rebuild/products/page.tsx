import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogueMedia } from "@/app/rebuild/products/catalogue-media";
import {
  getRebuildProductByCode,
  rebuildCatalogue,
} from "@/lib/rebuild-catalogue";
import { CatalogueClient } from "./catalogue-client";
import styles from "./catalogue.module.css";

export const metadata: Metadata = {
  title: "Product Catalogue | THROHI Medical Tools",
  description:
    "Search THROHI surgical and dental instruments by product name, family, or code.",
  robots: { index: false, follow: false },
};

const catalogueInstrument = getRebuildProductByCode("04-0101");

export default function ProductsPage() {
  return (
    <main id="main" className={styles.cataloguePage}>
      <section className={styles.intro}>
        {catalogueInstrument ? (
          <CatalogueMedia
            product={catalogueInstrument}
            className={styles.introInstrument}
            priority
          />
        ) : null}
        <div className={styles.introInner}>
          <p>THROHI / Product catalogue</p>
          <h1>Find the right instrument.</h1>
          <p>
            Search {rebuildCatalogue.counts.products} indexed product records
            and {rebuildCatalogue.counts.variants} variant codes across the
            supplied Surgical and Dental &amp; Orthodontic catalogues.
          </p>
        </div>
      </section>
      <Suspense fallback={<CatalogueLoading />}>
        <CatalogueClient />
      </Suspense>
    </main>
  );
}

function CatalogueLoading() {
  return (
    <section className={styles.loading} aria-label="Loading catalogue">
      <div />
      <div />
      <div />
      <p>Loading catalogue</p>
    </section>
  );
}
