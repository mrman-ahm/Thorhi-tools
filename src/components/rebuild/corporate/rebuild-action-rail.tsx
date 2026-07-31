import Link from "next/link";
import styles from "./corporate-components.module.css";

export type RebuildAction = {
  href: string;
  label: string;
  description: string;
  emphasis?: "primary" | "secondary";
};

export function RebuildActionRail({ actions }: { actions: readonly RebuildAction[] }) {
  return (
    <nav className={styles.actions} aria-label="Next actions" data-corporate-actions>
      {actions.map((action) => (
        <Link
          className={styles.action}
          data-emphasis={action.emphasis ?? "secondary"}
          data-corporate-action
          href={action.href}
          key={action.href}
        >
          <strong>{action.label}</strong>
          <span>{action.description}</span>
          <b aria-hidden="true">↗</b>
        </Link>
      ))}
    </nav>
  );
}
