import type { ReactNode } from "react";
import { RebuildShell } from "./rebuild-shell";
export default function Layout({children}:{children:ReactNode}) { return <RebuildShell>{children}</RebuildShell>; }
