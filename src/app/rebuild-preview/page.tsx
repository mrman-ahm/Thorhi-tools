"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./preview.module.css";

type PreviewView = "home" | "catalogue" | "product";

type SpriteProps = {
  name: string;
  position: string;
  className?: string;
};

const productFamilies = [
  { name: "Operating Scissors", code: "04-0101", family: "Scissors", variants: 12, position: "4% 45.833%" },
  { name: "Mayo Hegar Needle Holder", code: "09-1301", family: "Needle Holders", variants: 5, position: "96% 54.167%" },
  { name: "Stille Osteotome", code: "36-6901", family: "Bone Chisels & Osteotomes", variants: 8, position: "80% 66.667%" },
  { name: "Oliver Wire Bending Plier", code: "SP-84", family: "Orthodontic Pliers", variants: 1, position: "44% 8.333%" },
] as const;

const operatingVariants = [
  ["04-0101", "Straight · sharp / sharp", "14 cm"],
  ["04-0102", "Straight · sharp / sharp", "17 cm"],
  ["04-0111", "Curved · sharp / sharp", "14 cm"],
  ["04-0112", "Curved · sharp / sharp", "17 cm"],
  ["04-0201", "Straight · sharp / blunt", "14 cm"],
  ["04-0202", "Straight · sharp / blunt", "17 cm"],
  ["04-0211", "Curved · sharp / blunt", "14 cm"],
  ["04-0212", "Curved · sharp / blunt", "17 cm"],
  ["04-0301", "Straight · blunt / blunt", "14 cm"],
  ["04-0302", "Straight · blunt / blunt", "17 cm"],
  ["04-0311", "Curved · blunt / blunt", "14 cm"],
  ["04-0312", "Curved · blunt / blunt", "17 cm"],
] as const;

function Sprite({ name, position, className = "" }: SpriteProps) {
  return <span
    className={`${styles.sprite} ${className}`}
    role="img"
    aria-label={name}
    style={{ backgroundPosition: position }}
  />;
}

