# Sector 9D refinement — cover handoff, higher-resolution sequence, clean identity

## Opening handoff

The opening cinematic is a rigid cover over the normal homepage. The section occupies 200svh while applying a -100svh overlap, so the homepage exists beneath the cover rather than following as a conventional section. Native scroll moves the cover upward from 0 to -100svh. The cover does not fade while leaving; a restrained lower-edge shadow and rule preserve the physical sheet metaphor.

The scroll invitation is hidden until the intro video finishes, media fails, or reduced motion is active. Header controls remain hidden until the cover is almost completely removed.

## Evolution quality

The 260 source JPGs remain the visual source of truth. The build generates:

- desktop WebP sprite: 640 × 360 per frame, quality 90;
- mobile WebP sprite: 400 × 225 per frame, quality 86.

The desktop sheet is 7680 × 7920, which stays below the common 8192-pixel texture ceiling while materially improving the rendered frame quality.

## Identity asset

The homepage hero and persistent site header use `public/brand/throhi-logo-clean.webp`, a cleaned transparent export with the checkerboard and residual inter-letter background removed.

## Safety

- native scrolling only;
- no wheel interception;
- complete reduced-motion layout;
- existing 260-frame timing boundaries unchanged;
- exact rendered-frame-to-copy synchronization unchanged;
- all generated media stays outside the JavaScript bundle.
