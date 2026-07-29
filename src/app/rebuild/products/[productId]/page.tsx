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
        candidate.family === product.family
    )
    .slice(0, 3);
  const divisionLabel =
    product.division === "dental" ? "Dental & Orthodontic" : "Surgical";
  const sourcePage =
    product.sourcePrintedPage ?? product.sourcePdfPage;

  return (
    <main id="main" className={styles.detailPage}>
      <div className={styles.detailShell}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href={returnPath}>Back to catalogue</Link>
          <span aria-hidden="true">/</span>
          <span>{product.familyLabel}</span>
          <span aria-hidden="true">/</span>
          <strong>{product.code}</strong>
        </nav>

        <section className={styles.examination}>
          <div className={styles.mediaStage}>
            <CatalogueMedia
              product={product}
              className={styles.primaryMedia}
              labelled
              priority
            />
            <div className={styles.mediaReference}>
              <span>{product.code}</span>
              <span>Supplied catalogue image</span>
            </div>
          </div>

          <div className={styles.identity}>
            <p>{divisionLabel} / {product.familyLabel}</p>
            <h1>{product.name}</h1>
            <code>{product.code}</code>
            <p className={styles.boundary}>
              Catalogue identity and source references are available for
              inquiry. Technical specifications, materials, finishes, and
              availability remain under client review.
            </p>
            <ProductActions product={product} />
            <dl>
              <div>
                <dt>Division</dt>
                <dd>{divisionLabel}</dd>
              </div>
              <div>
                <dt>Product family</dt>
                <dd>{product.familyLabel}</dd>
              </div>
              <div>
                <dt>Source reference</dt>
                <dd>{sourcePage ? `Catalogue page ${sourcePage}` : "Page review pending"}</dd>
              </div>
              <div>
                <dt>Technical status</dt>
                <dd>Client verification pending</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className={styles.variantSection} aria-labelledby="variants-title">
          <header>
            <div>
              <p>Inquiry references</p>
              <h2 id="variants-title">
                {product.variants.length
                  ? "Catalogue variant codes"
                  : "Base catalogue reference"}
              </h2>
            </div>
            <span>
              {product.variants.length
                ? `${product.variants.length} ${
                    product.variants.length === 1 ? "code" : "codes"
                  }`
                : "1 code"}
            </span>
          </header>
          <div className={styles.variantList}>
            {product.variants.length ? (
              product.variants.map((variant, index) => (
                <article key={variant.id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <code>{variant.code}</code>
                  <p>
                    {variant.sourcePrintedPage
                      ? `Source catalogue page ${variant.sourcePrintedPage}`
                      : "Source catalogue reference"}
                  </p>
                  <ProductActions product={product} variant={variant} compact />
                </article>
              ))
            ) : (
              <article>
                <span>01</span>
                <code>{product.code}</code>
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
          <section className={styles.related} aria-labelledby="related-title">
            <header>
              <div>
                <p>Same product family</p>
                <h2 id="related-title">Continue comparing.</h2>
              </div>
              <Link href={returnPath}>Return to catalogue</Link>
            </header>
            <div>
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
                      <small>View instrument <b aria-hidden="true">↗</b></small>
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
