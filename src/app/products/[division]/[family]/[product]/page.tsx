import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, CopyCodeButton, DocumentList, ProductCard, ProductInquiryControls, ProductVariantTable, SeedDataNotice } from "@/components/catalogue-ui";
import { ProductExaminationMotion } from "@/components/product-examination-motion";
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
      <Breadcrumbs items={[{ label: "Catalogue", href: "/products" }, { label: division.label, href: `/products/${division.slug}` }, { label: family.label, href: `/products/${division.slug}/${family.slug}` }, { label: product.name }]} />
      <div className="product-examination-grid">
        <div className="product-examination-stage"><header><span>CATALOGUE IMAGE</span><small>{product.imageState === "available" ? "REPRESENTATIVE OBJECT" : "IMAGE UNAVAILABLE"}</small></header><ProductExaminationMotion product={product} /><div className="product-image-state-list"><span>01 · {product.catalogue.toUpperCase()}</span><span>02 · PDF PAGE {product.sourcePdfPage}</span><span>03 · {product.variants.length} {product.variants.length === 1 ? "VARIANT" : "VARIANTS"}</span></div></div>
        <div className="product-examination-summary"><div className="product-summary-index"><p className="eyebrow">{division.label.toUpperCase()} · {family.label.toUpperCase()}</p><span>REPRESENTATIVE GROUP</span></div><h1>{product.name}</h1><CopyCodeButton code={product.code} /><p className="product-description">{product.description}</p><SeedDataNotice />
          <section className="verified-information" aria-labelledby="verified-title"><header><span>CATALOGUE INFORMATION</span><small>{verifiedSpecifications.length} source-backed fields</small></header><h2 id="verified-title">Published catalogue facts.</h2><dl>{verifiedSpecifications.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl><div className="catalogue-source-meta"><span>{product.sourceFile}</span><span>PDF page {product.sourcePdfPage}</span>{product.sourcePrintedPage ? <span>Printed page {product.sourcePrintedPage}</span> : null}</div></section>
          <section className="product-inquiry-builder" aria-labelledby="inquiry-builder-title"><header><span>INQUIRY BUILDER</span><small>QUANTITY · NOTE · SAVE</small></header><h2 id="inquiry-builder-title">Add this instrument group to your request.</h2><ProductInquiryControls product={product} /></section>
          <Link className="return-link catalogue-return-link" href={`/products/${division.slug}/${family.slug}`}>← Return to {family.label}</Link>
        </div>
      </div>
    </div></section>

    <section className="catalogue-variant-section" aria-labelledby="catalogue-variants-title"><div className="container"><header className="catalogue-variant-heading"><div><p className="eyebrow">DOCUMENTED VARIANTS</p><h2 id="catalogue-variants-title">Every code grouped under this object.</h2></div><p>Size-only and closely related catalogue entries are consolidated here. Each row retains the original source wording and page location.</p></header><ProductVariantTable product={product} /></div></section>

    <section className="product-document-band"><div className="container product-document-grid"><div><p className="eyebrow">PUBLIC DOCUMENTS</p><h2>Approved downloads only.</h2><DocumentList documents={product.documents} /></div><aside><span>NEED CLARIFICATION?</span><h3>Send the representative or exact variant code.</h3><p>The inquiry route preserves this catalogue group while allowing the exact size, geometry, finish, or external reference to be stated in the product note.</p><Link href={`/inquiry?manual=1&reference=${encodeURIComponent(product.code)}`}>Ask about this instrument ↗</Link></aside></div></section>

    <section className="related-object-section"><div className="container"><header className="catalogue-section-heading"><div><p className="eyebrow">RELATED OBJECTS</p><h2>{related.length ? "Continue comparing within the family." : "Return to the family catalogue."}</h2></div><Link className="catalogue-heading-link" href={`/products/${division.slug}/${family.slug}`}>Return to family ↗</Link></header>{related.length ? <div className="catalogue-editorial-grid">{related.map(item => <ProductCard key={item.id} product={item} />)}</div> : null}</div></section>
  </main><SiteFooter /></>;
}
