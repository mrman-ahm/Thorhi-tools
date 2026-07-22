import { Suspense } from "react";
import { InquirySuccess } from "@/components/inquiry-success";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "Inquiry Confirmation" };

export default function InquirySuccessPage() {
  return <><SiteHeader /><main id="main" className="confirmation-page"><div className="container"><Suspense fallback={<p>Loading inquiry confirmation…</p>}><InquirySuccess /></Suspense></div></main><SiteFooter /></>;
}
