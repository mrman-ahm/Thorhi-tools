import { Suspense } from "react";
import { InquiryWorkflow } from "@/components/inquiry-workflow";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "Product Inquiry" };

export default function InquiryPage() {
  return <><SiteHeader /><main id="main" className="utility-v2 inquiry-page-v2">
    <section className="utility-hero inquiry-hero"><div className="container utility-hero-grid"><div><p className="eyebrow dark">STRUCTURED PRODUCT INQUIRY</p><h1>One clear request.<br /><span>Every known detail preserved.</span></h1><p>Review selected products, add requirements, and provide the buyer information needed for a useful response. This is an inquiry workflow, not an online order or payment process.</p></div><ol className="utility-step-index" aria-label="Inquiry steps"><li><span>01</span><strong>Review products</strong></li><li><span>02</span><strong>Add requirements</strong></li><li><span>03</span><strong>Provide buyer details</strong></li></ol></div></section>
    <section className="inquiry-workflow-section"><div className="container"><Suspense fallback={<p className="utility-loading">Loading saved inquiry…</p>}><InquiryWorkflow /></Suspense></div></section>
  </main><SiteFooter /></>;
}
