import Link from "next/link";
import {
  ProductCatalogue,
  SavedInquiryPanel,
  type PreviewProduct
} from "@/components/catalogue-preview";
import {
  GlassPanel,
  SectionIndex,
  SurgicalLink,
  TechnicalReadout
} from "@/components/v3/optical-primitives";

const documents = [
  { index: "01", title: "Main catalogue", note: "Metadata pending" },
  { index: "02", title: "Surgical catalogue", note: "Metadata pending" },
  { index: "03", title: "Dental catalogue", note: "Metadata pending" },
  { index: "04", title: "Veterinary catalogue", note: "Metadata pending" }
] as const;

const inquirySteps = [
  {
    index: "01",
    title: "Find the instrument",
    note: "Use a product code, family, division, or working function."
  },
  {
    index: "02",
    title: "Set quantity and requirements",
    note: "Keep product notes and manual references attached to the correct item."
  },
  {
    index: "03",
    title: "Send one organized inquiry",
    note: "Buyer details, attachments, and selected products stay within one validated request."
  }
] as const;

export function HomepageUtilityChapters({
  products
}: {
  products: readonly PreviewProduct[];
}) {
  return <>
    <section className="v3-catalogue-command v3-surface" aria-labelledby="catalogue-command-title">
      <div className="container">
        <header className="v3-chapter-heading">
          <SectionIndex>06 · Catalogue command</SectionIndex>
          <div>
            <h2 id="catalogue-command-title">Know the object?<br /><span>Go straight to it.</span></h2>
            <p>Product-code search remains the fastest route for procurement teams and returning buyers.</p>
          </div>
        </header>

        <GlassPanel variant="optical" className="v3-command-console">
          <div className="v3-command-console-copy">
            <TechnicalReadout label="Ranking" value="Code → prefix → name → alias → family" />
            <p>Enter an exact or partial catalogue code, product name, instrument family, or working term.</p>
          </div>
          <form action="/search" method="get" className="v3-command-form">
            <label htmlFor="v3-command-query">Search the catalogue</label>
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
            <small>Keyboard accessible · direct result routes · structured inquiry handoff</small>
          </form>
        </GlassPanel>
      </div>
    </section>

    <section className="v3-catalogue-objects v3-surface" data-tone="light" aria-labelledby="catalogue-objects-title" id="products">
      <div className="container">
        <header className="v3-chapter-heading">
          <SectionIndex>07 · Catalogue objects</SectionIndex>
          <div>
            <h2 id="catalogue-objects-title">Representative records.<br /><span>Useful product structure.</span></h2>
            <p>Seed records remain clearly identified until approved catalogue content and product photography replace them.</p>
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
          <p>The inquiry system remains a procurement workflow, not a checkout. Products, quantities, notes, references, attachments, and buyer details stay connected.</p>

          <ol className="v3-inquiry-steps">
            {inquirySteps.map(step => <li key={step.index}>
              <span>{step.index}</span>
              <div><strong>{step.title}</strong><p>{step.note}</p></div>
            </li>)}
          </ol>
        </div>
        <GlassPanel variant="clinical" className="v3-saved-inquiry-shell">
          <SavedInquiryPanel products={products} />
        </GlassPanel>
      </div>
    </section>

    <section className="v3-verification v3-surface" data-tone="light" aria-labelledby="verification-title">
      <div className="container v3-verification-layout">
        <div className="v3-verification-copy">
          <SectionIndex>09 · Evidence before claims</SectionIndex>
          <h2 id="verification-title">Publish only what can be verified.</h2>
          <p>Company identity, manufacturing capabilities, certifications, materials, export information, and technical claims remain unpublished until evidence and approval exist.</p>
          <div className="v3-verification-statuses" aria-label="Verification status">
            <span><i data-state="pending" />Company identity <b>Pending approval</b></span>
            <span><i data-state="conditional" />Capability evidence <b>Conditional</b></span>
            <span><i data-state="conditional" />Quality documents <b>Conditional</b></span>
            <span><i data-state="required" />Contact routes <b>Required</b></span>
          </div>
        </div>

        <GlassPanel variant="clinical" className="v3-document-archive">
          <header><span>Document archive</span><small>Verified files only</small></header>
          <div>
            {documents.map(document => <article key={document.title}>
              <span>{document.index}</span>
              <div><strong>{document.title}</strong><small>{document.note}</small></div>
              <b>Pending</b>
            </article>)}
          </div>
          <p>No false download action is shown before a real approved file exists.</p>
        </GlassPanel>
      </div>
    </section>

    <section className="v3-surgical-light" aria-labelledby="surgical-light-title">
      <div className="v3-surgical-light-beam" aria-hidden="true"><span /><span /></div>
      <div className="container v3-surgical-light-content">
        <p>Catalogue to inquiry</p>
        <h2 id="surgical-light-title">Find the instrument.<br /><span>Build the inquiry.</span></h2>
        <div>
          <SurgicalLink href="/search" variant="primary">Search catalogue <span aria-hidden="true">↗</span></SurgicalLink>
          <SurgicalLink href="/inquiry" variant="quiet">Review inquiry</SurgicalLink>
          <Link href="/contact">Contact THROHI</Link>
        </div>
      </div>
    </section>
  </>;
}
