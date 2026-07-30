import type { ReactNode } from "react";
import styles from "./corporate-components.module.css";

export type RebuildPageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  summary: string;
  meta?: readonly string[];
  tone?: "paper" | "steel" | "navy";
  children?: ReactNode;
};

export function RebuildPageHero({
  eyebrow,
  title,
  summary,
  meta = [],
  tone = "paper",
  children,
}: RebuildPageHeroProps) {
  return (
    <header className={styles.hero} data-corporate-hero data-tone={tone}>
      <div className={styles.heroInner}>
        <div>
          <p className={styles.heroEyebrow}>{eyebrow}</p>
          <h1>{title}</h1>
        </div>
        <div className={styles.heroCopy}>
          <p>{summary}</p>
          {meta.length ? (
            <ul className={styles.meta} aria-label="Page facts">
              {meta.map((item) => <li key={item}>{item}</li>)}
            </ul>
          ) : null}
          {children ? <div className={styles.heroChildren}>{children}</div> : null}
        </div>
      </div>
    </header>
  );
}
