"use client";

import Link from "next/link";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
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
    data-motion-zone="macro-inspection"
    data-motion-policy="anime"
    style={{ "--inspection-x": "50%", "--inspection-y": "51%" } as CSSProperties}
  >
    <div className="container macro-grid">
      <div className="macro-object inspection-canvas" onPointerMove={inspect} onPointerLeave={stopInspecting} data-motion-item="instrument" data-motion-static="pointer-surface">
        <InstrumentVisual variant="macro" label="Temporary macro instrument study with selectable generic examination regions" />
        <div className="inspection-lens" aria-hidden="true"><span /></div>
        <div className="inspection-reticle" aria-hidden="true"><span /><span /></div>
      </div>
      <div className="macro-copy" data-motion-item="copy">
        <p className="eyebrow">04 · UNDER EXAMINATION</p>
        <h2 id="macro-title">Precision becomes visible at the edge.</h2>
        <p>Move across the object or select a region. Every label is intentionally generic until approved product photography and factual annotations are available.</p>
        <div className="inspection-controls" role="group" aria-label="Select an instrument examination region" data-motion-static="interactive-control">
          {inspectionRegions.map((region, index) => <button
            key={region.index}
            type="button"
            aria-pressed={activeRegion === index}
            onClick={() => selectRegion(index)}
            onFocus={() => selectRegion(index)}
          ><span>{region.index}</span><strong>{region.name}</strong></button>)}
        </div>
        <div className="inspection-readout" aria-live="polite" data-motion-static="live-region">
          <span>{inspectionRegions[activeRegion].index} / ACTIVE REGION</span>
          <h3>{inspectionRegions[activeRegion].name}</h3>
          <p>{inspectionRegions[activeRegion].note}</p>
        </div>
      </div>
    </div>
  </section>;
}

export function ScissorsEvolutionScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const chapterRefs = useRef<Array<HTMLElement | null>>([]);
  const frameRef = useRef<number | null>(null);
  const [activeChapter, setActiveChapter] = useState(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 900px)");

    const updateProgress = () => {
      const section = sectionRef.current;
      if (!section || reducedMotion.matches || mobile.matches) {
        section?.style.setProperty("--evolution-progress", "0");
        frameRef.current = null;
        return;
      }
      const rect = section.getBoundingClientRect();
      const distance = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, -rect.top / distance));
      section.style.setProperty("--evolution-progress", progress.toFixed(4));
      frameRef.current = null;
    };

    const onScroll = () => {
      if (frameRef.current === null) frameRef.current = window.requestAnimationFrame(updateProgress);
    };

    const observer = new IntersectionObserver(entries => {
      if (reducedMotion.matches || mobile.matches) return;
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const index = Number((visible.target as HTMLElement).dataset.chapterIndex ?? 0);
      setActiveChapter(index);
    }, { rootMargin: "-30% 0px -35%", threshold: [0.1, 0.35, 0.6] });

    chapterRefs.current.forEach(element => element && observer.observe(element));
    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return <section
    ref={sectionRef}
    className={`evolution-stage evolution-experience tone-${evolutionChapters[activeChapter].tone}`}
    aria-labelledby="evolution-title"
    data-active-chapter={activeChapter}
    data-motion-zone="scissors-evolution"
    data-motion-policy="anime"
    style={{ "--evolution-progress": "0" } as CSSProperties}
  >
    <header className="container evolution-heading" data-motion-item="intro">
      <p className="eyebrow">05 · PRECISION THROUGH TIME</p>
      <h2 id="evolution-title">One form.<br />Four visual chapters.</h2>
      <p>The sequence is a designed reconstruction framework, not a claim that temporary imagery is archival evidence.</p>
    </header>

    <div className="container evolution-experience-grid">
      <div className="evolution-visual-stage" aria-hidden="true" data-motion-item="stage">
        <div className="evolution-stage-index"><span>{evolutionChapters[activeChapter].index}</span><small>{evolutionChapters[activeChapter].era}</small></div>
        <div className="evolution-layers">{evolutionChapters.map((chapter, index) => <div className={`evolution-layer ${chapter.tone}`} data-active={activeChapter === index} key={chapter.index}><ScissorsPlaceholder tone={chapter.tone} /><span className="reconstruction-label">VISUAL RECONSTRUCTION PLACEHOLDER</span></div>)}</div>
        <div className="evolution-meter" data-motion-static="progress"><span style={{ transform: `scaleX(${(activeChapter + 1) / evolutionChapters.length})` }} /></div>
      </div>

      <div className="evolution-chapters" data-motion-group="chapters">{evolutionChapters.map((chapter, index) => <article
        ref={element => { chapterRefs.current[index] = element; }}
        className={`evolution-chapter ${chapter.tone}`}
        data-chapter-index={index}
        data-active={activeChapter === index}
        data-motion-item="chapter"
        key={chapter.index}
        tabIndex={0}
        onFocus={() => setActiveChapter(index)}
        onPointerEnter={() => setActiveChapter(index)}
      >
        <div className="evolution-mobile-visual"><ScissorsPlaceholder tone={chapter.tone} compact /><span>RECONSTRUCTION PLACEHOLDER</span></div>
        <span>{chapter.index} · {chapter.era.toUpperCase()}</span>
        <h3>{chapter.title}</h3>
        <p>{chapter.text}</p>
      </article>)}</div>
    </div>

    <div className="container evolution-link" data-motion-item="link"><Link href="/precision-through-time">Open the editorial history route <span aria-hidden="true">↗</span></Link></div>
  </section>;
}
