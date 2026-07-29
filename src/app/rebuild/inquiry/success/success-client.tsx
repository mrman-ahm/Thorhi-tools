"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useInquiry } from "@/components/inquiry-provider";
import styles from "../../rebuild.module.css";

export function RebuildInquirySuccess() {
  const params = useSearchParams();
  const { clearInquiry } = useInquiry();
  const reference = params.get("reference") ?? "Pending reference";
  const storage = params.get("storage") ?? "unknown";

  useEffect(() => clearInquiry(), [clearInquiry]);

  return <article className={styles.successPanel}>
    <p>Inquiry validated</p>
    <h1>Your request entered the current application workflow.</h1>
    <p>The browser draft has been cleared to prevent accidental duplicate submission.</p>
    <dl><div><dt>Reference</dt><dd><code>{reference}</code></dd></div><div><dt>Current delivery mode</dt><dd>{storage === "development-memory" ? "Development memory adapter" : storage}</dd></div></dl>
    {storage === "development-memory" && <div className={styles.developmentWarning}><strong>Production delivery is not configured.</strong><span>The request was accepted by a development-only memory adapter. Durable database storage, file storage, and email or CRM delivery remain launch dependencies.</span></div>}
    <div><Link href="/rebuild/products">Return to products</Link><Link href="/rebuild">Rebuild home</Link></div>
  </article>;
}
