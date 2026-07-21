# THROHI Website — Sitemap and Information Architecture

**Status:** Working architecture for wireframing  
**Date:** 2026-07-22

---

## 1. Global navigation

### Primary desktop navigation

- Products
- Company
- Resources
- Contact
- Search
- Inquiry basket

### Primary mobile navigation

- Search products
- Products
- Company
- Resources
- Contact
- Inquiry basket

The inquiry basket should remain visible as a compact icon with item count. Search must be more prominent on mobile than a conventional hidden search icon because many buyers may arrive with a product code.

---

## 2. Products mega-menu

The top-level product menu should expose the four main divisions without listing every legacy category.

### Dental Instruments

Grouped families proposed for validation:

- Examination and Diagnostic
- Extraction
- Periodontal
- Restorative and Filling
- Endodontic
- Oral Surgery
- Orthodontic and Prosthetic
- Syringes and Irrigation
- Rubber Dam and Matrix
- Laboratory, Trays, and Hollowware

### Surgical Instruments

Grouped families proposed for validation:

- Diagnostic and Anaesthesia
- Scalpels and Knives
- Scissors
- Forceps and Clamps
- Needle Holders and Suturing
- Hooks and Retractors
- Probes, Dilators, and Specula
- Suction Instruments
- Bone Surgery
- Specialty Surgery
- Plaster and Hospital Ware
- Tungsten Carbide Instruments

### Veterinary Instruments

Grouped families proposed for validation:

- General Veterinary
- Equine Dental
- Hoof and Farrier
- Bone Surgery
- Obstetrical
- Castration and Dehorning
- Branding, Tagging, and Identification
- Injectors and Extractors
- Grooming and Restraining

### Beauty Instruments

Grouped families proposed for validation:

- Professional Hair Scissors
- Barber Scissors and Razors
- Nail and Cuticle
- Manicure and Pedicure
- Tweezers
- Eyebrow and Eyelash
- Salon Tools
- Cases, Kits, and Accessories

These groups are a cleaned navigation model, not a final reclassification. Each legacy product must be mapped and verified before import.

---

## 3. Complete sitemap

### Home

`/`

Purpose:

- Establish first impression
- Explain the product range
- Provide immediate search
- Direct visitors into the four divisions
- Introduce the inquiry system
- Provide a controlled brand story

### Products landing

`/products`

Purpose:

- Search all products
- Browse all divisions
- Browse common instrument families
- Access catalogues
- Resume an inquiry

Child pages:

- `/products/dental`
- `/products/surgical`
- `/products/veterinary`
- `/products/beauty`

### Division landing

Example: `/products/surgical`

Purpose:

- Introduce one division
- Show grouped product families
- Offer division-specific search and filters
- Surface useful catalogues
- Lead to product-family pages

Children:

`/products/{division}/{family}`

Examples:

- `/products/surgical/scissors`
- `/products/dental/extraction`
- `/products/veterinary/hoof-farrier`
- `/products/beauty/hair-scissors`

### Product-family listing

`/products/{division}/{family}`

Purpose:

- Display products in one coherent family
- Support sorting and relevant filters
- Show product name, code, image, and inquiry action
- Preserve browse context

States:

- Loading
- Results
- No results
- Filtered no results
- Missing image
- Pagination or load more
- Network error

### Product detail

`/products/{division}/{family}/{product-slug}`

Purpose:

- Show the product clearly
- Confirm the product code
- Display verified variants and specifications
- Add to inquiry
- Show genuinely related products
- Link to catalogue information

Content:

- Product name
- Product code
- Image gallery
- Division and family breadcrumb
- Short factual description
- Verified specifications
- Variants or sizes
- Downloadable sheet, when available
- Quantity selector
- Add to inquiry
- Product-specific note
- Related products

### Search

`/search`

Supports query parameters such as `/search?q=T-1115`.

Purpose:

- Exact product-code lookup
- Partial-code search
- Product-name search
- Family and division matching

States:

- Suggested matches
- Exact match
- Multiple results
- No results
- Corrected spelling
- Search error

No-results recovery:

- Check the code
- Browse a likely division
- Submit a manual inquiry
- Contact THROHI

### Inquiry basket

`/inquiry`

Purpose:

- Review selected products
- Change quantities
- Add item notes
- Remove products
- Continue browsing
- Start submission

States:

- Empty basket with clear recovery
- Products present
- Invalid or unavailable product
- Saved locally
- Restore after refresh

### Inquiry submission

`/inquiry/submit`

Sections:

1. Selected products
2. General requirements
3. Buyer and company details
4. Preferred contact method
5. Attachment
6. Consent and submission

Success: `/inquiry/success`

Failure behavior:

- Preserve entered information
- Explain what failed
- Allow retry
- Provide direct contact fallback

### Company

`/company`

Children:

- `/company/about`
- `/company/capabilities` — publish only after validation
- `/company/quality` — publish only after evidence
- `/company/certifications` — publish only after evidence
- `/company/contact`

The navigation should not expose empty or unsupported pages.

### Resources

`/resources`

Children:

- `/resources/catalogues`
- `/resources/precision-through-time`
- `/resources/product-documents` — only if documents exist

#### Catalogues

`/resources/catalogues`

- Full catalogue
- Division catalogues
- Product-family brochures
- File type, size, and update date
- Accessible download labels

#### Precision Through Time

`/resources/precision-through-time`

An editorial visual experience about instrument-form evolution and precision. This must not pretend to be THROHI's company history unless such history is confirmed.

### Contact

`/contact`

Content:

- Address
- Phone
- Email
- WhatsApp
- Business-hours information, if confirmed
- General inquiry form
- Map only if the location is confirmed and useful
- Clear difference between general contact and product inquiry

### Legal

- `/privacy`
- `/terms`
- `/cookies` where required

### System pages

- `/404`
- `/500`
- Maintenance state
- Offline or failed-request state where relevant

---

## 4. Footer architecture

### Products

- Dental
- Surgical
- Veterinary
- Beauty
- Search products
- Inquiry basket

### Company

- About
- Capabilities, when verified
- Quality, when verified
- Contact

### Resources

- Catalogues
- Precision Through Time

### Legal

- Privacy
- Terms
- Cookies

### Contact

- Approved address
- Email
- Phone
- WhatsApp

Do not repeat unsupported compliance logos or certifications in the footer.

---

## 5. URL and naming rules

- Use readable lowercase URLs.
- Use hyphens between words.
- Preserve product codes exactly in product data.
- Do not use the product code as the only page title.
- Avoid duplicate page paths for the same product.
- Redirect legacy URLs when practical.
- Keep division and family names consistent across navigation, filters, breadcrumbs, and metadata.

---

## 6. Navigation rules

- The four divisions are always reachable within one interaction.
- Search is globally available.
- The inquiry basket is persistent.
- Breadcrumbs appear on division, family, and product pages.
- Mobile navigation must not expose a giant unstructured category list.
- The mega-menu should show grouped families and a “View all” route.
- Product pages should allow returning to the previous filtered results.
- Visual effects must never delay access to navigation.

---

## 7. Product taxonomy migration rule

The legacy catalogue should be migrated through a structured mapping table with these fields:

- Legacy URL
- Legacy category
- New division
- New family
- Product name
- Product code
- Duplicate status
- Spelling correction
- Image status
- Description status
- Specification status
- Approval status
- Redirect URL

No legacy product should be silently deleted or merged without a documented decision.
