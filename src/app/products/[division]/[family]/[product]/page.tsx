import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, CopyCodeButton, DocumentList, ProductCard, ProductImage, ProductInquiryControls, SeedDataNotice } from "@/components/catalogue-ui";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getDivision, getFamily, getProduct, getRelatedProducts, products } from "@/lib/catalogue";

export function generateStaticParams() {
  return products.map(product => ({ division: product.division, family: product.family, product: product.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ division: string; family: string; product: string }> }) {
  const { division: divisionSlug, family: familySlug, product: productSlug } = await params;
  const division = getDivision(divisionSlug);
  const family = getFamily(divisionSlug, familySlug);
  const product = getProduct(divisionSlug, familySlug, productSlug);
  if (!division || !family || !product) notFound();
  const related = getRelatedProducts(product);

  return <><SiteHeader /><main id="main">
    <section className="product-detail-section"><div className="container"><Breadcrumbs items={[{ label: "Products", href: "/products" }, { label: division.label, href: `/products/${division.slug}` }, { label: family.label, href: `/products/${division.slug}/${family.slug}` }, { label: product.name }]} /><div className="product-detail-grid"><div className="product-gallery"><ProductImage product={product} /><div className="gallery-states"><span>Image loading reserved</span><span>Missing-image state reserved</span></div></div><div className="product-summary"><p className="eyebrow">{division.label.toUpperCase()} · {family.label.toUpperCase()}</p><h1>{product.name}</h1><CopyCodeButton code={product.code} /><p>{product.description}</p><SeedDataNotice /><div className="product-specs"><h2>Verified product information</h2>{product.specifications.filter(item => item.verified).length ? <dl>{product.specifications.filter(item => item.verified).map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl> : <p>No specifications are published until they are verified against approved catalogue data.</p>}</div><ProductInquiryControls product={product} /><Link className="return-link" href={`/products/${division.slug}/${family.slug}`}>← Return to {family.label}</Link></div></div></div></section>
    <section className="section evidence-section"><div className="container evidence-grid"><div><p className="eyebrow">PRODUCT DOCUMENTS</p><h2>Catalogue and data sheets.</h2><DocumentList documents={product.documents} /></div><div className="documents-panel"><h3>Need clarification?</h3><p>Send the known code, a description, or a reference document through the inquiry route.</p><Link className="button primary" href={`/inquiry?manual=1&reference=${encodeURIComponent(product.code)}`}>Ask about this product</Link></div></div></section>
    <section className="section"><div className="container"><div className="section-heading"><p className="eyebrow">RELATED PRODUCTS</p><h2>{related.length ? "Continue comparing." : "No related products approved yet."}</h2></div>{related.length ? <div className="product-grid">{related.map(item => <ProductCard key={item.id} product={item} />)}</div> : <p className="empty-copy">Related records will appear only after catalogue relationships are validated.</p>}</div></section>
  </main><SiteFooter /></>;
}
