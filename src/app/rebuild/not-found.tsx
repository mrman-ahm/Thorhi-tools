import Link from "next/link";
import styles from "./utility-state.module.css";

export default function RebuildNotFound() {
  return (
    <main id="main" className={styles.statePage} data-utility-state="not-found">
      <div className={styles.stateGrid}>
        <div className={styles.missingCode} aria-hidden="true">404</div>
        <article className={styles.statePanel}>
          <p className={styles.referenceLabel}>Catalogue route not found</p>
          <h1 className={styles.stateTitle}>This instrument route is not available.</h1>
          <p>
            The address may be incomplete, the product may belong to another family, or the
            reference may not yet appear in the structured catalogue.
          </p>
          <div className={styles.actions}>
            <Link className={styles.primary} href="/rebuild/products">Search catalogue</Link>
            <Link href="/rebuild/products">Browse all products</Link>
            <Link className={styles.secondary} href="/rebuild/inquiry?manual=1">
              Add an unlisted instrument
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
