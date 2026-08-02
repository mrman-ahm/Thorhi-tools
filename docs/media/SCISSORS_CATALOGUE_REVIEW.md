# Scissors Catalogue Review

## Scope

Reviewed the supplied `Scissors Catalog(1).pdf` against the current website catalogue records in `src/data/catalogue.runtime.generated.json`.

- Source PDF: 11 pages total
- Product pages: 10 plus cover
- Source authority: supplied client catalogue
- Product geometry: must come from the supplied catalogue or approved client photography
- Web images: not approved for product identity

## What already maps correctly by catalogue code

The current catalogue contains recognisable records for these groups:

- Iris Scissors — regular, Super Cut and TC
- Stevens Scissors — regular, Super Cut and TC
- Operating Scissors — regular, Super Cut and TC
- Mayo Scissors — regular, Super Cut and TC
- Metzenbaum Scissors — regular, Super Cut and TC
- Stitch Scissors
- Bandage Scissors
- Wire Cut Scissors
- Dean Scissors
- Fomon Scissors
- Iris Ribbon Scissors

These records still require image-by-image visual confirmation before being approved for production.

## Records that need correction

### Duplicate or malformed records

- `surgical-scissors-05-0414` is a Mayo Super Cut variant and should not be a separate product record.
- `surgical-scissors-06-1913` duplicates a TC Metzenbaum code already included under the main TC Metzenbaum group.
- `surgical-scissors-04-3102-2` duplicates catalogue code `04-3102` and currently has no variants.
- `surgical-scissors-04-3110` is not present in the supplied catalogue. The Universal Bandage Scissors codes are `04-3111`, `04-3112` and `04-3113`.
- `surgical-scissors-04-3000-2` and `surgical-scissors-06-3000-2` use artificial suffixes. The printed catalogue codes are `04-3000` and `06-3000`.

### Names requiring source-based cleanup

Current records include damaged or inconsistent names such as:

- `METZENBAUN- Scissors BLBL`
- `By METZENBAUM Scissors`
- `METZENBAUM ScissorsSTR cum`
- `sc MAYO Scissors`
- `ie MAYO Scissors a`
- `ISIMS Uterine Scissors`
- malformed Micro Scissors names

Names must be corrected only from the supplied catalogue, without guessing.

## Missing variants in existing groups

### Operating Scissors

The supplied catalogue includes 12 cm variants that are absent from the current grouped records:

- Regular: `04-0121`, `04-0131`, `04-0221`, `04-0231`, `04-0321`, `04-0331`
- Super Cut: corresponding `05-` codes
- TC: corresponding `06-` codes

### Mayo Scissors

The current groups omit or separate some catalogue variants, including:

- Regular: `04-0403`, `04-0413`
- Super Cut: `05-0403`, `05-0413`, with `05-0414` incorrectly separated
- TC: `06-0403`, `06-0413`

### Stitch Scissors

The current record starts at `04-2902`. The supplied catalogue also includes `04-2901`.

### Bandage Scissors

The supplied group contains `04-3101`, `04-3102` and `04-3103`. The current website does not represent the group cleanly.

### Dean Scissors

The current records represent the 17 cm versions, but the catalogue also includes:

- `04-3501` — 15 cm
- `06-3501` — 15 cm TC

### Fomon Scissors

The current catalogue contains the regular group, but the supplied catalogue also includes complete Super Cut and TC groups:

- `05-3203`, `05-3204`
- `06-3203`, `06-3204`

## Product groups missing or not cleanly represented

The following catalogue groups require new or rebuilt website records:

- Sims Scissors — regular, Super Cut and TC
- Jameson Scissors — regular, Super Cut and TC
- Goldman Fox Scissors — regular, Super Cut and TC
- Kilner Scissors — regular, Super Cut and TC
- Kelly Scissors — regular, Super Cut and TC
- Gorney Scissors — regular, Super Cut and TC
- Braun Stadler Scissors
- Ferguson Scissors
- Episiotomy Scissors and TC variant
- Bee Bee Scissors and TC variant
- Locklin Scissors and TC variant
- Goldman Scissors — side curved and front curved, including TC variants
- Heyman Scissors — regular, Super Cut and TC
- Steven Ribbon Scissors — regular and Super Cut
- Micro Scissors groups shown on catalogue page 9, including TC variants
- Pottsmith Scissors — regular and TC

## Image decision

The supplied catalogue already contains client-owned product imagery for these products. Therefore:

1. Do not search the web for replacement product geometry yet.
2. Correct and complete the product records first.
3. Match every product code to its exact catalogue image.
4. Crop and clean the approved catalogue image without changing the instrument shape.
5. Use web research only for non-product editorial imagery unless explicit reuse permission is recorded.

## Next work item

Build the clean Scissors product list from the supplied catalogue, map it to existing stable website IDs, and mark every entry as:

- keep existing record
- merge duplicate
- correct record
- add missing product
- add missing variant
