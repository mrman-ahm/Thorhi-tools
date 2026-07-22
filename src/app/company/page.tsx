import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "Company" };

const pendingEvidence = [
  ["01", "Legal identity", "Registered company description and approved public address."],
  ["02", "Manufacturing", "Approved production, inspection, and quality-control evidence."],
  ["03", "Certifications", "Current documents with valid scope, issuer, and dates."],
  ["04", "Commercial capability", "OEM, private-label, export, market, and capacity claims."],
  ["05", "Company imagery", "Approved facility, process, inspection, packaging, and team media."]
] as const;

export default function CompanyPage() {
  return <><SiteHeader /><main id="main" className="utility-v2 company-v2">
    <section className="utility-hero company-utility-hero"><div className="container utility-hero-grid"><div><p className="eyebrow dark">COMPANY</p><h1>Evidence first.<br /><span>Claims second.</span></h1></div><div className="utility-hero-copy"><p>THROHI’s public company profile will expand only through approved identity, capability, quality, and documentary evidence.</p><span>UNVERIFIED CLAIMS REMAIN UNPUBLISHED</span></div></div></section>

    <section className="utility-section utility-light"><div className="container company-foundation-grid"><article><p className="eyebrow">APPROVED FOUNDATION</p><h2>What the current application can state.</h2><p>THROHI Medical Tools presents surgical, dental, veterinary, and beauty instrument catalogues through a structured business inquiry platform.</p><p>The public experience supports product discovery by division, family, name, and product code. It does not publish unsupported manufacturing, certification, market, or company-history claims.</p><div className="utility-action-row"><Link className="utility-action primary" href="/products">Explore catalogue</Link><Link className="utility-action" href="/inquiry">Build inquiry</Link></div></article><aside className="company-proof-placeholder" aria-label="Approved company image placeholder"><span>APPROVED COMPANY MEDIA REQUIRED</span><div aria-hidden="true"><i /><i /><i /></div><small>Facility · inspection · packaging · team</small></aside></div></section>

    <section className="utility-section company-evidence-section"><div className="container"><header className="utility-section-heading"><div><p className="eyebrow">PUBLICATION CHECKLIST</p><h2>Every proof block has an owner.</h2></div><p>Pending information is displayed here as a production requirement, not presented publicly as a company achievement.</p></header><div className="company-evidence-list">{pendingEvidence.map(([index, title, text]) => <article key={index}><span>{index}</span><div><h3>{title}</h3><p>{text}</p></div><b>PENDING APPROVAL</b></article>)}</div></div></section>

    <section className="utility-assurance-band"><div className="container utility-assurance-grid"><span>CATALOGUE BEFORE CLAIMS</span><p>Product routes remain available while company proof and final media are prepared for controlled publication.</p><Link href="/contact">Contact route ↗</Link></div></section>
  </main><SiteFooter /></>;
}
