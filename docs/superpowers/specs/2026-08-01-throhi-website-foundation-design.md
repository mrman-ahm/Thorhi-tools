# THROHI Website Foundation Design Specification

**Date:** 2026-08-01  
**Status:** Awaiting user review  
**Project:** THROHI Medical Tools website and owner admin  
**Repository:** `mrman-ahm/Thorhi-tools`  
**Working branch:** `design/surgical-precision-archive`

## 1. Purpose and precedence

This document consolidates the currently approved strategic, brand, UX, content, interface, responsive, accessibility, product-catalogue, inquiry, contact, catalogue-document, motion, and admin foundations for the THROHI website.

It supersedes earlier conflicting redesign assumptions, including:

- four publicly visible divisions;
- scissors evolution on the homepage;
- attachment-based inquiry flows;
- heritage-heavy or fake-European positioning;
- dark-first page treatment;
- ecommerce wording or behavior;
- unsupported company, export, manufacturing, certification, material, capacity, history, pricing, or response-time claims;
- rejected responsive wireframes on the Figma page `02 — Public Website Wireframes`;
- any earlier typography direction that conflicts with the approved hierarchy in this document.

Existing repository implementation, tests, assets, and data remain valuable engineering references, but they do not overrule this approved design foundation.

## 2. Business role and product positioning

THROHI is presented as a surgical and dental instrument manufacturer/supplier based in Sialkot, Pakistan.

The website has three primary business jobs:

1. establish a credible international-facing company identity;
2. help buyers discover and evaluate catalogue products;
3. make direct contact and quotation inquiry fast and clear.

The primary audience is international procurement professionals, importers, and distributors. The experience must also remain understandable for hospitals, clinics, practitioners, and other buyers.

The positioning is:

> An authentic Sialkot-based surgical and dental instrument business presented with modern international clarity, catalogue depth, and direct inquiry access.

The website must not imitate a European heritage brand, luxury fashion house, design agency, game studio, or generic startup.

## 3. Core design principles

### 3.1 Trust through evidence

Trust is created through real catalogue depth, product names, reference codes, families, images, original documents, verified contact details, and clear inquiry behavior.

Decorative seals, invented certifications, fabricated statistics, vague claims, or false heritage devices must not be used.

### 3.2 Spacious brand pages, compact operational interfaces

The overall site composition should feel spacious and deliberate. Catalogue records, specifications, filters, forms, and admin controls should become more compact and information-dense where utility demands it.

The experience must never become either empty and theatrical or cramped and spreadsheet-like.

### 3.3 Images over unnecessary 3D

Real product imagery and the supplied motion assets take priority over decorative 3D. Cinematic presentation is reserved for selected signature moments, not repeated across every section.

### 3.4 Clear procurement behavior

The site must use straightforward product, catalogue, quotation, contact, and inquiry language. It is not an ecommerce checkout system.

### 3.5 No unsupported facts

The following remain unpublished until verified and supplied by the client:

- founding year or company history;
- certifications;
- materials and steel grades;
- manufacturing capabilities or capacity;
- export regions or markets;
- OEM/private-label claims;
- minimum order quantities;
- lead times;
- exact phone numbers, emails, addresses, map location, or operating hours;
- response-time guarantees;
- legal wording;
- final pricing policy;
- complete Beauty and Veterinary division content;
- final catalogue PDF files and metadata.

## 4. Public information architecture

The approved public sitemap is:

1. Home
2. Company
3. Products
4. Product Detail
5. Catalogues
6. Inquiry
7. Contact
8. Admin login and owner interface

Only two divisions are public:

- Surgical
- Dental

Beauty and Veterinary may exist only as hidden future admin divisions. They must not appear publicly until manually activated with complete approved content.

## 5. Typography system

### 5.1 Font roles

- **DM Serif Display Regular** — homepage hero, page titles, selected major H1 and H2 headings, and occasional editorial statements on Company.
- **Instrument Sans** — navigation, body copy, product names, H3 through H6, buttons, forms, filters, tables, admin controls, and all practical interface text.
- **IBM Plex Mono** — product codes, reference numbers, dimensions, quantities, variants, catalogue metadata, and other technical labels.

### 5.2 Serif restrictions

The serif must remain elegant and recognizably serif, never heavy or visually close to a bold sans-serif.

