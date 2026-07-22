import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "Precision Through Time" };

const periods = [
  { label: "Early forms", text: "Simple cutting, grasping, and probing forms established the functional foundations later refined for specialist work." },
  { label: "Craft refinement", text: "Toolmakers progressively differentiated instrument shapes, joints, handles, and working ends for specific procedures." },
  { label: "Industrial precision", text: "Repeatable production and specialist catalogues made instrument families easier to define, compare, and source." },
  { label: "Modern catalogue systems", text: "Current professional catalogues depend on precise codes, variants, documentation, and traceable product relationships." }
];

export default function PrecisionThroughTimePage() {
  return <><SiteHeader /><main id="main"><section className="content-hero section-dark"><div className="container"><p className="eyebrow dark">PRECISION THROUGH TIME</p><h1>Instrument form evolves around function.</h1><p>This is a restrained industry and design-history overview. It is not presented as THROHI corporate history.</p></div></section><section className="section history-long"><div className="container"><ol>{periods.map((period, index) => <li key={period.label}><span>{String(index + 1).padStart(2, "0")}</span><div><h2>{period.label}</h2><p>{period.text}</p></div></li>)}</ol><aside className="verification-panel"><h3>Editorial verification required</h3><p>Production publication should add reviewed sources, dates, image rights, and precise historical context before making detailed factual claims.</p></aside></div></section><section className="final-cta section-dark"><div className="container final-grid"><div><h2>Explore present-day catalogue structure.</h2><p>Browse instruments by division, family, name, and code.</p></div><Link className="button primary" href="/products">Browse products</Link></div></section></main><SiteFooter /></>;
}
