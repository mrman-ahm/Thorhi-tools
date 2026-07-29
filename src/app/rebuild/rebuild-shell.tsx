import type { ReactNode } from "react";
import { RebuildFooter } from "@/components/rebuild/rebuild-footer";
import { RebuildHeader } from "@/components/rebuild/rebuild-header";
import styles from "./rebuild.module.css";

export function RebuildShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.root}>
      <RebuildHeader />
      {children}
      <RebuildFooter />
    </div>
  );
}
