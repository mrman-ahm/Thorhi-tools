import Link from "next/link";
import type { CompanyDivisionContent } from "@/rebuild/company-content";
import styles from "./corporate-components.module.css";

export function RebuildDivisionLedger({
  divisions,
}: {
  divisions: readonly CompanyDivisionContent[];
}) {
  return (
    <section
      className={styles.ledger}
      role="region"
      aria-label="Instrument divisions"
      data-corporate-ledger
    >
      {divisions.map((division, index) => (
        <article
          className={`${styles.ledgerRow} ${division.catalogueState === "pending" ? styles.pending : ""}`}
          key={division.slug}
          data-corporate-ledger-row
        >
          <span className={styles.ledgerIndex}>{String(index + 1).padStart(2, "0")}</span>
          <h3>{division.label}</h3>
          <p>{division.description}</p>
          {division.catalogueState === "structured" && division.href ? (
            <Link href={division.href}>Browse {division.shortLabel.toLowerCase()}</Link>
          ) : (
            <span className={styles.state}>Detailed catalogue pending</span>
          )}
        </article>
      ))}
    </section>
  );
}
