import styles from "./corporate-components.module.css";

export type RebuildSectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function RebuildSectionHeading({
  eyebrow,
  title,
  description,
}: RebuildSectionHeadingProps) {
  return (
    <header className={styles.sectionHeading}>
      <div className={styles.sectionInner}>
        <div>
          <p className={styles.sectionEyebrow}>{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        <p>{description}</p>
      </div>
    </header>
  );
}
