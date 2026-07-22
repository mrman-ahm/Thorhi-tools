import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, DocumentList, ProductCard, SeedDataNotice } from "@/components/catalogue-ui";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { divisionSlugs, getDivision, getFamiliesForDivision, getProductsForDivision } from "@/lib/catalogue";

export function generateStaticParams() {
  return divisionSlugs.map(division => ({ division }));
}

export default async function DivisionPage({ params }: { params: Promise<{ division: string }> }) {
  const { division: slug } = await params;
  const division = getDivision(slug);
  if (!division) notFound();
  const families = getFamiliesForDivision(slug);
  const products = getProductsForDivision(slug);

  return <><SiteHeader /><main id="main" className={`catalogue-v2 division-catalogue tone-${division.slug}`}>
    <section className="division-catalogue-hero" aria-labelledby="division-title"><div className="container">
      <Breadcrumbs items={[{ label: "Products", href: "/products" }, { label: division.label }]} />
      <div className="division-catalogue-hero-grid"><div><p className="eyebrow dark">{division.index} · DIVISION</p><h1 id="division-title">{division.label}</h1><p>{division.description}</p><div className="division-route-meta"><span>{families.length} family routes</span><span>{products.length} seed products</span><span>Verified files only</span></div></div><form className="division-command" action="/search"><input type="hidden" name="division" value={division.slug} /><label htmlFor="division-query">Search within {division.label}</label><div><input id="division-query" name="q" type="search" placeholder="Name, family, or code" /><button type="submit">SEARCH ↗</button></div><Link href={`/inquiry?manual=1&division=${division.slug}`}>Add an unlisted {division.label.toLowerCase()} instrument</Link></form></div>
    </div></section>

    <div className="container"><SeedDataNotice /></div>

    <section className="division-family-routes" aria-labelledby="division-family-title"><div className="container"><header className="catalogue-section-heading"><div><p className="eyebrow">FAMILY ROUTES</p><h2 id="division-family-title">Browse {division.label.toLowerCase()} by family.</h2></div><p>Every route remains direct, searchable, and ready for approved catalogue expansion.</p></header><div className="division-family-list">{families.map(family => <Link href={`/products/${division.slug}/${family.slug}`} key={family.slug}><span>{family.index}</span><div><strong>{family.label}</strong><small>{family.description}</small></div><b aria-hidden="true">↗</b></Link>)}</div></div></section>

    <section className="division-product-preview" aria-labelledby="division-products-title"><div className="container"><header className="catalogue-section-heading"><div><p className="eyebrow">PRODUCT PREVIEW</p><h2 id="division-products-title">Representative {division.label.toLowerCase()} objects.</h2></div><Link className="catalogue-heading-link" href={`/search?division=${division.slug}`}>View all results ↗</Link></header><div className="catalogue-editorial-grid">{products.slice(0, 4).map(product => <ProductCard product={product} key={product.id} />)}</div></div></section>

    <section className="division-evidence-band"><div className="container division-evidence-grid"><div><p className="eyebrow">RECOVERY</p><h2>Need an unlisted instrument?</h2><p>Add the known name or code without losing the current division context.</p><Link href={`/inquiry?manual=1&division=${division.slug}`}>Add manual item ↗</Link></div><div className="division-documents"><header><span>DIVISION DOCUMENTS</span><small>APPROVED FILES ONLY</small></header><DocumentList documents={division.documents} /></div></div></section>
  </main><SiteFooter /></>;
}
