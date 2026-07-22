"use client";

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

    const onScroll = () => {
      if (frameRef.current === null) frameRef.current = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.cancelAnimationFrame(readyFrame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
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
