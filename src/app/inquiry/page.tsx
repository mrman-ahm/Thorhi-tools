import { Suspense } from "react";
import { InquiryWorkflow } from "@/components/inquiry-workflow";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "Product Inquiry" };

export default function InquiryPage() {
  return <><SiteHeader /><main id="main"><section className="inquiry-page-header section-dark"><div className="container"><p className="eyebrow dark">STRUCTURED PRODUCT INQUIRY</p><h1>Review products and send one organized request.</h1><p>Products, quantities, notes, and buyer details remain available after validation or network failure.</p></div></section><section className="section inquiry-page-section"><div className="container"><Suspense fallback={<p>Loading saved inquiry…</p>}><InquiryWorkflow /></Suspense></div></section></main><SiteFooter /></>;
}
