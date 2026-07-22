import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return <><SiteHeader /><main id="main" className="utility-v2 contact-v2">
    <section className="utility-hero contact-utility-hero"><div className="container utility-hero-grid"><div><p className="eyebrow dark">CONTACT THROHI</p><h1>Send the context<br /><span>needed to respond.</span></h1></div><div className="utility-hero-copy"><p>Product codes, quantities, notes, company details, and reference metadata produce a clearer request than an unstructured message.</p><span>PRODUCT REQUESTS · USE THE INQUIRY BUILDER</span></div></div></section>

    <section className="utility-section contact-route-section"><div className="container contact-route-grid"><article className="contact-featured-route"><header><span>RECOMMENDED ROUTE</span><small>PRODUCTS · QUANTITY · NOTES</small></header><div><p className="eyebrow">STRUCTURED INQUIRY</p><h2>Build one organized product request.</h2><p>Select catalogue products or add an unlisted instrument, then include the buyer and company details required for a response.</p></div><Link className="utility-action primary" href="/inquiry">Open inquiry builder <b aria-hidden="true">↗</b></Link></article><aside className="contact-verification"><span>DIRECT CONTACT</span><h2>Publication pending.</h2><p>Email, phone, WhatsApp, address, map, directions, and business hours will appear only after THROHI confirms the production contact information.</p><div><small>EMAIL</small><strong>Pending approval</strong></div><div><small>PHONE / WHATSAPP</small><strong>Pending approval</strong></div><div><small>ADDRESS / HOURS</small><strong>Pending approval</strong></div></aside></div></section>

    <section className="utility-light contact-guidance"><div className="container"><header className="utility-section-heading"><div><p className="eyebrow">WHAT TO INCLUDE</p><h2>Useful context shortens clarification.</h2></div><p>Only send information relevant to the product request and the response route.</p></header><div className="contact-guidance-grid"><article><span>01</span><h3>Instrument</h3><p>Name, family, product code, equivalent reference, or a clear description.</p></article><article><span>02</span><h3>Quantity</h3><p>Requested units or expected quantity range when known.</p></article><article><span>03</span><h3>Requirements</h3><p>Packaging, labeling, documentation, or other review context.</p></article><article><span>04</span><h3>Buyer details</h3><p>Name, company, country, email, and preferred response method.</p></article></div></div></section>

    <section className="utility-warning-band"><div className="container utility-assurance-grid"><span>INFORMATION SAFETY</span><p>Do not send passwords, payment credentials, one-time codes, or unrelated confidential information.</p><Link href="/privacy">Read privacy notice ↗</Link></div></section>
  </main><SiteFooter /></>;
}
