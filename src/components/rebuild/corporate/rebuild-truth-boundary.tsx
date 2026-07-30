import styles from "./corporate-components.module.css";

export type RebuildTruthBoundaryProps = {
  label: string;
  title: string;
  paragraphs: readonly string[];
};

export function RebuildTruthBoundary({
  label,
  title,
  paragraphs,
}: RebuildTruthBoundaryProps) {
  return (
    <section className={styles.truth} aria-label={label}>
      <div className={styles.truthLabel}>
        <span>{label}</span>
        <h2>{title}</h2>
      </div>
      <div className={styles.truthCopy}>
        {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
    </section>
  );
}
