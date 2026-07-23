"use client";

import { createScope, createTimeline } from "animejs";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

const INTRO_VIDEO = "/media/sector9d/intro.mp4";

export function CinematicEntry() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<number | null>(null);
  const [mediaState, setMediaState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const scope = createScope({ root: sectionRef }).add(() => {
      const index = section.querySelector<HTMLElement>(".cinematic-entry-index");
      const title = section.querySelector<HTMLElement>(".cinematic-entry-title");
      const scroll = section.querySelector<HTMLElement>(".cinematic-entry-scroll");
      const timeline = createTimeline({ defaults: { ease: "out(5)" } });
      if (index) timeline.add(index, { opacity: { from: 0 }, y: { from: -8 }, duration: 520 }, 100);
      if (title) timeline.add(title, { opacity: { from: 0 }, y: { from: 18 }, duration: 760 }, 260);
      if (scroll) timeline.add(scroll, { opacity: { from: 0 }, y: { from: 12 }, duration: 620 }, 1200);
    });

    const update = () => {
      const rect = section.getBoundingClientRect();
      const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      section.style.setProperty("--cinematic-progress", progress.toFixed(4));
      section.dataset.exitState = progress > 0.04 ? "leaving" : "holding";

      if (progress < 0.72) document.body.dataset.cinematicActive = "true";
      else delete document.body.dataset.cinematicActive;

      frameRef.current = null;
    };

    const requestUpdate = () => {
      if (frameRef.current === null) frameRef.current = window.requestAnimationFrame(update);
    };

    document.body.dataset.cinematicActive = "true";
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    reduced.addEventListener("change", requestUpdate);

    if (!reduced.matches && video) {
      video.muted = true;
      void video.play().catch(() => setMediaState("error"));
    }

    return () => {
      scope.revert();
      video?.pause();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      reduced.removeEventListener("change", requestUpdate);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      delete document.body.dataset.cinematicActive;
    };
  }, []);

  const skip = () => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: section.offsetTop + section.offsetHeight - window.innerHeight + 4,
      behavior: reduced ? "auto" : "smooth"
    });
  };

  return <section
    ref={sectionRef}
    className="cinematic-entry"
    aria-labelledby="cinematic-entry-title"
    data-media-state={mediaState}
    data-exit-state="holding"
    style={{ "--cinematic-progress": "0" } as CSSProperties}
  >
    <div className="cinematic-entry-sticky">
      <div className="cinematic-entry-media" aria-hidden="true">
        <video
          ref={videoRef}
          src={INTRO_VIDEO}
          muted
          playsInline
          preload="auto"
          onCanPlay={() => setMediaState("ready")}
          onError={() => setMediaState("error")}
          onEnded={event => { event.currentTarget.dataset.ended = "true"; }}
        />
        <div className="cinematic-entry-fallback"><span>THROHI</span><small>MEDICAL TOOLS</small></div>
        <div className="cinematic-entry-feather" />
      </div>

      <div className="cinematic-entry-index"><span>THROHI / OPENING STUDY</span><span>INSTRUMENTS IN TRANSITION</span></div>
      <div className="cinematic-entry-copy">
        <p>PRECISION THROUGH FORM</p>
        <h1 id="cinematic-entry-title" className="cinematic-entry-title">Built around<br />the instrument.</h1>
      </div>
      <button className="cinematic-entry-scroll" type="button" onClick={skip}>
        <span>SCROLL TO ENTER</span><b aria-hidden="true">↓</b>
      </button>
    </div>
  </section>;
}
