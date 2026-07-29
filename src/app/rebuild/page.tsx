import type { Metadata } from "next";
import Link from "next/link";
import { CatalogueMedia } from "@/app/rebuild/products/catalogue-media";
import {
  getRebuildProductByCode,
  rebuildCatalogue,
  type RuntimeProduct,
} from "@/lib/rebuild-catalogue";
import styles from "./home.module.css";

export const metadata: Metadata = {
  title: "THROHI Medical Tools",
  description:
    "Browse THROHI surgical and dental instrument families by product name or code.",
  robots: { index: false, follow: false },
};

function requireProduct(code: string): RuntimeProduct {
  const product = getRebuildProductByCode(code);
  if (!product) throw new Error(`Required rebuild product ${code} is missing.`);
  return product;
}

const operatingScissors = requireProduct("04-0101");
const oliverPliers = requireProduct("SP-84");
const needleHolder = requireProduct("09-1301");
const osteotome = requireProduct("36-6901");

const divisions = [
  {
    number: "01",
    name: "Surgical Instruments",
    slug: "surgical",
    product: operatingScissors,
    count:
      rebuildCatalogue.divisions.find((division) => division.slug === "surgical")
        ?.productCount ?? 0,
  },
  {
    number: "02",
    name: "Dental & Orthodontic",
    slug: "dental",
    product: oliverPliers,
    count:
      rebuildCatalogue.divisions.find((division) => division.slug === "dental")
        ?.productCount ?? 0,
  },
] as const;

const selectedProducts = [operatingScissors, needleHolder, osteotome] as const;

export default function RebuildHome() {
  return (
    <main id="main" className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroCoordinates} aria-hidden="true">
          <span>CAT / {rebuildCatalogue.counts.products}</span>
          <span>DATA / SOURCE-DERIVED</span>
          <span>REF / 01-02</span>
        </div>
        <div className={styles.heroScene}>
          <CatalogueMedia
            product={operatingScissors}
            className={`${styles.sceneInstrument} ${styles.sceneScissors}`}
            priority
          />
          <CatalogueMedia
            product={oliverPliers}
            className={`${styles.sceneInstrument} ${styles.scenePliers}`}
            labelled
            priority
          />
          <CatalogueMedia
            product={needleHolder}
            className={`${styles.sceneInstrument} ${styles.sceneHolder}`}
          />
          <span className={styles.sceneCodeA}>04-0101 / Surgical</span>
          <span className={styles.sceneCodeB}>SP-84 / Orthodontic</span>
        </div>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Surgical / Dental &amp; Orthodontic</p>
          <h1>
            <span>THROHI</span>
            <span>Medical Tools</span>
          </h1>
          <p className={styles.heroCopy}>
            Find instruments by catalogue code or name, then bring every
            quantity and note into one clear inquiry.
          </p>
          <div className={styles.heroActions}>
            <Link href="/rebuild/products">Browse catalogue</Link>
            <Link href="/rebuild/inquiry">Open Inquiry List</Link>
          </div>
        </div>
        <p className={styles.heroVertical} aria-hidden="true">
          Source-derived catalogue / Technical claims pending
        </p>
        <div className={styles.heroIndex}>
          <span><b>{rebuildCatalogue.counts.products}</b> Product identities</span>
          <span><b>{rebuildCatalogue.counts.variants.toLocaleString("en-US")}</b> Variant codes</span>
          <span><b>{String(rebuildCatalogue.counts.divisions).padStart(2, "0")}</b> Supplied divisions</span>
        </div>
      </section>

      <section className={styles.searchSection} aria-labelledby="catalogue-search-title">
        <div className={styles.searchInner}>
          <div>
            <p>Direct catalogue lookup</p>
            <h2 id="catalogue-search-title">Code known?<br />Go straight there.</h2>
          </div>
          <form action="/rebuild/products" role="search">
            <label htmlFor="home-query">Product name or catalogue code</label>
            <div>
              <input
                id="home-query"
                name="q"
                type="search"
                placeholder="04-0101 or operating scissors"
              />
              <button type="submit">Find product</button>
            </div>
            <small>Exact code, compact code, family name, or product identity</small>
          </form>
        </div>
      </section>

      <section className={styles.divisions} aria-labelledby="divisions-title">
        <div className={styles.sectionIntro}>
          <p>Supplied catalogues</p>
          <h2 id="divisions-title">Explore by division.</h2>
          <p>
            Surgical and Dental &amp; Orthodontic records are indexed in this
            rebuild. Other divisions remain unpublished until catalogue sources
            are supplied and reviewed.
          </p>
        </div>
        <div className={styles.divisionList}>
          {divisions.map((division) => (
            <Link
              key={division.slug}
              href={`/rebuild/products?division=${division.slug}`}
              className={styles.divisionRow}
              data-division={division.slug}
            >
              <span className={styles.divisionNumber}>{division.number}</span>
              <CatalogueMedia
                product={division.product}
                className={styles.divisionInstrument}
              />
              <span className={styles.divisionCopy}>
                <strong>{division.name}</strong>
                <small>
                  {division.count} indexed product families / source-derived
                </small>
              </span>
              <span className={styles.rowAction}>Browse <b aria-hidden="true">+</b></span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.selection} aria-labelledby="selection-title">
        <div className={styles.selectionHeading}>
          <p>Catalogue reference</p>
          <h2 id="selection-title">Start with a known family.</h2>
          <Link href="/rebuild/products">View all products</Link>
        </div>
        <div className={styles.productStrip}>
          {selectedProducts.map((product) => (
            <article key={product.id}>
              <Link href={`/rebuild/products/${product.id}`}>
                <CatalogueMedia
                  product={product}
                  className={styles.productInstrument}
                  labelled
                />
                <span className={styles.productIdentity}>
                  <span>
                    <code>{product.code}</code>
                    <small>{product.division}</small>
                  </span>
                  <strong>{product.name}</strong>
                  <em>{product.familyLabel}</em>
                </span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section id="company" className={styles.company}>
        <div className={styles.companyInner}>
          <div>
            <p>01 / Evidence boundary</p>
            <h2>Identity first.<br /><span>Claims after proof.</span></h2>
          </div>
          <div className={styles.companyCopy}>
            <p>
              THROHI Medical Tools is presented here through the supplied
              Surgical and Dental &amp; Orthodontic catalogue identities.
              Product codes, family names, and representative images are
              available for discovery.
            </p>
            <p>
              Materials, measurements, finishes, certifications, availability,
              company profile details, and direct contact information remain
              withheld until client verification.
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className={styles.inquiryCta}>
        <div>
          <p>02 / Structured inquiry</p>
          <h2>Build one precise request across every instrument.</h2>
        </div>
        <div className={styles.inquiryActions}>
          <Link href="/rebuild/products">Choose instruments</Link>
          <Link href="/rebuild/inquiry">Review Inquiry List</Link>
        </div>
      </section>
    </main>
  );
}
