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

  return <article className="success-card success-card-v2">
    <div className="success-mark" aria-hidden="true"><span>✓</span></div>
    <div className="success-intro"><p className="eyebrow">INQUIRY VALIDATED</p><h1>Your request has entered the current application workflow.</h1><p>The saved inquiry has been cleared from this browser to prevent accidental duplicate submission.</p></div>
    <dl className="success-reference-grid"><div><dt>Reference</dt><dd><code>{reference}</code></dd></div><div><dt>Current delivery mode</dt><dd>{storage === "development-memory" ? "Development memory adapter" : storage}</dd></div></dl>
    {storage === "development-memory" && <div className="submission-warning success-development-warning"><strong>Production delivery is not configured.</strong><span>This build validates and accepts the inquiry through a development-only memory adapter. Durable database storage, attachment storage, and email or CRM delivery remain launch dependencies.</span></div>}
    <div className="success-boundary"><span>NO RESPONSE-TIME PROMISE</span><p>A response time will appear only after THROHI approves and operationally supports it.</p></div>
    <div className="utility-action-row"><Link className="utility-action primary" href="/products">Return to products</Link><Link className="utility-action" href="/contact">Contact route</Link></div>
  </article>;
}
