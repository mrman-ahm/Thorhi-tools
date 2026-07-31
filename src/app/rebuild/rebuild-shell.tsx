import type { ReactNode } from "react";
import { RebuildFooter } from "@/components/rebuild/rebuild-footer";
import { RebuildHeader } from "@/components/rebuild/rebuild-header";
import criticalStyles from "./critical-accessibility.module.css";
import premiumStyles from "./premium-convergence.module.css";
import legacyStyles from "./rebuild.module.css";
import shellStyles from "./surgical-precision-shell.module.css";

export function RebuildShell({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${legacyStyles.root} ${shellStyles.root} ${criticalStyles.root} ${premiumStyles.root}`}
      data-rebuild-shell
      data-milestone-contract="surgical-precision-archive-v1"
      data-premium-contract="premium-visual-convergence-v1"
    >
      <RebuildHeader />
      {children}
      <RebuildFooter />
    </div>
  );
}
