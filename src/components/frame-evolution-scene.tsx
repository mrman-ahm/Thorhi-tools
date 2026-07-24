"use client";

import { animate, createScope, createTimeline, stagger } from "animejs";
import { useEffect, useRef, useState } from "react";
import {
  chapterIndexForFrame,
  EVOLUTION_CHAPTERS,
  exitOpacityForFrame,
  frameForEvolutionProgress
} from "@/lib/evolution-frames";

type SpriteDescriptor = {
  src: string;
  cellWidth: number;
  cellHeight: number;
  columns: number;
  startFrame?: number;
  endFrame?: number;
};

type EvolutionVariant = {
  maxDecodedSheets: number;
  sheets: Required<Pick<SpriteDescriptor, "src" | "cellWidth" | "cellHeight" | "columns" | "startFrame" | "endFrame">>[];
};

type MediaManifest = {
  available: boolean;
  sprite: string | null;
  sprites?: {
    desktop: SpriteDescriptor;
    mobile: SpriteDescriptor;
  } | null;
  evolution?: {
    framesPerSheet: number;
    desktop: EvolutionVariant;
    mobile: EvolutionVariant;
  } | null;
};

type MediaSelection =
  | { kind: "sheets"; variant: EvolutionVariant }
  | { kind: "legacy"; descriptor: SpriteDescriptor };

type CachedSheet = { image: HTMLImageElement; lastUsed: number };

const LEGACY_SPRITE: Omit<SpriteDescriptor, "src"> = {
  cellWidth: 240,
  cellHeight: 135,
  columns: 12
};

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
  const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
  const pixelWidth = Math.max(1, Math.round(width * ratio));
  const pixelHeight = Math.max(1, Math.round(height * ratio));
  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }

  const localIndex = Math.max(0, frame - (descriptor.startFrame ?? 1));
  const column = localIndex % descriptor.columns;
  const row = Math.floor(localIndex / descriptor.columns);
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

function selectMedia(manifest: MediaManifest, useMobile: boolean): MediaSelection | null {
  if (manifest.evolution) {
    return { kind: "sheets", variant: useMobile ? manifest.evolution.mobile : manifest.evolution.desktop };
  }
  if (manifest.sprites) {
    return { kind: "legacy", descriptor: useMobile ? manifest.sprites.mobile : manifest.sprites.desktop };
  }
  return manifest.sprite ? { kind: "legacy", descriptor: { src: manifest.sprite, ...LEGACY_SPRITE } } : null;
}

function sheetIndexForFrame(variant: EvolutionVariant, frame: number) {
  const index = variant.sheets.findIndex(sheet => frame >= sheet.startFrame && frame <= sheet.endFrame);
  return index < 0 ? 0 : index;
}

