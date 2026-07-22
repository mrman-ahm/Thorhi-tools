# THROHI V2 — Sector 5 Signature Visual Scenes

## Scope

Sector 5 develops two homepage scenes only:

1. Macro instrument examination
2. Surgical-scissors evolution

It does not begin catalogue-template redesign, Easter eggs, final photography, 3D, audio, or smooth scrolling.

## Macro examination

### Purpose

The macro scene turns a replaceable instrument placeholder into an examination surface while keeping every annotation honest and generic.

### Regions

- Working end
- Joint
- Handle

### Interaction

- Fine pointers move a circular inspection lens.
- The nearest generic region becomes active.
- Keyboard and touch users select the same regions through visible buttons.
- The active region updates a textual readout.
- No information exists only inside the moving lens.

### Placeholder policy

The current object is an SVG concept. It does not represent an approved THROHI product image, material, dimension, finish, or manufacturing claim.

## Scissors evolution

### Chapters

1. Origin
2. Mechanism
3. Specialization
4. Precision

### Desktop behavior

- Normal vertical scrolling moves through long-form chapter copy.
- A visual stage remains sticky while the active reconstruction layer changes.
- IntersectionObserver selects the most relevant chapter.
- Focus and pointer entry also select a chapter.
- The browser scrollbar and wheel behavior remain untouched.

### Mobile behavior

- The sticky stage is removed.
- Each chapter receives its own compact reconstruction placeholder.
- Chapters follow ordinary document flow.

### Reduced-motion behavior

- The moving lens and reticle are removed.
- The sticky evolution stage is removed.
- All four chapter cards and reconstruction placeholders remain visible.
- No content or route is lost.

## Visual principles

- Surgical and mechanical rather than futuristic.
- Amber progresses toward blue, green, and mint.
- The evolution section remains a bright editorial intermission around a dark instrument stage.
- Crossfades and transform changes are restrained.
- Every temporary visual is labelled as a reconstruction placeholder.

## Engineering principles

- Native React and CSS only.
- IntersectionObserver for chapter selection.
- requestAnimationFrame for scroll progress.
- CSS custom properties for pointer coordinates.
- No scroll hijacking.
- No smooth-scroll dependency.
- No 3D or WebGL.
- No changes to catalogue, search, inquiry, API, or migration behavior.

## Replacement path

Final approved photography or illustrations can replace the placeholder object and chapter layers without changing the interaction contract, page routes, content structure, or accessibility controls.