Rules:

- use DM Serif Display Regular only;
- do not apply artificial bolding;
- do not use uppercase serif headings;
- do not use very tight tracking;
- avoid oversized, blocky, or excessively compressed display treatment;
- do not use the serif for product names, filters, navigation, buttons, forms, specifications, or long paragraphs;
- reserve serif primarily for H1 and H2 hierarchy.

### 5.3 Sans and mono behavior

Instrument Sans carries most of the product and interface experience. IBM Plex Mono should improve technical scanning, not turn the site into a developer dashboard.

## 6. Color system and page atmosphere

The approved palette direction is:

- **Emerald** — primary actions, selected states, active filters, important emphasis;
- **Technical blue** — catalogue navigation, structural information, secondary actions, supporting data;
- **Warm ivory / paper** — dominant page background;
- **White** — product cards, forms, tables, and clean content surfaces;
- **Deep ink** — primary text, footer, and limited cinematic sections;
- **Muted brass** — rare editorial accent only.

Reference color direction from the approved Figma study:

- Emerald: `#0B6B4E`
- Soft emerald: `#D9EEE6`
- Technical blue: `#3F6475`
- Soft blue: `#E1E9EC`
- Paper: `#F6F3EA`
- Ink: `#132522`
- Muted text: `#65736F`
- Accent brass: `#A88955`

The website is light-first. Dark sections are used sparingly for cinematic emphasis, intro media, footer treatment, or selected editorial transitions.

The brass accent must not create a luxury or antique identity.

## 7. Shape, spacing, and surface language

### 7.1 Geometry

Use restrained low-radius geometry:

- 4–8 px corner radii for cards, inputs, and buttons;
- pills only for filters, tags, and compact statuses;
- no excessive capsules;
- no sharp gaming-style geometry;
- no exaggerated blobs or decorative cut-outs.

### 7.2 Structure

Fine borders, spacing, grouping, and background contrast should establish hierarchy before shadows.

Use shadows only where elevation or layering truly needs explanation.

### 7.3 Layout density

- spacious brand composition on Home and Company;
- compact technical information inside catalogue records, filters, specifications, forms, and admin;
- no oversized empty sections;
- no decorative whitespace without a communication purpose.

## 8. Layout system

Use a hybrid grid system:

- editorial, slightly asymmetric compositions on Home and Company;
- strict aligned grids for Products, Product Detail, Inquiry, Contact forms, Catalogues, and Admin;
- 12-column desktop foundation;
- maximum content width around 1400–1440 px;
- narrower text columns for long-form company content;
- deliberate tablet and mobile rearrangement rather than simple desktop stacking.

## 9. Product imagery system

Product imagery uses a clinical specimen presentation:

- warm neutral or pale steel backgrounds;
- full instrument silhouette preserved;
- no aggressive cropping;
- no fake reflections, excessive glow, or dramatic color grading;
- consistent image-stage proportions across catalogue cards;
- lower-resolution Surgical source images kept at a controlled display size;
- higher-resolution Dental images may receive more visual space without breaking grid consistency;
- cinematic lighting limited to the intro and selected editorial moments.

The catalogue should use three products per row on desktop because the source imagery varies in quality and should not be enlarged beyond useful sharpness.

## 10. Motion system

The motion model has two levels.

### 10.1 Signature motion

Only two major signature experiences are approved:

1. the first-visit intro;
2. the scissors evolution sequence on the Company page.

### 10.2 Functional motion

Navigation transitions, filter changes, inquiry feedback, accordions, galleries, dialogs, status changes, and page transitions may use restrained functional animation.

### 10.3 Motion prohibitions

Do not use constant floating, glowing, repeated parallax, decorative cursor effects, or animation that slows product browsing.

### 10.4 Reduced motion

Reduced-motion users receive the same information immediately:

- skip or shorten the intro;
- simplify the scissors sequence into static or low-motion presentation;
- remove nonessential movement;
- preserve navigation and content access.

## 11. Content voice

The approved voice is:

- factual;
- concise;
- confident without exaggeration;
- internationally understandable;
- procurement-friendly;
- specific about products and inquiry actions;
- restrained in its use of Sialkot identity;
- transparent when information is unverified.

Avoid phrases such as:

