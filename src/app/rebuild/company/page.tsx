import type { Metadata } from "next";
import Link from "next/link";
import { RebuildActionRail } from "@/components/rebuild/corporate/rebuild-action-rail";
import { RebuildDivisionLedger } from "@/components/rebuild/corporate/rebuild-division-ledger";
import { RebuildPageHero } from "@/components/rebuild/corporate/rebuild-page-hero";
import { RebuildSectionHeading } from "@/components/rebuild/corporate/rebuild-section-heading";
import { RebuildTruthBoundary } from "@/components/rebuild/corporate/rebuild-truth-boundary";
import { companyDivisionCopy, companyProfile, scissorsEditorialCopy } from "@/rebuild/company-content";
import styles from "./company.module.css";

export const metadata: Metadata = {
  title: "Company | THROHI Medical Tools",
  description:
    "Learn how THROHI Medical Tools presents surgical, dental and orthodontic, veterinary, and beauty instrument ranges from Sialkot, Pakistan.",
  robots: { index: false, follow: false },
};

const actions = [
  {
    href: "/rebuild/products",
    label: "Browse products",
    description: "Search validated instrument families by product name or catalogue code.",
    emphasis: "primary" as const,
  },
  {
    href: "/rebuild/catalogues",
    label: "View catalogues",
    description: "Use the digital catalogue now and see which verified documents are available.",
  },
  {
    href: "/rebuild/inquiry",
    label: "Build an inquiry",
    description: "Collect product families, quantities, notes, and unlisted references into one request.",
  },
] as const;

export default function RebuildCompanyPage() {
  return (
    <main id="main" tabIndex={-1} className={styles.page}>
      <RebuildPageHero
        eyebrow="Company"
        title={companyProfile.name}
        summary={companyProfile.introduction}
        meta={[companyProfile.location, "Four instrument divisions", "Structured inquiry workflow"]}
        tone="steel"
      />

      <section className={styles.profile} aria-label="About THROHI Medical Tools">
        <h2>One company entry point for instrument discovery.</h2>
        <div className={styles.profileCopy}>
          <p>{companyProfile.catalogueStatement}</p>
          <p>
            The company experience connects verified identity, searchable product records,
            document availability, and a practical Inquiry List without introducing public pricing.
          </p>
        </div>
      </section>

      <RebuildSectionHeading
        eyebrow="Instrument ranges"
        title="Four divisions. Truthful catalogue depth."
        description="Surgical and Dental and Orthodontic records are structured for browsing. Veterinary and Beauty remain visible without invented product detail."
      />
      <RebuildDivisionLedger divisions={companyDivisionCopy} />

      <RebuildTruthBoundary
        label="Publication boundary"
        title="Verified detail before public claims."
        paragraphs={[
          companyProfile.publicationStatement,
          "Company history, manufacturing detail, certifications, materials, markets, and direct contact information remain absent until verified for publication.",
        ]}
      />

      <section className={styles.editorial} aria-label="Scissors through time preview">
        <div className={styles.editorialInner}>
          <h2>{scissorsEditorialCopy.title}</h2>
          <div>
            <p>{scissorsEditorialCopy.introduction}</p>
            <p>{scissorsEditorialCopy.disclaimer}</p>
            <Link href="/rebuild/company/scissors-through-time">Scissors through time</Link>
          </div>
        </div>
      </section>

      <RebuildActionRail actions={actions} />
    </main>
  );
}
