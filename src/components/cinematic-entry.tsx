"use client";

import { createScope, createTimeline } from "animejs";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

type MediaManifest = {
  available: boolean;
  intro: string | null;
};

type ConnectionHint = {
  saveData?: boolean;
  effectiveType?: string;
};

type NavigatorWithConnection = Navigator & {
  connection?: ConnectionHint;
};

function hasConstrainedMediaPreference() {
  const connection = (navigator as NavigatorWithConnection).connection;
  return Boolean(connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType ?? ""));
}

function viewportHeight() {
  return Math.max(1, window.visualViewport?.height ?? window.innerHeight);
}

export function CinematicEntry() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<number | null>(null);
  const clearedRef = useRef(false);
  const [videoSource, setVideoSource] = useState<string | null>(null);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [mediaState, setMediaState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const controller = new AbortController();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const constrained = hasConstrainedMediaPreference();
    const updateMotionPreference = () => {
      const allowed = !reduced.matches && !constrained;
      setMotionAllowed(allowed);
      if (!allowed) setVideoEnded(true);
    };
    updateMotionPreference();
    reduced.addEventListener("change", updateMotionPreference);

    if (constrained) {
      setMediaState("error");
      setVideoEnded(true);
    } else {
      void fetch("/media/sector9d/manifest.json", { signal: controller.signal })
        .then(response => response.ok ? response.json() as Promise<MediaManifest> : Promise.reject(new Error("Media manifest unavailable")))
        .then(manifest => {
          if (manifest.available && manifest.intro) setVideoSource(manifest.intro);
          else {
            setMediaState("error");
            setVideoEnded(true);
          }
        })
        .catch(error => {
          if (error instanceof DOMException && error.name === "AbortError") return;
          setMediaState("error");
          setVideoEnded(true);
        });
    }

    return () => {
      controller.abort();
      reduced.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const scope = createScope({ root: sectionRef }).add(() => {
      const index = section.querySelector<HTMLElement>(".cinematic-entry-index");
      const title = section.querySelector<HTMLElement>(".cinematic-entry-title");
      const timeline = createTimeline({ defaults: { ease: "out(5)" } });
      if (index) timeline.add(index, { opacity: { from: 0 }, y: { from: -8 }, duration: 520 }, 100);
      if (title) timeline.add(title, { opacity: { from: 0 }, y: { from: 18 }, duration: 760 }, 260);
    });

    const update = () => {
      const rect = section.getBoundingClientRect();
      const height = viewportHeight();
      const travel = Math.max(section.offsetHeight - height, 1);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      const cleared = progress >= 0.995;
      section.style.setProperty("--cinematic-progress", progress.toFixed(4));
      section.dataset.exitState = cleared ? "cleared" : progress > 0.04 ? "leaving" : "holding";
      section.inert = cleared;

      if (cleared !== clearedRef.current) {
        clearedRef.current = cleared;
        window.dispatchEvent(new CustomEvent("throhi:cinematic-state", { detail: { cleared } }));
      }

      if (progress < 0.94) document.body.dataset.cinematicActive = "true";
      else delete document.body.dataset.cinematicActive;

      frameRef.current = null;
    };

    const requestUpdate = () => {
      if (frameRef.current === null) frameRef.current = window.requestAnimationFrame(update);
    };

    const visualViewport = window.visualViewport;
    document.body.dataset.cinematicActive = "true";
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("orientationchange", requestUpdate);
    visualViewport?.addEventListener("resize", requestUpdate);
    visualViewport?.addEventListener("scroll", requestUpdate);

    return () => {
      scope.revert();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("orientationchange", requestUpdate);
      visualViewport?.removeEventListener("resize", requestUpdate);
      visualViewport?.removeEventListener("scroll", requestUpdate);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      section.inert = false;
      clearedRef.current = false;
      delete document.body.dataset.cinematicActive;
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !motionAllowed || !videoSource) return;
    video.muted = true;

    const syncVisibility = () => {
      if (document.hidden) {
        video.pause();
        return;
      }
      if (!video.ended) void video.play().catch(() => {
        setMediaState("error");
        setVideoEnded(true);
      });
    };

    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      document.removeEventListener("visibilitychange", syncVisibility);
      video.pause();
    };
  }, [motionAllowed, videoSource]);

  const skip = () => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: section.offsetTop + section.offsetHeight - viewportHeight() + 2,
      behavior: reduced ? "auto" : "smooth"
    });
  };

  const entryReady = videoEnded || mediaState === "error" || !motionAllowed;

  return <section
    ref={sectionRef}
    className="cinematic-entry"
    aria-labelledby="cinematic-entry-title"
    data-media-state={mediaState}
    data-video-ended={entryReady ? "true" : "false"}
    data-exit-state="holding"
    style={{ "--cinematic-progress": "0" } as CSSProperties}
  >
    <div className="cinematic-entry-sticky">
      <div className="cinematic-entry-media" aria-hidden="true">
        {videoSource && motionAllowed ? <video
          ref={videoRef}
          src={videoSource}
          muted
          playsInline
          preload="metadata"
          onCanPlay={() => setMediaState("ready")}
          onError={() => {
            setMediaState("error");
            setVideoEnded(true);
          }}
          onEnded={() => setVideoEnded(true)}
        /> : null}
        <div className="cinematic-entry-fallback"><span>THROHI</span><small>MEDICAL TOOLS</small></div>
        <div className="cinematic-entry-feather" />
      </div>

      <div className="cinematic-entry-index"><span>THROHI / OPENING STUDY</span><span>INSTRUMENTS IN TRANSITION</span></div>
      <div className="cinematic-entry-copy">
        <p>PRECISION THROUGH FORM</p>
        <h1 id="cinematic-entry-title" className="cinematic-entry-title">Built around<br />the instrument.</h1>
      </div>
      <button className="cinematic-entry-scroll" type="button" onClick={skip} aria-label="Slide the opening cover away and enter the THROHI website">
        <span>SCROLL TO ENTER</span><b aria-hidden="true">↓</b>
      </button>
    </div>
  </section>;
}
