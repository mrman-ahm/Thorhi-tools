import Link from "next/link";
import { ProductCatalogue, SavedInquiryPanel, type PreviewProduct } from "@/components/catalogue-preview";
import { InstrumentVisual } from "@/components/instrument-visual";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const divisions = [
  { index: "01", name: "Surgical", slug: "surgical", description: "Cutting, holding, clamping, retracting, and suturing families.", verbs: "CUT · HOLD · CLAMP", tone: "green" },
  { index: "02", name: "Dental", slug: "dental", description: "Diagnostic, extraction, periodontal, and restorative families.", verbs: "EXAMINE · EXTRACT · RESTORE", tone: "blue" },
  { index: "03", name: "Veterinary", slug: "veterinary", description: "General, equine, hoof, obstetrical, and specialist families.", verbs: "TREAT · HOLD · SUPPORT", tone: "amber" },
  { index: "04", name: "Beauty", slug: "beauty", description: "Hair, tweezer, nail, cuticle, and professional salon families.", verbs: "SHAPE · REFINE · DETAIL", tone: "coral" }
] as const;

const familyRoutes = [
  ["Scissors", "/products/surgical/scissors"],
  ["Forceps & Clamps", "/products/surgical/forceps-clamps"],
  ["Needle Holders", "/products/surgical/needle-holders"],
  ["Dental Extraction", "/products/dental/extraction"],
  ["Periodontal", "/products/dental/periodontal"],
  ["Hoof & Farrier", "/products/veterinary/hoof-farrier"],
  ["Hair Scissors", "/products/beauty/hair-scissors"],
  ["Nail & Cuticle", "/products/beauty/nail-cuticle"]
] as const;

const products: readonly PreviewProduct[] = [
  { family: "SURGICAL · SCISSORS", name: "Operating Scissors", code: "THR-SC-001" },
  { family: "SURGICAL · FORCEPS", name: "Dressing Forceps", code: "THR-FC-014" },
  { family: "SURGICAL · SUTURING", name: "Needle Holder", code: "THR-NH-007" },
  { family: "DENTAL · EXTRACTION", name: "Dental Extraction Forceps", code: "THR-DE-021" }
];

const evolution = [
  { index: "01", era: "ORIGIN", title: "The cutting form", color: "amber", text: "A visual reconstruction placeholder for the earliest chapter. Historical claims and imagery require later verification." },
  { index: "02", era: "MECHANISM", title: "The pivot", color: "blue", text: "The joint becomes the central mechanical idea: two controlled edges working through one axis." },
  { index: "03", era: "SPECIALIZATION", title: "The profile divides", color: "green", text: "Different working ends, curves, and proportions emerge for different procedures and handling needs." },
  { index: "04", era: "PRECISION", title: "The object today", color: "mint", text: "A modern instrument silhouette closes the storyboard. Final photography or approved reconstruction will replace this placeholder." }
] as const;

const documents = ["Main catalogue", "Surgical catalogue", "Dental catalogue", "Veterinary catalogue"];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

