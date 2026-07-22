import Link from "next/link";
import { DocumentList } from "@/components/catalogue-ui";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { divisions } from "@/lib/catalogue";

export const metadata = { title: "Resources" };

export default function ResourcesPage() {
  return <><SiteHeader /><main id="main" className="utility-v2 resources-page-v2">
    <section className="utility-hero"><div className="container utility-hero-grid"><div><p className="eyebrow dark">CATALOGUES & RESOURCES</p><h1>A document archive built on verification.</h1><p>File type, size, update date, and download route must be approved before a catalogue appears as available.</p></div><div className="utility-proof-mark"><span>ARCHIVE STATUS</span><strong>Conditional publication</strong><small>No fake downloads · no placeholder files</small></div></div></section>
    <section className="utility-section"><div className="container"><header className="utility-section-heading"><div><p className="eyebrow">DIVISION ARCHIVE</p><h2>Browse by instrument field.</h2></div><p>Pending divisions remain useful through their live catalogue routes even when no approved document is available.</p></header><div className="utility-resource-grid">{divisions.map(division => <article className="utility-resource-card" key={division.slug}><header><span>{division.index}</span><small>{division.label.toUpperCase()}</small></header><h3>{division.label}</h3><DocumentList documents={division.documents} /><Link href={`/products/${division.slug}`}>Browse division <span aria-hidden="true">↗</span></Link></article>)}</div></div></section>
    <section className="utility-cta mint"><div className="container"><div><p className="eyebrow">NO APPROVED DOCUMENT?</p><h2>Use the product reference you already have.</h2><p>Add a name, code, image reference, or description to the structured inquiry.</p></div><Link className="button primary" href="/inquiry?manual=1">Add unlisted item</Link></div></section>
  </main><SiteFooter /></>;
}
