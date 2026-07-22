import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "Terms" };

const sections = [
  ["01", "Catalogue information", "Seed records are technical demonstration data and must not be treated as approved specifications, offers, availability, or contractual product descriptions."],
  ["02", "Inquiry status", "Submitting an inquiry does not create an order, payment obligation, shipping commitment, lead-time guarantee, or product-reservation agreement."],
  ["03", "Documents and claims", "Catalogues, certifications, capabilities, company information, and commercial claims publish only after verification."],
  ["04", "Acceptable use", "Do not submit malicious files, automated abuse, confidential credentials, payment information, or unrelated personal information."],
  ["05", "Final agreement", "Commercial terms, confirmed products, quantities, delivery, and payment are handled outside this public catalogue after direct review."]
] as const;

export default function TermsPage() {
  return <><SiteHeader /><main id="main" className="utility-v2 legal-v2">
    <section className="utility-hero legal-utility-hero"><div className="container utility-hero-grid"><div><p className="eyebrow dark">TERMS</p><h1>Inquiry first.<br /><span>No online order.</span></h1></div><div className="utility-hero-copy"><p>These working terms state only the boundaries already enforced by the application. Final legal wording and effective dates require THROHI review.</p><span>CATALOGUE · INQUIRY · DIRECT REVIEW</span></div></div></section>
    <section className="legal-reading-section"><div className="container legal-reading-grid"><aside className="legal-index"><span>TERMS INDEX</span>{sections.map(([index, title]) => <a key={index} href={`#terms-${index}`}>{index} · {title}</a>)}<Link href="/privacy">Privacy notice ↗</Link></aside><article className="legal-article">{sections.map(([index, title, body]) => <section id={`terms-${index}`} key={index}><span>{index}</span><h2>{title}</h2><p>{body}</p></section>)}</article></div></section>
    <section className="utility-assurance-band"><div className="container utility-assurance-grid"><span>COMMERCIAL TERMS OFF-SITE</span><p>Product confirmation, quotation, quantities, delivery, and payment are completed only after direct review.</p><Link href="/inquiry">Build inquiry ↗</Link></div></section>
  </main><SiteFooter /></>;
}
