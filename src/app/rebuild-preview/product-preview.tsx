import { operatingScissorsVariants } from "@/rebuild/verified-preview-data";
import styles from "./preview.module.css";
import { PreviewSprite } from "./preview-sprite";

export function ProductPreview() {
  return <main id="main" className={`${styles.previewMain} ${styles.lightPage}`}>
    <section className={styles.productHero}>
      <p className={styles.productBreadcrumb}>Home / Products / Surgical Instruments / Scissors / Operating Scissors</p>
      <div className={styles.productOverview}>
        <figure><PreviewSprite name="Operating scissors" position="4% 45.833%" /><figcaption>Representative product image</figcaption></figure>
        <div className={styles.productCopy}>
          <span>Surgical Instruments / Scissors</span>
          <h1>Operating Scissors</h1>
          <code>CODE FAMILY · 04-0101</code>
          <p>Available in straight and curved configurations, with sharp/sharp, sharp/blunt and blunt/blunt patterns in 14 cm and 17 cm lengths.</p>
          <div><a href="#variants">Choose variants ↓</a><a href="#contact">Ask on WhatsApp ↗</a></div>
        </div>
      </div>
    </section>
    <section id="variants" className={styles.variants}>
      <h2>Available variants</h2>
      <div className={styles.variantTable}>
        <div className={styles.variantHeader}><span>Code</span><span>Configuration</span><span>Size</span><span>Quantity</span></div>
        {operatingScissorsVariants.map((variant) => <div className={styles.variantRow} key={variant.code}>
          <code>{variant.code}</code><span>{variant.configuration}</span><span>{variant.size}</span><input type="number" min="0" defaultValue="0" aria-label={`Quantity for ${variant.code}`} />
        </div>)}
      </div>
      <button className={styles.addVariants} type="button">Add selected variants to Inquiry List <b>+</b></button>
    </section>
  </main>;
}
