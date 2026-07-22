"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const divisions = [
  { index: "01", name: "Surgical", slug: "surgical", description: "Cutting, holding, clamping, retracting, and suturing families.", verbs: ["CUT", "HOLD", "CLAMP"], tone: "green" },
  { index: "02", name: "Dental", slug: "dental", description: "Diagnostic, extraction, periodontal, and restorative families.", verbs: ["EXAMINE", "EXTRACT", "RESTORE"], tone: "blue" },
  { index: "03", name: "Veterinary", slug: "veterinary", description: "General, equine, hoof, obstetrical, and specialist families.", verbs: ["TREAT", "HOLD", "SUPPORT"], tone: "amber" },
  { index: "04", name: "Beauty", slug: "beauty", description: "Hair, tweezer, nail, cuticle, and professional salon families.", verbs: ["SHAPE", "REFINE", "DETAIL"], tone: "coral" }
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

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

export function DiscoveryExperience() {
  const [activeDivision, setActiveDivision] = useState(0);
  const divisionItems = useRef<Array<HTMLAnchorElement | null>>([]);
  const familySection = useRef<HTMLElement>(null);
  const familyViewport = useRef<HTMLDivElement>(null);
  const familyTrack = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const index = Number((visible.target as HTMLElement).dataset.divisionIndex ?? 0);
      setActiveDivision(index);
    }, { rootMargin: "-20% 0px -48% 0px", threshold: [0.2, 0.38, 0.58, 0.78] });

    divisionItems.current.forEach(item => item && observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia("(max-width: 900px)");

    const updateFamily = () => {
      const section = familySection.current;
      const viewport = familyViewport.current;
      const track = familyTrack.current;
      if (!section || !viewport || !track) return;

      if (reduced.matches || narrow.matches) {
        section.style.removeProperty("height");
        section.style.setProperty("--family-progress", "0");
        track.style.transform = "none";
        frame.current = null;
        return;
      }

      const maximumShift = Math.max(0, track.scrollWidth - viewport.clientWidth);
      const travel = Math.max(window.innerHeight * 1.25, maximumShift + window.innerHeight * 0.7);
      section.style.height = `${travel + window.innerHeight}px`;
      const rect = section.getBoundingClientRect();
      const progress = clamp(-rect.top / travel, 0, 1);
      section.style.setProperty("--family-progress", progress.toFixed(4));
      track.style.transform = `translate3d(${-maximumShift * progress}px,0,0)`;
      frame.current = null;
    };

    const requestUpdate = () => {
      if (frame.current === null) frame.current = window.requestAnimationFrame(updateFamily);
    };

    updateFamily();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    reduced.addEventListener("change", requestUpdate);
    narrow.addEventListener("change", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      reduced.removeEventListener("change", requestUpdate);
      narrow.removeEventListener("change", requestUpdate);
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    };
  }, []);

  const active = divisions[activeDivision];

  return <>
    <section className="division-discovery" aria-labelledby="division-title" data-active-tone={active.tone} data-active-index={activeDivision}>
      <header className="section-intro container"><p className="eyebrow">01 · FOUR DIVISIONS</p><h2 id="division-title">Four fields.<br /><span>One language of precision.</span></h2><p>Each division keeps a distinct working character while remaining part of one catalogue system.</p></header>

      <div className="container division-discovery-grid">
        <aside className="division-active-stage" aria-live="polite">
          <div className="division-stage-index"><span>{active.index}</span><small>ACTIVE DIVISION</small></div>
          <div className="division-stage-object" aria-hidden="true"><span className="stage-axis horizontal" /><span className="stage-axis vertical" /><span className="stage-pivot" /><span className="stage-blade blade-one" /><span className="stage-blade blade-two" /></div>
          <div className="division-stage-copy"><p>{active.description}</p><div>{active.verbs.map(verb => <span key={verb}>{verb}</span>)}</div></div>
        </aside>

        <div className="division-scroll-list">{divisions.map((division, index) => <Link
          ref={element => { divisionItems.current[index] = element; }}
          className={`division-discovery-item ${division.tone}`}
          href={`/products/${division.slug}`}
          key={division.slug}
          data-division-index={index}
          aria-current={activeDivision === index ? "true" : undefined}
          onPointerEnter={() => setActiveDivision(index)}
          onFocus={() => setActiveDivision(index)}
        >
          <span className="division-number">{division.index}</span>
          <strong>{division.name}</strong>
          <div><p>{division.description}</p><small>{division.verbs.join(" · ")}</small></div>
          <b aria-hidden="true">↗</b>
        </Link>)}</div>
      </div>
    </section>

    <section className="function-passage" aria-labelledby="function-title">
      <div className="container function-heading"><p className="eyebrow">02 · WORKING LANGUAGE</p><h2 id="function-title">Find the instrument through what it must do.</h2></div>
      <div className="function-lines" aria-label="Instrument functions">
        <Link href="/search?q=cut"><span>01</span><strong>CUT</strong><small>Scissors and cutting families</small></Link>
        <Link href="/search?q=hold"><span>02</span><strong>HOLD</strong><small>Forceps, clamps, and holders</small></Link>
        <Link href="/search?q=retract"><span>03</span><strong>RETRACT</strong><small>Retraction families</small></Link>
        <Link href="/search?q=suture"><span>04</span><strong>SUTURE</strong><small>Needle-holding families</small></Link>
        <Link href="/search?q=examine"><span>05</span><strong>EXAMINE</strong><small>Diagnostic families</small></Link>
        <Link href="/search?q=extract"><span>06</span><strong>EXTRACT</strong><small>Dental extraction families</small></Link>
      </div>
    </section>

    <section ref={familySection} className="family-discovery" aria-labelledby="family-title">
      <div className="family-sticky-stage">
        <header className="container family-discovery-heading"><div><p className="eyebrow">03 · FAMILY INDEX</p><h2 id="family-title">Enter through the family.</h2></div><p>Vertical scrolling advances the archive on larger screens. Every panel remains a direct catalogue link.</p></header>
        <div ref={familyViewport} className="family-track-viewport">
          <div ref={familyTrack} className="family-track">{families.map(family => <Link className="family-panel" href={family.route} key={family.route}>
            <header><span>{family.index}</span><small>{family.division}</small></header>
            <div className="family-panel-object" aria-hidden="true"><span /><span /><i /></div>
            <div><p>{family.function}</p><h3>{family.name}</h3><b>Open family ↗</b></div>
          </Link>)}</div>
        </div>
        <div className="container family-progress" aria-hidden="true"><span>START</span><i><b /></i><span>END</span></div>
      </div>
    </section>
  </>;
}
