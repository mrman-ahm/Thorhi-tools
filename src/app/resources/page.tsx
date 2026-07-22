import Link from "next/link";
import { DocumentList } from "@/components/catalogue-ui";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { divisions } from "@/lib/catalogue";

export const metadata = { title: "Resources" };

export default function ResourcesPage() {
  return <><SiteHeader /><main id="main"><section className="content-hero section-dark"><div className="container"><p className="eyebrow dark">CATALOGUES & RESOURCES</p><h1>Documents publish only after verification.</h1><p>File type, size, update date, and download route must be approved before a catalogue appears as available.</p></div></section><section className="section"><div className="container resources-grid">{divisions.map(division => <article className="resource-card" key={division.slug}><p className="eyebrow">{division.index} · {division.label.toUpperCase()}</p><h2>{division.label}</h2><DocumentList documents={division.documents} /><Link className="button secondary" href={`/products/${division.slug}`}>Browse division</Link></article>)}</div></section><section className="final-cta section-dark"><div className="container final-grid"><div><h2>Need a product without a document?</h2><p>Add the item name, code, or reference to an inquiry.</p></div><Link className="button primary" href="/inquiry?manual=1">Add unlisted item</Link></div></section></main><SiteFooter /></>;
}
