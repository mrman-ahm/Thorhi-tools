"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useInquiry } from "@/components/inquiry-provider";

export function InquirySuccess() {
  const params = useSearchParams();
  const { clearInquiry } = useInquiry();
  const reference = params.get("reference") ?? "Pending reference";
  const storage = params.get("storage") ?? "unknown";

  useEffect(() => clearInquiry(), [clearInquiry]);

  return <article className="success-card">
    <p className="eyebrow">INQUIRY VALIDATED</p>
    <h1>Your inquiry has been accepted by the current application workflow.</h1>
    <p>The form has been cleared to prevent accidental duplicate submission.</p>
    <dl><div><dt>Reference</dt><dd><code>{reference}</code></dd></div><div><dt>Storage mode</dt><dd>{storage === "development-memory" ? "Development memory adapter" : storage}</dd></div></dl>
    {storage === "development-memory" && <div className="submission-warning"><strong>Production delivery is not configured.</strong><span>This build validates and accepts the inquiry through a development-only memory adapter. Durable database, attachment storage, and email or CRM delivery remain launch dependencies.</span></div>}
    <p>No response-time promise is shown until THROHI approves one.</p>
    <div className="button-row"><Link className="button primary" href="/products">Return to products</Link><Link className="button secondary" href="/contact">Contact THROHI</Link></div>
  </article>;
}
