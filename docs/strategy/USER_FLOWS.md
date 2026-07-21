# THROHI Website — Core User Flows

**Status:** Working flows for wireframing  
**Date:** 2026-07-22

---

## Flow 1 — Buyer knows the product code

### Goal

Find a specific product and add it to an inquiry with minimal effort.

### Steps

1. Buyer opens the website.
2. Product-code search is visible in the hero or header.
3. Buyer enters a full or partial code.
4. Search returns an exact match or ranked suggestions.
5. Buyer opens the product.
6. Buyer confirms image, name, code, and available variants.
7. Buyer chooses quantity.
8. Buyer adds the product to the inquiry.
9. Buyer either continues browsing or reviews the inquiry.

### Recovery states

- Code not found
- Mistyped punctuation
- Partial code with several matches
- Duplicate or retired legacy code
- Missing image
- Product data awaiting confirmation

### Required UX behavior

- Do not force the buyer through categories first.
- Preserve the search query.
- Allow direct inquiry using the entered code if no product is found.

---

## Flow 2 — Buyer explores a product division

### Goal

Discover available products without knowing a code.

### Steps

1. Buyer selects Dental, Surgical, Veterinary, or Beauty.
2. Division page explains the available families.
3. Buyer chooses a family.
4. Product listing shows clear names, codes, and images.
5. Buyer filters or searches within the family.
6. Buyer opens a product or adds it directly to the inquiry.
7. Buyer can return to the same filtered position.

### Recovery states

- No products in selected filter
- Overly broad legacy category
- Category renamed during migration
- Missing images
- Slow network

### Required UX behavior

- Do not present hundreds of categories in one flat menu.
- Keep division and family context visible.
- Make inquiry actions possible without losing browse position.

---

## Flow 3 — Buyer creates a multi-product inquiry

### Goal

Send a useful quotation or sourcing request containing several products.

### Steps

1. Buyer adds products from search, listings, or product pages.
2. Inquiry basket displays an item count.
3. Buyer opens the basket.
4. Buyer reviews products and codes.
5. Buyer sets quantities.
6. Buyer adds notes to individual products.
7. Buyer enters general requirements.
8. Buyer supplies company and contact information.
9. Buyer attaches a reference document if needed.
10. Buyer selects preferred contact method.
11. Buyer reviews and submits.
12. Website confirms successful submission and provides a reference number if the backend supports it.

### Failure handling

- Submission fails: preserve all information.
- Attachment rejected: explain file type or size.
- Required field missing: show inline guidance.
- Duplicate submission: prevent accidental repeats.
- Network loss: retain basket and form locally where safe.
- Server unavailable: provide approved email and WhatsApp fallback.

### Required inquiry fields

Keep these minimal until the sales process is confirmed:

- Full name
- Company name
- Country
- Email
- Phone or WhatsApp
- Preferred contact method
- Product list
- Quantities
- Message or requirements
- Optional attachment
- Consent checkbox where required

---

## Flow 4 — Buyer downloads a catalogue

### Goal

Obtain a relevant product catalogue without searching the entire site.

### Steps

1. Buyer opens Resources or a division page.
2. Buyer sees available catalogues with clear labels.
3. Buyer sees file type, approximate size, and last update.
4. Buyer downloads or opens the relevant file.
5. Buyer can return to browse or start an inquiry.

### Required UX behavior

- Do not label every document simply “Download”.
- Do not publish outdated catalogues without a date.
- Do not hide catalogues behind unnecessary forms unless the client deliberately chooses lead capture.

---

## Flow 5 — Buyer evaluates credibility

### Goal

Decide whether THROHI is worth contacting.

### Steps

1. Buyer sees a polished but factual homepage.
2. Buyer reviews product breadth.
3. Buyer opens About.
4. Buyer reviews capabilities, quality, certifications, or factory evidence only where verified.
5. Buyer checks contact information.
6. Buyer submits an inquiry or contacts THROHI directly.

### Trust requirements

- Real company details
- Consistent contact information
- Real product imagery
- Clear catalogue organization
- No placeholder text
- No fake statistics
- No unsupported badges
- No fabricated testimonials
- Secure website and professional email domain
- Clear inquiry confirmation

---

## Flow 6 — Mobile buyer contacts THROHI quickly

### Goal

Find a product or contact the company from a phone.

### Steps

1. Buyer lands on mobile homepage.
2. Search and product divisions appear before long storytelling.
3. Buyer searches a code or chooses a division.
4. Buyer adds a product to inquiry or taps Contact.
5. Buyer selects email, phone, or WhatsApp.
6. Website passes useful product context into the chosen contact route where possible.

### Required UX behavior

- No desktop hero merely scaled down.
- No long intro animation.
- Search input must be easy to tap.
- Inquiry basket remains reachable.
- Sticky actions must not cover content.
- Product images must not dominate the full viewport without purpose.
- Form fields must support mobile keyboards and autofill.

---

## Flow 7 — Buyer cannot find a product

### Goal

Convert an unsuccessful search into a useful manual inquiry.

### Steps

1. Search returns no exact match.
2. Website suggests likely families or spelling corrections.
3. Buyer can enter the known product name or code manually.
4. Buyer can attach a reference image or document.
5. Buyer submits a sourcing question.

### Required UX behavior

A no-results state must never end with only “No results found.”

It should offer:

- Search again
- Browse likely categories
- Add an unlisted item to inquiry
- Send reference material
- Contact THROHI

---

## Shared state inventory

Every relevant flow must account for:

- Default
- Hover
- Focus
- Active
- Selected
- Disabled
- Loading
- Empty
- Error
- Success
- Partial data
- Missing image
- Long content
- No results
- Offline or failed network
- Invalid attachment
- Expired form session
- Duplicate submission
- Permission or spam rejection
