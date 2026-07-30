import type { Metadata } from "next";
import Link from "next/link";
import { RebuildActionRail } from "@/components/rebuild/corporate/rebuild-action-rail";
import { RebuildDocumentLedger } from "@/components/rebuild/corporate/rebuild-document-ledger";
import { RebuildPageHero } from "@/components/rebuild/corporate/rebuild-page-hero";
import { rebuildCatalogueDocuments } from "@/rebuild/catalogue-documents";
import { companyDivisionCopy } from "@/rebuild/company-content";
import styles from "./catalogues.module.css";

export const metadata: Metadata = {
  title: "Catalogues | THROHI Medical Tools",
  description:
    "Browse THROHI's searchable digital catalogue and see which verified downloadable catalogue documents are available.",
  robots: { index: false, follow: false },
};

const actions = [
  {
    href: "/rebuild/products",
    label: "Search the digital catalogue",
    description: "Browse validated instrument families by product name or catalogue code.",
    emphasis: "primary" as const,
  },
  {
    href: "/rebuild/inquiry?manual=1",
    label: "Request a document or reference",
    description: "Add a known document, product, or external reference to the Inquiry List.",
  },
] as const;

export default function RebuildCataloguesPage() {
  return (
    <main id="main" tabIndex={-1} className={styles.page}>
      <RebuildPageHero
        eyebrow="Digital catalogue and documents"
        title="Catalogues"
        summary="Search current structured product records now. Downloadable documents appear only when the file and its publication metadata are verified."
        meta={["Real files only", "No false downloads", "Inquiry route for missing references"]}
        tone="steel"
      />

      <section className={styles.digital} role="region" aria-label="Digital catalogue">
        <h2>Browse structured product information now.</h2>
        <div className={styles.digitalCopy}>
          <p>
            The digital catalogue is the current source for validated product families,
            representative images, catalogue codes, variants, and Inquiry List actions.
          </p>
          <div className={styles.divisions}>
            {companyDivisionCopy.map((division) => (
              <article className={styles.division} key={division.slug}>
                <h3>{division.label}</h3>
                <p>{division.description}</p>
                {division.catalogueState === "structured" && division.href ? (
                  <Link href={division.href}>Browse {division.shortLabel.toLowerCase()}</Link>
                ) : (
                  <span>Detailed records pending</span>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.documentsSection} role="region" aria-label="Catalogue document archive">
        <div className={styles.documentsHeading}>
          <h2>Downloadable documents</h2>
          <p>
            A download appears only with a verified title, division, format, file size,
            publication or update date, and working file route.
          </p>
        </div>
        <RebuildDocumentLedger documents={rebuildCatalogueDocuments} />
      </section>

      <RebuildActionRail actions={actions} />
    </main>
  );
}
