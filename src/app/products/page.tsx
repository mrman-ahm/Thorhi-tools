import Link from "next/link";
import { ProductCard, SeedDataNotice } from "@/components/catalogue-ui";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { divisions, families, products } from "@/lib/catalogue";

export const metadata = { title: "Products" };

export default function ProductsPage() {
  return <><SiteHeader /><main id="main">
    <section className="catalogue-hero section-dark"><div className="container catalogue-hero-grid"><div><p className="eyebrow dark">PRODUCT CATALOGUE</p><h1>Find instruments by division, family, name, or code.</h1><p>Use direct search when you know the item, or enter a focused division and browse its verified catalogue structure.</p></div><form className="catalogue-search" action="/search" method="get"><label htmlFor="products-query">Search the catalogue</label><input id="products-query" name="q" type="search" placeholder="Product name or exact / partial code" /><button className="button primary" type="submit">Search products</button><Link className="button inverse" href="/inquiry?manual=1">Add unlisted item</Link></form></div></section>
    <div className="container"><SeedDataNotice /></div>
    <section className="section"><div className="container"><div className="section-heading split"><div><p className="eyebrow">01 · DIVISIONS</p><h2>Four focused catalogue routes.</h2></div><p>Each division exposes only relevant families, products, and documents.</p></div><div className="division-grid">{divisions.map(division => <article className="division-card" key={division.slug}><div className={`division-art ${division.slug}`}><span>{division.index}</span></div><div><h3>{division.label}</h3><p>{division.description}</p><small>{division.familySlugs.map(slug => families.find(family => family.slug === slug)?.label).filter(Boolean).join(" · ")}</small><Link href={`/products/${division.slug}`}>Explore division <span aria-hidden="true">→</span></Link></div></article>)}</div></div></section>
    <section className="section family-section"><div className="container family-layout"><div><p className="eyebrow">02 · FAMILY EXPLORER</p><h2>Browse a structured family index.</h2><p>Routes stay concise so catalogue growth does not become a flat legacy-category dump.</p></div><div className="family-grid">{families.map(family => <Link key={`${family.division}-${family.slug}`} href={`/products/${family.division}/${family.slug}`} className="family-link"><span>{family.index}</span><strong>{family.label}</strong><b aria-hidden="true">→</b></Link>)}</div></div></section>
    <section className="section"><div className="container"><div className="section-heading split"><div><p className="eyebrow">03 · CATALOGUE PREVIEW</p><h2>Representative product records.</h2></div><p>Seed records exist only to validate product routing, search, inquiry, and responsive behaviour.</p></div><div className="product-grid">{products.slice(0, 4).map(product => <ProductCard key={product.id} product={product} />)}</div></div></section>
    <section className="final-cta section-dark"><div className="container final-grid"><div><h2>Cannot find an instrument?</h2><p>Add a known name, code, or reference directly to the inquiry.</p></div><div className="button-row"><Link className="button inverse-light" href="/search">Search catalogue</Link><Link className="button primary" href="/inquiry?manual=1">Add unlisted item</Link></div></div></section>
  </main><SiteFooter /></>;
}
