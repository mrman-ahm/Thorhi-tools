import type { Metadata } from "next";
import { RebuildContactRoutes } from "@/components/rebuild/corporate/rebuild-contact-routes";
import { RebuildPageHero } from "@/components/rebuild/corporate/rebuild-page-hero";
import { verifiedContact } from "@/rebuild/contact";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact | THROHI Medical Tools",
  description:
    "Send THROHI Medical Tools an organized product request through the structured Inquiry List.",
  robots: { index: false, follow: false },
};

const guidance = [
  ["Instrument", "Name, family, product code, equivalent reference, or a clear description."],
  ["Quantity", "Requested units or a useful expected quantity range when known."],
  ["Requirements", "Packaging, labeling, documentation, or other relevant review context."],
  ["Buyer details", "Name, company, country, email, and preferred response method."],
] as const;

export default function RebuildContactPage() {
  return (
    <main id="main" tabIndex={-1} className={styles.page}>
      <RebuildPageHero
        eyebrow="Product requests and verified contact"
        title="Contact THROHI"
        summary="The Inquiry List is the primary route for product requests because it keeps instruments, quantities, notes, references, and buyer details together."
        meta={[verifiedContact.location, "No account required", "No public pricing or checkout"]}
        tone="navy"
      />

      <div className={styles.routes}>
        <RebuildContactRoutes contact={verifiedContact} />
      </div>

      <section className={styles.guidance} aria-label="Useful inquiry details">
        <div className={styles.guidanceIntro}>
          <h2>Useful context reduces clarification.</h2>
          <p>
            Include only the information needed to identify the instrument and respond to
            the request. The Contact page does not duplicate the full Inquiry List form.
          </p>
        </div>
        <ol className={styles.guidanceList}>
          {guidance.map(([title, description], index) => (
            <li key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{title}</strong>
              <p>{description}</p>
            </li>
          ))}
        </ol>
      </section>

      <aside className={styles.safety} aria-label="Information safety">
        <strong>Information safety</strong>
        <p>
          Do not send passwords, payment credentials, one-time codes, or unrelated
          confidential information through a product inquiry.
        </p>
      </aside>
    </main>
  );
}
