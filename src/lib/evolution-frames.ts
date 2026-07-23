export const EVOLUTION_FRAME_COUNT = 260;
export const EVOLUTION_SPRITE_COLUMNS = 12;
export const EVOLUTION_SPRITE_ROWS = 22;
export const EVOLUTION_SOURCE_WIDTH = 240;
export const EVOLUTION_SOURCE_HEIGHT = 135;

export type EvolutionChapter = {
  id: "origin" | "mechanism" | "specialization" | "precision";
  index: string;
  eyebrow: string;
  title: string;
  description: string;
  startFrame: number;
  endFrame: number;
  scrollStart: number;
  scrollEnd: number;
};

export const EVOLUTION_CHAPTERS: readonly EvolutionChapter[] = [
  {
    id: "origin",
    index: "01",
    eyebrow: "ORIGIN",
    title: "The cutting form emerges.",
    description: "The sequence begins with a heavy historical shear profile and holds long enough for its construction to be read before the first transformation.",
    startFrame: 1,
    endFrame: 56,
    scrollStart: 0,
    scrollEnd: 0.24
  },
  {
    id: "mechanism",
    index: "02",
    eyebrow: "MECHANISM",
    title: "The profile becomes controlled.",
    description: "At frame 57 the object resolves into a refined hinged scissor form. The copy changes only after that visual threshold is reached.",
    startFrame: 57,
    endFrame: 129,
    scrollStart: 0.24,
    scrollEnd: 0.50
  },
  {
    id: "specialization",
    index: "03",
    eyebrow: "SPECIALIZATION",
    title: "Precision enters the handle and edge.",
    description: "Frames 130 through 197 introduce the ornate precision profile. The transformation receives its own scroll distance instead of being rushed through a linear timeline.",
    startFrame: 130,
    endFrame: 197,
    scrollStart: 0.50,
    scrollEnd: 0.76
  },
  {
    id: "precision",
    index: "04",
    eyebrow: "MODERN PRECISION",
    title: "The instrument becomes surgical.",
    description: "At frame 198 the silhouette changes into a contemporary locking surgical instrument. Frames 248 through 260 then contract the object into the next section.",
    startFrame: 198,
    endFrame: 247,
    scrollStart: 0.76,
    scrollEnd: 0.94
  }
] as const;

const EXIT_SEGMENT = {
  startFrame: 248,
  endFrame: 260,
  scrollStart: 0.94,
  scrollEnd: 1
} as const;

export function clampUnit(value: number) {
  return Math.min(1, Math.max(0, value));
}

function mapSegment(progress: number, scrollStart: number, scrollEnd: number, startFrame: number, endFrame: number) {
  const local = clampUnit((progress - scrollStart) / Math.max(scrollEnd - scrollStart, Number.EPSILON));
  return startFrame + (endFrame - startFrame) * local;
}

export function frameForEvolutionProgress(progressInput: number) {
  const progress = clampUnit(progressInput);

  for (const chapter of EVOLUTION_CHAPTERS) {
    if (progress <= chapter.scrollEnd) {
      return Math.round(mapSegment(progress, chapter.scrollStart, chapter.scrollEnd, chapter.startFrame, chapter.endFrame));
    }
  }

  return Math.round(mapSegment(
    progress,
    EXIT_SEGMENT.scrollStart,
    EXIT_SEGMENT.scrollEnd,
    EXIT_SEGMENT.startFrame,
    EXIT_SEGMENT.endFrame
  ));
}

export function chapterIndexForFrame(frameInput: number) {
  const frame = Math.min(EVOLUTION_FRAME_COUNT, Math.max(1, Math.round(frameInput)));
  const index = EVOLUTION_CHAPTERS.findIndex(chapter => frame >= chapter.startFrame && frame <= chapter.endFrame);
  return index === -1 ? EVOLUTION_CHAPTERS.length - 1 : index;
}

export function spriteCellForFrame(frameInput: number) {
  const frame = Math.min(EVOLUTION_FRAME_COUNT, Math.max(1, Math.round(frameInput)));
  const zeroBased = frame - 1;
  return {
    column: zeroBased % EVOLUTION_SPRITE_COLUMNS,
    row: Math.floor(zeroBased / EVOLUTION_SPRITE_COLUMNS)
  };
}

export function exitOpacityForFrame(frameInput: number) {
  const frame = Math.min(EVOLUTION_FRAME_COUNT, Math.max(1, frameInput));
  if (frame < EXIT_SEGMENT.startFrame) return 1;
  return 1 - clampUnit((frame - EXIT_SEGMENT.startFrame) / (EXIT_SEGMENT.endFrame - EXIT_SEGMENT.startFrame));
}
