"use client";

import Link from "next/link";
import { useState } from "react";
import {
  GlassPanel,
  SectionIndex,
  TechnicalReadout
} from "@/components/v3/optical-primitives";

const divisions = [
  {
    index: "01",
    name: "Surgical",
    slug: "surgical",
    description: "Cutting, holding, clamping, retracting, and suturing families.",
    verbs: ["Cut", "Hold", "Clamp"],
    tone: "green"
  },
  {
    index: "02",
    name: "Dental",
    slug: "dental",
    description: "Diagnostic, extraction, periodontal, and restorative families.",
    verbs: ["Examine", "Extract", "Restore"],
    tone: "blue"
  },
  {
    index: "03",
    name: "Veterinary",
    slug: "veterinary",
    description: "General, equine, hoof, obstetrical, and specialist families.",
    verbs: ["Treat", "Hold", "Support"],
    tone: "amber"
  },
  {
    index: "04",
    name: "Beauty",
    slug: "beauty",
    description: "Hair, tweezer, nail, cuticle, and professional salon families.",
    verbs: ["Shape", "Refine", "Detail"],
    tone: "coral"
  }
] as const;

const functions = [
  { index: "01", name: "Cut", note: "Scissors and cutting families", query: "cut" },
  { index: "02", name: "Hold", note: "Forceps, clamps, and holders", query: "hold" },
  { index: "03", name: "Retract", note: "Retraction families", query: "retract" },
  { index: "04", name: "Suture", note: "Needle-holding families", query: "suture" },
  { index: "05", name: "Examine", note: "Diagnostic families", query: "examine" },
  { index: "06", name: "Extract", note: "Dental extraction families", query: "extract" }
] as const;

const families = [
  { index: "01", name: "Scissors", route: "/products/surgical/scissors", division: "Surgical", function: "Cut" },
  { index: "02", name: "Forceps & Clamps", route: "/products/surgical/forceps-clamps", division: "Surgical", function: "Hold" },
  { index: "03", name: "Needle Holders", route: "/products/surgical/needle-holders", division: "Surgical", function: "Suture" },
  { index: "04", name: "Dental Extraction", route: "/products/dental/extraction", division: "Dental", function: "Extract" },
  { index: "05", name: "Periodontal", route: "/products/dental/periodontal", division: "Dental", function: "Examine" },
  { index: "06", name: "Hoof & Farrier", route: "/products/veterinary/hoof-farrier", division: "Veterinary", function: "Treat" },
  { index: "07", name: "Hair Scissors", route: "/products/beauty/hair-scissors", division: "Beauty", function: "Shape" },
  { index: "08", name: "Nail & Cuticle", route: "/products/beauty/nail-cuticle", division: "Beauty", function: "Refine" }
] as const;

export function DiscoveryExperience() {
  const [activeDivision, setActiveDivision] = useState(0);
  const active = divisions[activeDivision];

  return <>
    <section
      className="division-discovery v3-division-index v3-surface"
      aria-labelledby="division-title"
      data-active-tone={active.tone}
      data-active-index={activeDivision}
    >
      <div className="container v3-division-shell">
        <header className="v3-chapter-heading">
          <SectionIndex>01 · Precision index</SectionIndex>
          <div>
            <h2 id="division-title">Four fields.<br /><span>One catalogue language.</span></h2>
            <p>Move through the divisions without losing the shared product-code, search, and inquiry structure.</p>
          </div>
        </header>

        <div className="v3-division-layout">
          <GlassPanel variant="optical" className="v3-division-active" aria-live="polite">
            <div className="v3-division-stage-index">
              <TechnicalReadout label="Active division" value={`${active.index} / 04`} />
              <TechnicalReadout label="Primary route" value={`/products/${active.slug}`} />
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
              <Link href={`/products/${active.slug}`}>Open {active.name} catalogue <span aria-hidden="true">↗</span></Link>
            </div>
          </GlassPanel>

          <nav className="v3-division-rail" aria-label="Product divisions">
            {divisions.map((division, index) => <Link
              className="v3-division-option"
              href={`/products/${division.slug}`}
              key={division.slug}
              data-tone={division.tone}
              data-active={activeDivision === index}
              aria-current={activeDivision === index ? "page" : undefined}
              onPointerEnter={() => setActiveDivision(index)}
              onFocus={() => setActiveDivision(index)}
            >
              <span>{division.index}</span>
              <strong>{division.name}</strong>
              <small>{division.verbs.join(" · ")}</small>
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
            <p>Every function opens a real catalogue search rather than a decorative category.</p>
          </div>
        </header>

        <nav className="v3-function-list" aria-label="Browse instruments by working function">
          {functions.map(item => <Link href={`/search?q=${item.query}`} key={item.query}>
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
            <p>Eight direct routes, presented in normal document flow without an artificial horizontal scroll runway.</p>
          </div>
        </header>

        <div className="v3-family-layout">
          <aside className="v3-family-note">
            <p>Catalogue structure</p>
            <strong>Division → family → product → inquiry</strong>
            <small>Every family remains keyboard accessible and directly linkable.</small>
          </aside>

          <nav className="v3-family-shelves" aria-label="Instrument families">
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
                <span>{family.function}</span>
                <h3>{family.name}</h3>
                <b>Open family <span aria-hidden="true">↗</span></b>
              </footer>
            </Link>)}
          </nav>
        </div>
      </div>
    </section>
  </>;
}
