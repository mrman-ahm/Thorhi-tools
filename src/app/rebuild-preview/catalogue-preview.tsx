import { verifiedPreviewFamilies } from "@/rebuild/verified-preview-data";
import type { PreviewView } from "./preview-header";
import styles from "./preview.module.css";
import { PreviewSprite } from "./preview-sprite";

export function CataloguePreview({ onView }: { onView: (view: PreviewView) => void }) {
  return <main id="main" className={`${styles.previewMain} ${styles.lightPage}`}>
    <section className={styles.pageTop}>
      <p>Home / Products</p>
      <h1>Product Catalogue</h1>
      <div>Search by instrument name, family or code, or begin with one of THROHI’s product divisions.</div>
    </section>
    <section className={styles.catalogueSurface}>
      <form className={styles.catalogueSearch} onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="catalogue-query">Search catalogue</label>
        <div className={styles.searchField}><input id="catalogue-query" type="search" placeholder="Product name or code" /><button type="submit" aria-label="Search catalogue">→</button></div>
      </form>
      <div className={styles.mobileFilters}><button type="button">Filters <small>Division · Category</small></button><span>626 indexed families</span></div>
      <div className={styles.catalogueLayout}>
        <aside className={styles.filters}>
          <fieldset><legend>Division</legend><label><input type="checkbox" defaultChecked /> Surgical</label><label><input type="checkbox" /> Dental & Orthodontic</label><label><input type="checkbox" /> Veterinary</label><label><input type="checkbox" /> Beauty</label></fieldset>
          <fieldset><legend>Category</legend><label><input type="checkbox" /> Scissors</label><label><input type="checkbox" /> Forceps & Clamps</label><label><input type="checkbox" /> Needle Holders</label><label><input type="checkbox" /> Bone Instruments</label></fieldset>
        </aside>
        <section className={styles.results} aria-labelledby="catalogue-results">
          <header><h2 id="catalogue-results">Surgical instruments</h2><span>626 indexed families · 1,434 variants</span></header>
          <div className={styles.productGrid}>{verifiedPreviewFamilies.map((product) => <button type="button" key={product.representativeCode} onClick={() => onView("product")}>
            <span className={styles.productImage}><PreviewSprite name={product.name} position={product.spritePosition} /></span>
            <span className={styles.productMeta}><span><strong>{product.name}</strong><small>{product.family} · {product.representativeCode}</small></span><span><b>{product.variantCount}</b><small>{product.variantCount === 1 ? "variant" : "variants"}</small></span></span>
          </button>)}</div>
        </section>
      </div>
    </section>
  </main>;
}
