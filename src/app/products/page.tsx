import Link from "next/link";
import { ProductCard, SeedDataNotice } from "@/components/catalogue-ui";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { divisions, families, products } from "@/lib/catalogue";

export const metadata = { title: "Products" };

const divisionVerbs: Record<string, string> = {
  surgical: "CUT · HOLD · CLAMP · RETRACT",
  dental: "EXAMINE · EXTRACT · RESTORE",
  veterinary: "TREAT · SUPPORT · HANDLE",
  beauty: "SHAPE · REFINE · DETAIL"
};

export default function ProductsPage() {
  return <><SiteHeader /><main id="main" className="catalogue-v2">
    <section className="catalogue-hub-hero" aria-labelledby="catalogue-title">
      <div className="container catalogue-hub-grid">
        <div className="catalogue-hub-copy"><p className="eyebrow dark">PRODUCT CATALOGUE / 00</p><h1 id="catalogue-title">Find the object.<br /><span>Start with its function.</span></h1><p>Search by exact code, partial code, product name, or family. Or enter one of four focused catalogue divisions.</p><div className="catalogue-hub-stats" aria-label="Development catalogue structure"><span><b>{divisions.length}</b> divisions</span><span><b>{families.length}</b> families</span><span><b>{products.length}</b> seed records</span></div></div>
        <form className="catalogue-command" action="/search" method="get"><header><span>CATALOGUE COMMAND</span><small>EXACT CODE → PREFIX → NAME → FAMILY</small></header><label htmlFor="products-query">Search the catalogue</label><div className="catalogue-command-field"><input id="products-query" name="q" type="search" placeholder="THR-SC-001 or operating scissors" /><button type="submit">SEARCH <span aria-hidden="true">↗</span></button></div><Link className="manual-recovery-link" href="/inquiry?manual=1"><span>Cannot find it?</span><strong>Add an unlisted instrument</strong><b aria-hidden="true">+</b></Link></form>
      </div>
    </section>

    <div className="container"><SeedDataNotice /></div>

    <section className="catalogue-division-index" aria-labelledby="division-index-title"><div className="container"><header className="catalogue-section-heading"><div><p className="eyebrow">01 · DIVISIONS</p><h2 id="division-index-title">Four routes through one catalogue.</h2></div><p>Each division opens only the relevant families, product records, and conditional documents.</p></header></div><div className="catalogue-division-rows">{divisions.map(division => <Link className={`catalogue-division-row tone-${division.slug}`} href={`/products/${division.slug}`} key={division.slug}><span className="division-row-index">{division.index}</span><div className="division-row-title"><strong>{division.label}</strong><small>{divisionVerbs[division.slug]}</small></div><p>{division.description}</p><span className="division-row-family-count">{division.familySlugs.length} families</span><b aria-hidden="true">↗</b></Link>)}</div></section>

    <section className="catalogue-family-index" aria-labelledby="family-index-title"><div className="container catalogue-family-index-grid"><div className="catalogue-family-index-intro"><p className="eyebrow">02 · FAMILY INDEX</p><h2 id="family-index-title">Browse by working category.</h2><p>The index stays compact enough to scale when approved catalogue families replace the seed structure.</p><Link href="/search">Search every product <span aria-hidden="true">↗</span></Link></div><div className="catalogue-family-routes">{families.map(family => <Link key={`${family.division}-${family.slug}`} href={`/products/${family.division}/${family.slug}`}><span>{family.index}</span><div><strong>{family.label}</strong><small>{family.division.toUpperCase()}</small></div><b aria-hidden="true">↗</b></Link>)}</div></div></section>

    <section className="catalogue-featured-objects" aria-labelledby="preview-title"><div className="container"><header className="catalogue-section-heading"><div><p className="eyebrow">03 · CATALOGUE OBJECTS</p><h2 id="preview-title">Representative records.<br /><span>Useful routes.</span></h2></div><p>Seed records validate product routing, search, inquiry, and responsive behavior. They do not represent an approved commercial catalogue.</p></header><div className="catalogue-editorial-grid">{products.slice(0, 4).map(product => <ProductCard key={product.id} product={product} />)}</div></div></section>

    <section className="catalogue-recovery-band"><div className="container"><span className="recovery-code">RECOVERY / MANUAL</span><div><h2>Know the instrument, but not the route?</h2><p>Add the name, code, or reference directly to a structured inquiry.</p></div><div><Link href="/search">Search catalogue</Link><Link className="primary-recovery" href="/inquiry?manual=1">Add unlisted item ↗</Link></div></div></section>
  </main><SiteFooter /></>;
}
