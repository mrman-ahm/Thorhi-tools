"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useInquiry } from "@/components/inquiry-provider";
import styles from "../../rebuild.module.css";

const storageLabels: Record<string, string> = {
  "development-memory": "Development memory adapter",
  "cloudflare-d1-r2": "Durable Cloudflare D1 and R2 storage",
};

export function RebuildInquirySuccess() {
  const params = useSearchParams();
  const { clearInquiry } = useInquiry();
  const reference = params.get("reference") ?? "Pending reference";
  const storage = params.get("storage") ?? "unknown";
  const durable = storage === "cloudflare-d1-r2";

  useEffect(() => clearInquiry(), [clearInquiry]);

  return (
    <article className={styles.successPanel}>
      <p>{durable ? "Inquiry received" : "Inquiry validated"}</p>
      <h1>
        {durable
          ? "Your request has been stored with its inquiry reference."
          : "Your request entered the current application workflow."}
      </h1>
      <p>The browser draft has been cleared to prevent accidental duplicate submission.</p>
      <dl>
        <div>
          <dt>Reference</dt>
          <dd><code>{reference}</code></dd>
        </div>
        <div>
          <dt>Storage mode</dt>
          <dd>{storageLabels[storage] ?? storage}</dd>
        </div>
      </dl>
      {storage === "development-memory" ? (
        <div className={styles.developmentWarning}>
          <strong>Production delivery is not configured.</strong>
          <span>
            The request was accepted by a development-only memory adapter. Durable
            database storage, file storage, and approved delivery remain launch dependencies.
          </span>
        </div>
      ) : null}
      {durable ? (
        <p>
          Keep the reference above with any follow-up about this request. This confirmation
          does not represent an order, payment, quotation, or acceptance of supply.
        </p>
      ) : null}
      <div>
        <Link href="/rebuild/products">Return to products</Link>
        <Link href="/rebuild">Rebuild home</Link>
      </div>
    </article>
  );
}
