import Link from "next/link";
import { ProductCatalogue, SavedInquiryPanel, type PreviewProduct } from "@/components/catalogue-preview";
import { DiscoveryExperience } from "@/components/discovery-experience";
import { HeroExperience } from "@/components/hero-experience";
import { InstrumentVisual } from "@/components/instrument-visual";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

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
      <HeroExperience />
      <DiscoveryExperience />

      <section className="macro-stage" aria-labelledby="macro-title"><div className="container macro-grid"><div className="macro-object"><InstrumentVisual variant="macro" label="Temporary macro instrument study with generic annotation placeholders" /></div><div className="macro-copy"><Eyebrow>04 · UNDER EXAMINATION</Eyebrow><h2 id="macro-title">Precision becomes visible at the edge.</h2><p>The final version will reveal an approved macro instrument image through light and technical annotation. The static skeleton establishes scale, hierarchy, and placement first.</p><dl><div><dt>01</dt><dd>WORKING END</dd></div><div><dt>02</dt><dd>JOINT</dd></div><div><dt>03</dt><dd>HANDLE</dd></div></dl></div></div></section>

      <section className="evolution-stage" aria-labelledby="evolution-title"><header className="container evolution-heading"><Eyebrow>05 · PRECISION THROUGH TIME</Eyebrow><h2 id="evolution-title">One form.<br />Four visual chapters.</h2><p>This is the static storyboard for the future scissors-evolution sequence. No historical image or claim is treated as approved yet.</p></header><div className="evolution-grid">{evolution.map(chapter => <article className={`evolution-card ${chapter.color}`} key={chapter.index}><div className="evolution-figure" aria-label={`${chapter.era} scissors concept placeholder`} role="img"><span className="mini-blade one" /><span className="mini-blade two" /><span className="mini-ring one" /><span className="mini-ring two" /></div><div><span>{chapter.index} · {chapter.era}</span><h3>{chapter.title}</h3><p>{chapter.text}</p></div></article>)}</div><div className="container evolution-link"><Link href="/precision-through-time">Open the editorial history route <span aria-hidden="true">↗</span></Link></div></section>

      <section className="command-stage" aria-labelledby="command-title"><div className="container command-grid"><div><Eyebrow>06 · DIRECT UTILITY</Eyebrow><h2 id="command-title">Know the object?<br />Skip the exhibition.</h2><p>Search remains the fastest route for procurement teams and returning buyers.</p></div><form action="/search" method="get"><label htmlFor="command-query">PRODUCT COMMAND</label><div><input id="command-query" name="q" type="search" placeholder="Name, family, or code" /><button type="submit">ENTER</button></div><small>EXACT CODE → PREFIX → NAME → ALIAS → FAMILY</small></form></div></section>

      <section className="object-catalogue" aria-labelledby="objects-title"><div className="container"><header className="object-heading"><div><Eyebrow>07 · CATALOGUE OBJECTS</Eyebrow><h2 id="objects-title">Large objects.<br /><span>Useful data.</span></h2></div><p>Seed product records remain visibly identified until the real catalogue is approved.</p></header><ProductCatalogue products={products} /></div></section>

      <section className="inquiry-stage" aria-labelledby="inquiry-title"><div className="container inquiry-stage-grid"><div><Eyebrow>08 · STRUCTURED INQUIRY</Eyebrow><h2 id="inquiry-title">Collect the instruments.<br />Send one clear request.</h2><p>Products, quantities, notes, manual references, and buyer details remain connected through the existing validated inquiry system.</p><ol><li><span>01</span>Add catalogue or manual products</li><li><span>02</span>Adjust quantity and requirements</li><li><span>03</span>Submit one organized inquiry</li></ol></div><SavedInquiryPanel products={products} /></div></section>

      <section className="proof-stage" aria-labelledby="proof-title"><div className="container proof-grid"><div className="proof-copy"><Eyebrow>09 · EVIDENCE BEFORE CLAIMS</Eyebrow><h2 id="proof-title">Professionalism comes from proof, not decoration.</h2><p>Company identity, capabilities, certifications, manufacturing evidence, and documents enter the public site only after verification.</p><div className="proof-lines"><span>COMPANY IDENTITY · PENDING APPROVAL</span><span>CAPABILITY EVIDENCE · CONDITIONAL</span><span>QUALITY DOCUMENTS · CONDITIONAL</span><span>CONTACT ROUTES · REQUIRED</span></div></div><div className="resource-stack"><header><span>DOCUMENT ARCHIVE</span><small>VERIFIED FILES ONLY</small></header>{documents.map((document, index) => <article key={document}><span>{String(index + 1).padStart(2, "0")}</span><strong>{document}</strong><small>PDF · METADATA PENDING</small><b>PENDING</b></article>)}</div></div></section>

      <section className="contact-stage"><div className="container"><p>LOOKING FOR A SPECIFIC INSTRUMENT?</p><h2>Search it.<br /><span>Save it.</span><br />Ask for it.</h2><div><Link href="/search">Search catalogue</Link><Link href="/inquiry">Build inquiry</Link><Link href="/contact">Contact THROHI</Link></div></div></section>
    </main>
    <SiteFooter />
  </>;
}
