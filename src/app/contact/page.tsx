import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return <><SiteHeader /><main id="main" className="utility-v2 contact-page-v2">
    <section className="utility-hero"><div className="container utility-hero-grid"><div><p className="eyebrow dark">CONTACT THROHI</p><h1>Send product context, not a vague message.</h1><p>The structured inquiry route preserves product codes, quantities, notes, manual references, and buyer details for a more useful response.</p></div><div className="utility-proof-mark"><span>RECOMMENDED ROUTE</span><strong>Structured inquiry</strong><small>Products · quantities · requirements · buyer</small></div></div></section>
    <section className="utility-section"><div className="container utility-split"><article className="utility-contact-primary"><p className="eyebrow">PRODUCT INQUIRY</p><h2>Build one organized request.</h2><p>Select catalogue products or add an unlisted instrument, then provide the company and contact information needed for review.</p><ol><li><span>01</span>Choose or describe the instrument</li><li><span>02</span>Add quantity and requirements</li><li><span>03</span>Provide a reply route</li></ol><Link className="button primary" href="/inquiry">Open inquiry builder</Link></article><aside className="utility-verification-panel"><header><span>DIRECT CONTACT</span><small>PENDING APPROVAL</small></header><h3>No placeholder contact details.</h3><p>Email, phone, WhatsApp, address, and business hours appear here only after THROHI confirms the production information.</p><p>No response-time promise is published without approval.</p></aside></div></section>
    <section className="utility-safety-band"><div className="container"><span className="utility-safety-mark">!</span><div><p className="eyebrow">SAFETY</p><h2>Do not send passwords or payment credentials.</h2><p>Use the inquiry only for product, company, and response information. Payment collection is not part of this website.</p></div></div></section>
  </main><SiteFooter /></>;
}