- world-class;
- unmatched quality;
- industry-leading;
- finest craftsmanship;
- trusted worldwide;
- decades of excellence;
- any other unsupported superlative.

Small utility labels should be meaningful. Do not add decorative section labels that merely restate obvious section names.

## 12. Global navigation

### 12.1 Desktop

Use a persistent header containing:

- Company
- Products
- Catalogues
- Contact
- Search
- Inquiry

Products uses a division-first menu:

- Surgical
- Dental

Family selection filters the unified catalogue rather than creating disconnected family pages.

Inquiry count remains visible when products have been added.

### 12.2 Mobile

Use a full-height navigation panel with the same hierarchy. Essential routes must not be hidden behind unclear icons or gesture-only behavior.

### 12.3 Navigation restrictions

- no oversized decorative mega-menu;
- no hidden essential pages;
- no motion effect that delays navigation;
- no duplicate route naming;
- no public Beauty or Veterinary links before activation.

## 13. Home page foundation

After the brief cinematic intro, the homepage hierarchy is:

1. clear THROHI identity and verified Sialkot origin;
2. immediate access to Surgical and Dental products;
3. direct catalogue search by product name or reference code;
4. representative product families;
5. concise verified company introduction;
6. original catalogue downloads;
7. strong Contact and Inquiry conclusion.

The homepage should help a buyer reach products or contact quickly.

The full scissors evolution story must not appear on Home.

The homepage must not contain fake statistics, unsupported certificates, filler process diagrams, generic testimonials, decorative award strips, or oversized mission statements.

## 14. Company page foundation

The approved Company structure is:

1. **THROHI introduction** — concise identity, location, and verified business role;
2. **Sialkot context** — brief factual explanation of the region’s relevance to instrument manufacturing;
3. **Instrument evolution** — general evolution sequence using the supplied scissors frames;
4. **THROHI today** — present-day Surgical and Dental focus, catalogue depth, and inquiry support using verified facts only;
5. **Contact conclusion** — direct links to Contact, WhatsApp, catalogues, and product inquiry.

The evolution sequence must never imply that THROHI invented or manufactured the historical instruments shown. It should end with modern surgical scissors and transition into THROHI’s current identity.

No factory-tour filler, fabricated historical timeline, unsupported founder story, oversized values section, or fake certification panel should be used.

## 15. Products experience

### 15.1 Entry and browsing

The first decision is division:

- Surgical
- Dental

The second decision is family.

Selecting a family updates a unified searchable catalogue instead of opening fragmented family pages.

### 15.2 Search and filters

Search supports:

- product name;
- reference code.

Filters may include:

- division;
- family;
- other attributes only when the source data supports them reliably.

Avoid deep filter stacks with no data value.

### 15.3 Catalogue grid

Desktop uses three products per row.

Each card contains:

- stable contained image stage;
- product name in Instrument Sans;
- reference code in IBM Plex Mono;
- concise division/family context when useful;
- clear detail action;
- clear Add to Inquiry action.

### 15.4 Product detail

Product detail includes:

- larger contained product imagery;
- variants and reference codes;
- verified specifications;
- optional price display when configured;
- related products;
- Quick Inquiry;
- Add to Inquiry.

### 15.5 Pricing

Pricing is optional and controlled by the owner.

Default public state:

> Contact for quotation

When enabled, the owner may configure exact price or range and currency. The system must not invent prices.

### 15.6 Catalogue behavior restrictions

- no customer account required;
- no cart, checkout, or payment language;
- no fake stock labels;
- no ratings or reviews without a real system;
- no unsupported delivery promises;
- no oversized product imagery that exposes source limitations;
- no endless scrolling without clear navigation and state retention.

## 16. Catalogues page

### 16.1 Groups

Display separate document groups for:

- Surgical catalogue;
- Dental catalogue.

A combined catalogue is shown only when THROHI supplies one.

### 16.2 Document information

Each document may show:

- title;
- division;
- edition or date when supplied;
- file size;
- open/download action.

### 16.3 Access

Original client-supplied PDFs must open or download directly without email gates, forms, or account creation.

### 16.4 Admin document controls

The owner may:

- upload;
- replace;
- reorder;
- hide;
- archive;
- restore.

The website must never edit, merge, rewrite, or generate the original PDF content.

