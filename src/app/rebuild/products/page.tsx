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
    <main
      id="main"
      className={styles.cataloguePage}
      data-catalogue-workspace
      data-redesign-catalogue
    >
      <section className={styles.catalogueMasthead} data-catalogue-masthead>
        <div className={styles.mastheadInner}>
          <div className={styles.mastheadCopy}>
            <div className={styles.mastheadIndex}>
              <span>THR / 02</span>
              <span>Structured instrument archive</span>
            </div>
            <h1>Product catalogue</h1>
            <p>
              Search validated Surgical and Dental &amp; Orthodontic instrument
              families by product name or catalogue code.
            </p>
          </div>

          <div className={styles.mastheadSpecimen}>
            <span>Reference specimen</span>
            {catalogueInstrument ? (
              <CatalogueMedia
                product={catalogueInstrument}
                className={styles.mastheadInstrument}
                priority
              />
            ) : null}
            <div>
              <code>04-0101</code>
              <small>Operating Scissors</small>
            </div>
          </div>
        </div>

        <dl className={styles.mastheadLedger}>
          <div>
            <dt>Indexed products</dt>
            <dd>{rebuildCatalogue.counts.products}</dd>
          </div>
          <div>
            <dt>Variant codes</dt>
            <dd>{rebuildCatalogue.counts.variants}</dd>
          </div>
          <div>
            <dt>Structured divisions</dt>
            <dd>02</dd>
          </div>
          <div>
            <dt>Catalogue status</dt>
            <dd>Source-derived</dd>
          </div>
        </dl>
      </section>

      <Suspense fallback={<CatalogueLoading />}>
        <CatalogueClient />
      </Suspense>
    </main>
  );
}

function CatalogueLoading() {
  return (
    <section className={styles.loading} aria-label="Loading catalogue" role="status">
      <div />
      <div />
      <div />
      <p>Loading catalogue</p>
    </section>
  );
}
