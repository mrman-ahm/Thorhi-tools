import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "Company" };

export default function CompanyPage() {
  return <><SiteHeader /><main id="main" className="utility-v2 company-page-v2">
    <section className="utility-hero"><div className="container utility-hero-grid"><div><p className="eyebrow dark">COMPANY</p><h1>Evidence before claims.</h1><p>THROHI company information appears publicly only after verification. Age, reach, certifications, factory scale, manufacturing capabilities, and export claims are not inferred.</p></div><div className="utility-proof-mark"><span>PUBLICATION STANDARD</span><strong>Verified information only</strong><small>Identity · capability · quality · contact</small></div></div></section>
    <section className="utility-section"><div className="container utility-split"><article className="utility-copy"><p className="eyebrow">APPROVED FOUNDATION</p><h2>What can be stated now.</h2><p>THROHI Medical Tools presents surgical, dental, veterinary, and beauty instrument catalogues through a structured B2B inquiry platform.</p><Link className="utility-text-link" href="/products">Evaluate the catalogue ↗</Link></article><aside className="utility-verification-panel"><header><span>VERIFICATION QUEUE</span><small>NOT PUBLIC CLAIMS</small></header><ul><li>Legal company description</li><li>Registered address and contact details</li><li>Manufacturing and quality-control evidence</li><li>Certifications and catalogue claims</li><li>OEM or private-label availability</li><li>Export and market information</li></ul></aside></div></section>
    <section className="utility-evidence-band"><div className="container"><p className="eyebrow">PUBLICATION RULE</p><h2>Unsupported proof blocks remain unpublished.</h2><div className="utility-evidence-grid"><span>Company identity <b>Pending approval</b></span><span>Location <b>Pending approval</b></span><span>Capabilities <b>Excluded until verified</b></span><span>Quality evidence <b>Excluded until verified</b></span></div></div></section>
    <section className="utility-cta"><div className="container"><div><p className="eyebrow dark">PRODUCT-FIRST REVIEW</p><h2>Evaluate what is available now.</h2><p>Browse instrument families or send one structured request with the products you need.</p></div><div className="button-row"><Link className="button secondary" href="/products">Browse products</Link><Link className="button primary" href="/inquiry">Build inquiry</Link></div></div></section>
  </main><SiteFooter /></>;
}
