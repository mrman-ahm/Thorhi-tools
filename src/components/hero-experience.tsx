"use client";

import { createScope, createTimeline, stagger } from "animejs";
import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

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
    const section = sectionRef.current;
    if (!section) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const readyFrame = window.requestAnimationFrame(() => setReady(true));

    const updateProgress = () => {
      const rect = section.getBoundingClientRect();
      const distance = Math.max(section.offsetHeight * 0.82, 1);
      const progress = reduced.matches ? 0 : Math.min(1, Math.max(0, -rect.top / distance));
      section.style.setProperty("--hero-progress", progress.toFixed(4));
      frameRef.current = null;
    };

    const requestUpdate = () => {
      if (frameRef.current === null) frameRef.current = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    reduced.addEventListener("change", requestUpdate);

    return () => {
      window.cancelAnimationFrame(readyFrame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      reduced.removeEventListener("change", requestUpdate);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      section.dataset.specialMotion = "reduced";
      return;
    }

    const scope = createScope({ root: sectionRef }).add(() => {
      const marks = Array.from(section.querySelectorAll<HTMLElement>(".hero-brand-registration > *"));
      const logo = section.querySelector<HTMLElement>(".hero-brand-logo");
      const words = Array.from(section.querySelectorAll<HTMLElement>(".hero-brand-name > *"));
      const rule = section.querySelector<HTMLElement>(".hero-brand-rule i");
      const timeline = createTimeline({ defaults: { ease: "out(5)" } });

      if (marks.length) timeline.add(marks, {
        opacity: { from: 0 },
        x: { from: 10 },
        delay: stagger(50),
        duration: 420
      }, 100);
      if (logo) timeline.add(logo, {
        opacity: { from: 0 },
        scale: { from: .965 },
        rotate: { from: -.5 },
        duration: 720
      }, 160);
      if (words.length) timeline.add(words, {
        opacity: { from: 0 },
        y: { from: 18 },
        delay: stagger(75),
        duration: 560
      }, 260);
      if (rule) timeline.add(rule, {
        scaleX: { from: 0, to: 1 },
        transformOrigin: "left center",
        duration: 620,
        ease: "inOutSine"
      }, 460);

      section.dataset.specialMotion = "ready";
    });

    return () => {
      scope.revert();
      delete section.dataset.specialMotion;
    };
  }, []);

  return <section
    ref={sectionRef}
    className={`v2-hero hero-experience hero-brand-experience${ready ? " is-ready" : ""}`}
    aria-labelledby="hero-title"
    style={initialStyle}
  >
    <div className="hero-inspection-light" aria-hidden="true" />
    <div className="hero-index" aria-hidden="true"><span>THROHI / MEDICAL TOOLS</span><span>PRECISION OBJECTS / CATALOGUE / INQUIRY</span></div>
    <h1 className="hero-type" id="hero-title"><span>PRECISION,</span><span>BROUGHT</span><span className="accent-green">ALIVE.</span></h1>

    <div className="hero-object hero-brand-stage" role="img" aria-label="THROHI Medical Tools brand mark">
      <div className="hero-brand-registration" aria-hidden="true"><span>ESTABLISHED IDENTITY</span><span>TM / 01</span></div>
      <div className="hero-brand-logo"><Image src="/logo.webp" alt="" width={322} height={242} priority /></div>
      <div className="hero-brand-name" aria-hidden="true"><strong>THROHI</strong><span>MEDICAL TOOLS</span></div>
      <div className="hero-brand-rule" aria-hidden="true"><i /><span>SURGICAL · DENTAL · VETERINARY · BEAUTY</span></div>
    </div>

    <div className="hero-statement"><p>Not a marketplace. Not a generic supplier template.</p><p>A visual catalogue for surgical, dental, veterinary, and beauty instruments.</p></div>
    <form className="hero-search" action="/search" method="get">
      <label htmlFor="hero-query"><span>SEARCH THE CATALOGUE</span><small>NAME · FAMILY · EXACT OR PARTIAL CODE</small></label>
      <div><input id="hero-query" name="q" type="search" placeholder="THR-SC-001" autoComplete="off" /><button type="submit">Search <span aria-hidden="true">↗</span></button></div>
    </form>
    <div className="hero-scroll-note" aria-hidden="true"><span>SCROLL TO EXAMINE</span><b>↓</b></div>
  </section>;
}
