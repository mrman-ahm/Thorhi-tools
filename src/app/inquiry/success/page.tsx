import { Suspense } from "react";
import { InquirySuccess } from "@/components/inquiry-success";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "Inquiry Confirmation" };

export default function InquirySuccessPage() {
  return <><SiteHeader /><main id="main" className="utility-v2 confirmation-page-v2"><section className="confirmation-shell"><div className="container"><Suspense fallback={<p className="utility-loading">Loading inquiry confirmation…</p>}><InquirySuccess /></Suspense></div></section></main><SiteFooter /></>;
}
