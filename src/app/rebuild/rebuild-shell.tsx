import type { ReactNode } from "react";
import { RebuildFooter } from "@/components/rebuild/rebuild-footer";
import { RebuildHeader } from "@/components/rebuild/rebuild-header";
import legacyStyles from "./rebuild.module.css";
import shellStyles from "./surgical-precision-shell.module.css";

export function RebuildShell({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${legacyStyles.root} ${shellStyles.root}`}
      data-rebuild-shell
      data-milestone-contract="surgical-precision-archive-v1"
    >
      <RebuildHeader />
      {children}
      <RebuildFooter />
    </div>
  );
}