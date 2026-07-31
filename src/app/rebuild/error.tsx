"use client";

import Link from "next/link";
import { useEffect } from "react";
import styles from "./utility-state.module.css";

export default function RebuildError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Rebuild route error", error);
  }, [error]);

  return (
    <main id="main" className={styles.statePage} data-utility-state="error">
      <div className={styles.stateGrid}>
        <div className={styles.missingCode} aria-hidden="true">!</div>
        <article className={styles.statePanel}>
          <p className={styles.referenceLabel}>Route interruption</p>
          <h1 className={styles.stateTitle}>This page could not be prepared.</h1>
          <p>
            Your catalogue and Inquiry List data remain in the browser. Retry the route, return
            to the catalogue, or review the current inquiry without re-entering product lines.
          </p>
          <div className={styles.actions}>
            <button className={styles.primary} type="button" onClick={() => reset()}>
              Retry this page
            </button>
            <Link href="/rebuild/products">Return to catalogue</Link>
            <Link className={styles.secondary} href="/rebuild/inquiry">Review Inquiry List</Link>
          </div>
        </article>
      </div>
    </main>
  );
}
