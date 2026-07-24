# THROHI V2 — Sector 10 Precision Secrets

## Purpose

Sector 10 adds restrained hidden interactions after the approved motion and cinematic phases. The secret layer is decorative and never required to understand, navigate, search, or submit an inquiry.

## Activation

- type `THROHI` outside form fields
- press and hold the header brand, homepage identity, or footer identity for 720 ms
- press Escape to close
- the state clears automatically after 9 seconds

The keyboard buffer resets after 1.5 seconds. Form fields, editable content, keyboard shortcuts with modifiers, and normal typing are ignored.

## Visual response

The temporary state reuses the existing visual language:

- thin calibration frame
- restrained central measurement axes
- corner registration marks
- static 00–100 scale
- existing technical labels and catalogue codes receive a subtle engraved highlight
- existing hero, division, family, evolution, product, result, and footer surfaces receive a very light calibration outline
- footer letters perform one controlled alignment motion

No new product information or manufacturing claim is displayed.

## Interaction protection

- the overlay has `pointer-events: none`
- long-press activation suppresses only the resulting brand click so the secret does not navigate away
- normal short clicks remain unchanged
- the visual overlay hides while menus, search, or form fields are active
- search, catalogue, inquiry, and route behavior remain unchanged

## Accessibility

- activation is announced through a visually hidden polite status region
- Escape closes the state
- reduced motion presents the complete layer statically
- no essential content is hidden behind the secret
- the layer itself is `aria-hidden`

## Performance

- no new dependency
- no continuous animation loop
- one global client component
- one timeout for the active state
- one timeout for the keyboard buffer
- one timeout for pointer hold detection
- all listeners and timers clean up on unmount

## Exclusions

No:

- particles
- cursor trails
- magnetic controls
- audio
- WebGL or 3D
- glitch or typewriter effects
- bouncing, elastic, or spring motion
- continuous loops
- scroll hijacking
- fake dimensions, materials, dates, certifications, or capabilities

## Review gate

Sector 10 must pass:

- lint
- strict TypeScript
- unit and catalogue-pipeline tests
- production build
- desktop and mobile browser suites
- keyboard activation and Escape
- form-field exclusion
- pointer/touch-equivalent long press
- reduced motion
- accessibility
- horizontal overflow
- catalogue, search, inquiry, API, and migration regressions

Do not begin Sector 11 responsive reconstruction until this phase is visually approved.