function PreviewHeader({ view, onView }: { view: PreviewView; onView: (view: PreviewView) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return <>
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <button className={styles.brandButton} type="button" onClick={() => onView("home")} aria-label="Open homepage preview">
          <Image src="/brand/throhi-logo-clean.webp" alt="THROHI Medical Tools" width={900} height={671} priority />
        </button>
        <nav className={styles.desktopNav} aria-label="Preview navigation">
          <button type="button" aria-current={view === "catalogue" ? "page" : undefined} onClick={() => onView("catalogue")}>Products</button>
          <a href="#company">Company</a>
          <a href="#catalogues">Catalogues</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className={styles.headerActions}>
          <button className={styles.searchButton} type="button" onClick={() => onView("catalogue")}>Search</button>
          <button className={styles.inquiryButton} type="button"><span>Inquiry</span><b>0</b></button>
          <a className={styles.whatsappButton} href="#contact">WhatsApp</a>
          <button className={styles.menuButton} type="button" aria-expanded={menuOpen} aria-controls="rebuild-mobile-menu" onClick={() => setMenuOpen(value => !value)}>{menuOpen ? "Close" : "Menu"}</button>
        </div>
      </div>
    </header>
    <aside id="rebuild-mobile-menu" className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`} aria-hidden={!menuOpen} inert={!menuOpen}>
      <button type="button" onClick={() => { onView("catalogue"); setMenuOpen(false); }}>Products</button>
      <div className={styles.mobileDivisions}>
        <button type="button" onClick={() => { onView("catalogue"); setMenuOpen(false); }}>Surgical Instruments</button>
        <button type="button" onClick={() => { onView("catalogue"); setMenuOpen(false); }}>Dental & Orthodontic</button>
        <button type="button" onClick={() => setMenuOpen(false)}>Veterinary Instruments</button>
        <button type="button" onClick={() => setMenuOpen(false)}>Beauty Instruments</button>
      </div>
      <a href="#company" onClick={() => setMenuOpen(false)}>Company</a>
      <a href="#catalogues" onClick={() => setMenuOpen(false)}>Catalogues</a>
      <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
    </aside>
  </>;
}

function HomePreview({ onView }: { onView: (view: PreviewView) => void }) {
  return <main id="main" className={styles.previewMain}>
    <section className={styles.hero}>
      <div className={styles.heroGrid}>
        <div className={styles.heroCopy}>
          <p className={styles.place}>Sialkot, Pakistan</p>
          <h1>Instruments for <span>surgery, dentistry</span> and specialist care.</h1>
          <p className={styles.heroSummary}>THROHI Medical Tools presents surgical, dental, veterinary and beauty instrument ranges through a searchable catalogue and direct product inquiry.</p>
          <div className={styles.heroActions}>
            <button className={styles.primaryAction} type="button" onClick={() => onView("catalogue")}>Browse catalogue <b aria-hidden="true">↗</b></button>
            <a className={styles.secondaryAction} href="#contact">Contact THROHI <b aria-hidden="true">↗</b></a>
          </div>
          <nav className={styles.divisionLinks} aria-label="Product divisions">
            <button type="button" onClick={() => onView("catalogue")}>Surgical</button>
            <button type="button" onClick={() => onView("catalogue")}>Dental & Orthodontic</button>
            <a href="#veterinary">Veterinary</a>
            <a href="#beauty">Beauty</a>
          </nav>
        </div>
        <figure className={styles.heroObject}>
          <Sprite name="Oliver wire bending plier" position="44% 8.333%" className={styles.heroSprite} />
          <figcaption><strong>Oliver wire bending plier</strong><span>SP-84</span></figcaption>
        </figure>
      </div>
    </section>

    <section className={styles.searchBand}>
      <div className={styles.searchGrid}>
        <div>
          <h2>Find the instrument you already know.</h2>
          <p>Search the digital catalogue by product name, product family or code.</p>
        </div>
        <form onSubmit={(event) => { event.preventDefault(); onView("catalogue"); }}>
          <label htmlFor="preview-search">Catalogue search</label>
          <div className={styles.searchField}><input id="preview-search" type="search" placeholder="Product name or code" /><button type="submit" aria-label="Search catalogue">→</button></div>
          <small>Operating scissors · wire bending plier · needle holder · osteotome</small>
        </form>
      </div>
    </section>

    <section className={styles.divisions} aria-labelledby="division-heading">
      <header className={styles.sectionHeading}><h2 id="division-heading">Four product divisions.</h2><p>Enter the range that matches your work, then search by family, name or code.</p></header>
      <div className={styles.divisionRows}>
        <button type="button" onClick={() => onView("catalogue")}><h3>Surgical Instruments</h3><p>Scissors, forceps, clamps, needle holders, retractors and other verified surgical families.</p><Sprite name="Operating scissors" position="4% 45.833%" /><b>↗</b></button>
        <button type="button" onClick={() => onView("catalogue")}><h3>Dental & Orthodontic</h3><p>Orthodontic pliers, cutters, positioning instruments and related dental ranges.</p><Sprite name="Oliver wire bending plier" position="44% 8.333%" /><b>↗</b></button>
        <a id="veterinary" href="#contact"><h3>Veterinary Instruments</h3><p>Contact THROHI for the current verified veterinary range.</p><span className={styles.rangeContact}>Contact for current range</span><b>↗</b></a>
        <a id="beauty" href="#contact"><h3>Beauty Instruments</h3><p>Contact THROHI for the current verified beauty range.</p><span className={styles.rangeContact}>Contact for current range</span><b>↗</b></a>
      </div>
    </section>

    <section id="company" className={styles.companyStrip}>
      <div><h2>Medical tools from <span>Sialkot, Pakistan.</span></h2><div className={styles.companyActions}><Link href="/company">About THROHI ↗</Link><a href="#contact">Contact ↗</a></div></div>
      <dl><div><dt>Company</dt><dd>THROHI Medical Tools</dd></div><div><dt>Location</dt><dd>Sialkot, Pakistan</dd></div><div><dt>Divisions</dt><dd>Surgical, Dental, Veterinary, Beauty</dd></div><div><dt>Catalogue</dt><dd>Digital catalogue and structured inquiry</dd></div></dl>
    </section>

    <footer id="contact" className={styles.footer}><span>THROHI Medical Tools · Sialkot, Pakistan</span><nav><button type="button" onClick={() => onView("catalogue")}>Products</button><a href="#company">Company</a><a href="#catalogues">Catalogues</a></nav></footer>
  </main>;
}

function CataloguePreview({ onView }: { onView: (view: PreviewView) => void }) {
  return <main id="main" className={`${styles.previewMain} ${styles.lightPage}`}>
    <section className={styles.pageTop}><p>Home / Products</p><h1>Product Catalogue</h1><div>Search by instrument name, family or code, or begin with one of THROHI’s product divisions.</div></section>
    <section className={styles.catalogueSurface}>
      <form className={styles.catalogueSearch} onSubmit={(event) => event.preventDefault()}><label htmlFor="catalogue-query">Search catalogue</label><div className={styles.searchField}><input id="catalogue-query" type="search" placeholder="Product name or code" /><button type="submit">→</button></div></form>
      <div className={styles.mobileFilters}><button type="button">Filters <small>Division · Category</small></button><span>626 indexed families</span></div>
      <div className={styles.catalogueLayout}>
        <aside className={styles.filters}><fieldset><legend>Division</legend><label><input type="checkbox" defaultChecked /> Surgical</label><label><input type="checkbox" /> Dental & Orthodontic</label><label><input type="checkbox" /> Veterinary</label><label><input type="checkbox" /> Beauty</label></fieldset><fieldset><legend>Category</legend><label><input type="checkbox" /> Scissors</label><label><input type="checkbox" /> Forceps & Clamps</label><label><input type="checkbox" /> Needle Holders</label><label><input type="checkbox" /> Bone Instruments</label></fieldset></aside>
        <section className={styles.results} aria-labelledby="catalogue-results"><header><h2 id="catalogue-results">Surgical instruments</h2><span>626 indexed families · 1,434 variants</span></header><div className={styles.productGrid}>{productFamilies.map((product) => <button type="button" key={product.code} onClick={() => onView("product")}><span className={styles.productImage}><Sprite name={product.name} position={product.position} /></span><span className={styles.productMeta}><span><strong>{product.name}</strong><small>{product.family} · {product.code}</small></span><span><b>{product.variants}</b><small>{product.variants === 1 ? "variant" : "variants"}</small></span></span></button>)}</div></section>
      </div>
    </section>
  </main>;
}

function ProductPreview() {
  return <main id="main" className={`${styles.previewMain} ${styles.lightPage}`}>
    <section className={styles.productHero}>
      <p className={styles.productBreadcrumb}>Home / Products / Surgical Instruments / Scissors / Operating Scissors</p>
      <div className={styles.productOverview}>
        <figure><Sprite name="Operating scissors" position="4% 45.833%" /><figcaption>Representative product image</figcaption></figure>
        <div className={styles.productCopy}><span>Surgical Instruments / Scissors</span><h1>Operating Scissors</h1><code>CODE FAMILY · 04-0101</code><p>Available in straight and curved configurations, with sharp/sharp, sharp/blunt and blunt/blunt patterns in 14 cm and 17 cm lengths.</p><div><a href="#variants">Choose variants ↓</a><a href="#contact">Ask on WhatsApp ↗</a></div></div>
      </div>
    </section>
    <section id="variants" className={styles.variants}><h2>Available variants</h2><div className={styles.variantTable}><div className={styles.variantHeader}><span>Code</span><span>Configuration</span><span>Size</span><span>Quantity</span></div>{operatingVariants.map(([code, configuration, size]) => <div className={styles.variantRow} key={code}><code>{code}</code><span>{configuration}</span><span>{size}</span><input type="number" min="0" defaultValue="0" aria-label={`Quantity for ${code}`} /></div>)}</div><button className={styles.addVariants} type="button">Add selected variants to Inquiry List <b>+</b></button></section>
  </main>;
}

export default function RebuildPreviewPage() {
  const [view, setView] = useState<PreviewView>("home");
  return <div className={styles.previewRoot}>
    <PreviewHeader view={view} onView={setView} />
    {view === "home" ? <HomePreview onView={setView} /> : view === "catalogue" ? <CataloguePreview onView={setView} /> : <ProductPreview />}
    <div className={styles.previewSwitcher} aria-label="Prototype views"><span>Prototype</span><button type="button" aria-pressed={view === "home"} onClick={() => setView("home")}>Home</button><button type="button" aria-pressed={view === "catalogue"} onClick={() => setView("catalogue")}>Catalogue</button><button type="button" aria-pressed={view === "product"} onClick={() => setView("product")}>Product</button></div>
  </div>;
}
