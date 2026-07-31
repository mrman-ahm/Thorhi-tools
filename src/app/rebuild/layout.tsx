import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RebuildShell } from "./rebuild-shell";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <RebuildShell>{children}</RebuildShell>;
}
