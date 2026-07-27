import Link from "next/link";
import { rebuildDivisionNavigation } from "@/rebuild/navigation";
import { verifiedPreviewFamilies } from "@/rebuild/verified-preview-data";
import type { PreviewView } from "./preview-header";
import styles from "./preview.module.css";
import { PreviewSprite } from "./preview-sprite";

export function HomePreview({ onView }: { onView: (view: PreviewView) => void }) {
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
            {rebuildDivisionNavigation.map((division) => division.catalogueState === "structured" ? <button
              type="button"
              key={division.slug}
              onClick={() => onView("catalogue")}
            >{division.shortLabel}</button> : <a key={division.slug} href={`#${division.slug}`}>{division.shortLabel}</a>)}
          </nav>
        </div>
        <figure className={styles.heroObject}>
          <PreviewSprite name="Oliver wire bending plier" position="44% 8.333%" className={styles.heroSprite} />
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
        {rebuildDivisionNavigation.map((division) => {
          const family = verifiedPreviewFamilies.find((item) => item.division === division.slug);
          const content = <>
            <h3>{division.label}</h3>
            <p>{division.description}</p>
            {family && division.catalogueState === "structured" ? <PreviewSprite name={family.name} position={family.spritePosition} /> : <span className={styles.rangeContact}>Contact for current range</span>}
            <b aria-hidden="true">↗</b>
          </>;

          return division.catalogueState === "structured" ? <button type="button" key={division.slug} onClick={() => onView("catalogue")}>{content}</button> : <a id={division.slug} key={division.slug} href="#contact">{content}</a>;
        })}
      </div>
    </section>

    <section id="company" className={styles.companyStrip}>
      <div><h2>Medical tools from <span>Sialkot, Pakistan.</span></h2><div className={styles.companyActions}><Link href="/company">About THROHI ↗</Link><a href="#contact">Contact ↗</a></div></div>
      <dl>
        <div><dt>Company</dt><dd>THROHI Medical Tools</dd></div>
        <div><dt>Location</dt><dd>Sialkot, Pakistan</dd></div>
        <div><dt>Divisions</dt><dd>Surgical, Dental, Veterinary, Beauty</dd></div>
        <div><dt>Catalogue</dt><dd>Digital catalogue and structured inquiry</dd></div>
      </dl>
    </section>

    <footer id="contact" className={styles.footer}>
      <span>THROHI Medical Tools · Sialkot, Pakistan</span>
      <nav><button type="button" onClick={() => onView("catalogue")}>Products</button><a href="#company">Company</a><a id="catalogues" href="/catalogues">Catalogues</a></nav>
    </footer>
  </main>;
}
