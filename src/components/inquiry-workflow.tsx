"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useInquiry, type InquiryItem } from "@/components/inquiry-provider";
import { allowedAttachmentTypes, maxAttachmentBytes } from "@/lib/inquiry-validation";

const countries = ["Pakistan", "United Kingdom", "United States", "Germany", "United Arab Emirates", "Saudi Arabia", "Other"];

type BuyerState = {
  fullName: string;
  companyName: string;
  country: string;
  email: string;
  phone: string;
  preferredContact: "email" | "phone" | "whatsapp";
  consent: boolean;
};

const initialBuyer: BuyerState = { fullName: "", companyName: "", country: "", email: "", phone: "", preferredContact: "email", consent: false };

function FieldError({ error }: { error?: string }) {
  return error ? <p className="field-error" role="alert">{error}</p> : null;
}

export function InquiryWorkflow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inquiry = useInquiry();
  const [buyer, setBuyer] = useState<BuyerState>(initialBuyer);
  const [manualName, setManualName] = useState("");
  const [manualCode, setManualCode] = useState("");
  const [showManual, setShowManual] = useState(searchParams.get("manual") === "1");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState("");
  const [removed, setRemoved] = useState<InquiryItem | null>(null);
  const [submissionToken] = useState(() => crypto.randomUUID());

  useEffect(() => {
    const reference = searchParams.get("reference");
    if (reference) {
      setShowManual(true);
      setManualCode(reference);
      setManualName(reference);
    }
  }, [searchParams]);

  const totalQuantity = useMemo(() => inquiry.items.reduce((total, item) => total + item.quantity, 0), [inquiry.items]);

  const addManual = () => {
    if (!manualName.trim()) {
      setErrors(current => ({ ...current, manualName: "Enter the known product name or description." }));
      return;
    }
    inquiry.addManualItem(manualName, manualCode);
    setManualName("");
    setManualCode("");
    setShowManual(false);
    setErrors(current => ({ ...current, manualName: "" }));
  };

  const removeItem = (code: string) => {
    const item = inquiry.removeItem(code);
    if (item) setRemoved(item);
  };

  const validateClient = () => {
    const next: Record<string, string> = {};
    if (!inquiry.items.length) next.items = "Add at least one catalogue product or manual item.";
    if (buyer.fullName.trim().length < 2) next["buyer.fullName"] = "Enter your full name.";
    if (buyer.companyName.trim().length < 2) next["buyer.companyName"] = "Enter the company or organization name.";
    if (!buyer.country) next["buyer.country"] = "Country is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyer.email)) next["buyer.email"] = "Enter a valid email address.";
    if ((buyer.preferredContact === "phone" || buyer.preferredContact === "whatsapp") && !buyer.phone.trim()) next["buyer.phone"] = "Enter a phone number for this contact method.";
    if (!buyer.consent) next.consent = "Consent is required before submission.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onAttachment = (file?: File) => {
    if (!file) {
      inquiry.setAttachment(undefined);
      return;
    }
    if (!allowedAttachmentTypes.includes(file.type as typeof allowedAttachmentTypes[number])) {
      setErrors(current => ({ ...current, attachment: "Use PDF, JPG, PNG, or WebP." }));
      return;
    }
    if (file.size > maxAttachmentBytes) {
      setErrors(current => ({ ...current, attachment: "Attachment must be smaller than 8 MB." }));
      return;
    }
    inquiry.setAttachment({ name: file.name, type: file.type, size: file.size });
    setErrors(current => ({ ...current, attachment: "" }));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateClient()) return;
    setSubmitting(true);
    setServerMessage("");
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionToken,
          items: inquiry.items,
          buyer,
          generalRequirements: inquiry.generalRequirements,
          attachment: inquiry.attachment,
          consent: buyer.consent
        })
      });
      const result = await response.json() as { ok: boolean; reference?: string; storageMode?: string; message?: string; errors?: Record<string, string> };
      if (!response.ok || !result.ok) {
        setErrors(result.errors ?? {});
        setServerMessage(result.message ?? "The inquiry could not be submitted. Your information has been preserved.");
        return;
      }
      router.push(`/inquiry/success?reference=${encodeURIComponent(result.reference ?? "PENDING")}&storage=${encodeURIComponent(result.storageMode ?? "unknown")}`);
    } catch {
      setServerMessage("The inquiry could not reach the server. Your products and form information remain available.");
    } finally {
      setSubmitting(false);
    }
  };

  return <form className="inquiry-workflow" onSubmit={submit} noValidate>
    <div className="inquiry-main">
      <section className="inquiry-block" aria-labelledby="selected-products-title">
        <div className="block-heading"><div><p className="eyebrow">01 · PRODUCTS</p><h2 id="selected-products-title">Review selected products</h2></div><span>{inquiry.count} {inquiry.count === 1 ? "product" : "products"} · quantity {totalQuantity}</span></div>
        <FieldError error={errors.items} />
        {inquiry.items.length === 0 ? <div className="empty-state compact"><h3>Your inquiry is empty.</h3><p>Browse the catalogue or add an unlisted item with the name or code you know.</p><div className="button-row"><Link className="button primary" href="/products">Browse products</Link><button className="button secondary" type="button" onClick={() => setShowManual(true)}>Add unlisted item</button></div></div> : <div className="inquiry-items">{inquiry.items.map(item => <article className="inquiry-row" key={item.code}><div className="inquiry-thumb" aria-hidden="true">{item.manual ? "Manual" : "Image"}</div><div className="inquiry-item-info"><small>{item.manual ? "UNLISTED ITEM" : "CATALOGUE PRODUCT"}</small><h3>{item.name}</h3><code>{item.code}</code><label htmlFor={`note-${item.code}`}>Product-specific note</label><textarea id={`note-${item.code}`} value={item.note} onChange={event => inquiry.updateItem(item.code, { note: event.target.value })} placeholder="Optional product requirement" /></div><div className="quantity-control"><label htmlFor={`qty-${item.code}`}>Quantity</label><div><button type="button" aria-label={`Decrease quantity for ${item.name}`} onClick={() => inquiry.updateItem(item.code, { quantity: item.quantity - 1 })}>−</button><input id={`qty-${item.code}`} type="number" min="1" max="9999" value={item.quantity} onChange={event => inquiry.updateItem(item.code, { quantity: Number(event.target.value) || 1 })} /><button type="button" aria-label={`Increase quantity for ${item.name}`} onClick={() => inquiry.updateItem(item.code, { quantity: item.quantity + 1 })}>+</button></div><button className="remove-button" type="button" onClick={() => removeItem(item.code)}>Remove</button></div></article>)}</div>}
        {removed && <div className="undo-banner" role="status"><span>{removed.name} removed.</span><button type="button" onClick={() => { inquiry.restoreItem(removed); setRemoved(null); }}>Undo</button></div>}
        <div className="inquiry-add-actions"><Link className="button secondary" href="/products">Add another product</Link><button className="button secondary" type="button" onClick={() => setShowManual(value => !value)}>Add unlisted item</button></div>
        {showManual && <div className="manual-item-panel"><h3>Add an unlisted product</h3><label htmlFor="manual-name">Known name or description</label><input id="manual-name" value={manualName} onChange={event => setManualName(event.target.value)} /><FieldError error={errors.manualName} /><label htmlFor="manual-code">Known code or reference</label><input id="manual-code" value={manualCode} onChange={event => setManualCode(event.target.value)} /><button className="button primary" type="button" onClick={addManual}>Add to inquiry</button></div>}
      </section>

      <section className="inquiry-block" aria-labelledby="requirements-title"><p className="eyebrow">02 · REQUIREMENTS</p><h2 id="requirements-title">General requirements and attachment</h2><label htmlFor="general-requirements">Requirements applying to the full inquiry</label><textarea id="general-requirements" value={inquiry.generalRequirements} onChange={event => inquiry.setGeneralRequirements(event.target.value)} placeholder="Packaging, quantities, equivalent references, or other context" /><label htmlFor="attachment">Optional reference attachment</label><input id="attachment" type="file" accept={allowedAttachmentTypes.join(",")} onChange={event => onAttachment(event.target.files?.[0])} /><p className="helper-text">PDF, JPG, PNG, or WebP. Maximum 8 MB. This build validates metadata only; production object storage is not connected.</p><FieldError error={errors.attachment} />{inquiry.attachment && <div className="attachment-summary"><strong>{inquiry.attachment.name}</strong><span>{Math.ceil(inquiry.attachment.size / 1024)} KB · validated metadata</span><button type="button" onClick={() => inquiry.setAttachment(undefined)}>Remove</button></div>}</section>

      <section className="inquiry-block" aria-labelledby="buyer-title"><p className="eyebrow">03 · BUYER DETAILS</p><h2 id="buyer-title">Tell THROHI how to respond</h2><div className="form-grid"><div><label htmlFor="full-name">Full name</label><input id="full-name" autoComplete="name" value={buyer.fullName} onChange={event => setBuyer(current => ({ ...current, fullName: event.target.value }))} aria-invalid={Boolean(errors["buyer.fullName"])} /><FieldError error={errors["buyer.fullName"]} /></div><div><label htmlFor="company-name">Company name</label><input id="company-name" autoComplete="organization" value={buyer.companyName} onChange={event => setBuyer(current => ({ ...current, companyName: event.target.value }))} aria-invalid={Boolean(errors["buyer.companyName"])} /><FieldError error={errors["buyer.companyName"]} /></div><div><label htmlFor="country">Country</label><select id="country" autoComplete="country-name" value={buyer.country} onChange={event => setBuyer(current => ({ ...current, country: event.target.value }))}><option value="">Select country</option>{countries.map(country => <option key={country}>{country}</option>)}</select><FieldError error={errors["buyer.country"]} /></div><div><label htmlFor="email">Email</label><input id="email" type="email" autoComplete="email" value={buyer.email} onChange={event => setBuyer(current => ({ ...current, email: event.target.value }))} aria-invalid={Boolean(errors["buyer.email"])} /><FieldError error={errors["buyer.email"]} /></div><div><label htmlFor="phone">Phone or WhatsApp</label><input id="phone" type="tel" autoComplete="tel" value={buyer.phone} onChange={event => setBuyer(current => ({ ...current, phone: event.target.value }))} aria-invalid={Boolean(errors["buyer.phone"])} /><FieldError error={errors["buyer.phone"]} /></div><div><label htmlFor="preferred-contact">Preferred contact</label><select id="preferred-contact" value={buyer.preferredContact} onChange={event => setBuyer(current => ({ ...current, preferredContact: event.target.value as BuyerState["preferredContact"] }))}><option value="email">Email</option><option value="phone">Phone</option><option value="whatsapp">WhatsApp</option></select></div></div><label className="consent-row"><input type="checkbox" checked={buyer.consent} onChange={event => setBuyer(current => ({ ...current, consent: event.target.checked }))} /><span>I confirm that the provided information may be used to respond to this inquiry.</span></label><FieldError error={errors.consent} /></section>
    </div>

    <aside className="inquiry-review"><p className="eyebrow">FINAL REVIEW</p><h2>Inquiry summary</h2><dl><div><dt>Products</dt><dd>{inquiry.count}</dd></div><div><dt>Total quantity</dt><dd>{totalQuantity}</dd></div><div><dt>Product notes</dt><dd>{inquiry.items.filter(item => item.note.trim()).length}</dd></div><div><dt>Attachment</dt><dd>{inquiry.attachment ? "1 file" : "None"}</dd></div></dl><p>This is a product inquiry, not an online order or payment.</p>{serverMessage && <div className="submission-error" role="alert"><strong>Submission not completed</strong><span>{serverMessage}</span></div>}<button className="button positive full" type="submit" disabled={submitting || inquiry.count === 0}>{submitting ? "Submitting…" : "Submit inquiry"}</button><p className="helper-text">Duplicate submission is prevented using a one-time browser token.</p></aside>
  </form>;
}
