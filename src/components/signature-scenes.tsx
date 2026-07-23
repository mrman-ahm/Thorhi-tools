"use client";

import Link from "next/link";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useRef, useState } from "react";
import { InstrumentVisual } from "@/components/instrument-visual";

const inspectionRegions = [
  { index: "01", name: "Working end", note: "Generic examination region. Final annotation requires an approved product image." },
  { index: "02", name: "Joint", note: "The central mechanical region is highlighted without implying an unverified specification." },
  { index: "03", name: "Handle", note: "A replaceable interaction target for the grip and handling area." }
] as const;

const evolutionChapters = [
  { index: "01", era: "Origin", title: "The cutting form", tone: "amber", text: "A visual reconstruction placeholder for the opening chapter. No image or historical claim is treated as approved evidence." },
  { index: "02", era: "Mechanism", title: "The pivot", tone: "blue", text: "The visual emphasis moves toward the axis where two controlled edges become one mechanical object." },
  { index: "03", era: "Specialization", title: "The profile divides", tone: "green", text: "Working ends, curves, and proportions separate into distinct visual families without presenting unsupported product facts." },
  { index: "04", era: "Precision", title: "The object today", tone: "mint", text: "A contemporary silhouette closes the sequence. Approved photography or reconstruction can replace every layer later." }
] as const;

function ScissorsPlaceholder({ tone, compact = false }: { tone: string; compact?: boolean }) {
  return <div className={`scene-scissors ${tone}${compact ? " compact" : ""}`} role="img" aria-label={`${tone} surgical scissors reconstruction placeholder`}>
    <span className="scene-blade blade-one" />
    <span className="scene-blade blade-two" />
    <span className="scene-ring ring-one" />
    <span className="scene-ring ring-two" />
    <span className="scene-pivot" />
    <span className="scene-axis horizontal" />
    <span className="scene-axis vertical" />
  </div>;
}

export function MacroInspectionScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeRegion, setActiveRegion] = useState(1);

  const inspect = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    const section = sectionRef.current;
    if (!section) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((event.clientY - rect.top) / rect.height) * 100));
    section.style.setProperty("--inspection-x", `${x.toFixed(2)}%`);
    section.style.setProperty("--inspection-y", `${y.toFixed(2)}%`);
    section.dataset.inspecting = "true";

    if (x > 58) setActiveRegion(0);
    else if (x > 32) setActiveRegion(1);
    else setActiveRegion(2);
  };

  const stopInspecting = () => {
    if (!sectionRef.current) return;
    delete sectionRef.current.dataset.inspecting;
  };

  const selectRegion = (index: number) => {
    setActiveRegion(index);
    const positions = [[76, 25], [50, 51], [20, 72]] as const;
    sectionRef.current?.style.setProperty("--inspection-x", `${positions[index][0]}%`);
    sectionRef.current?.style.setProperty("--inspection-y", `${positions[index][1]}%`);
  };

  return <section
    ref={sectionRef}
    className="macro-stage macro-inspection-scene"
    aria-labelledby="macro-title"
    data-active-region={activeRegion}
    style={{ "--inspection-x": "50%", "--inspection-y": "51%" } as CSSProperties}
  >
    <div className="container macro-grid">
      <div className="macro-object inspection-canvas" onPointerMove={inspect} onPointerLeave={stopInspecting}>
        <InstrumentVisual variant="macro" label="Temporary macro instrument study with selectable generic examination regions" />
        <div className="inspection-lens" aria-hidden="true"><span /></div>
        <div className="inspection-reticle" aria-hidden="true"><span /><span /></div>
      </div>
      <div className="macro-copy">
        <p className="eyebrow">04 · UNDER EXAMINATION</p>
        <h2 id="macro-title">Precision becomes visible at the edge.</h2>
        <p>Move across the object or select a region. Every label is intentionally generic until approved product photography and factual annotations are available.</p>
        <div className="inspection-controls" role="group" aria-label="Select an instrument examination region">
          {inspectionRegions.map((region, index) => <button
            key={region.index}
            type="button"
            aria-pressed={activeRegion === index}
            onClick={() => selectRegion(index)}
            onFocus={() => selectRegion(index)}
          ><span>{region.index}</span><strong>{region.name}</strong></button>)}
        </div>
        <div className="inspection-readout" aria-live="polite">
          <span>{inspectionRegions[activeRegion].index} / ACTIVE REGION</span>
          <h3>{inspectionRegions[activeRegion].name}</h3>
          <p>{inspectionRegions[activeRegion].note}</p>
        </div>
      </div>
    </div>
  </section>;
}

export function ScissorsEvolutionScene() {
  return <section
    className="evolution-stage evolution-experience evolution-experience-static"
    aria-labelledby="evolution-title"
  >
    <header className="container evolution-heading">
      <p className="eyebrow">05 · PRECISION THROUGH TIME</p>
      <h2 id="evolution-title">One form.<br />Four visual chapters.</h2>
      <p>The sequence is a designed reconstruction framework, not a claim that temporary imagery is archival evidence.</p>
    </header>

    <div className="container evolution-static-grid">
      {evolutionChapters.map(chapter => <article
        className={`evolution-chapter evolution-static-card ${chapter.tone}`}
        data-chapter-index={Number(chapter.index) - 1}
        key={chapter.index}
      >
        <div className={`evolution-static-visual tone-${chapter.tone}`}>
          <ScissorsPlaceholder tone={chapter.tone} />
          <span>VISUAL RECONSTRUCTION PLACEHOLDER</span>
        </div>
        <div className="evolution-static-copy">
          <span>{chapter.index} · {chapter.era.toUpperCase()}</span>
          <h3>{chapter.title}</h3>
          <p>{chapter.text}</p>
        </div>
      </article>)}
    </div>

    <div className="container evolution-link"><Link href="/precision-through-time">Open the editorial history route <span aria-hidden="true">↗</span></Link></div>
  </section>;
}
