import Link from "next/link";
import { DocumentList } from "@/components/catalogue-ui";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { divisions } from "@/lib/catalogue";

export const metadata = { title: "Resources" };

export default function ResourcesPage() {
  return <><SiteHeader /><main id="main" className="utility-v2 resources-v2">
    <section className="utility-hero resources-utility-hero"><div className="container utility-hero-grid"><div><p className="eyebrow dark">CATALOGUES & RESOURCES</p><h1>Documents with<br /><span>traceable context.</span></h1></div><div className="utility-hero-copy"><p>A public catalogue appears only after its file, division, format, size, update date, and download route are approved.</p><span>REAL FILES ONLY · NO FALSE DOWNLOADS</span></div></div></section>

    <section className="utility-section resource-archive-section"><div className="container"><header className="utility-section-heading"><div><p className="eyebrow">DOCUMENT ARCHIVE</p><h2>Organized by instrument division.</h2></div><p>Pending resources remain visibly unavailable rather than presenting a non-functional download control.</p></header><div className="resource-archive-grid">{divisions.map(division => <article className={`resource-archive-card tone-${division.slug}`} key={division.slug}><header><span>{division.index}</span><small>{division.label.toUpperCase()}</small></header><div><h3>{division.label} documents</h3><p>Approved catalogue and supporting files for this division will appear with complete metadata.</p></div><DocumentList documents={division.documents} /><Link href={`/products/${division.slug}`}>Browse {division.label.toLowerCase()} instruments <b aria-hidden="true">↗</b></Link></article>)}</div></div></section>

    <section className="utility-light resource-rules-section"><div className="container resource-rules-grid"><div><p className="eyebrow">PUBLICATION STANDARD</p><h2>A file is more than a button.</h2></div><dl><div><dt>01</dt><dd>Approved title and division</dd></div><div><dt>02</dt><dd>Verified format and file size</dd></div><div><dt>03</dt><dd>Publication or update date</dd></div><div><dt>04</dt><dd>Working download route</dd></div></dl></div></section>

    <section className="utility-assurance-band"><div className="container utility-assurance-grid"><span>DOCUMENT NOT AVAILABLE?</span><p>Send the known product name, code, or external reference through the structured inquiry route.</p><Link href="/inquiry?manual=1">Add unlisted item ↗</Link></div></section>
  </main><SiteFooter /></>;
}
