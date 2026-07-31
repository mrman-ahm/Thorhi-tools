import type { Metadata } from "next";
import { Suspense } from "react";
import { RebuildInquirySuccess } from "./success-client";
import premiumStyles from "./success-premium.module.css";
import styles from "../../rebuild.module.css";

export const metadata: Metadata = {
  title: "Inquiry Confirmation | THROHI Medical Tools",
  robots: { index: false, follow: false },
};

export default function RebuildInquirySuccessPage() {
  return (
    <main id="main" className={`${styles.successPage} ${premiumStyles.page}`}>
      <div className={styles.shell}>
        <Suspense fallback={<p>Loading inquiry confirmation…</p>}>
          <RebuildInquirySuccess />
        </Suspense>
      </div>
    </main>
  );
}
