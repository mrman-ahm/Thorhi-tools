"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

const SESSION_KEY = "throhi:v2:cinematic-intro-seen";

type IntroState = "checking" | "active" | "playing" | "ended" | "fallback" | "reduced" | "skipped";

export function CinematicIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<number | null>(null);
  const [state, setState] = useState<IntroState>("checking");

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const alreadySeen = window.sessionStorage.getItem(SESSION_KEY) === "1";

    if (alreadySeen) {
      setState("skipped");
      return;
    }

    window.sessionStorage.setItem(SESSION_KEY, "1");
    if (reduced.matches) {
      setState("reduced");
      return;
    }

    setState("active");
    const attempt = video.play();
    attempt?.then(() => setState("playing")).catch(() => setState("fallback"));

    const update = () => {
      const rect = section.getBoundingClientRect();
      const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      section.style.setProperty("--intro-progress", progress.toFixed(4));
      section.dataset.exited = progress > 0.94 ? "true" : "false";
      frameRef.current = null;
    };

    const requestUpdate = () => {
      if (frameRef.current === null) frameRef.current = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      video.pause();
    };
  }, []);

  if (state === "skipped") return null;

  return <section
    ref={sectionRef}
    className="cinematic-intro"
    aria-label="THROHI instrument evolution introduction"
    data-intro-state={state}
    data-exited="false"
    style={{ "--intro-progress": "0" } as CSSProperties}
  >
    <div className="cinematic-intro-sticky">
      <div className="cinematic-intro-media" aria-hidden="true">
        <video
          ref={videoRef}
          className="cinematic-intro-video"
          muted
          autoPlay
          playsInline
          preload="metadata"
          poster="/media/sector9d/intro-poster.jpg"
          onPlaying={() => setState("playing")}
          onEnded={() => setState("ended")}
          onError={() => setState("fallback")}
        >
          <source src="/media/sector9d/throhi-intro.mp4" type="video/mp4" />
        </video>
        <div className="cinematic-intro-underlay" />
        <div className="cinematic-intro-feather" />
      </div>

      <div className="cinematic-intro-registration" aria-hidden="true">
        <span>THROHI / MEDICAL TOOLS</span>
        <span>INSTRUMENT STUDY / 001</span>
      </div>

      <div className="cinematic-intro-scroll" aria-hidden="true">
        <span>{state === "fallback" ? "SCROLL TO ENTER" : "SCROLL"}</span>
        <i />
      </div>

      <noscript><p className="cinematic-intro-noscript">Scroll to enter the THROHI Medical Tools catalogue.</p></noscript>
    </div>
  </section>;
}
