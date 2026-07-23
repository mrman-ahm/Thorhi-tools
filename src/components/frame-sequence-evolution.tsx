"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 260;
const LAST_FRAME = FRAME_COUNT - 1;
const FRAMES_PER_SHEET = 20;
const SHEET_COUNT = 13;
const SHEET_COLUMNS = 5;
const CELL_WIDTH = 384;
const CELL_HEIGHT = 216;

const chapters = [
  {
    index: "01",
    era: "Origin",
    title: "The hand-forged cutting form.",
    text: "The sequence opens with a compact historical cutting form. The imagery is presented as an approved visual reconstruction, without assigning an unverified date, maker, or material."
  },
  {
    index: "02",
    era: "Mechanism",
    title: "The pivot becomes deliberate.",
    text: "The profile refines into a more controlled two-part mechanism. The visual emphasis moves from rough form toward alignment, leverage, and repeatable movement."
  },
  {
    index: "03",
    era: "Specialization",
    title: "The instrument acquires a purpose-built profile.",
    text: "The handle and working form become more specialized and ornate, showing how one mechanical language can divide into distinct professional instruments."
  },
  {
    index: "04",
    era: "Precision",
    title: "The modern gripping instrument.",
    text: "The final chapter resolves into a contemporary forceps profile: controlled rings, a central lock, and a long working end presented without unsupported product specifications."
  }
] as const;

const transitions = [
  { start: 56, end: 73, from: 0, to: 1 },
  { start: 121, end: 139, from: 1, to: 2 },
  { start: 188, end: 207, from: 2, to: 3 }
] as const;

const representativeFrames = [0, 74, 140, 208] as const;

function sheetUrl(sheetIndex: number) {
  return `/media/sector9d/evolution/evolution-sheet-${String(sheetIndex + 1).padStart(2, "0")}.webp`;
}

function frameCoordinates(frame: number) {
  const safe = Math.min(LAST_FRAME, Math.max(0, frame));
  const sheet = Math.floor(safe / FRAMES_PER_SHEET);
  const local = safe % FRAMES_PER_SHEET;
  return {
    frame: safe,
    sheet,
    column: local % SHEET_COLUMNS,
    row: Math.floor(local / SHEET_COLUMNS)
  };
}

function framePhase(frame: number) {
  for (const transition of transitions) {
    if (frame >= transition.start && frame <= transition.end) {
      const mix = (frame - transition.start) / Math.max(1, transition.end - transition.start);
      return { type: "transition" as const, ...transition, mix };
    }
  }
  if (frame <= 55) return { type: "chapter" as const, chapter: 0, mix: 0 };
  if (frame <= 120) return { type: "chapter" as const, chapter: 1, mix: 0 };
  if (frame <= 187) return { type: "chapter" as const, chapter: 2, mix: 0 };
  return { type: "chapter" as const, chapter: 3, mix: 0 };
}

