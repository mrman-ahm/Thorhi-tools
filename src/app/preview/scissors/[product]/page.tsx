import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, CopyCodeButton, ProductInquiryControls } from "@/components/catalogue-ui";
import { ProductExaminationMotion } from "@/components/product-examination-motion";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getScissorsPreviewProduct, scissorsPreviewProducts } from "@/lib/scissors-preview";

export function generateStaticParams() {
  return scissorsPreviewProducts.map(product => ({ product: product.slug }));
}

export default async function ScissorsPreviewDetailPage({ params }: { params: Promise<{ product: string }> }) {
  const { product: productSlug } = await params;
  const product = getScissorsPreviewProduct(productSlug);
  if (!product) notFound();

  return <><SiteHeader /><main id="main" className="catalogue-v2 product-examination tone-surgical">
    <section className="product-examination-section"><div className="container">
      <Breadcrumbs items={[{ label: "Products", href: "/products" }, { label: "Scissors image review", href: "/preview/scissors" }, { label: product.name }]} />
      <div className="product-examination-grid">
        <div className="product-examination-stage"><header><span>IMAGE EXAMINATION</span><small>REVIEW ONLY · NOT PUBLISHED</small></header><ProductExaminationMotion product={product} /><div className="product-image-state-list"><span>01 · FULL INSTRUMENT VISIBLE</span><span>02 · NEUTRAL CATALOGUE BACKGROUND</span><span>03 · SHAPE UNCHANGED</span></div></div>
        <div className="product-examination-summary"><div className="product-summary-index"><p className="eyebrow">SURGICAL INSTRUMENTS · SCISSORS</p><span>IMAGE REVIEW OBJECT</span></div><h1>{product.name}</h1><CopyCodeButton code={product.code} /><p className="product-description">{product.description}</p>
          <aside className="seed-notice catalogue-seed-notice" role="note"><span className="seed-mark" aria-hidden="true">REVIEW / 01</span><div><strong>Visual approval pending</strong><span>This page tests how the cleaned catalogue image looks in the real product-detail layout.</span></div></aside>
          <section className="verified-information" aria-labelledby="review-title"><header><span>REVIEW POINTS</span><small>IMAGE ONLY</small></header><h2 id="review-title">Check the presentation.</h2><dl><div><dt>Framing</dt><dd>Full instrument visible with clear breathing room.</dd></div><div><dt>Background</dt><dd>Light neutral catalogue treatment.</dd></div><div><dt>Identity</dt><dd>Catalogue shape preserved; final approval still required.</dd></div></dl></section>
          <section className="product-inquiry-builder" aria-labelledby="inquiry-builder-title"><header><span>REAL INQUIRY CONTROL</span><small>UNCHANGED WEBSITE BEHAVIOR</small></header><h2 id="inquiry-builder-title">Test the product interaction.</h2><ProductInquiryControls product={product} /></section>
          <Link className="return-link catalogue-return-link" href="/preview/scissors">← Return to all 15 image previews</Link>
        </div>
      </div>
    </div></section>
  </main><SiteFooter /></>;
}