### 16.5 Missing-document state

When a catalogue is unavailable, show a factual contact prompt. Never provide a fake download or placeholder PDF.

## 17. Inquiry experience

### 17.1 Inquiry types

Two entry paths are approved:

- **Quick Inquiry** for one product;
- **Inquiry List** for multiple products.

No customer account is required.

### 17.2 Product information retained

Each selected product keeps:

- product name;
- reference code;
- quantity;
- optional note.

If a referenced product is later archived or deleted, retained inquiry records must preserve the stored product name and reference code.

### 17.3 Contact form fields

The inquiry form may include:

- name;
- company;
- country;
- email;
- phone or WhatsApp;
- preferred contact method;
- message.

No file uploads are part of the approved inquiry flow.

### 17.4 Submission behavior

The inquiry is sent to the configured THROHI email destination and stored as one of the latest 20 lightweight admin records.

At record 21, the oldest retained lightweight record is removed.

There is no CRM status workflow.

### 17.5 Approved language

Use:

- Add to Inquiry;
- Inquiry List;
- Quick Inquiry;
- Request Quotation;
- Submit Inquiry.

Do not use:

- cart;
- basket;
- checkout;
- place order;
- payment.

## 18. Contact page

The Contact page is the primary conversion page.

Its structure is:

1. primary WhatsApp, email, and phone options near the top;
2. focused general inquiry form;
3. verified company details;
4. location and map only after exact address confirmation;
5. response-time guidance only when verified;
6. clear separation between general contact and product-based inquiry.

Product inquiries retain selected products. General contact submissions remain simpler.

Missing contact details remain unpublished rather than replaced with filler.

## 19. Admin experience

### 19.1 Access model

- one owner account;
- no public registration;
- no staff roles;
- secure email/password access;
- 2FA, password reset, session management, rate protection, and an audit log are recommended security requirements for implementation planning.

### 19.2 Dashboard

The dashboard should summarize:

- product totals;
- visible divisions;
- catalogue-document status;
- latest inquiries;
- draft changes;
- publishing state.

### 19.3 Content management

The owner can manage:

- approved website copy;
- homepage sections;
- Company content;
- contact information;
- navigation visibility;
- calls to action.

### 19.4 Product management

The owner can manage:

- divisions;
- families;
- products;
- variants;
- images;
- specifications;
- optional price visibility;
- draft, active, hidden, and archived states.

### 19.5 Catalogue-document management

The owner can upload, replace, reorder, hide, archive, and restore original catalogue PDFs.

### 19.6 Inquiry records

The admin displays the latest 20 lightweight inquiry records with contact information and referenced products.

No status pipeline, sales stages, or CRM automation are included.

### 19.7 Publishing and versions

Workflow:

> Draft → Preview → Publish

Retain the latest five published versions.

Restoring an older version creates a new draft first. It does not immediately overwrite the public site.

### 19.8 Deletion behavior

Archive is the default removal action.

Permanent deletion must be separate, explicit, and strongly confirmed.

### 19.9 Division states

Supported division states:

- draft;
- active;
- hidden;
- archived.

Surgical and Dental are the intended public divisions. Beauty and Veterinary remain hidden future divisions until manually activated with approved content.

## 20. Responsive behavior

Mobile and tablet layouts are designed around task priority rather than mechanically stacking desktop frames.

### 20.1 Product grids

- desktop: three columns;
- tablet: two columns where space permits;
- mobile: one column.

### 20.2 Filters

Desktop filters may remain visible where practical. Mobile filters move into a focused drawer or sheet with clear apply, reset, and close behavior.

### 20.3 Navigation

Mobile navigation uses a full-height accessible panel with visible hierarchy and inquiry access.

### 20.4 Content order

On smaller screens, product access, search, contact, and inquiry actions should appear before secondary editorial content.

### 20.5 Images

Product silhouettes remain fully visible and stable across breakpoints. Media must not create layout shifts or unpredictable cropping.

## 21. Accessibility foundation

The target is WCAG 2.2 AA.

Requirements include:

