import Link from "next/link";
import styles from "./catalogue.module.css";

export function CatalogueEmptyState({
  query,
  onReset,
}: {
  query: string;
  onReset: () => void;
}) {
  return (
    <section className={styles.noResults} aria-label="No catalogue results">
      <p>No catalogue match</p>
      <h2>{query ? `Nothing matched “${query}”.` : "No products match these filters."}</h2>
      <p>
        Try a shorter catalogue code, clear one filter, or add the known
        reference directly to the Inquiry List.
      </p>
      <div>
        <button type="button" onClick={onReset}>Reset catalogue</button>
        <Link href="/rebuild/inquiry?manual=1">Add an unlisted reference</Link>
      </div>
    </section>
  );
}
