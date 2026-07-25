"use client";

import { createScope, createTimeline, stagger } from "animejs";
import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import {
  GlassPanel,
  SurgicalLink,
  TechnicalReadout
} from "@/components/v3/optical-primitives";

const initialStyle = { "--hero-progress": "0" } as CSSProperties;

export function HeroExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const readyFrame = window.requestAnimationFrame(() => setReady(true));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      const rect = section.getBoundingClientRect();
      const distance = Math.max(section.offsetHeight * 0.82, 1);
      const progress = reduced.matches ? 0 : Math.min(1, Math.max(0, -rect.top / distance));
      section.style.setProperty("--hero-progress", progress.toFixed(4));
      frameRef.current = null;
    };

    const requestUpdate = () => {
      if (frameRef.current === null) frameRef.current = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    reduced.addEventListener("change", requestUpdate);

    const scope = reduced.matches ? null : createScope({ root: sectionRef }).add(() => {
      const mark = section.querySelector<HTMLElement>(".hero-brand-mark");
      const rings = Array.from(section.querySelectorAll<HTMLElement>(".hero-brand-orbit"));
      const labels = Array.from(section.querySelectorAll<HTMLElement>(".hero-brand-meta > *"));
      const timeline = createTimeline({ defaults: { ease: "out(5)" } });
      if (mark) timeline.add(mark, { scale: { from: .965 }, rotate: { from: -1.2 }, opacity: { from: 0 }, duration: 900 }, 120);
      if (rings.length) timeline.add(rings, { scale: { from: .82 }, opacity: { from: 0 }, delay: stagger(90), duration: 720 }, 220);
      if (labels.length) timeline.add(labels, { x: { from: 10 }, opacity: { from: 0 }, delay: stagger(60), duration: 460 }, 540);
      section.dataset.specialMotion = "identity-ready";
    });

    return () => {
      window.cancelAnimationFrame(readyFrame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      reduced.removeEventListener("change", requestUpdate);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      scope?.revert();
      delete section.dataset.specialMotion;
    };
  }, []);

  return <section
    ref={sectionRef}
    id="home-hero"
    className={`v2-hero hero-experience hero-brand-handoff v3-hero v3-surface${ready ? " is-ready" : ""}`}
    aria-labelledby="hero-title"
    style={initialStyle}
  >
    <div className="hero-inspection-light" aria-hidden="true" />
    <div className="hero-index" aria-hidden="true">
      <span>THROHI / MEDICAL TOOLS</span>
      <span>CATALOGUE · PRODUCT CODE · STRUCTURED INQUIRY</span>
    </div>

    <div className="v3-hero-copy">
      <p className="v3-eyebrow">Surgical editorial catalogue</p>
      <h1 className="hero-type" id="hero-title">
        <span>Precision that</span>
        <span>begins with</span>
        <span className="accent-green">the instrument.</span>
      </h1>
      <div className="hero-statement v3-body-copy">
        <p>Search by name, family, or catalogue code.</p>
        <p>Explore surgical, dental, veterinary, and beauty instruments, then collect the exact items into one structured inquiry.</p>
      </div>
      <div className="v3-hero-actions">
        <SurgicalLink href="/products" variant="primary">Explore catalogue <span aria-hidden="true">↗</span></SurgicalLink>
        <SurgicalLink href="/inquiry" variant="quiet">Build an inquiry</SurgicalLink>
      </div>
    </div>

    <div className="hero-object hero-brand-object">
      <GlassPanel variant="optical" className="hero-brand-stage" role="img" aria-label="THROHI Medical Tools identity mark">
        <span className="hero-brand-orbit orbit-one" aria-hidden="true" />
        <span className="hero-brand-orbit orbit-two" aria-hidden="true" />
        <span className="hero-brand-axis axis-horizontal" aria-hidden="true" />
        <span className="hero-brand-axis axis-vertical" aria-hidden="true" />
        <div className="hero-brand-mark"><Image src="/brand/throhi-logo-clean.webp" alt="THROHI Medical Tools" width={900} height={671} priority /></div>
        <div className="hero-brand-meta" aria-hidden="true">
          <span>SURGICAL · DENTAL</span>
          <span>VETERINARY · BEAUTY</span>
          <span>SEARCH · SAVE · INQUIRE</span>
        </div>
        <div className="v3-hero-readouts" aria-hidden="true">
          <TechnicalReadout label="System" value="Optical precision" />
          <TechnicalReadout label="Entry" value="Catalogue code" />
        </div>
      </GlassPanel>
    </div>

    <form className="hero-search v3-machined" data-state="inset" action="/search" method="get">
      <label htmlFor="hero-query">
        <span>Catalogue command</span>
        <small>Name · family · exact or partial code</small>
      </label>
      <div>
        <input id="hero-query" name="q" type="search" placeholder="Search an instrument" autoComplete="off" />
        <button type="submit">Search <span aria-hidden="true">↗</span></button>
      </div>
    </form>

    <div className="hero-scroll-note" aria-hidden="true"><span>CONTINUE TO THE PRECISION INDEX</span><b>↓</b></div>
  </section>;
}
