# THROHI Content Truth Matrix

**Authority:** `docs/superpowers/specs/2026-08-01-throhi-website-foundation-design.md`  
**Working branch:** `implementation/throhi-foundation-layer-1`  
**Purpose:** Prevent unverified facts, hidden future divisions, rejected concepts, and historical implementation assumptions from reaching the public website.

## Status definitions

| Status | Meaning | Publication rule |
|---|---|---|
| **Approved** | Explicitly approved project direction or wording category. | May appear publicly when implemented accurately. |
| **Source-derived** | Product identity, code, family, variant, or image derived from supplied catalogue material. | May appear after data/media integrity checks pass. |
| **Pending verification** | A client fact or asset is absent, incomplete, or not approved. | Keep unpublished; do not replace with plausible filler. |
| **Hidden** | Intentionally present only for future owner administration. | Must not appear in public navigation, search, metadata, counts, or feeds. |
| **Prohibited** | Conflicts with the approved specification or has no truthful source. | Must not be designed or implemented as public content. |

## Global publication rules

1. The latest explicit user instruction and the August 1 foundation specification override older code, wireframes, and documentation.
2. Only **Surgical** and **Dental** are public divisions.
3. **Beauty** and **Veterinary** remain hidden future admin divisions until complete approved content is explicitly activated.
4. Product names, codes, families, variants, and images must remain traceable to supplied source material.
5. Missing facts stay missing. No design or implementation task may silently turn draft copy into a published claim.
6. Use **Inquiry** terminology. Do not use cart, basket, checkout, payment, place order, or ecommerce framing.
7. The Company-page evolution sequence describes general instrument development. It must never imply that THROHI invented or manufactured the historical instruments shown.
8. Original catalogue PDFs are opened or downloaded unchanged. The application does not generate, merge, rewrite, or edit them.

## Public shell and metadata

| Area | Content | Status | Public rule |
|---|---|---:|---|
| Company identity | THROHI Medical Tools | Approved | Use consistently in navigation, metadata, footer, and contact surfaces. |
| Location | Sialkot, Pakistan | Approved | Present factually and without exaggerated heritage claims. |
| Public product focus | Surgical and Dental instruments | Approved | These are the only public divisions. |
| Header navigation | Company, Products, Catalogues, Contact, Search, Inquiry | Approved | Inquiry count remains visible after products are selected. |
| Product menu | Division first, then family | Approved | Family selection filters the unified catalogue. |
| Mobile navigation | Full-height accessible panel | Approved | Preserve route hierarchy, Search, and Inquiry access. |
| Final logo master | Production-ready logo file | Pending verification | Current transparent asset requires edge/background review before release. |
| Canonical URLs, social image, sitemap | Final production values | Pending verification | Keep preview non-indexed until cutover approval. |
| Beauty/Veterinary navigation or metadata | Any public reference | Hidden | Must not leak through menus, metadata, counts, search, sitemap, or structured data. |

## Home

| Content unit | Status | Public rule |
|---|---:|---|
| Brief first-visit cinematic intro using supplied media | Approved | Returning visitors skip or receive a shortened experience; reduced-motion users bypass it. |
| THROHI identity and Sialkot origin | Approved | State directly; do not add unsupported history or manufacturing claims. |
| Surgical and Dental entry points | Approved | Both should lead into the unified catalogue with division state preserved. |
| Search by product name or reference code | Approved | Make product discovery available early. |
| Representative families/products | Source-derived | Use real names, codes, and source media only. |
| Concise company introduction | Approved structure / pending final client copy | Publish only verified statements. |
| Surgical and Dental catalogue-document access | Approved structure / pending real PDFs | Show factual unavailable states until authentic PDFs are supplied. |
| Contact and Inquiry conclusion | Approved | Use specific actions such as Browse products, Contact THROHI, and Request quotation. |
| Scissors evolution sequence on Home | Prohibited | The full evolution experience belongs only on Company. |
| Fake statistics, certificates, awards, testimonials, logo strips | Prohibited | Do not use as filler or trust decoration. |
| Generic process, feature-grid, FAQ, newsletter, or mission filler | Prohibited unless later justified with real content | Every section must answer a unique visitor question. |

## Company

| Content unit | Status | Public rule |
|---|---:|---|
| THROHI introduction | Approved structure / pending final verified copy | Include identity, location, and current business role only. |
| Sialkot context | Approved structure | Keep concise, factual, and relevant to instrument manufacturing. |
| General instrument-evolution sequence | Approved | Company page only; use supplied 260-frame sequence with a static reduced-motion alternative. |
| Evolution disclaimer | Approved requirement | Clearly separate general history from THROHI company history. |
| THROHI today | Approved structure / pending verified facts | Emphasize Surgical/Dental catalogue depth and inquiry support. |
| Contact conclusion | Approved | Link to Contact, WhatsApp when verified, Catalogues, Products, and Inquiry. |
| Founding year/history | Pending verification | Do not infer from assets, domain age, or regional history. |
| Founder story/team | Pending verification | Do not fabricate names, roles, or biographies. |
| Factory tour/process/capacity | Pending verification | No dedicated factory-showcase or long process section without evidence. |
| Certifications, materials, markets, OEM, MOQ, lead times | Pending verification | Publish only after documentary/client verification. |

## Products and Product Detail

