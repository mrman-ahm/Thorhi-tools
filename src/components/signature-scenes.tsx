"use client";

import { animate, createScope, createTimeline, stagger, svg } from "animejs";
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
  { index: "01", era: "Origin", title: "The cutting form", tone: "amber", text: "A visual reconstruction placeholder for the opening chapter. No image or historical claim is treated as approved evidence.", bladeOne: -19, bladeTwo: 17, rotation: -12, scaleX: .9 },
  { index: "02", era: "Mechanism", title: "The pivot", tone: "blue", text: "The visual emphasis moves toward the axis where two controlled edges become one mechanical object.", bladeOne: -27, bladeTwo: 25, rotation: -9, scaleX: .96 },
  { index: "03", era: "Specialization", title: "The profile divides", tone: "green", text: "Working ends, curves, and proportions separate into distinct visual families without presenting unsupported product facts.", bladeOne: -38, bladeTwo: 34, rotation: -7, scaleX: 1.04 },
  { index: "04", era: "Precision", title: "The object today", tone: "mint", text: "A contemporary silhouette closes the sequence. Approved photography or reconstruction can replace every layer later.", bladeOne: -32, bladeTwo: 29, rotation: -8, scaleX: 1 }
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

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      section.dataset.specialMotion = "reduced";
      return;
    }

    const scope = createScope({ root: sectionRef }).add(() => {
      const activePath = section.querySelector<SVGPathElement>(`.macro-connector-path[data-region="${activeRegion}"]`);
      const readout = Array.from(section.querySelectorAll<HTMLElement>(".inspection-readout > *"));
      const reticle = section.querySelector<HTMLElement>(".inspection-reticle");
      const lens = section.querySelector<HTMLElement>(".inspection-lens");
      const sweep = section.querySelector<SVGGElement>(".instrument-steel-sweep");
      const sweepBand = section.querySelector<SVGRectElement>(".steel-sweep-band");
      const timeline = createTimeline({ defaults: { ease: "out(4)" } });

      section.querySelectorAll<SVGPathElement>(".macro-connector-path").forEach(path => {
        path.dataset.active = path === activePath ? "true" : "false";
      });

      if (activePath) {
        const [drawable] = svg.createDrawable(activePath);
        timeline.add(drawable, { draw: ["0 0", "0 1"], duration: 440, ease: "inOutSine" }, 0);
      }
      if (reticle) timeline.add(reticle, { rotate: { from: -8, to: 0 }, scale: { from: .82, to: 1 }, duration: 380 }, 40);
      if (lens) timeline.add(lens, { opacity: { from: .55, to: .9 }, duration: 340 }, 40);
      if (readout.length) timeline.add(readout, {
        x: { from: 14 },
        clipPath: ["inset(0 0 0 12%)", "inset(0 0 0 0%)"],
        delay: stagger(35),
        duration: 420
      }, 310);
      if (sweep && sweepBand) timeline.add(sweep, { opacity: [0, .48, 0], duration: 720, ease: "inOutSine" }, 120)
        .add(sweepBand, { x: { from: -260, to: 1180 }, duration: 720, ease: "inOutSine" }, 120);

      section.dataset.specialMotion = "ready";
    });

    return () => scope.revert();
  }, [activeRegion]);

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
        <svg className="macro-annotation-connectors" viewBox="0 0 1000 820" aria-hidden="true" focusable="false">
          <path className="macro-connector-path" data-region="0" d="M755 206 C830 185 886 178 964 188" />
          <path className="macro-connector-path" data-region="1" d="M500 420 C640 398 770 420 964 420" />
          <path className="macro-connector-path" data-region="2" d="M205 602 C390 650 650 628 964 640" />
        </svg>
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

    const onNativeScroll = () => {
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
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    window.addEventListener("resize", onNativeScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onNativeScroll);
      window.removeEventListener("resize", onNativeScroll);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 900px)").matches;
    if (reduced || mobile) {
      section.dataset.specialMotion = reduced ? "reduced" : "mobile-static";
      return;
    }

    const chapter = evolutionChapters[activeChapter];
    const scope = createScope({ root: sectionRef }).add(() => {
      const scissors = section.querySelector<HTMLElement>(".evolution-visual-stage .scene-scissors");
      const bladeOne = section.querySelector<HTMLElement>(".evolution-visual-stage .blade-one");
      const bladeTwo = section.querySelector<HTMLElement>(".evolution-visual-stage .blade-two");
      const rings = Array.from(section.querySelectorAll<HTMLElement>(".evolution-visual-stage .scene-ring"));
      const axes = Array.from(section.querySelectorAll<HTMLElement>(".evolution-visual-stage .scene-axis"));
      const pivot = section.querySelector<HTMLElement>(".evolution-visual-stage .scene-pivot");
      const stageIndex = Array.from(section.querySelectorAll<HTMLElement>(".evolution-stage-index > *"));
      const label = section.querySelector<HTMLElement>(".reconstruction-label");
      const timeline = createTimeline({ defaults: { ease: "out(5)" } });

      if (scissors) timeline.add(scissors, {
        rotate: chapter.rotation,
        scaleX: chapter.scaleX,
        scaleY: { from: .985, to: 1 },
        duration: 720
      }, 0);
      if (bladeOne) timeline.add(bladeOne, { rotate: chapter.bladeOne, duration: 680 }, 20);
      if (bladeTwo) timeline.add(bladeTwo, { rotate: chapter.bladeTwo, duration: 680 }, 20);
      if (rings.length) timeline.add(rings, {
        x: { from: activeChapter % 2 === 0 ? -8 : 8, to: 0 },
        scale: { from: .98, to: 1 },
        delay: stagger(45),
        duration: 520
      }, 90);
      if (pivot) timeline.add(pivot, {
        scale: [{ to: 1.12, duration: 220 }, { to: 1, duration: 300 }],
        rotate: { from: -18, to: 0 },
        duration: 520
      }, 120);
      if (axes.length) timeline.add(axes, {
        scaleX: { from: 0, to: 1 },
        scaleY: { from: 0, to: 1 },
        delay: stagger(35),
        duration: 420
      }, 120);
      if (stageIndex.length) timeline.add(stageIndex, { y: { from: 10 }, delay: stagger(35), duration: 360 }, 160);
      if (label) timeline.add(label, { clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"], duration: 460, ease: "inOutSine" }, 260);

      section.dataset.specialMotion = "ready";
    });

    return () => scope.revert();
  }, [activeChapter]);

  const active = evolutionChapters[activeChapter];

  return <section
    ref={sectionRef}
    className={`evolution-stage evolution-experience tone-${active.tone}`}
    aria-labelledby="evolution-title"
    data-active-chapter={activeChapter}
    style={{ "--evolution-progress": "0" } as CSSProperties}
  >
    <header className="container evolution-heading">
      <p className="eyebrow">05 · PRECISION THROUGH TIME</p>
      <h2 id="evolution-title">One form.<br />Four visual chapters.</h2>
      <p>The sequence is a designed reconstruction framework, not a claim that temporary imagery is archival evidence.</p>
    </header>

    <div className="container evolution-experience-grid">
      <div className="evolution-visual-stage" aria-hidden="true">
        <div className="evolution-stage-index"><span>{active.index}</span><small>{active.era}</small></div>
        <div className="evolution-layers"><div className={`evolution-layer ${active.tone}`} data-active="true"><ScissorsPlaceholder tone={active.tone} /><span className="reconstruction-label">VISUAL RECONSTRUCTION PLACEHOLDER</span></div></div>
        <div className="evolution-meter"><span style={{ transform: `scaleX(${(activeChapter + 1) / evolutionChapters.length})` }} /></div>
      </div>

      <div className="evolution-chapters">{evolutionChapters.map((chapter, index) => <article
        ref={element => { chapterRefs.current[index] = element; }}
        className={`evolution-chapter ${chapter.tone}`}
        data-chapter-index={index}
        data-active={activeChapter === index}
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

    <div className="container evolution-link"><Link href="/precision-through-time">Open the editorial history route <span aria-hidden="true">↗</span></Link></div>
  </section>;
}
