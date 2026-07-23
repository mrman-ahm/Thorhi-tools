"use client";

import { animate, createScope, createTimeline, stagger } from "animejs";
import { useEffect, useRef, useState } from "react";
import {
  chapterIndexForFrame,
  EVOLUTION_CHAPTERS,
  EVOLUTION_SOURCE_HEIGHT,
  EVOLUTION_SOURCE_WIDTH,
  exitOpacityForFrame,
  frameForEvolutionProgress,
  spriteCellForFrame
} from "@/lib/evolution-frames";

const SPRITE_URL = "/media/sector9d/evolution-sprite.webp";

function drawFrame(canvas: HTMLCanvasElement, image: HTMLImageElement, frame: number) {
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

  const { column, row } = spriteCellForFrame(frame);
  const destinationRatio = pixelWidth / pixelHeight;
  const sourceRatio = EVOLUTION_SOURCE_WIDTH / EVOLUTION_SOURCE_HEIGHT;
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
    column * EVOLUTION_SOURCE_WIDTH,
    row * EVOLUTION_SOURCE_HEIGHT,
    EVOLUTION_SOURCE_WIDTH,
    EVOLUTION_SOURCE_HEIGHT,
    (pixelWidth - drawWidth) / 2,
    (pixelHeight - drawHeight) / 2,
    drawWidth,
    drawHeight
  );
  context.globalAlpha = 1;
}

export function FrameEvolutionScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const readoutRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
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

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sprite = new Image();
    sprite.decoding = "async";
    sprite.src = SPRITE_URL;
    imageRef.current = sprite;

    const render = () => {
      const image = imageRef.current;
      if (!image || !image.complete || !image.naturalWidth) {
        frameRequest.current = null;
        return;
      }

      const difference = targetFrame.current - renderedFrame.current;
      const step = Math.sign(difference) * Math.min(Math.abs(difference), Math.max(1, Math.ceil(Math.abs(difference) * 0.28)));
      renderedFrame.current += step;
      const frame = Math.round(renderedFrame.current);
      drawFrame(canvas, image, frame);
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
      const distance = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, -rect.top / distance));
      const frame = reduced.matches ? EVOLUTION_CHAPTERS[activeChapterRef.current].startFrame : frameForEvolutionProgress(progress);
      targetFrame.current = frame;
      section.style.setProperty("--evolution-sequence-progress", progress.toFixed(4));
      section.dataset.targetFrame = String(frame);
      requestRender();
    };

    sprite.onload = () => {
      setMediaState("ready");
      renderedFrame.current = 1;
      targetFrame.current = 1;
      drawFrame(canvas, sprite, 1);
      update();
    };
    sprite.onerror = () => setMediaState("error");

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    reduced.addEventListener("change", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      reduced.removeEventListener("change", update);
      if (frameRequest.current !== null) window.cancelAnimationFrame(frameRequest.current);
      imageRef.current = null;
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
