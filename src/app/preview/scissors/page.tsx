import Link from "next/link";
import { Breadcrumbs, ProductCard } from "@/components/catalogue-ui";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { scissorsPreviewProducts } from "@/lib/scissors-preview";

export const metadata = { title: "Scissors Image Review" };

export default function ScissorsPreviewPage() {
  return <><SiteHeader /><main id="main" className="catalogue-v2 family-catalogue tone-surgical">
    <section className="family-catalogue-hero" aria-labelledby="preview-title"><div className="container">
      <Breadcrumbs items={[{ label: "Products", href: "/products" }, { label: "Scissors image review" }]} />
      <div className="family-catalogue-hero-grid"><div><p className="eyebrow">IMAGE REVIEW · BATCH 01</p><h1 id="preview-title">Scissors</h1><p>Fifteen catalogue-derived images shown inside the real product-card and product-detail layouts. This route is for visual review only and is not published catalogue data.</p><div className="family-hero-routes"><Link href="/products">Return to products</Link><Link href="#preview-products">Review all 15 images</Link></div></div><div className="family-catalogue-object" role="img" aria-label="Scissors image review batch"><span className="family-object-grid" aria-hidden="true" /><small>REVIEW ONLY · NOT PUBLISHED</small><strong>15 catalogue images</strong><code>01 / 15</code></div></div>
    </div></section>

    <div className="container"><aside className="seed-notice catalogue-seed-notice" role="note"><span className="seed-mark" aria-hidden="true">REVIEW / 01</span><div><strong>Image-quality preview</strong><span>Judge framing, clarity, background, and consistency. Product identities remain pending final approval.</span></div></aside></div>

    <section id="preview-products" className="family-listing-section"><div className="container family-listing-layout">
      <aside className="catalogue-filter-panel"><header><span>PREVIEW SCOPE</span><small>CATALOGUE PAGES 2–4</small></header><div className="catalogue-active-filters" aria-label="Preview filters"><span>Division: Surgical</span><span>Family: Scissors</span><span>Products: 15</span><span>Status: Review only</span></div><div className="catalogue-sibling-routes"><h3>Included groups</h3><span>Iris</span><span>Stevens</span><span>Operating</span><span>Mayo</span><span>Metzenbaum</span></div></aside>
      <div className="catalogue-results-column"><header className="catalogue-results-toolbar"><div><p className="eyebrow">REAL PRODUCT CARDS</p><h2>15 objects</h2></div><div className="catalogue-result-state"><span>Cleaned catalogue imagery</span><small>REGULAR · SUPER CUT · TC</small></div></header><div className="catalogue-listing-grid">{scissorsPreviewProducts.map(product => <ProductCard key={product.id} product={product} hrefOverride={`/preview/scissors/${product.slug}`} />)}</div></div>
    </div></section>
  </main><SiteFooter /></>;
}
