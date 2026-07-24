"use client";

import { animate, createScope, createTimeline, stagger } from "animejs";
import type { CSSProperties } from "react";
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

type ConnectionHint = {
  saveData?: boolean;
  effectiveType?: string;
};

type NavigatorWithDeviceHints = Navigator & {
  connection?: ConnectionHint;
  deviceMemory?: number;
};

type SpriteMode = "none" | "desktop" | "mobile" | "static";

type SpriteSelection = {
  descriptor: SpriteDescriptor;
  mode: Exclude<SpriteMode, "none" | "static">;
  constrained: boolean;
};

const LEGACY_SPRITE: Omit<SpriteDescriptor, "src"> = {
  cellWidth: 240,
  cellHeight: 135,
  columns: 12
};

function deviceHints() {
  const navigatorWithHints = navigator as NavigatorWithDeviceHints;
  const connection = navigatorWithHints.connection;
  const effectiveType = connection?.effectiveType ?? "";
  const constrained = Boolean(
    connection?.saveData ||
    /(^|-)2g$|^3g$/.test(effectiveType) ||
    (navigatorWithHints.deviceMemory !== undefined && navigatorWithHints.deviceMemory <= 4)
  );
  const compact = constrained || window.matchMedia("(max-width: 900px), (pointer: coarse)").matches;
  return { constrained, compact };
}

function drawFrame(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  descriptor: SpriteDescriptor,
  frame: number,
  pixelRatioCap: number
) {
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return;

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const ratio = Math.min(window.devicePixelRatio || 1, pixelRatioCap);
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

function selectSprite(manifest: MediaManifest): SpriteSelection | null {
  const hints = deviceHints();
  if (manifest.sprites) {
    return hints.compact
      ? { descriptor: manifest.sprites.mobile, mode: "mobile", constrained: hints.constrained }
      : { descriptor: manifest.sprites.desktop, mode: "desktop", constrained: false };
  }
  return manifest.sprite
    ? { descriptor: { src: manifest.sprite, ...LEGACY_SPRITE }, mode: "mobile", constrained: hints.constrained }
    : null;
}

export function FrameEvolutionScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const readoutRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const descriptorRef = useRef<SpriteDescriptor | null>(null);
  const pixelRatioCapRef = useRef(1.25);
  const frameRequest = useRef<number | null>(null);
  const targetFrame = useRef(1);
  const renderedFrame = useRef(1);
  const activeChapterRef = useRef(0);
  const [activeChapter, setActiveChapter] = useState(0);
  const [spriteMode, setSpriteMode] = useState<SpriteMode>("none");
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
    let observer: IntersectionObserver | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let mediaRequested = false;

    const render = () => {
      const image = imageRef.current;
      const descriptor = descriptorRef.current;
      if (!image || !descriptor || !image.complete || !image.naturalWidth) {
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
      drawFrame(canvas, image, descriptor, frame, pixelRatioCapRef.current);
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
      if (frameRequest.current === null) frameRequest.current = window.requestAnimationFrame(render);
    };

    const update = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = Math.max(1, window.visualViewport?.height ?? window.innerHeight);
      const distance = Math.max(section.offsetHeight - viewportHeight, 1);
      const progress = Math.min(1, Math.max(0, -rect.top / distance));
      const frame = reduced.matches
        ? EVOLUTION_CHAPTERS[activeChapterRef.current].startFrame
        : frameForEvolutionProgress(progress);
      targetFrame.current = frame;
      section.style.setProperty("--evolution-sequence-progress", progress.toFixed(4));
      section.dataset.targetFrame = String(frame);
      requestRender();
    };

    const loadSprite = (selection: SpriteSelection) => {
      if (mediaRequested) return;
      mediaRequested = true;
      descriptorRef.current = selection.descriptor;
      pixelRatioCapRef.current = selection.mode === "mobile" || selection.constrained ? 1.25 : 1.5;
      setSpriteMode(selection.mode);
      const sprite = new Image();
      sprite.decoding = "async";
      sprite.fetchPriority = selection.constrained ? "low" : "auto";
      sprite.onload = () => {
        imageRef.current = sprite;
        setMediaState("ready");
        renderedFrame.current = 1;
        targetFrame.current = 1;
        drawFrame(canvas, sprite, selection.descriptor, 1, pixelRatioCapRef.current);
        update();
      };
      sprite.onerror = () => setMediaState("error");
      sprite.src = selection.descriptor.src;
    };

    const deferSprite = (selection: SpriteSelection) => {
      if (!("IntersectionObserver" in window)) {
        loadSprite(selection);
        return;
      }
      observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        observer?.disconnect();
        observer = null;
        loadSprite(selection);
      }, { rootMargin: selection.constrained ? "500px 0px" : "1200px 0px" });
      observer.observe(section);
    };

    void fetch("/media/sector9d/manifest.json", { signal: controller.signal })
      .then(response => response.ok
        ? response.json() as Promise<MediaManifest>
        : Promise.reject(new Error("Media manifest unavailable")))
      .then(manifest => {
        if (reduced.matches) {
          setSpriteMode("static");
          setMediaState("error");
          return;
        }
        const selection = manifest.available ? selectSprite(manifest) : null;
        if (selection) deferSprite(selection);
        else setMediaState("error");
      })
      .catch(error => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setMediaState("error");
      });

    const visualViewport = window.visualViewport;
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    visualViewport?.addEventListener("resize", update);
    reduced.addEventListener("change", update);

    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(() => requestRender());
      resizeObserver.observe(canvas);
    }

    return () => {
      controller.abort();
      observer?.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      visualViewport?.removeEventListener("resize", update);
      reduced.removeEventListener("change", update);
      if (frameRequest.current !== null) window.cancelAnimationFrame(frameRequest.current);
      if (imageRef.current) imageRef.current.src = "";
      imageRef.current = null;
      descriptorRef.current = null;
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
    data-sprite-mode={spriteMode}
    data-rendered-frame="1"
    data-target-frame="1"
    style={{ "--evolution-sequence-progress": "0" } as CSSProperties}
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
