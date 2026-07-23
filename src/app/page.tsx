import Link from "next/link";
import { ProductCatalogue, SavedInquiryPanel, type PreviewProduct } from "@/components/catalogue-preview";
import { CinematicEntry } from "@/components/cinematic-entry";
import { DiscoveryExperience } from "@/components/discovery-experience";
import { FrameEvolutionScene } from "@/components/frame-evolution-scene";
import { HeroExperience } from "@/components/hero-experience";
import { MacroInspectionScene } from "@/components/signature-scenes";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const products: readonly PreviewProduct[] = [
  { family: "SURGICAL · SCISSORS", name: "Operating Scissors", code: "THR-SC-001" },
  { family: "SURGICAL · FORCEPS", name: "Dressing Forceps", code: "THR-FC-014" },
  { family: "SURGICAL · SUTURING", name: "Needle Holder", code: "THR-NH-007" },
  { family: "DENTAL · EXTRACTION", name: "Dental Extraction Forceps", code: "THR-DE-021" }
];

const documents = ["Main catalogue", "Surgical catalogue", "Dental catalogue", "Veterinary catalogue"];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

export default function HomePage() {
  return <>
    <CinematicEntry />
    <SiteHeader />
    <main id="main" className="v2-home">
      <HeroExperience />
      <DiscoveryExperience />
      <MacroInspectionScene />
      <FrameEvolutionScene />

      <section className="command-stage" aria-labelledby="command-title"><div className="container command-grid"><div><Eyebrow>06 · DIRECT UTILITY</Eyebrow><h2 id="command-title">Know the object?<br />Skip the exhibition.</h2><p>Search remains the fastest route for procurement teams and returning buyers.</p></div><form action="/search" method="get"><label htmlFor="command-query">PRODUCT COMMAND</label><div><input id="command-query" name="q" type="search" placeholder="Name, family, or code" /><button type="submit">ENTER</button></div><small>EXACT CODE → PREFIX → NAME → ALIAS → FAMILY</small></form></div></section>

      <section className="object-catalogue" aria-labelledby="objects-title"><div className="container"><header className="object-heading"><div><Eyebrow>07 · CATALOGUE OBJECTS</Eyebrow><h2 id="objects-title">Large objects.<br /><span>Useful data.</span></h2></div><p>Seed product records remain visibly identified until the real catalogue is approved.</p></header><ProductCatalogue products={products} /></div></section>

      <section className="inquiry-stage" aria-labelledby="inquiry-title"><div className="container inquiry-stage-grid"><div><Eyebrow>08 · STRUCTURED INQUIRY</Eyebrow><h2 id="inquiry-title">Collect the instruments.<br />Send one clear request.</h2><p>Products, quantities, notes, manual references, and buyer details remain connected through the existing validated inquiry system.</p><ol><li><span>01</span>Add catalogue or manual products</li><li><span>02</span>Adjust quantity and requirements</li><li><span>03</span>Submit one organized inquiry</li></ol></div><SavedInquiryPanel products={products} /></div></section>

      <section className="proof-stage" aria-labelledby="proof-title"><div className="container proof-grid"><div className="proof-copy"><Eyebrow>09 · EVIDENCE BEFORE CLAIMS</Eyebrow><h2 id="proof-title">Professionalism comes from proof, not decoration.</h2><p>Company identity, capabilities, certifications, manufacturing evidence, and documents enter the public site only after verification.</p><div className="proof-lines"><span>COMPANY IDENTITY · PENDING APPROVAL</span><span>CAPABILITY EVIDENCE · CONDITIONAL</span><span>QUALITY DOCUMENTS · CONDITIONAL</span><span>CONTACT ROUTES · REQUIRED</span></div></div><div className="resource-stack"><header><span>DOCUMENT ARCHIVE</span><small>VERIFIED FILES ONLY</small></header>{documents.map((document, index) => <article key={document}><span>{String(index + 1).padStart(2, "0")}</span><strong>{document}</strong><small>PDF · METADATA PENDING</small><b>PENDING</b></article>)}</div></div></section>

      <section className="contact-stage"><div className="container"><p>LOOKING FOR A SPECIFIC INSTRUMENT?</p><h2>Search it.<br /><span>Save it.</span><br />Ask for it.</h2><div><Link href="/search">Search catalogue</Link><Link href="/inquiry">Build inquiry</Link><Link href="/contact">Contact THROHI</Link></div></div></section>
    </main>
    <SiteFooter />
  </>;
}
