# THROHI V2 — Sector 9D Scroll Cinema

## Purpose

Sector 9D uses the supplied opening MP4 and 260-frame transformation sequence as two distinct homepage experiences:

1. an autoplaying opening stage that leaves through native scrolling
2. a scroll-controlled evolution canvas whose text follows actual rendered frame boundaries

The sequence is not treated as a conventional embedded video.

## Opening stage

- full viewport
- muted and inline
- media mounted only after the generated manifest confirms availability
- no wheel interception
- no body scroll lock
- no mandatory playback completion
- `SCROLL TO ENTER` moves to the normal homepage through native page scrolling
- header remains visually absent until the opening stage clears
- reduced motion receives a complete static THROHI identity stage
- missing media produces the same designed static identity without a 404 request

## Hero handoff

The normal homepage hero no longer repeats the scissors placeholder from the opening stage.

The right-side object is now a THROHI Medical Tools identity composition using the approved logo, technical axes, restrained orbits, and division metadata.

Search and direct catalogue access remain immediately available.

## Analyzed frame boundaries

| Chapter | Frames | Scroll allocation |
| --- | ---: | ---: |
| Origin | 001–056 | 0.00–0.24 |
| Mechanism | 057–129 | 0.24–0.50 |
| Specialization | 130–197 | 0.50–0.76 |
| Modern Precision | 198–247 | 0.76–0.94 |
| Exit contraction | 248–260 | 0.94–1.00 |

The exit remains part of Modern Precision. It does not create an unsupported fifth historical chapter.

## Text synchronization

The target frame is calculated from native scroll progress through a piecewise mapping.

The canvas renderer eases its rendered frame toward that target through `requestAnimationFrame`.

The active copy changes only after `chapterIndexForFrame(renderedFrame)` crosses the analyzed threshold. It never changes solely because target scroll percentage entered a new segment.

This makes the instrument the timing authority.

## Canvas renderer

- one `<canvas>`
- one sprite image
- 12 columns × 22 rows
- 240 × 135 source cells
- 260 used cells
- device-pixel ratio capped at 1.5
- canvas dimensions update only when display size changes
- frame drawing remains outside React rendering
- React state changes only at chapter boundaries
- frame readout updates through a ref
- no 260-image DOM tree

## Media blending

The opening MP4 and canvas use:

- radial alpha masks
- horizontal edge feathering
- vertical edge feathering
- the same `#030504` environmental black as the stage

Blur is not applied to the instrument. A mild backdrop blur is permitted only on the small scroll instruction pill.

## Media pipeline

`predev` and `prebuild` run `scripts/prepare-cinematic-assets.mjs`.

The script:

1. checks for already prepared static files
2. reads optional chunked source files from `assets/sector9d`
3. decodes the base64 archive
4. extracts `intro.mp4` and `evolution-sprite.webp`
5. emits `/public/media/sector9d/manifest.json`

The browser consults the manifest before mounting media. Missing assets therefore produce no media 404 and no console error.

## Failure state

When the manifest reports unavailable media:

- the opening stage shows the THROHI fallback
- the evolution section becomes a normal-height static editorial section
- all four chapter records remain visible
- the canvas area shows a designed archive placeholder
- no empty 650-viewport scroll range remains

## Reduced motion

- opening video is not mounted
- opening stage is static
- scroll arrow is removed
- sequence section becomes normal document flow
- all four chapter records are visible
- canvas does not drive chapter transitions
- all catalogue and inquiry tasks remain unchanged

## Protected behavior

Sector 9D does not modify:

- catalogue records
- search ranking, filters, or sorting
- inquiry persistence
- quantities and notes
- manual products
- remove and undo
- attachment validation
- buyer validation
- API submission behavior
- migration pipeline

## Validation

- exact frame-boundary source contracts
- one-canvas architecture
- text follows rendered frame
- native-scroll cinematic exit
- THROHI identity handoff
- exit frames 248–260
- silent missing-media fallback
- synthetic sprite browser validation
- reduced motion
- desktop and mobile layouts
- accessibility
- overflow
- complete existing quality matrix
