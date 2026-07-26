"use client";

import Link from "next/link";
import { useState } from "react";
import {
  GlassPanel,
  SectionIndex,
  TechnicalReadout
} from "@/components/v3/optical-primitives";
import {
  divisions as catalogueDivisions,
  families as catalogueFamilies,
  type DivisionSlug
} from "@/lib/catalogue";

const divisionPresentation: Record<DivisionSlug, {
  verbs: readonly string[];
  tone: "green" | "blue";
}> = {
  surgical: { verbs: ["Cut", "Hold", "Clamp", "Retract"], tone: "green" },
  dental: { verbs: ["Cut", "Bend", "Place", "Remove"], tone: "blue" }
};

const divisions = catalogueDivisions.map(division => ({
  index: division.index,
  name: division.label,
  slug: division.slug,
  description: division.description,
  productCount: division.productCount,
  variantCount: division.variantCount,
  ...divisionPresentation[division.slug]
}));

const functions = [
  { index: "01", name: "Cut", note: "Scissors, cutters, and osteotomes", query: "cut" },
  { index: "02", name: "Hold", note: "Forceps, clamps, and holders", query: "hold" },
  { index: "03", name: "Retract", note: "Hand and self-retaining retractors", query: "retract" },
  { index: "04", name: "Suture", note: "Needle holders and suturing families", query: "needle holder" },
  { index: "05", name: "Bend", note: "Wire bending and loop-forming pliers", query: "wire bending" },
  { index: "06", name: "Position", note: "Bracket, band, and measuring instruments", query: "positioning" }
] as const;

const familyPresentation = [
  { division: "surgical", slug: "scissors", function: "Cut" },
  { division: "surgical", slug: "dressing-tissue-forceps", function: "Hold" },
  { division: "surgical", slug: "needle-holders", function: "Suture" },
  { division: "surgical", slug: "hemostatic-forceps", function: "Clamp" },
  { division: "dental", slug: "ligature-wire-cutters", function: "Cut" },
  { division: "dental", slug: "wire-bending-loop-forming-pliers", function: "Bend" },
  { division: "dental", slug: "bracket-positioning-forceps", function: "Position" },
  { division: "dental", slug: "aligner-technic-pliers", function: "Align" }
] as const;

const families = familyPresentation.flatMap((entry, index) => {
  const family = catalogueFamilies.find(item => item.division === entry.division && item.slug === entry.slug);
  const division = catalogueDivisions.find(item => item.slug === entry.division);
  if (!family || !division) return [];
  return [{
    index: String(index + 1).padStart(2, "0"),
    name: family.label,
    route: `/products/${family.division}/${family.slug}`,
    division: division.label,
    function: entry.function,
    productCount: family.productCount,
    variantCount: family.variantCount
  }];
});

export function DiscoveryExperience() {
  const [activeDivision, setActiveDivision] = useState(0);
  const active = divisions[activeDivision] ?? divisions[0];

  return <>
    <section
      className="division-discovery v3-division-index v3-surface"
      aria-labelledby="division-title"
      data-active-tone={active.tone}
      data-active-index={activeDivision}
    >
      <div className="container v3-division-shell">
        <header className="v3-chapter-heading">
          <SectionIndex>01 · Catalogue index</SectionIndex>
          <div>
            <h2 id="division-title">Two catalogues.<br /><span>One inquiry language.</span></h2>
            <p>Move between General Surgery and Orthodontic Instruments without losing product codes, documented variants, source references, search, or inquiry context.</p>
          </div>
        </header>

        <div className="v3-division-layout">
          <GlassPanel variant="optical" className="v3-division-active">
            <div className="v3-division-stage-index">
              <TechnicalReadout label="Active catalogue" value={`${active.index} / ${String(divisions.length).padStart(2, "0")}`} />
              <TechnicalReadout label="Catalogue depth" value={`${active.productCount} groups · ${active.variantCount} variants`} />
            </div>

            <div className="v3-division-instrument" aria-hidden="true">
              <span className="v3-division-orbit orbit-a" />
              <span className="v3-division-orbit orbit-b" />
              <span className="v3-division-blade blade-a" />
              <span className="v3-division-blade blade-b" />
              <span className="v3-division-pivot" />
              <span className="v3-division-axis horizontal" />
              <span className="v3-division-axis vertical" />
            </div>

            <div className="v3-division-copy">
              <p>{active.description}</p>
              <div>{active.verbs.map(verb => <span key={verb}>{verb}</span>)}</div>
              <Link href={`/products/${active.slug}`}>Open {active.name} <span aria-hidden="true">↗</span></Link>
            </div>
          </GlassPanel>

          <nav className="v3-division-rail" aria-label="Product catalogues">
            {divisions.map((division, index) => <Link
              className="v3-division-option"
              href={`/products/${division.slug}`}
              key={division.slug}
              data-tone={division.tone}
              data-active={activeDivision === index}
              onMouseEnter={() => setActiveDivision(index)}
              onFocus={() => setActiveDivision(index)}
            >
              <span>{division.index}</span>
              <strong>{division.name}</strong>
              <small>{division.productCount} groups · {division.variantCount} variants</small>
              <b aria-hidden="true">↗</b>
            </Link>)}
          </nav>
        </div>
      </div>
    </section>

    <section className="function-passage v3-function-archive" aria-labelledby="function-title">
      <div className="container">
        <header className="v3-chapter-heading is-compact">
          <SectionIndex>02 · Working language</SectionIndex>
          <div>
            <h2 id="function-title">Begin with what the instrument must do.</h2>
            <p>Each function searches the complete catalogue, including representative codes and all documented variants.</p>
          </div>
        </header>

        <nav className="v3-function-list" aria-label="Browse instruments by working function">
          {functions.map(item => <Link href={`/search?q=${encodeURIComponent(item.query)}`} key={item.query}>
            <span>{item.index}</span>
            <strong>{item.name}</strong>
            <small>{item.note}</small>
            <b aria-hidden="true">↗</b>
          </Link>)}
        </nav>
      </div>
    </section>

    <section className="family-discovery v3-family-archive v3-surface" data-tone="light" aria-labelledby="family-title">
      <div className="container">
        <header className="v3-chapter-heading">
          <SectionIndex>03 · Family archive</SectionIndex>
          <div>
            <h2 id="family-title">Enter through the family.</h2>
            <p>Featured routes open real catalogue families. The complete family index contains 53 categories across both supplied catalogues.</p>
          </div>
        </header>

        <div className="v3-family-layout">
          <aside className="v3-family-note">
            <p>Catalogue structure</p>
            <strong>Catalogue → family → instrument group → variant → inquiry</strong>
            <small>626 representative groups · 1,434 source variants</small>
          </aside>

          <nav className="v3-family-shelves" aria-label="Featured instrument families">
            {families.map((family, index) => <Link
              className="v3-family-object"
              href={family.route}
              key={family.route}
              style={{ "--family-order": index } as React.CSSProperties}
            >
              <header><span>{family.index}</span><small>{family.division}</small></header>
              <div className="v3-family-object-study" aria-hidden="true">
                <i className="edge edge-a" />
                <i className="edge edge-b" />
                <i className="pivot" />
              </div>
              <footer>
                <span>{family.function} · {family.productCount} groups</span>
                <h3>{family.name}</h3>
                <b>{family.variantCount} variants <span aria-hidden="true">↗</span></b>
              </footer>
            </Link>)}
          </nav>
        </div>
      </div>
    </section>
  </>;
}
