import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return <><SiteHeader /><main id="main"><section className="content-hero section-dark"><div className="container"><p className="eyebrow dark">CONTACT THROHI</p><h1>Send product context, not a vague message.</h1><p>The structured inquiry route preserves product codes, quantities, notes, and reference metadata for a more useful response.</p></div></section><section className="section"><div className="container contact-grid"><article className="contact-primary"><p className="eyebrow">RECOMMENDED</p><h2>Build a product inquiry</h2><p>Select catalogue products or add an unlisted item, then provide the buyer and company details needed for a response.</p><Link className="button primary" href="/inquiry">Open inquiry builder</Link></article><aside className="verification-panel"><h3>Direct contact details pending approval</h3><p>Email, phone, WhatsApp, address, and business hours will appear here only after THROHI confirms the production contact information.</p><p>No placeholder email address or phone number is published.</p></aside></div></section><section className="section evidence-section"><div className="container"><div className="section-heading"><p className="eyebrow">SAFETY</p><h2>Do not send passwords or payment credentials.</h2></div><p>Use the inquiry only for product, company, and response information. Payment collection is not part of this website.</p></div></section></main><SiteFooter /></>;
}
