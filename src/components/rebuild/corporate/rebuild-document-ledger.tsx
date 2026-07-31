import Link from "next/link";
import type { RebuildCatalogueDocument } from "@/rebuild/catalogue-documents";
import styles from "./corporate-components.module.css";

export function RebuildDocumentLedger({
  documents,
}: {
  documents: readonly RebuildCatalogueDocument[];
}) {
  return (
    <section
      className={styles.documents}
      role="region"
      aria-label="Downloadable documents"
      data-corporate-documents
    >
      {documents.length ? (
        documents.map((document) => (
          <article className={styles.documentRow} key={document.id} data-corporate-document>
            <h3>{document.title}</h3>
            <div className={styles.documentMeta}>
              <span>{document.division}</span>
              <span>{document.format}</span>
              <span>{document.sizeLabel}</span>
              <span>{document.publishedOrUpdated}</span>
            </div>
            <Link href={document.href}>Download {document.format}</Link>
          </article>
        ))
      ) : (
        <div className={styles.emptyDocuments} data-corporate-documents-empty>
          <h3>No approved downloadable catalogue is published yet.</h3>
          <p>
            Use the searchable digital catalogue now, or add a known document or
            instrument reference to the Inquiry List.
          </p>
        </div>
      )}
    </section>
  );
}
