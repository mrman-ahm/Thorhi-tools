import type { Metadata } from "next";
import { Suspense } from "react";
import { InquiryClient } from "./inquiry-client";
import styles from "./inquiry.module.css";
import heritageStyles from "./inquiry-heritage.module.css";

export const metadata: Metadata = {
  title: "Inquiry List | THROHI Medical Tools",
  description:
    "Review selected instruments and send one organized inquiry to THROHI.",
  robots: { index: false, follow: false },
};

export default function InquiryPage() {
  return (
    <main
      id="main"
      className={`${styles.inquiryPage} ${heritageStyles.inquiry}`}
      data-redesign-inquiry
    >
      <section className={styles.masthead} data-inquiry-masthead>
        <div className={styles.mastheadInner} data-inquiry-masthead-inner>
          <div className={styles.mastheadCopy} data-inquiry-masthead-copy>
            <div>
              <p>THR / 03 · Procurement inquiry desk</p>
              <h1>Build one precise inquiry.</h1>
            </div>
            <p>
              Review instrument references, quantities, notes, attachment context,
              and buyer details before sending one structured request. This is not
              an order or payment flow.
            </p>
          </div>

          <div
            className={styles.stageLedger}
            aria-label="Inquiry stages"
            data-inquiry-stages
          >
            <span><b>01</b> Products</span>
            <span><b>02</b> Requirements</span>
            <span><b>03</b> Buyer details</span>
            <span><b>04</b> Review</span>
          </div>
        </div>
      </section>

      <section className={styles.workspaceShell} data-inquiry-shell>
        <Suspense fallback={<p>Loading saved inquiry…</p>}>
          <InquiryClient />
        </Suspense>
      </section>
    </main>
  );
}
