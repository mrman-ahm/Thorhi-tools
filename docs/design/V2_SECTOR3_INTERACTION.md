# THROHI V2 — Sector 3 Interaction System

## Scope

Sector 3 adds behavior only to navigation and the homepage hero. It does not begin division choreography, family scrolling, scissors evolution, Easter eggs, smooth scrolling, final imagery, or 3D.

## Header states

- **Initial:** quiet near-transparent dark surface.
- **Scrolled:** reduced header height and tighter navigation spacing.
- **Scrolling down:** header may move out after the visitor has passed the opening area.
- **Scrolling up:** header returns immediately.
- **Menu open:** header remains visible and body scrolling is locked.
- **Reduced motion:** the header never hides through motion.

## Full-screen menu

- Available on desktop and mobile.
- Four divisions are the dominant navigation layer.
- Product, search, company, resources, contact, and inquiry remain direct routes.
- Focus moves into the menu when opened.
- Tab and Shift+Tab cycle inside the open menu.
- Escape closes the menu.
- Focus returns to the menu trigger after closing.
- Inactive menu content uses `inert` and `aria-hidden`.

## Hero entrance

The hero introduces content in this order:

1. technical index
2. display statement
3. instrument placeholder
4. supporting statement
5. catalogue search
6. scroll indicator

The sequence uses opacity and transform only. It does not delay input availability or page navigation.

## Inspection behavior

- Fine pointers control a restrained radial inspection light.
- Instrument edges receive a small green/blue highlight.
- Generic technical markers become clearer while inspecting.
- The pointer effect does not expose unique information.
- Touch devices use a slow automatic lighting drift.
- Reduced-motion mode removes the inspection light.

## Hero scroll exit

The hero title, object, statement, search, and scroll indicator move at different restrained rates while leaving the viewport. Native page scrolling remains unchanged.

## Performance rules

- No external motion library.
- Scroll updates are grouped through `requestAnimationFrame`.
- Pointer movement writes CSS custom properties directly rather than rerendering React.
- Transform and opacity are the primary animated properties.
- No scroll hijacking or forced smooth scrolling.

## Accessibility rules

- Search remains normal semantic HTML.
- Menu state uses `aria-expanded` and `aria-controls`.
- Focus trapping and restoration are mandatory.
- Escape always closes the menu.
- Reduced motion preserves the complete static composition.
- Motion never communicates required product information.

## Explicit exclusions

- Division-section scroll choreography
- Family horizontal passage
- Scissors image sequence
- Easter eggs
- Audio
- Final photography
- 3D assets or rendering