function drawFrame(canvas: HTMLCanvasElement, image: HTMLImageElement, frame: number, dpr: number) {
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width * dpr));
  const height = Math.max(1, Math.round(rect.height * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  const context = canvas.getContext("2d", { alpha: false });
  if (!context) return;
  const { column, row } = frameCoordinates(frame);
  context.fillStyle = "#030706";
  context.fillRect(0, 0, width, height);

  const sourceRatio = CELL_WIDTH / CELL_HEIGHT;
  const targetRatio = width / height;
  let destinationWidth = width;
  let destinationHeight = height;
  let destinationX = 0;
  let destinationY = 0;

  if (targetRatio > sourceRatio) {
    destinationHeight = width / sourceRatio;
    destinationY = (height - destinationHeight) / 2;
  } else {
    destinationWidth = height * sourceRatio;
    destinationX = (width - destinationWidth) / 2;
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(
    image,
    column * CELL_WIDTH,
    row * CELL_HEIGHT,
    CELL_WIDTH,
    CELL_HEIGHT,
    destinationX,
    destinationY,
    destinationWidth,
    destinationHeight
  );
}

function StaticFrame({ frame, label }: { frame: number; label: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { sheet } = frameCoordinates(frame);
    const image = new Image();
    image.decoding = "async";
    image.src = sheetUrl(sheet);
    const render = () => drawFrame(canvas, image, frame, Math.min(window.devicePixelRatio || 1, 1.25));
    image.addEventListener("load", render, { once: true });
    const observer = new ResizeObserver(render);
    observer.observe(canvas);
    return () => {
      image.removeEventListener("load", render);
      observer.disconnect();
    };
  }, [frame]);

  return <div className="sequence-static-media" role="img" aria-label={label}><canvas ref={canvasRef} /></div>;
}

export function FrameSequenceEvolution() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sharpCanvasRef = useRef<HTMLCanvasElement>(null);
  const underlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const copyRefs = useRef<Array<HTMLElement | null>>([]);
  const cacheRef = useRef(new Map<number, HTMLImageElement>());
  const loadingRef = useRef(new Map<number, Promise<HTMLImageElement>>());
  const targetFrameRef = useRef(0);
  const renderedFrameRef = useRef(-1);
  const frameRequestRef = useRef<number | null>(null);
  const idleRef = useRef<number | null>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const sharpCanvas = sharpCanvasRef.current;
    const underlayCanvas = underlayCanvasRef.current;
    if (!section || !sharpCanvas || !underlayCanvas) return;

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 900px)");
    const cacheLimit = mobileQuery.matches ? 3 : 5;
    setReduced(reducedQuery.matches);

    const trimCache = (protectedSheet: number) => {
      while (cacheRef.current.size > cacheLimit) {
        const first = cacheRef.current.keys().next().value as number | undefined;
        if (first === undefined) break;
        if (first === protectedSheet) {
          const image = cacheRef.current.get(first);
          cacheRef.current.delete(first);
          if (image) cacheRef.current.set(first, image);
          continue;
        }
        cacheRef.current.delete(first);
      }
    };

    const loadSheet = (sheet: number) => {
      const safeSheet = Math.min(SHEET_COUNT - 1, Math.max(0, sheet));
      const cached = cacheRef.current.get(safeSheet);
      if (cached) return Promise.resolve(cached);
      const pending = loadingRef.current.get(safeSheet);
      if (pending) return pending;

      const promise = new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.decoding = "async";
        image.src = sheetUrl(safeSheet);
        image.onload = async () => {
          try { await image.decode(); } catch { /* loaded pixels remain usable */ }
          cacheRef.current.set(safeSheet, image);
          loadingRef.current.delete(safeSheet);
          trimCache(safeSheet);
          resolve(image);
        };
        image.onerror = () => {
          loadingRef.current.delete(safeSheet);
          reject(new Error(`Unable to load evolution sheet ${safeSheet + 1}`));
        };
      });
      loadingRef.current.set(safeSheet, promise);
      return promise;
    };

    const nearestDecodedFrame = (target: number) => {
      if (!cacheRef.current.size) return renderedFrameRef.current >= 0 ? renderedFrameRef.current : 0;
      let nearest = renderedFrameRef.current >= 0 ? renderedFrameRef.current : 0;
      let distance = Number.POSITIVE_INFINITY;
      for (const sheet of cacheRef.current.keys()) {
        const start = sheet * FRAMES_PER_SHEET;
        const end = Math.min(LAST_FRAME, start + FRAMES_PER_SHEET - 1);
        const candidate = Math.min(end, Math.max(start, target));
        const candidateDistance = Math.abs(candidate - target);
        if (candidateDistance < distance) {
          nearest = candidate;
          distance = candidateDistance;
        }
      }
      return nearest;
    };

    const render = (requestedFrame: number) => {
      const target = Math.min(LAST_FRAME, Math.max(0, requestedFrame));
      targetFrameRef.current = target;
      const { sheet } = frameCoordinates(target);
      const image = cacheRef.current.get(sheet);
      const frameToDraw = image ? target : nearestDecodedFrame(target);
      const fallback = frameCoordinates(frameToDraw);
      const fallbackImage = cacheRef.current.get(fallback.sheet);
      if (fallbackImage) {
        const dpr = Math.min(window.devicePixelRatio || 1, mobileQuery.matches ? 1.25 : 1.5);
        drawFrame(sharpCanvas, fallbackImage, frameToDraw, dpr);
        drawFrame(underlayCanvas, fallbackImage, frameToDraw, Math.min(dpr, 1.2));
        renderedFrameRef.current = frameToDraw;
        section.dataset.renderedFrame = String(frameToDraw);
      }

      void loadSheet(sheet).then(loaded => {
        if (targetFrameRef.current !== target) return;
        const dpr = Math.min(window.devicePixelRatio || 1, mobileQuery.matches ? 1.25 : 1.5);
        drawFrame(sharpCanvas, loaded, target, dpr);
        drawFrame(underlayCanvas, loaded, target, Math.min(dpr, 1.2));
        renderedFrameRef.current = target;
        section.dataset.renderedFrame = String(target);
        setReady(true);
      }).catch(() => {
        section.dataset.sequenceError = "true";
      });

      void loadSheet(sheet - 1).catch(() => undefined);
      void loadSheet(sheet + 1).catch(() => undefined);
    };

    const updateCopy = (frame: number) => {
      const phase = framePhase(frame);
      section.dataset.sequencePhase = phase.type;
      section.style.setProperty("--sequence-mix", String(phase.mix));
      const from = phase.type === "transition" ? phase.from : phase.chapter;
      const to = phase.type === "transition" ? phase.to : phase.chapter;
      section.dataset.sequenceFrom = String(from);
      section.dataset.sequenceTo = String(to);

      copyRefs.current.forEach((copy, index) => {
        if (!copy) return;
        let opacity = 0;
        let offset = 12;
        if (phase.type === "chapter" && index === phase.chapter) {
          opacity = 1;
          offset = 0;
        } else if (phase.type === "transition" && index === phase.from) {
          opacity = 1 - phase.mix;
          offset = -10 * phase.mix;
        } else if (phase.type === "transition" && index === phase.to) {
          opacity = phase.mix;
          offset = 10 * (1 - phase.mix);
        }
        copy.style.opacity = opacity.toFixed(4);
        copy.style.transform = `translate3d(0,${offset.toFixed(2)}px,0)`;
        copy.setAttribute("aria-hidden", opacity < 0.5 ? "true" : "false");
      });

      const dominant = phase.type === "chapter" ? phase.chapter : phase.mix < 0.5 ? phase.from : phase.to;
      setActiveChapter(previous => previous === dominant ? previous : dominant);
    };

    const update = () => {
      if (reducedQuery.matches) {
        frameRequestRef.current = null;
        return;
      }
      const rect = section.getBoundingClientRect();
      const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      const frame = Math.min(LAST_FRAME, Math.max(0, Math.round(progress * LAST_FRAME)));
      section.style.setProperty("--sequence-progress", progress.toFixed(5));
      section.dataset.frame = String(frame);
      updateCopy(frame);
      if (frame !== targetFrameRef.current || renderedFrameRef.current < 0) render(frame);
      frameRequestRef.current = null;
    };

    const requestUpdate = () => {
      if (frameRequestRef.current === null) frameRequestRef.current = window.requestAnimationFrame(update);
    };

    const resizeObserver = new ResizeObserver(() => render(targetFrameRef.current));
    resizeObserver.observe(stageRef.current ?? sharpCanvas);

    void loadSheet(0).then(() => render(0)).catch(() => {
      section.dataset.sequenceError = "true";
    });

    const idleLoad = () => {
      if (document.hidden) return;
      const boundarySheets = [2, 3, 6, 7, 9, 10, 12];
      let index = 0;
      const next = () => {
        if (index >= boundarySheets.length || document.hidden) return;
        void loadSheet(boundarySheets[index++]).catch(() => undefined).finally(() => {
          idleRef.current = window.setTimeout(next, 180);
        });
      };
      next();
    };
    idleRef.current = window.setTimeout(idleLoad, 700);

    const onVisibility = () => {
      if (!document.hidden && idleRef.current === null) idleRef.current = window.setTimeout(idleLoad, 300);
    };

    updateCopy(0);
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    reducedQuery.addEventListener("change", requestUpdate);
    mobileQuery.addEventListener("change", requestUpdate);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      reducedQuery.removeEventListener("change", requestUpdate);
      mobileQuery.removeEventListener("change", requestUpdate);
      document.removeEventListener("visibilitychange", onVisibility);
      resizeObserver.disconnect();
      if (frameRequestRef.current !== null) window.cancelAnimationFrame(frameRequestRef.current);
      if (idleRef.current !== null) window.clearTimeout(idleRef.current);
      loadingRef.current.clear();
      cacheRef.current.clear();
    };
  }, []);

  return <section
    ref={sectionRef}
    className="sequence-evolution"
    aria-labelledby="sequence-evolution-title"
    data-frame="0"
    data-rendered-frame="0"
    data-active-chapter={activeChapter}
    data-sequence-phase="chapter"
    data-sequence-from="0"
    data-sequence-to="0"
    data-ready={ready ? "true" : "false"}
    style={{ "--sequence-progress": "0", "--sequence-mix": "0" } as CSSProperties}
  >
    <header className="container sequence-evolution-heading">
      <p className="eyebrow">05 · PRECISION THROUGH TIME</p>
      <h2 id="sequence-evolution-title">One mechanism.<br />Four controlled transformations.</h2>
      <p>The uploaded reconstruction sequence is scrubbed directly by native scrolling. Copy changes only as each new instrument becomes visually dominant.</p>
    </header>

    <div className="sequence-sticky-stage">
      <div className="container sequence-layout">
        <div ref={stageRef} className="sequence-media-stage" data-loading={ready ? "false" : "true"}>
          <canvas ref={underlayCanvasRef} className="sequence-canvas sequence-canvas-underlay" aria-hidden="true" />
          <canvas ref={sharpCanvasRef} className="sequence-canvas sequence-canvas-sharp" role="img" aria-label={`Instrument evolution frame ${Number(sectionRef.current?.dataset.renderedFrame ?? 0) + 1} of ${FRAME_COUNT}`} />
          <div className="sequence-edge-feather" aria-hidden="true" />
          <div className="sequence-loading" aria-hidden="true"><span>LOADING FRAME SEQUENCE</span><i /></div>
          <div className="sequence-frame-readout" aria-hidden="true"><span>FRAME</span><b>{String(Math.min(LAST_FRAME, Math.max(0, Number(sectionRef.current?.dataset.frame ?? 0))) + 1).padStart(3, "0")} / 260</b></div>
        </div>

        <div className="sequence-copy-stage" aria-live="polite">
          <div className="sequence-copy-stack">{chapters.map((chapter, index) => <article
            ref={element => { copyRefs.current[index] = element; }}
            className="sequence-chapter-copy"
            data-chapter={index}
            key={chapter.index}
            aria-hidden={index === 0 ? "false" : "true"}
          >
            <span>{chapter.index} · {chapter.era.toUpperCase()}</span>
            <h3>{chapter.title}</h3>
            <p>{chapter.text}</p>
          </article>)}</div>
          <div className="sequence-progress" aria-hidden="true"><span>001</span><i><b /></i><span>260</span></div>
        </div>
      </div>
    </div>

    <div className="container sequence-static-grid" data-reduced={reduced ? "true" : "false"}>{chapters.map((chapter, index) => <article key={chapter.index}>
      <StaticFrame frame={representativeFrames[index]} label={`${chapter.era} instrument reconstruction`} />
      <span>{chapter.index} · {chapter.era.toUpperCase()}</span>
      <h3>{chapter.title}</h3>
      <p>{chapter.text}</p>
    </article>)}</div>

    <div className="container sequence-evolution-link"><Link href="/precision-through-time">Open the editorial history route <span aria-hidden="true">↗</span></Link></div>
  </section>;
}

export { FRAME_COUNT, framePhase };
