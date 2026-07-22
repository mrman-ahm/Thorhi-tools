import { products } from "@/lib/catalogue";

export const allowedAttachmentTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"] as const;
export const maxAttachmentBytes = 8 * 1024 * 1024;

export type InquiryPayload = {
  submissionToken: string;
  items: { code: string; name: string; quantity: number; note?: string; manual?: boolean }[];
  buyer: {
    fullName: string;
    companyName: string;
    country: string;
    email: string;
    phone?: string;
    preferredContact: "email" | "phone" | "whatsapp";
  };
  generalRequirements?: string;
  attachment?: { name: string; type: string; size: number };
  consent: boolean;
};

export type ValidationResult = { valid: true; value: InquiryPayload } | { valid: false; errors: Record<string, string> };

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function sanitizeFilename(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-").slice(0, 120);
}

export function validateInquiry(input: unknown): ValidationResult {
  const errors: Record<string, string> = {};
  const raw = input && typeof input === "object" ? input as Record<string, unknown> : {};
  const buyerRaw = raw.buyer && typeof raw.buyer === "object" ? raw.buyer as Record<string, unknown> : {};
  const rawItems = Array.isArray(raw.items) ? raw.items : [];
  const items = rawItems.slice(0, 100).map((entry, index) => {
    const item = entry && typeof entry === "object" ? entry as Record<string, unknown> : {};
    const code = text(item.code, 80).toUpperCase();
    const name = text(item.name, 160);
    const quantity = Number(item.quantity);
    const manual = Boolean(item.manual);
    if (!code) errors[`items.${index}.code`] = "Product code or manual reference is required.";
    if (!name) errors[`items.${index}.name`] = "Product name is required.";
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 9999) errors[`items.${index}.quantity`] = "Quantity must be between 1 and 9999.";
    if (!manual && code && !products.some(product => product.code === code)) errors[`items.${index}.code`] = "The product code does not match the current catalogue.";
    return { code, name, quantity, note: text(item.note, 1000), manual };
  });
  if (items.length === 0) errors.items = "Add at least one product or manual item.";

  const fullName = text(buyerRaw.fullName, 120);
  const companyName = text(buyerRaw.companyName, 160);
  const country = text(buyerRaw.country, 100);
  const email = text(buyerRaw.email, 200).toLowerCase();
  const phone = text(buyerRaw.phone, 60);
  const preferredContact = text(buyerRaw.preferredContact, 20) as InquiryPayload["buyer"]["preferredContact"];
  if (fullName.length < 2) errors["buyer.fullName"] = "Enter your full name.";
  if (companyName.length < 2) errors["buyer.companyName"] = "Enter the company or organization name.";
  if (!country) errors["buyer.country"] = "Country is required.";
  if (!validEmail(email)) errors["buyer.email"] = "Enter a valid email address.";
  if (!["email", "phone", "whatsapp"].includes(preferredContact)) errors["buyer.preferredContact"] = "Choose a preferred contact method.";
  if ((preferredContact === "phone" || preferredContact === "whatsapp") && !phone) errors["buyer.phone"] = "A phone number is required for this contact method.";

  let attachment: InquiryPayload["attachment"];
  if (raw.attachment && typeof raw.attachment === "object") {
    const file = raw.attachment as Record<string, unknown>;
    const name = sanitizeFilename(text(file.name, 200));
    const type = text(file.type, 100);
    const size = Number(file.size);
    if (!allowedAttachmentTypes.includes(type as typeof allowedAttachmentTypes[number])) errors["attachment.type"] = "Use PDF, JPG, PNG, or WebP.";
    if (!Number.isFinite(size) || size < 1 || size > maxAttachmentBytes) errors["attachment.size"] = "Attachment must be smaller than 8 MB.";
    if (!name) errors["attachment.name"] = "Attachment filename is invalid.";
    attachment = { name, type, size };
  }

  const submissionToken = text(raw.submissionToken, 120);
  if (submissionToken.length < 12) errors.submissionToken = "Submission token is missing.";
  const consent = raw.consent === true;
  if (!consent) errors.consent = "Consent is required before submission.";

  if (Object.keys(errors).length) return { valid: false, errors };
  return {
    valid: true,
    value: {
      submissionToken,
      items,
      buyer: { fullName, companyName, country, email, phone: phone || undefined, preferredContact },
      generalRequirements: text(raw.generalRequirements, 4000) || undefined,
      attachment,
      consent
    }
  };
}
