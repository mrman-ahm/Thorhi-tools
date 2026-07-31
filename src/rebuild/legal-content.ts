export type LegalSection = {
  index: string;
  title: string;
  body: string;
};

export const privacySections: readonly LegalSection[] = [
  {
    index: "01",
    title: "Information submitted",
    body: "The inquiry workflow may collect selected instruments, catalogue references, quantities, item notes, general requirements, buyer name, organization, country, email, optional phone details, preferred contact method, and an optional reference attachment.",
  },
  {
    index: "02",
    title: "Purpose of collection",
    body: "Submitted information is used to receive, review, store, and respond to the product inquiry. It is not used to create an online order or payment transaction.",
  },
  {
    index: "03",
    title: "Storage and attachments",
    body: "The production design supports durable inquiry records and private attachment storage when the approved Cloudflare resources are configured. Final retention and deletion periods require client and legal approval before public launch.",
  },
  {
    index: "04",
    title: "Security and abuse prevention",
    body: "The inquiry service may use request fingerprints, rate limits, file validation, and optional anti-spam verification to protect the submission channel. These controls are limited to operating and securing the inquiry workflow.",
  },
  {
    index: "05",
    title: "Rights and contact",
    body: "Jurisdiction-specific rights, the final privacy contact, and formal request procedures remain subject to legal review and are not published until approved.",
  },
] as const;

export const termsSections: readonly LegalSection[] = [
  {
    index: "01",
    title: "Catalogue information",
    body: "Catalogue names, codes, imagery, families, and variants support product discovery and inquiry preparation. They do not constitute confirmed technical specifications, availability, pricing, or a contractual offer.",
  },
  {
    index: "02",
    title: "Inquiry status",
    body: "Submitting an inquiry does not create an order, quotation, payment obligation, product reservation, shipping commitment, lead-time guarantee, or acceptance of supply.",
  },
  {
    index: "03",
    title: "Verification boundary",
    body: "Certifications, materials, manufacturing capabilities, export markets, downloadable catalogues, and commercial claims publish only after verification and approval.",
  },
  {
    index: "04",
    title: "Acceptable use",
    body: "Do not submit malicious files, automated abuse, payment credentials, account passwords, unrelated sensitive information, or content that is not required for a product inquiry.",
  },
  {
    index: "05",
    title: "Commercial agreement",
    body: "Confirmed products, quantities, specifications, quotation, delivery, payment, and other commercial terms are handled after direct review outside the public catalogue. Final legal terms remain subject to legal review.",
  },
] as const;
