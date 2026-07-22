import { Suspense } from "react";
import { InquiryWorkflow } from "@/components/inquiry-workflow";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "Product Inquiry" };

export default function InquiryPage() {
  return <><SiteHeader /><main id="main" className="utility-v2 inquiry-v2">
    <section className="utility-hero inquiry-utility-hero">
      <div className="container utility-hero-grid">
        <div>
          <p className="eyebrow dark">STRUCTURED PRODUCT INQUIRY</p>
          <h1>One clear request.<br /><span>Every product attached.</span></h1>
        </div>
        <div className="utility-hero-copy">
          <p>Review products, quantities, notes, reference metadata, and buyer details before sending one organized inquiry.</p>
          <span>PRODUCT INQUIRY · NOT AN ONLINE ORDER</span>
        </div>
      </div>
      <div className="container inquiry-progress" aria-label="Inquiry stages">
        <span><b>01</b>Products</span><span><b>02</b>Requirements</span><span><b>03</b>Buyer details</span><span><b>04</b>Review</span>
      </div>
    </section>
    <section className="inquiry-workspace"><div className="container"><Suspense fallback={<p className="utility-loading">Loading saved inquiry…</p>}><InquiryWorkflow /></Suspense></div></section>
    <section className="utility-assurance-band"><div className="container utility-assurance-grid"><span>NO PAYMENT COLLECTION</span><p>Submitting this form does not create an order, shipping commitment, lead-time promise, or payment obligation.</p><a href="/terms">Read inquiry terms ↗</a></div></section>
  </main><SiteFooter /></>;
}
