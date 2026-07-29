# Approved Product Data

Only validated production-ready product records belong here.

Run `npm run data:approve -- path/to/exported-review.json` after completing the
private catalogue review workflow. The command validates product identity,
taxonomy, provenance, and separate confirmation of source references, images,
and variant codes before writing `catalogue.approved.json`.

The Phase 11 promotion schema intentionally cannot accept descriptions,
materials, measurements, finishes, certifications, availability, or other
technical and commercial claims. Those require a later evidence-backed approval
workflow.
