"use client";

import { animate, createScope, createTimeline, stagger } from "animejs";
import { useEffect, useRef, useState } from "react";
import {
  chapterIndexForFrame,
  EVOLUTION_CHAPTERS,
  exitOpacityForFrame,
  frameForEvolutionProgress,
  spriteCellForFrame
} from "@/lib/evolution-frames";

type SpriteDescriptor = {
  src: string;
  cellWidth: number;
  cellHeight: number;
  columns: number;
};

type MediaManifest = {
  available: boolean;
  sprite: string | null;
  sprites?: {
    desktop: SpriteDescriptor;
    mobile: SpriteDescriptor;
  } | null;
};

const LEGACY_SPRITE: Omit<SpriteDescriptor, "src"> = {
  cellWidth: 240,
  cellHeight: 135,
  columns: 12
};

function saveDataEnabled() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return Boolean(connection?.saveData);
}

function drawFrame(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  descriptor: SpriteDescriptor,
  frame: number
) {
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return;

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const ratio = Math.min(window.devicePixelRatio || 1, saveDataEnabled() ? 1 : 1.5);
  const pixelWidth = Math.max(1, Math.round(width * ratio));
  const pixelHeight = Math.max(1, Math.round(height * ratio));
  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }

  const { column, row } = spriteCellForFrame(frame);
  const destinationRatio = pixelWidth / pixelHeight;
  const sourceRatio = descriptor.cellWidth / descriptor.cellHeight;
  let drawWidth = pixelWidth;
  let drawHeight = pixelHeight;
  if (destinationRatio > sourceRatio) drawHeight = drawWidth / sourceRatio;
  else drawWidth = drawHeight * sourceRatio;

  context.clearRect(0, 0, pixelWidth, pixelHeight);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.globalAlpha = exitOpacityForFrame(frame);
  context.drawImage(
    image,
    column * descriptor.cellWidth,
    row * descriptor.cellHeight,
    descriptor.cellWidth,
    descriptor.cellHeight,
    (pixelWidth - drawWidth) / 2,
    (pixelHeight - drawHeight) / 2,
    drawWidth,
    drawHeight
  );
  context.globalAlpha = 1;
}

function selectSprite(manifest: MediaManifest): SpriteDescriptor | null {
  if (manifest.sprites) {
    return saveDataEnabled() || window.matchMedia("(max-width: 720px), (pointer: coarse)").matches
      ? manifest.sprites.mobile
      : manifest.sprites.desktop;
  }
  return manifest.sprite ? { src: manifest.sprite, ...LEGACY_SPRITE } : null;
}

