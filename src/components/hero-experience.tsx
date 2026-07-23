"use client";

import { animate, createScope, createTimeline, onScroll, stagger, svg } from "animejs";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { InstrumentVisual } from "@/components/instrument-visual";

const initialStyle = {
  "--hero-x": "72%",
  "--hero-y": "42%",
  "--hero-progress": "0"
} as CSSProperties;

export function HeroExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const readyFrame = window.requestAnimationFrame(() => setReady(true));
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateProgress = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const distance = Math.max(section.offsetHeight * 0.82, 1);
      const progress = Math.min(1, Math.max(0, -rect.top / distance));
      section.style.setProperty("--hero-progress", media.matches ? "0" : progress.toFixed(4));
      frameRef.current = null;
    };

    const onNativeScroll = () => {
      if (frameRef.current === null) frameRef.current = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    window.addEventListener("resize", onNativeScroll);

    return () => {
      window.cancelAnimationFrame(readyFrame);
      window.removeEventListener("scroll", onNativeScroll);
      window.removeEventListener("resize", onNativeScroll);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.matchMedia("(max-width: 900px)").matches;
    if (reduced) {
      section.dataset.specialMotion = "reduced";
      return;
    }

    const scope = createScope({ root: sectionRef }).add(() => {
      const upperHalf = section.querySelector<SVGGElement>(".instrument-half-upper");
      const lowerHalf = section.querySelector<SVGGElement>(".instrument-half-lower");
      const assembly = section.querySelector<SVGGElement>(".instrument-assembly");
      const pivotCalibration = section.querySelector<SVGCircleElement>(".pivot-calibration");
      const sweep = section.querySelector<SVGGElement>(".instrument-steel-sweep");
      const sweepBand = section.querySelector<SVGRectElement>(".steel-sweep-band");
      const labels = Array.from(section.querySelectorAll<SVGGElement>(".connector-label"));
      const code = section.querySelector<HTMLElement>(".visual-code > span");
      const codeScan = section.querySelector<HTMLElement>(".visual-code > i");
      const geometry = Array.from(section.querySelectorAll<SVGGeometryElement>(".instrument-drawable"));
      const drawables = geometry.flatMap(element => svg.createDrawable(element));

      if (upperHalf && lowerHalf) {
        const openAngle = narrow ? 2.4 : 4.2;
        animate(upperHalf, {
          rotate: -openAngle,
          ease: "linear",
          autoplay: onScroll({
            target: section,
            enter: "top top",
            leave: "bottom top",
            sync: narrow ? 0.42 : 0.3
          })
        });
        animate(lowerHalf, {
          rotate: openAngle,
          ease: "linear",
          autoplay: onScroll({
            target: section,
            enter: "top top",
            leave: "bottom top",
            sync: narrow ? 0.42 : 0.3
          })
        });
      }

      const calibration = createTimeline({ defaults: { ease: "out(5)" } });
      if (assembly) calibration.add(assembly, {
        scale: { from: narrow ? 0.992 : 0.978 },
        rotate: { from: narrow ? 0.25 : 0.7 },
        duration: narrow ? 720 : 940
      }, 90);
      if (drawables.length) calibration.add(drawables, {
        draw: ["0 0", "0 1"],
        delay: stagger(narrow ? 14 : 22),
        duration: narrow ? 620 : 880,
        ease: "inOutSine"
      }, 220);
      if (pivotCalibration) calibration.add(pivotCalibration, {
        rotate: { from: -28, to: 34 },
        opacity: { from: 0, to: 0.62 },
        duration: 760
      }, 300);
      if (labels.length) calibration.add(labels, {
        opacity: { from: 0 },
        x: { from: narrow ? 4 : 9 },
        delay: stagger(70),
        duration: 420
      }, 820);
      if (code) calibration.add(code, {
        clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
        opacity: { from: 0.3 },
        duration: 680,
        ease: "inOutSine"
      }, 700);
      if (codeScan) calibration.add(codeScan, {
        scaleX: { from: 0, to: 1 },
        transformOrigin: "left center",
        duration: 460,
        ease: "inOutSine"
      }, 700).add(codeScan, {
        x: { from: "0%", to: "112%" },
        opacity: { from: 0.8, to: 0 },
        duration: 520,
        ease: "inOutSine"
      }, 1040);
      if (sweep && sweepBand) calibration.add(sweep, {
        opacity: [0, 0.82, 0],
        duration: 980,
        ease: "inOutSine"
      }, 420).add(sweepBand, {
        x: { from: 0, to: 1550 },
        duration: 980,
        ease: "inOutSine"
      }, 420);

      section.dataset.specialMotion = "ready";
    });

    return () => {
      scope.revert();
      delete section.dataset.specialMotion;
    };
  }, []);

  const updateInspection = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    section.style.setProperty("--hero-x", `${Math.min(100, Math.max(0, x)).toFixed(2)}%`);
    section.style.setProperty("--hero-y", `${Math.min(100, Math.max(0, y)).toFixed(2)}%`);
    section.dataset.inspecting = "true";
  };

  const resetInspection = () => {
    const section = sectionRef.current;
    if (!section) return;
    section.style.setProperty("--hero-x", "72%");
    section.style.setProperty("--hero-y", "42%");
    delete section.dataset.inspecting;
  };

  return <section
    ref={sectionRef}
    className={`v2-hero hero-experience${ready ? " is-ready" : ""}`}
    aria-labelledby="hero-title"
    style={initialStyle}
    onPointerMove={updateInspection}
    onPointerLeave={resetInspection}
  >
    <div className="hero-inspection-light" aria-hidden="true" />
    <div className="hero-index" aria-hidden="true"><span>THROHI / MEDICAL TOOLS</span><span>PRECISION OBJECTS / CATALOGUE / INQUIRY</span></div>
    <h1 className="hero-type" id="hero-title"><span>PRECISION,</span><span>BROUGHT</span><span className="accent-green">ALIVE.</span></h1>
    <div className="hero-object">
      <InstrumentVisual label="Temporary surgical scissors silhouette for the V2 homepage hero" />
      <div className="hero-marker-set" aria-hidden="true"><span className="hero-marker marker-one">01 · EDGE</span><span className="hero-marker marker-two">02 · PIVOT</span><span className="hero-marker marker-three">03 · GRIP</span></div>
    </div>
    <div className="hero-statement"><p>Not a marketplace. Not a generic supplier template.</p><p>A visual catalogue for surgical, dental, veterinary, and beauty instruments.</p></div>
    <form className="hero-search" action="/search" method="get">
      <label htmlFor="hero-query"><span>SEARCH THE CATALOGUE</span><small>NAME · FAMILY · EXACT OR PARTIAL CODE</small></label>
      <div><input id="hero-query" name="q" type="search" placeholder="THR-SC-001" autoComplete="off" /><button type="submit">Search <span aria-hidden="true">↗</span></button></div>
    </form>
    <div className="hero-scroll-note" aria-hidden="true"><span>SCROLL TO EXAMINE</span><b>↓</b></div>
  </section>;
}
