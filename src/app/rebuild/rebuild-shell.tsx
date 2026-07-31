import type { ReactNode } from "react";
import { RebuildFooter } from "@/components/rebuild/rebuild-footer";
import { RebuildHeader } from "@/components/rebuild/rebuild-header";
import corporateStyles from "./corporate-heritage.module.css";
import criticalStyles from "./critical-accessibility.module.css";
import heritageStyles from "./precision-heritage.module.css";
import legacyStyles from "./rebuild.module.css";
import shellStyles from "./surgical-precision-shell.module.css";

export function RebuildShell({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${legacyStyles.root} ${shellStyles.root} ${criticalStyles.root} ${heritageStyles.root} ${corporateStyles.root}`}
      data-rebuild-shell
      data-milestone-contract="surgical-precision-archive-v1"
      data-redesign-contract="precision-heritage-house-v1"
    >
      <RebuildHeader />
      {children}
      <RebuildFooter />
    </div>
  );
}
