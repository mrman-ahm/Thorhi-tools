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
  const verifiedSpecifications = product.specifications.filter(item => item.verified);

  return <><SiteHeader /><main id="main" className={`catalogue-v2 product-examination tone-${division.slug}`}>
    <section className="product-examination-section"><div className="container">
      <Breadcrumbs items={[{ label: "Products", href: "/products" }, { label: division.label, href: `/products/${division.slug}` }, { label: family.label, href: `/products/${division.slug}/${family.slug}` }, { label: product.name }]} />
      <div className="product-examination-grid">
        <div className="product-examination-stage"><header><span>OBJECT EXAMINATION</span><small>APPROVED IMAGE REQUIRED</small></header><ProductImage product={product} /><div className="product-image-state-list"><span>01 · IMAGE LOADING RESERVED</span><span>02 · MISSING IMAGE RESERVED</span><span>03 · ALT TEXT REQUIRED</span></div></div>
        <div className="product-examination-summary"><div className="product-summary-index"><p className="eyebrow">{division.label.toUpperCase()} · {family.label.toUpperCase()}</p><span>CATALOGUE OBJECT</span></div><h1>{product.name}</h1><CopyCodeButton code={product.code} /><p className="product-description">{product.description}</p><SeedDataNotice />
          <section className="verified-information" aria-labelledby="verified-title"><header><span>VERIFIED INFORMATION</span><small>{verifiedSpecifications.length ? `${verifiedSpecifications.length} approved fields` : "No approved fields"}</small></header><h2 id="verified-title">Published facts only.</h2>{verifiedSpecifications.length ? <dl>{verifiedSpecifications.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl> : <p>No specifications are published until they are verified against approved catalogue data.</p>}</section>
          <section className="product-inquiry-builder" aria-labelledby="inquiry-builder-title"><header><span>INQUIRY BUILDER</span><small>QUANTITY · NOTE · SAVE</small></header><h2 id="inquiry-builder-title">Add this object to your request.</h2><ProductInquiryControls product={product} /></section>
          <Link className="return-link catalogue-return-link" href={`/products/${division.slug}/${family.slug}`}>← Return to {family.label}</Link>
        </div>
      </div>
    </div></section>

    <section className="product-document-band"><div className="container product-document-grid"><div><p className="eyebrow">PRODUCT DOCUMENTS</p><h2>Catalogue and data sheets.</h2><DocumentList documents={product.documents} /></div><aside><span>NEED CLARIFICATION?</span><h3>Send the known code or a reference file.</h3><p>The inquiry route preserves this product reference while allowing additional requirements.</p><Link href={`/inquiry?manual=1&reference=${encodeURIComponent(product.code)}`}>Ask about this product ↗</Link></aside></div></section>

    <section className="related-object-section"><div className="container"><header className="catalogue-section-heading"><div><p className="eyebrow">RELATED OBJECTS</p><h2>{related.length ? "Continue comparing." : "No related products approved yet."}</h2></div><Link className="catalogue-heading-link" href={`/products/${division.slug}/${family.slug}`}>Return to family ↗</Link></header>{related.length ? <div className="catalogue-editorial-grid">{related.map(item => <ProductCard key={item.id} product={item} />)}</div> : <p className="empty-copy">Related records will appear only after catalogue relationships are validated.</p>}</div></section>
  </main><SiteFooter /></>;
}
