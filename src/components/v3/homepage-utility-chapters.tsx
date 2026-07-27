import Link from "next/link";
import {
  ProductCatalogue,
  SavedInquiryPanel
} from "@/components/catalogue-preview";
import {
  GlassPanel,
  SectionIndex,
  SurgicalLink,
  TechnicalReadout
} from "@/components/v3/optical-primitives";
import {
  catalogueCounts,
  divisions as catalogueDivisions,
  type Product
} from "@/lib/catalogue";

const documents = [
  { index: "01", title: "Complete manufacturing list", note: `${catalogueCounts.variants} documented variants` },
  ...catalogueDivisions.map((division, index) => ({
    index: String(index + 2).padStart(2, "0"),
    title: `${division.label} source catalogue`,
    note: `${division.productCount} groups · ${division.variantCount} variants`
  }))
];

const inquirySteps = [
  {
    index: "01",
    title: "Find the instrument",
    note: "Use a representative code, variant code, family, catalogue, or working function."
  },
  {
    index: "02",
    title: "Set quantity and requirements",
    note: "Keep product notes and manual references attached to the correct instrument group."
  },
  {
    index: "03",
    title: "Send one organized inquiry",
    note: "Buyer details, attachments, and selected instruments stay within one validated request."
  }
] as const;

export function HomepageUtilityChapters({
  products
}: {
  products: readonly Product[];
}) {
  return <>
    <section className="v3-catalogue-command v3-surface" aria-labelledby="catalogue-command-title">
      <div className="container">
        <header className="v3-chapter-heading">
          <SectionIndex>06 · Catalogue command</SectionIndex>
          <div>
            <h2 id="catalogue-command-title">Know the object?<br /><span>Go straight to it.</span></h2>
            <p>Search all {catalogueCounts.variants} documented variants by code, product wording, family, or working function.</p>
          </div>
        </header>

        <GlassPanel variant="optical" className="v3-command-console">
          <div className="v3-command-console-copy">
            <TechnicalReadout label="Catalogue depth" value={`${catalogueCounts.products} groups → ${catalogueCounts.variants} variants`} />
            <p>Exact variant codes resolve to their representative catalogue object while preserving the full source description and page reference.</p>
          </div>
          <form action="/search" method="get" className="v3-command-form">
            <label htmlFor="v3-command-query">Search the complete catalogue</label>
            <div>
              <input
                id="v3-command-query"
                name="q"
                type="search"
                placeholder="Product name, family, or code"
                autoComplete="off"
              />
              <button type="submit">Run search <span aria-hidden="true">↗</span></button>
            </div>
            <small>Representative and variant codes · direct routes · structured inquiry handoff</small>
          </form>
        </GlassPanel>
      </div>
    </section>

    <section className="v3-catalogue-objects v3-surface" data-tone="light" aria-labelledby="catalogue-objects-title" id="products">
      <div className="container">
        <header className="v3-chapter-heading">
          <SectionIndex>07 · Catalogue objects</SectionIndex>
          <div>
            <h2 id="catalogue-objects-title">Real catalogue records.<br /><span>Real instrument imagery.</span></h2>
            <p>These four objects are drawn from the complete General Surgery and Orthodontic catalogue integration. Every route retains its variants and source pages.</p>
          </div>
        </header>
        <ProductCatalogue products={products} />
      </div>
    </section>

    <section className="v3-inquiry-path v3-surface" aria-labelledby="inquiry-path-title">
      <div className="container v3-inquiry-layout">
        <div className="v3-inquiry-copy">
          <SectionIndex>08 · Structured inquiry</SectionIndex>
          <h2 id="inquiry-path-title">Collect the instruments.<br /><span>Send one clear request.</span></h2>
          <p>The catalogue remains a procurement workflow, not a checkout. Instrument groups, quantities, notes, references, attachments, and buyer details stay connected.</p>

          <ol className="v3-inquiry-steps">
            {inquirySteps.map(step => <li key={step.index}>
              <span>{step.index}</span>
              <div><strong>{step.title}</strong><p>{step.note}</p></div>
            </li>)}
          </ol>
        </div>
        <GlassPanel variant="clinical" className="v3-saved-inquiry-shell">
          <SavedInquiryPanel />
        </GlassPanel>
      </div>
    </section>

    <section className="v3-verification v3-surface" data-tone="light" aria-labelledby="verification-title">
      <div className="container v3-verification-layout">
        <div className="v3-verification-copy">
          <SectionIndex>09 · Evidence before claims</SectionIndex>
          <h2 id="verification-title">Catalogue facts stay traceable.</h2>
          <p>Product codes, descriptions, materials, finishes, dimensions, and source pages come from the supplied catalogues. Company claims, certifications, and unsupported manufacturing assertions remain outside the published data.</p>
          <div className="v3-verification-statuses" aria-label="Catalogue integration status">
            <span><i data-state="required" />Manufacturing list <b>{catalogueCounts.variants} variants</b></span>
            <span><i data-state="required" />Representative imagery <b>{catalogueCounts.images} images</b></span>
            <span><i data-state="required" />Source pages <b>Retained</b></span>
            <span><i data-state="conditional" />Critical dimensions <b>Cross-check</b></span>
          </div>
        </div>

        <GlassPanel variant="clinical" className="v3-document-archive">
          <header><span>Source archive</span><small>Client-supplied materials</small></header>
          <div>
            {documents.map(document => <article key={document.title}>
              <span>{document.index}</span>
              <div><strong>{document.title}</strong><small>{document.note}</small></div>
              <b>Integrated</b>
            </article>)}
          </div>
          <p>Public download controls remain withheld until approved source files are intentionally published.</p>
        </GlassPanel>
      </div>
    </section>

    <section className="v3-surgical-light" aria-labelledby="surgical-light-title">
      <div className="v3-surgical-light-beam" aria-hidden="true"><span /><span /></div>
      <div className="container v3-surgical-light-content">
        <p>{catalogueCounts.products} groups · {catalogueCounts.variants} variants</p>
        <h2 id="surgical-light-title">Find the instrument.<br /><span>Build the inquiry.</span></h2>
        <div>
          <SurgicalLink className="v3-liquid-action" href="/search" variant="primary">Search catalogue <span aria-hidden="true">↗</span></SurgicalLink>
          <SurgicalLink href="/inquiry" variant="quiet">Review inquiry</SurgicalLink>
          <Link href="/contact">Contact THROHI</Link>
        </div>
      </div>
    </section>
  </>;
}