| Content unit | Status | Public rule |
|---|---:|---|
| Division selection | Approved | Surgical and Dental only. |
| Family selection | Approved | Filters the unified catalogue; avoid fragmented decorative family pages. |
| Search by name or code | Approved | Exact code, variant code, prefixes, name, aliases, then family relevance. |
| Product grid | Approved | Three columns desktop, two tablet where practical, one mobile. |
| Product names/codes/families/variants | Source-derived | Preserve catalogue identity and normalization rules. |
| Product imagery | Source-derived | Contained clinical-specimen stage; preserve full silhouette. |
| Low-resolution Surgical imagery | Source-derived with display constraint | Keep smaller and sharper; never enlarge merely to fill space. |
| Product specifications | Source-derived or verified | Omit unsupported fields rather than filling them. |
| Related products | Source-derived | Use real family/product relationships. |
| Quick Inquiry and Add to Inquiry | Approved | No account required. |
| Default price state | Approved | `Contact for quotation`. |
| Exact/range pricing | Pending owner configuration and client policy | Never invent prices or currency. |
| Stock, ratings, reviews, delivery promises | Prohibited without real systems/data | Do not simulate ecommerce evidence. |

## Catalogues

| Content unit | Status | Public rule |
|---|---:|---|
| Surgical document group | Approved structure | Display authentic supplied PDFs only. |
| Dental document group | Approved structure | Display authentic supplied PDFs only. |
| Title, division, date/edition, size | Pending real file metadata | Show only values derived from the actual file/client data. |
| Direct open/download | Approved | No email gate, account, or form before access. |
| Combined catalogue | Pending client-supplied file | Do not generate or merge one automatically. |
| Missing-document state | Approved | Provide a factual contact route instead of a fake download. |
| Existing placeholder PDFs | Prohibited | Do not publish generated or dummy files. |

## Inquiry

| Content unit | Status | Public rule |
|---|---:|---|
| Quick Inquiry | Approved | Single-product entry preserving name/reference. |
| Multi-product Inquiry List | Approved | Guest flow; persists selected product snapshots. |
| Product snapshot | Approved | Store name, reference, quantity, and optional notes. |
| Buyer fields | Approved structure | Name, company, country, email, phone/WhatsApp, preferred method, message. Final required/optional rules belong to backend validation design. |
| Submit terminology | Approved | Add to Inquiry, Inquiry List, Quick Inquiry, Request quotation, Submit inquiry. |
| File attachment | Prohibited | Remove the existing public attachment behavior and backend assumptions from this flow. |
| Customer account | Prohibited | No registration or sign-in requirement. |
| Latest 20 lightweight admin records | Approved | Oldest record is removed when record 21 is retained. |
| CRM stages/status pipeline | Prohibited | No sales workflow is required. |
| Submission destination email | Pending verification | Production must fail clearly until configured. |
| Archived/deleted product references | Approved behavior | Retained inquiry snapshots keep original product name and reference. |

## Contact

| Content unit | Status | Public rule |
|---|---:|---|
| Contact page as primary conversion route | Approved | Keep WhatsApp, email, phone, and general inquiry clear. |
| General inquiry form | Approved | Separate from product-based Inquiry List. |
| Phone, WhatsApp, email | Pending verification | Unverified channels remain unpublished. |
| Exact address and map | Pending verification | Do not approximate the location. |
| Operating hours | Pending verification | Do not infer standard business hours. |
| Response-time promise | Pending verification | Do not claim a turnaround time without approval. |

## Owner admin

| Content unit | Status | Rule |
|---|---:|---|
| One owner account | Approved | No public registration and no staff-role system. |
| Dashboard | Approved | Show real product/document/inquiry/publishing state only. |
| Website content controls | Approved | Owner edits approved content fields and route visibility. |
| Product/family/variant/media controls | Approved | Preserve source identity and validation. |
| Optional price controls | Approved structure | Hidden by default; owner selects exact/range and currency only under approved policy. |
| Catalogue-document controls | Approved | Upload, replace, reorder, hide, archive, restore original PDFs. |
| Contact controls | Approved | Unverified public values remain hidden until saved and published. |
| Draft → Preview → Publish | Approved | Preview is not public publication. |
| Latest five published versions | Approved | Restore creates a new draft. |
| Archive default | Approved | Permanent delete is separate and strongly confirmed. |
| Beauty/Veterinary division states | Hidden | May exist as draft/hidden/archived; never public until explicit activation. |
| Latest 20 inquiry records | Approved | Lightweight records only; no CRM stages. |

## Prohibited copy patterns

Do not publish unsupported versions of these phrases:

- world-class;
- unmatched quality;
- industry-leading;
- trusted worldwide;
- finest craftsmanship;
- decades of excellence;
- cutting-edge;
- next-generation;
- premium quality;
- seamless solutions;
- any customer count, export count, growth statistic, rating, award, or certificate without evidence.

## Release inputs still required

- final logo master;
- verified email, phone, WhatsApp, exact address, and map;
- inquiry-recipient email and delivery configuration;
- authentic Surgical and Dental PDFs with metadata;
- final legal/privacy text and retention policy;
- approved company history, certifications, materials, capabilities, capacity, markets, OEM, MOQ, lead times, and response expectations when available;
- final pricing policy if public prices are ever enabled.

A missing release input is a blocker for that specific content, not permission to invent a substitute.
