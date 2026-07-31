import Link from "next/link";
import { CatalogueMedia } from "@/app/rebuild/products/catalogue-media";
import type { RuntimeProduct } from "@/lib/rebuild-catalogue";
import { homeDivisionPresentation } from "@/rebuild/home-content";
import styles from "./home-sections.module.css";

type StructuredDivision = "surgical" | "dental";

export type HomeDivisionIndexProps = {
  representatives: Record<StructuredDivision, RuntimeProduct>;
  counts: Record<StructuredDivision, number>;
};

export function HomeDivisionIndex({
  representatives,
  counts,
}: HomeDivisionIndexProps) {
  return (
    <section
      className={styles.divisions}
      aria-labelledby="home-divisions-title"
      data-home-divisions
    >
      <header className={styles.sectionHeading}>
        <h2 id="home-divisions-title">Instrument divisions</h2>
        <p>
          Enter a validated catalogue where records are available, or send a
          reference for ranges still under catalogue review.
        </p>
      </header>

      <div className={styles.divisionList}>
        {homeDivisionPresentation.map((division) => {
          if (
            division.state === "structured" &&
            division.href &&
            (division.slug === "surgical" || division.slug === "dental")
          ) {
            const product = representatives[division.slug];
            return (
              <Link
                className={styles.divisionRow}
                href={division.href}
                key={division.slug}
              >
                <span className={styles.divisionMedia}>
                  <CatalogueMedia product={product} />
                </span>
                <span className={styles.divisionCopy}>
                  <strong>{division.label}</strong>
                  <small>{division.summary}</small>
                </span>
                <span className={styles.divisionState} data-division-state>
                  {counts[division.slug]} indexed families
                </span>
                <b aria-hidden="true">↗</b>
              </Link>
            );
          }

          return (
            <article className={styles.pendingDivision} key={division.slug}>
              <span className={styles.pendingMark} aria-hidden="true" />
              <span className={styles.divisionCopy}>
                <strong>{division.label}</strong>
                <small>{division.summary}</small>
              </span>
              <span className={styles.divisionState} data-division-state>
                Detailed catalogue not yet published
              </span>
            </article>
          );
        })}
      </div>
    </section>
  );
}
