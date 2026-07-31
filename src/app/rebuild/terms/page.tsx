import type { Metadata } from "next";
import Link from "next/link";
import { termsSections } from "@/rebuild/legal-content";
import styles from "../utility-state.module.css";

export const metadata: Metadata = {
  title: "Terms of Use | THROHI Medical Tools",
  robots: { index: false, follow: false },
};

export default function RebuildTermsPage() {
  return (
    <main id="main" className={styles.page} data-utility-state="terms">
      <header className={styles.masthead}>
        <div className={`${styles.shell} ${styles.mastheadGrid}`}>
          <div>
            <p className={styles.eyebrow}>Terms of use</p>
            <h1>Inquiry first. No online order.</h1>
          </div>
          <div className={styles.mastheadCopy}>
            <p>
              These working terms state the boundaries already enforced by the catalogue and
              inquiry workflow. Final legal wording and commercial terms require direct review.
            </p>
            <span className={styles.status}>Catalogue · inquiry · direct review</span>
          </div>
        </div>
      </header>

      <div className={`${styles.shell} ${styles.reading}`}>
        <aside className={styles.index} aria-label="Terms sections">
          <span className={styles.indexLabel}>Terms index</span>
          {termsSections.map((section) => (
            <a key={section.index} href={`#terms-${section.index}`}>
              {section.index} · {section.title}
            </a>
          ))}
          <Link href="/rebuild/privacy">Privacy notice</Link>
        </aside>

        <article className={styles.article}>
          {termsSections.map((section) => (
            <section id={`terms-${section.index}`} key={section.index}>
              <span className={styles.sectionNumber}>{section.index}</span>
              <div>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
              </div>
            </section>
          ))}
        </article>
      </div>

      <section className={`${styles.shell} ${styles.boundary}`} aria-label="Commercial boundary">
        <strong>Commercial agreement happens after review.</strong>
        <p>
          Product confirmation, quotation, quantities, delivery, and payment remain outside the
          public catalogue until directly agreed.
        </p>
        <Link href="/rebuild/products">Browse catalogue</Link>
      </section>
    </main>
  );
}