- full keyboard access for navigation, search, filters, galleries, dialogs, inquiry controls, and admin publishing;
- visible focus states;
- hover never used as the only signal;
- distinct selected, loading, success, disabled, and error states;
- practical touch target sizing;
- accessible color contrast;
- readable minimum type sizes;
- semantic heading order;
- labelled fields and controls;
- reduced-motion support;
- focus trapping only where appropriate and always reversible;
- accessible error summaries and inline validation;
- no content hidden exclusively behind animation.

## 22. Asset usage

### 22.1 Intro asset

The supplied 720p intro video may be used as the brief first-visit cinematic experience.

Behavior:

- first visit receives the complete brief sequence;
- returning visitors skip or receive a shortened version;
- the intro slides away to reveal the website;
- it must never block product or contact access;
- reduced-motion users bypass it.

### 22.2 Scissors evolution frames

The supplied 260-frame sequence is used only on the Company page.

### 22.3 Logo

The current transparent logo asset appears to require final production verification. Do not treat it as a final master until edge quality and background contamination are resolved.

### 22.4 Catalogue PDFs

Original Surgical and Dental PDFs were not confirmed in the supplied project sources at the time of this specification. The public download experience must remain unavailable or factual until real files are supplied.

## 23. Explicit anti-patterns

The final design must avoid:

- generic AI section labels;
- repetitive card grids without hierarchy;
- fake testimonials;
- fake statistics;
- unsupported certifications;
- decorative awards;
- excessive pills;
- enormous headings with little content;
- excessive whitespace;
- constant gradients, glow, blur, or glass effects;
- dark mode across every section;
- sharp gaming-style controls;
- template-like startup copy;
- repeated floating objects;
- decorative parallax across ordinary pages;
- ecommerce language;
- fake urgency;
- fabricated product or company claims;
- family pages that fragment the catalogue unnecessarily;
- public Beauty or Veterinary content before activation;
- a factory-showcase page without verified material;
- a long manufacturing-process section without verified material;
- scissors evolution on Home;
- file uploads in inquiry;
- mandatory customer accounts.

## 24. Figma design direction

The approved working Figma file is:

`THROHI Website & Admin Dashboard — Design System and UX`

File key:

`w12E41un4krAwBqlo8fHa6`

Approved typography direction:

- Study A — Editorial Precision;
- DM Serif Display + Instrument Sans + IBM Plex Mono;
- serif restricted to major H1/H2 use and kept regular, restrained, and clearly serif.

The rejected wireframes on page `02 — Public Website Wireframes` must not be treated as approved layout guidance.

The next design artifact after approval of this written specification is a deliberate Figma foundation system covering:

- color tokens;
- typography styles;
- spacing scale;
- responsive grid;
- surfaces and borders;
- image-stage rules;
- buttons and links;
- form controls;
- navigation states;
- cards and catalogue records;
- filters;
- inquiry controls;
- admin patterns;
- accessibility states.

Full page wireframes should begin only after those foundations are established.

## 25. Validation criteria

The design and later implementation should be considered aligned only when:

- buyers can identify THROHI, its location, and its Surgical/Dental focus quickly;
- buyers can reach products by division, family, name, or code;
- product imagery remains usable despite mixed source quality;
- catalogue PDFs are direct and authentic;
- product inquiry requires no account;
- Contact remains prominent;
- no unsupported company claim is published;
- the intro and evolution animation do not obstruct core tasks;
- the interface works with keyboard and reduced motion;
- mobile navigation, filters, products, and inquiry remain practical;
- owner publishing is controlled through draft, preview, versions, archive, and strong delete confirmation;
- Beauty and Veterinary remain hidden until explicitly activated.

## 26. Deferred decisions and required inputs

The following are deliberately deferred to implementation planning or client verification:

- final contact details;
- inquiry-recipient email;
- exact physical address and map;
- operating hours;
- response-time statement;
- real catalogue PDF files and metadata;
- final logo master;
- verified certifications;
- verified materials;
- verified capabilities and capacity;
- verified markets and OEM information;
- MOQ and lead-time policy;
- final pricing policy;
- legal/privacy wording;
- admin hosting, authentication provider, storage provider, email provider, and backup details;
- final analytics and consent requirements.

No placeholder claim may silently become production content.

## 27. Approval boundary

Approval of this specification authorizes creation of the implementation plan. It does not authorize coding, deployment, merging, GitHub Actions usage, or production changes.

Those actions require a separately approved implementation plan and explicit permission to begin implementation.
