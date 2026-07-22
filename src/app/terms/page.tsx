import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "Terms" };

export default function TermsPage() {
  return <><SiteHeader /><main id="main"><section className="content-hero section-dark"><div className="container"><p className="eyebrow dark">TERMS</p><h1>This catalogue supports inquiries, not online orders.</h1><p>Final legal terms require THROHI review. The current page states only the boundaries already enforced by the application.</p></div></section><section className="section legal-section"><div className="container legal-content"><h2>Catalogue information</h2><p>Seed records are technical demonstration data and must not be treated as approved specifications, offers, availability, or contractual product descriptions.</p><h2>Inquiry status</h2><p>Submitting an inquiry does not create an order, payment obligation, shipping commitment, lead-time guarantee, or product-reservation agreement.</p><h2>Documents and claims</h2><p>Catalogues, certifications, capabilities, and company claims publish only after verification.</p><h2>Acceptable use</h2><p>Do not submit malicious files, automated abuse, confidential credentials, or unrelated personal information.</p><h2>Final agreement</h2><p>Commercial terms, product confirmation, quantities, delivery, and payment are handled outside this public catalogue after direct review.</p></div></section></main><SiteFooter /></>;
}