export function FrameEvolutionScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const readoutRef = useRef<HTMLElement>(null);
  const legacyImageRef = useRef<HTMLImageElement | null>(null);
  const legacyDescriptorRef = useRef<SpriteDescriptor | null>(null);
  const variantRef = useRef<EvolutionVariant | null>(null);
  const sheetCacheRef = useRef(new Map<number, CachedSheet>());
  const sheetLoadingRef = useRef(new Map<number, Promise<HTMLImageElement>>());
  const frameRequest = useRef<number | null>(null);
  const targetFrame = useRef(1);
  const renderedFrame = useRef(1);
  const activeChapterRef = useRef(0);
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
    const mobileMedia = window.matchMedia("(max-width: 720px), (pointer: coarse)");
    let observer: IntersectionObserver | null = null;
    let manifest: MediaManifest | null = null;
    let mediaRequested = false;
    let disposed = false;

    const clearMedia = () => {
      legacyImageRef.current = null;
      legacyDescriptorRef.current = null;
      variantRef.current = null;
      for (const cached of sheetCacheRef.current.values()) cached.image.src = "";
      sheetCacheRef.current.clear();
      sheetLoadingRef.current.clear();
    };

    const evictSheets = (protectedIndexes: number[]) => {
      const variant = variantRef.current;
      if (!variant || sheetCacheRef.current.size <= variant.maxDecodedSheets) return;
      const protectedSet = new Set(protectedIndexes);
      const candidates = Array.from(sheetCacheRef.current.entries())
        .filter(([index]) => !protectedSet.has(index))
        .sort((left, right) => left[1].lastUsed - right[1].lastUsed);

      while (sheetCacheRef.current.size > variant.maxDecodedSheets && candidates.length) {
        const [index, cached] = candidates.shift()!;
        cached.image.src = "";
        sheetCacheRef.current.delete(index);
      }
    };

    const requestRender = () => {
      if (frameRequest.current === null) frameRequest.current = window.requestAnimationFrame(render);
    };

    const loadSheet = (index: number) => {
      const variant = variantRef.current;
      const descriptor = variant?.sheets[index];
      if (!variant || !descriptor) return Promise.reject(new Error("Evolution sheet unavailable"));
      const cached = sheetCacheRef.current.get(index);
      if (cached) {
        cached.lastUsed = performance.now();
        return Promise.resolve(cached.image);
      }
      const pending = sheetLoadingRef.current.get(index);
      if (pending) return pending;

      const promise = new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.decoding = "async";
        image.onload = () => {
          sheetLoadingRef.current.delete(index);
          if (disposed) return;
          sheetCacheRef.current.set(index, { image, lastUsed: performance.now() });
          evictSheets([index]);
          requestRender();
          resolve(image);
        };
        image.onerror = () => {
          sheetLoadingRef.current.delete(index);
          reject(new Error(`Unable to load evolution sheet ${index + 1}`));
        };
        image.src = descriptor.src;
      });

      sheetLoadingRef.current.set(index, promise);
      return promise;
    };

    function render() {
      const difference = targetFrame.current - renderedFrame.current;
      const step = Math.sign(difference) * Math.min(
        Math.abs(difference),
        Math.max(1, Math.ceil(Math.abs(difference) * 0.28))
      );
      const nextFrame = Math.round(renderedFrame.current + step);
      let image: HTMLImageElement | null = null;
      let descriptor: SpriteDescriptor | null = null;

      const variant = variantRef.current;
      if (variant) {
        const sheetIndex = sheetIndexForFrame(variant, nextFrame);
        const cached = sheetCacheRef.current.get(sheetIndex);
        if (!cached) {
          frameRequest.current = null;
          void loadSheet(sheetIndex).catch(() => setMediaState("error"));
          return;
        }
        cached.lastUsed = performance.now();
        image = cached.image;
        descriptor = variant.sheets[sheetIndex];
        const adjacent = targetFrame.current >= nextFrame ? sheetIndex + 1 : sheetIndex - 1;
        if (adjacent >= 0 && adjacent < variant.sheets.length) {
          void loadSheet(adjacent).catch(() => undefined);
        }
        evictSheets([sheetIndex, adjacent]);
      } else {
        image = legacyImageRef.current;
        descriptor = legacyDescriptorRef.current;
      }

      if (!image || !descriptor || !image.complete || !image.naturalWidth) {
        frameRequest.current = null;
        return;
      }

      renderedFrame.current = nextFrame;
      const frame = nextFrame;
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
    }

    const update = () => {
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

    const configureMedia = (nextManifest: MediaManifest) => {
      clearMedia();
      const selection = nextManifest.available ? selectMedia(nextManifest, mobileMedia.matches) : null;
      if (!selection) {
        setMediaState("error");
        return;
      }

      setMediaState("loading");
      renderedFrame.current = Math.max(1, Math.round(renderedFrame.current));
      if (selection.kind === "sheets") {
        variantRef.current = selection.variant;
        const initialIndex = sheetIndexForFrame(selection.variant, targetFrame.current);
        void loadSheet(initialIndex)
          .then(() => {
            if (disposed) return;
            setMediaState("ready");
            update();
          })
          .catch(() => setMediaState("error"));
        return;
      }

      legacyDescriptorRef.current = selection.descriptor;
      const sprite = new Image();
      sprite.decoding = "async";
      sprite.onload = () => {
        if (disposed) return;
        legacyImageRef.current = sprite;
        setMediaState("ready");
        drawFrame(canvas, sprite, selection.descriptor, renderedFrame.current);
        update();
      };
      sprite.onerror = () => setMediaState("error");
      sprite.src = selection.descriptor.src;
    };

    const requestMedia = () => {
      if (mediaRequested) return;
      mediaRequested = true;
      void fetch("/media/sector9d/manifest.json", { signal: controller.signal })
        .then(response => response.ok
          ? response.json() as Promise<MediaManifest>
          : Promise.reject(new Error("Media manifest unavailable")))
        .then(nextManifest => {
          manifest = nextManifest;
          configureMedia(nextManifest);
        })
        .catch(error => {
          if (error instanceof DOMException && error.name === "AbortError") return;
          setMediaState("error");
        });
    };

    const deferMedia = () => {
      if (!("IntersectionObserver" in window)) {
        requestMedia();
        return;
      }
      observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        observer?.disconnect();
        observer = null;
        requestMedia();
      }, { rootMargin: "1200px 0px" });
      observer.observe(section);
    };

    const handleMediaChange = () => {
      if (manifest) configureMedia(manifest);
      update();
    };

    deferMedia();
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    reduced.addEventListener("change", update);
    mobileMedia.addEventListener("change", handleMediaChange);

    return () => {
      disposed = true;
      controller.abort();
      observer?.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      reduced.removeEventListener("change", update);
      mobileMedia.removeEventListener("change", handleMediaChange);
      if (frameRequest.current !== null) window.cancelAnimationFrame(frameRequest.current);
      clearMedia();
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
    data-rendered-frame="1"
    data-target-frame="1"
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
