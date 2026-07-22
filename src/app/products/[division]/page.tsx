import Link from "next/link";
import { notFound } from "next/navigation";
import { DocumentList, ProductCard, SeedDataNotice, Breadcrumbs } from "@/components/catalogue-ui";
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

  return <><SiteHeader /><main id="main">
    <section className="catalogue-hero section-dark"><div className="container"><Breadcrumbs items={[{ label: "Products", href: "/products" }, { label: division.label }]} /><p className="eyebrow dark">{division.index} · DIVISION</p><h1>{division.label}</h1><p>{division.description}</p><form className="inline-search" action="/search"><input type="hidden" name="division" value={division.slug} /><label htmlFor="division-query">Search within {division.label}</label><div><input id="division-query" name="q" type="search" placeholder="Product name, family, or code" /><button className="button primary" type="submit">Search</button></div></form></div></section>
    <div className="container"><SeedDataNotice /></div>
    <section className="section family-section"><div className="container"><div className="section-heading split"><div><p className="eyebrow">FAMILY ROUTES</p><h2>Browse {division.label.toLowerCase()} by family.</h2></div><p>Only families represented in the approved catalogue model should publish in production.</p></div><div className="family-grid">{families.map(family => <Link className="family-link" href={`/products/${division.slug}/${family.slug}`} key={family.slug}><span>{family.index}</span><strong>{family.label}</strong><b aria-hidden="true">→</b></Link>)}</div></div></section>
    <section className="section"><div className="container"><div className="section-heading split"><div><p className="eyebrow">PRODUCT PREVIEW</p><h2>{products.length} representative products.</h2></div><Link className="button secondary" href={`/search?division=${division.slug}`}>View all results</Link></div><div className="product-grid">{products.slice(0, 4).map(product => <ProductCard product={product} key={product.id} />)}</div></div></section>
    <section className="section evidence-section"><div className="container evidence-grid"><div><p className="eyebrow">RECOVERY</p><h2>Need an unlisted instrument?</h2><p>Add the known name or code to a structured inquiry without losing the division context.</p><Link className="button primary" href={`/inquiry?manual=1&division=${division.slug}`}>Add manual item</Link></div><div className="documents-panel"><h3>Division documents</h3><DocumentList documents={division.documents} /></div></div></section>
  </main><SiteFooter /></>;
}