export function FrameEvolutionScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const readoutRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const descriptorRef = useRef<SpriteDescriptor | null>(null);
  const frameRequest = useRef<number | null>(null);
  const updateRequest = useRef<number | null>(null);
  const targetFrame = useRef(1);
  const renderedFrame = useRef(1);
  const activeChapterRef = useRef(0);
  const visibleRef = useRef(false);
  const [activeChapter, setActiveChapter] = useState(0);
  const [mediaState, setMediaState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    activeChapterRef.current = activeChapter;
  }, [activeChapter]);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const controller = new AbortController();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let loadObserver: IntersectionObserver | null = null;
    let visibilityObserver: IntersectionObserver | null = null;
    let mediaRequested = false;

    section.dataset.dataSaver = saveDataEnabled() ? "true" : "false";

    const render = () => {
      const image = imageRef.current;
      const descriptor = descriptorRef.current;
      if (document.hidden || !visibleRef.current || !image || !descriptor || !image.complete || !image.naturalWidth) {
        frameRequest.current = null;
        return;
      }

      const difference = targetFrame.current - renderedFrame.current;
      const step = Math.sign(difference) * Math.min(
        Math.abs(difference),
        Math.max(1, Math.ceil(Math.abs(difference) * 0.28))
      );
      renderedFrame.current += step;
      const frame = Math.round(renderedFrame.current);
      drawFrame(canvas, image, descriptor, frame);
      section.dataset.renderedFrame = String(frame);
      if (readoutRef.current) readoutRef.current.textContent = String(frame).padStart(3, "0");

      const nextChapter = chapterIndexForFrame(frame);
      if (nextChapter !== activeChapterRef.current) {
        activeChapterRef.current = nextChapter;
        setActiveChapter(nextChapter);
      }

      if (Math.abs(targetFrame.current - renderedFrame.current) > 0.35) {
        frameRequest.current = window.requestAnimationFrame(render);
      } else {
        renderedFrame.current = targetFrame.current;
        frameRequest.current = null;
      }
    };

    const requestRender = () => {
      if (frameRequest.current === null && visibleRef.current && !document.hidden) {
        frameRequest.current = window.requestAnimationFrame(render);
      }
    };

    const update = () => {
      updateRequest.current = null;
      if (!visibleRef.current || document.hidden) return;
      const rect = section.getBoundingClientRect();
      const distance = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, -rect.top / distance));
      const frame = reduced.matches
        ? EVOLUTION_CHAPTERS[activeChapterRef.current].startFrame
        : frameForEvolutionProgress(progress);
      targetFrame.current = frame;
      section.style.setProperty("--evolution-sequence-progress", progress.toFixed(4));
      section.dataset.targetFrame = String(frame);
      requestRender();
    };

    const requestUpdate = () => {
      if (updateRequest.current === null) updateRequest.current = window.requestAnimationFrame(update);
    };

    const loadSprite = (descriptor: SpriteDescriptor) => {
      if (mediaRequested) return;
      mediaRequested = true;
      descriptorRef.current = descriptor;
      const sprite = new Image();
      sprite.decoding = "async";
      sprite.onload = () => {
        imageRef.current = sprite;
        setMediaState("ready");
        renderedFrame.current = 1;
        targetFrame.current = 1;
        drawFrame(canvas, sprite, descriptor, 1);
        requestUpdate();
      };
      sprite.onerror = () => setMediaState("error");
      sprite.src = descriptor.src;
    };

    const deferSprite = (descriptor: SpriteDescriptor) => {
      if (!("IntersectionObserver" in window)) {
        visibleRef.current = true;
        loadSprite(descriptor);
        return;
      }
      loadObserver = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        loadObserver?.disconnect();
        loadObserver = null;
        loadSprite(descriptor);
      }, { rootMargin: "1400px 0px" });
      loadObserver.observe(section);
    };

    if ("IntersectionObserver" in window) {
      visibilityObserver = new IntersectionObserver(entries => {
        visibleRef.current = entries.some(entry => entry.isIntersecting);
        section.dataset.visible = visibleRef.current ? "true" : "false";
        if (visibleRef.current) requestUpdate();
        else if (frameRequest.current !== null) {
          window.cancelAnimationFrame(frameRequest.current);
          frameRequest.current = null;
        }
      }, { rootMargin: "260px 0px", threshold: 0.01 });
      visibilityObserver.observe(section);
    } else {
      visibleRef.current = true;
      section.dataset.visible = "true";
    }

    const handleVisibility = () => {
      if (document.hidden) {
        if (frameRequest.current !== null) window.cancelAnimationFrame(frameRequest.current);
        frameRequest.current = null;
        if (updateRequest.current !== null) window.cancelAnimationFrame(updateRequest.current);
        updateRequest.current = null;
      } else {
        requestUpdate();
      }
    };

    void fetch("/media/sector9d/manifest.json", { signal: controller.signal })
      .then(response => response.ok
        ? response.json() as Promise<MediaManifest>
        : Promise.reject(new Error("Media manifest unavailable")))
      .then(manifest => {
        const descriptor = manifest.available ? selectSprite(manifest) : null;
        if (descriptor) deferSprite(descriptor);
        else setMediaState("error");
      })
      .catch(error => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setMediaState("error");
      });

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    document.addEventListener("visibilitychange", handleVisibility);
    reduced.addEventListener("change", requestUpdate);

    return () => {
      controller.abort();
      loadObserver?.disconnect();
      visibilityObserver?.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      document.removeEventListener("visibilitychange", handleVisibility);
      reduced.removeEventListener("change", requestUpdate);
      if (frameRequest.current !== null) window.cancelAnimationFrame(frameRequest.current);
      if (updateRequest.current !== null) window.cancelAnimationFrame(updateRequest.current);
      imageRef.current = null;
      descriptorRef.current = null;
      visibleRef.current = false;
      delete section.dataset.visible;
      delete section.dataset.dataSaver;
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches || saveDataEnabled()) return;

    const scope = createScope({ root: sectionRef }).add(() => {
      const active = section.querySelector<HTMLElement>(`.frame-evolution-copy[data-chapter="${activeChapter}"]`);
      const parts = active ? Array.from(active.querySelectorAll<HTMLElement>("span, h3, p, small")) : [];
      const timeline = createTimeline({ defaults: { ease: "out(5)" } });
      if (parts.length) timeline.add(parts, {
        opacity: { from: 0 },
        y: { from: 18 },
        clipPath: ["inset(0 0 18% 0)", "inset(0 0 0% 0)"],
        delay: stagger(55),
        duration: 520
      });
      animate(".frame-evolution-chapter-marker", {
        scaleY: (_, index) => index === activeChapter ? 1 : 0.24,
        opacity: (_, index) => index === activeChapter ? 1 : 0.35,
        duration: 420,
        ease: "out(4)"
      });
    });

    return () => scope.revert();
  }, [activeChapter]);

  return <section
    ref={sectionRef}
    className="frame-evolution-section"
    aria-labelledby="frame-evolution-title"
    data-active-chapter={activeChapter}
    data-media-state={mediaState}
    data-rendered-frame="1"
    data-target-frame="1"
    data-visible="false"
    data-data-saver="false"
    style={{ "--evolution-sequence-progress": "0" } as React.CSSProperties}
  >
    <div className="frame-evolution-sticky">
      <header className="frame-evolution-heading container">
        <p className="eyebrow">05 · PRECISION THROUGH TIME</p>
        <h2 id="frame-evolution-title">The instrument changes.<br /><span>The text follows.</span></h2>
      </header>

      <div className="frame-evolution-layout container">
        <div className="frame-evolution-stage" role="img" aria-label="Scroll-controlled evolution of cutting and surgical instruments">
          <canvas ref={canvasRef} aria-hidden="true" />
          <div className="frame-evolution-fallback" aria-hidden="true"><span>EVOLUTION SEQUENCE</span><small>MEDIA LOADING</small></div>
          <div className="frame-evolution-feather" aria-hidden="true" />
          <div className="frame-evolution-frame-readout" aria-hidden="true"><span>FRAME</span><b ref={readoutRef}>001</b><small>/ 260</small></div>
        </div>

        <div className="frame-evolution-copy-stack" aria-live="polite">
          {EVOLUTION_CHAPTERS.map((chapter, index) => <article
            className="frame-evolution-copy"
            data-chapter={index}
            data-active={activeChapter === index}
            key={chapter.id}
          >
            <span>{chapter.index} · {chapter.eyebrow}</span>
            <h3>{chapter.title}</h3>
            <p>{chapter.description}</p>
            <small>FRAMES {String(chapter.startFrame).padStart(3, "0")}–{String(chapter.endFrame).padStart(3, "0")}</small>
          </article>)}
        </div>
      </div>

      <div className="frame-evolution-timeline container" aria-hidden="true">
        {EVOLUTION_CHAPTERS.map((chapter, index) => <span className="frame-evolution-chapter-marker" key={chapter.id}><i />{chapter.index}</span>)}
        <b><i /></b>
      </div>
    </div>
  </section>;
}
