import type { Metadata } from "next";
import Link from "next/link";
import { privacySections } from "@/rebuild/legal-content";
import styles from "../utility-state.module.css";

export const metadata: Metadata = {
  title: "Privacy Notice | THROHI Medical Tools",
  robots: { index: false, follow: false },
};

export default function RebuildPrivacyPage() {
  return (
    <main id="main" className={styles.page} data-utility-state="privacy">
      <header className={styles.masthead}>
        <div className={`${styles.shell} ${styles.mastheadGrid}`}>
          <div>
            <p className={styles.eyebrow}>Privacy notice</p>
            <h1>Collect only what the inquiry requires.</h1>
          </div>
          <div className={styles.mastheadCopy}>
            <p>
              This working notice describes the information handled by the current inquiry
              workflow. Final legal wording, formal contact routes, jurisdiction, and retention
              periods require approval before public launch.
            </p>
            <span className={styles.status}>Working notice · legal review required</span>
          </div>
        </div>
      </header>

      <div className={`${styles.shell} ${styles.reading}`}>
        <aside className={styles.index} aria-label="Privacy notice sections">
          <span className={styles.indexLabel}>Notice index</span>
          {privacySections.map((section) => (
            <a key={section.index} href={`#privacy-${section.index}`}>
              {section.index} · {section.title}
            </a>
          ))}
          <Link href="/rebuild/terms">Terms of use</Link>
        </aside>

        <article className={styles.article}>
          {privacySections.map((section) => (
            <section id={`privacy-${section.index}`} key={section.index}>
              <span className={styles.sectionNumber}>{section.index}</span>
              <div>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
              </div>
            </section>
          ))}
        </article>
      </div>

      <section className={`${styles.shell} ${styles.boundary}`} aria-label="Legal review status">
        <strong>Final legal review remains pending.</strong>
        <p>
          No privacy contact, jurisdiction, retention period, or data-rights procedure is
          published without approval.
        </p>
        <Link href="/rebuild/inquiry">Review Inquiry List</Link>
      </section>
    </main>
  );
}
