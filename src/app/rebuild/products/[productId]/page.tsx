import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CatalogueMedia } from "@/app/rebuild/products/catalogue-media";
import {
  getRebuildProduct,
  rebuildProducts,
} from "@/lib/rebuild-catalogue";
import { ProductActions } from "./product-actions";
import styles from "./product-detail.module.css";

type Props = {
  params: Promise<{ productId: string }>;
  searchParams: Promise<{ from?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productId } = await params;
  const product = getRebuildProduct(productId);
  return product
    ? {
        title: `${product.name} ${product.code} | THROHI`,
        description: `View ${product.name}, product code ${product.code}, and add it to a THROHI inquiry.`,
        robots: { index: false, follow: false },
      }
    : { title: "Product not found | THROHI" };
}

function safeReturnPath(value?: string) {
  return value?.startsWith("/rebuild/products") && !value.startsWith("//")
    ? value
    : "/rebuild/products";
}

export default async function ProductPage({ params, searchParams }: Props) {
  const [{ productId }, query] = await Promise.all([params, searchParams]);
  const product = getRebuildProduct(productId);
  if (!product) notFound();

  const returnPath = safeReturnPath(query.from);
  const relatedProducts = rebuildProducts
    .filter(
      (candidate) =>
        candidate.id !== product.id &&
        candidate.division === product.division &&
        candidate.family === product.family,
    )
    .slice(0, 3);
  const divisionLabel =
    product.division === "dental" ? "Dental & Orthodontic" : "Surgical";
  const sourcePage = product.sourcePrintedPage ?? product.sourcePdfPage;
  const variantCount = product.variants.length || 1;

  return (
    <main id="main" className={styles.detailPage}>
      <div className={styles.detailShell}>
        <nav className={styles.returnRail} aria-label="Product context">
          <Link href={returnPath}>
            <span aria-hidden="true">←</span>
            <span>Back to catalogue</span>
          </Link>
          <div>
            <span>{divisionLabel}</span>
            <span aria-hidden="true">/</span>
            <span>{product.familyLabel}</span>
          </div>
          <code>{product.code}</code>
        </nav>

        <section className={styles.examination} data-product-examination>
          <div className={styles.mediaStage}>
            <div className={styles.stageIndex} aria-hidden="true">
              <span>THR / EXAMINATION</span>
              <span>01</span>
            </div>
            <CatalogueMedia
              product={product}
              className={styles.primaryMedia}
              labelled
              priority
            />
            <div className={styles.mediaReference}>
              <span>{product.code}</span>
              <span>Source-derived catalogue image</span>
            </div>
          </div>

          <aside className={styles.identityRail} aria-label="Product inquiry details">
            <div className={styles.identityLead}>
              <p>{divisionLabel} / {product.familyLabel}</p>
              <h1>{product.name}</h1>
              <code>{product.code}</code>
            </div>

            <p className={styles.boundary}>
              Catalogue identity, source references, and available variant codes
              can be used for inquiry. Technical specifications, materials,
              finishes, and availability remain under client review.
            </p>

            <ProductActions product={product} />

            <dl className={styles.specLedger}>
              <div>
                <dt>Division</dt>
                <dd>{divisionLabel}</dd>
              </div>
              <div>
                <dt>Product family</dt>
                <dd>{product.familyLabel}</dd>
              </div>
              <div>
                <dt>Inquiry references</dt>
                <dd>{variantCount.toString().padStart(2, "0")}</dd>
              </div>
              <div>
                <dt>Source reference</dt>
                <dd>{sourcePage ? `Catalogue page ${sourcePage}` : "Review pending"}</dd>
              </div>
              <div>
                <dt>Technical status</dt>
                <dd>Client verification pending</dd>
              </div>
            </dl>
          </aside>
        </section>

        <section
          className={styles.variantSection}
          aria-labelledby="variants-title"
          data-variant-ledger
        >
          <header className={styles.sectionHeader}>
            <div>
              <p>Inquiry references</p>
              <h2 id="variants-title">
                {product.variants.length
                  ? "Catalogue variant codes"
                  : "Base catalogue reference"}
              </h2>
            </div>
            <span>
              {variantCount.toString().padStart(2, "0")} {variantCount === 1 ? "code" : "codes"}
            </span>
          </header>

          <div className={styles.variantList}>
            {product.variants.length ? (
              product.variants.map((variant, index) => (
                <article className={styles.variantRecord} key={variant.id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <small>Variant code</small>
                    <code>{variant.code}</code>
                  </div>
                  <p>
                    {variant.sourcePrintedPage
                      ? `Source catalogue page ${variant.sourcePrintedPage}`
                      : "Source catalogue reference"}
                  </p>
                  <ProductActions product={product} variant={variant} compact />
                </article>
              ))
            ) : (
              <article className={styles.variantRecord}>
                <span>01</span>
                <div>
                  <small>Base code</small>
                  <code>{product.code}</code>
                </div>
                <p>
                  {sourcePage
                    ? `Source catalogue page ${sourcePage}`
                    : "Source catalogue reference"}
                </p>
                <ProductActions product={product} compact />
              </article>
            )}
          </div>
        </section>

        {relatedProducts.length ? (
          <section
            className={styles.related}
            aria-labelledby="related-title"
            data-related-products
          >
            <header className={styles.sectionHeader}>
              <div>
                <p>Same product family</p>
                <h2 id="related-title">Continue comparing.</h2>
              </div>
              <Link href={returnPath}>Return to catalogue</Link>
            </header>
            <div className={styles.relatedGrid}>
              {relatedProducts.map((related) => (
                <article key={related.id}>
                  <Link
                    href={`/rebuild/products/${related.id}?from=${encodeURIComponent(returnPath)}`}
                  >
                    <CatalogueMedia
                      product={related}
                      className={styles.relatedMedia}
                    />
                    <span>
                      <code>{related.code}</code>
                      <strong>{related.name}</strong>
                      <small>
                        View instrument <b aria-hidden="true">↗</b>
                      </small>
                    </span>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