export default function HomePage() {
  return <>
    <SiteHeader />
    <main id="main" className="v2-home">
      <section className="v2-hero" aria-labelledby="hero-title">
        <div className="hero-index" aria-hidden="true"><span>THROHI / MEDICAL TOOLS</span><span>PRECISION OBJECTS / CATALOGUE / INQUIRY</span></div>
        <div className="hero-type" id="hero-title"><span>PRECISION,</span><span>BROUGHT</span><span className="accent-green">ALIVE.</span></div>
        <div className="hero-object"><InstrumentVisual label="Temporary surgical scissors silhouette for the V2 homepage hero" /></div>
        <div className="hero-statement"><p>Not a marketplace. Not a generic supplier template.</p><p>A visual catalogue for surgical, dental, veterinary, and beauty instruments.</p></div>
        <form className="hero-search" action="/search" method="get">
          <label htmlFor="hero-query"><span>SEARCH THE CATALOGUE</span><small>NAME · FAMILY · EXACT OR PARTIAL CODE</small></label>
          <div><input id="hero-query" name="q" type="search" placeholder="THR-SC-001" autoComplete="off" /><button type="submit">Search <span aria-hidden="true">↗</span></button></div>
        </form>
        <div className="hero-scroll-note" aria-hidden="true"><span>SCROLL TO EXAMINE</span><b>↓</b></div>
      </section>

      <section className="division-theatre" aria-labelledby="division-title">
        <header className="section-intro container"><Eyebrow>01 · FOUR DIVISIONS</Eyebrow><h2 id="division-title">Four fields.<br /><span>One language of precision.</span></h2><p>Every division receives its own atmosphere without breaking the THROHI system.</p></header>
        <div className="division-list">{divisions.map(division => <Link className={`division-scene ${division.tone}`} href={`/products/${division.slug}`} key={division.slug}><span className="division-number">{division.index}</span><strong>{division.name}</strong><div className="division-copy"><p>{division.description}</p><small>{division.verbs}</small></div><span className="division-arrow" aria-hidden="true">↗</span></Link>)}</div>
      </section>

      <section className="verb-stage" aria-label="Instrument functions"><div className="verb-row green"><span>CUT</span><span>HOLD</span><span>CLAMP</span></div><div className="verb-row blue"><span>RETRACT</span><span>SUTURE</span></div><div className="verb-row orange"><span>EXAMINE</span><span>REFINE</span></div></section>

      <section className="family-archive" aria-labelledby="family-title">
        <div className="container family-archive-grid"><div className="family-archive-intro"><Eyebrow>02 · FAMILY INDEX</Eyebrow><h2 id="family-title">Enter through the function, the family, or the code.</h2><p>The catalogue stays direct even when the homepage becomes expressive.</p><Link href="/products">View every product route <span aria-hidden="true">↗</span></Link></div><div className="family-routes">{familyRoutes.map(([name, href], index) => <Link href={href} key={name}><span>{String(index + 1).padStart(2, "0")}</span><strong>{name}</strong><small>OPEN FAMILY</small><b aria-hidden="true">↗</b></Link>)}</div></div>
      </section>

      <section className="macro-stage" aria-labelledby="macro-title"><div className="container macro-grid"><div className="macro-object"><InstrumentVisual variant="macro" label="Temporary macro instrument study with generic annotation placeholders" /></div><div className="macro-copy"><Eyebrow>03 · UNDER EXAMINATION</Eyebrow><h2 id="macro-title">Precision becomes visible at the edge.</h2><p>The final version will reveal an approved macro instrument image through light and technical annotation. The static skeleton establishes scale, hierarchy, and placement first.</p><dl><div><dt>01</dt><dd>WORKING END</dd></div><div><dt>02</dt><dd>JOINT</dd></div><div><dt>03</dt><dd>HANDLE</dd></div></dl></div></div></section>

      <section className="evolution-stage" aria-labelledby="evolution-title"><header className="container evolution-heading"><Eyebrow>04 · PRECISION THROUGH TIME</Eyebrow><h2 id="evolution-title">One form.<br />Four visual chapters.</h2><p>This is the static storyboard for the future scissors-evolution sequence. No historical image or claim is treated as approved yet.</p></header><div className="evolution-grid">{evolution.map(chapter => <article className={`evolution-card ${chapter.color}`} key={chapter.index}><div className="evolution-figure" aria-label={`${chapter.era} scissors concept placeholder`} role="img"><span className="mini-blade one" /><span className="mini-blade two" /><span className="mini-ring one" /><span className="mini-ring two" /></div><div><span>{chapter.index} · {chapter.era}</span><h3>{chapter.title}</h3><p>{chapter.text}</p></div></article>)}</div><div className="container evolution-link"><Link href="/precision-through-time">Open the editorial history route <span aria-hidden="true">↗</span></Link></div></section>

      <section className="command-stage" aria-labelledby="command-title"><div className="container command-grid"><div><Eyebrow>05 · DIRECT UTILITY</Eyebrow><h2 id="command-title">Know the object?<br />Skip the exhibition.</h2><p>Search remains the fastest route for procurement teams and returning buyers.</p></div><form action="/search" method="get"><label htmlFor="command-query">PRODUCT COMMAND</label><div><input id="command-query" name="q" type="search" placeholder="Name, family, or code" /><button type="submit">ENTER</button></div><small>EXACT CODE → PREFIX → NAME → ALIAS → FAMILY</small></form></div></section>

      <section className="object-catalogue" aria-labelledby="objects-title"><div className="container"><header className="object-heading"><div><Eyebrow>06 · CATALOGUE OBJECTS</Eyebrow><h2 id="objects-title">Large objects.<br /><span>Useful data.</span></h2></div><p>Seed product records remain visibly identified until the real catalogue is approved.</p></header><ProductCatalogue products={products} /></div></section>

      <section className="inquiry-stage" aria-labelledby="inquiry-title"><div className="container inquiry-stage-grid"><div><Eyebrow>07 · STRUCTURED INQUIRY</Eyebrow><h2 id="inquiry-title">Collect the instruments.<br />Send one clear request.</h2><p>Products, quantities, notes, manual references, and buyer details remain connected through the existing validated inquiry system.</p><ol><li><span>01</span>Add catalogue or manual products</li><li><span>02</span>Adjust quantity and requirements</li><li><span>03</span>Submit one organized inquiry</li></ol></div><SavedInquiryPanel products={products} /></div></section>

      <section className="proof-stage" aria-labelledby="proof-title"><div className="container proof-grid"><div className="proof-copy"><Eyebrow>08 · EVIDENCE BEFORE CLAIMS</Eyebrow><h2 id="proof-title">Professionalism comes from proof, not decoration.</h2><p>Company identity, capabilities, certifications, manufacturing evidence, and documents enter the public site only after verification.</p><div className="proof-lines"><span>COMPANY IDENTITY · PENDING APPROVAL</span><span>CAPABILITY EVIDENCE · CONDITIONAL</span><span>QUALITY DOCUMENTS · CONDITIONAL</span><span>CONTACT ROUTES · REQUIRED</span></div></div><div className="resource-stack"><header><span>DOCUMENT ARCHIVE</span><small>VERIFIED FILES ONLY</small></header>{documents.map((document, index) => <article key={document}><span>{String(index + 1).padStart(2, "0")}</span><strong>{document}</strong><small>PDF · METADATA PENDING</small><b>PENDING</b></article>)}</div></div></section>

      <section className="contact-stage"><div className="container"><p>LOOKING FOR A SPECIFIC INSTRUMENT?</p><h2>Search it.<br /><span>Save it.</span><br />Ask for it.</h2><div><Link href="/search">Search catalogue</Link><Link href="/inquiry">Build inquiry</Link><Link href="/contact">Contact THROHI</Link></div></div></section>
    </main>
    <SiteFooter />
  </>;
}
