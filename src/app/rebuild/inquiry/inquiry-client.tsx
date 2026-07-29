"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useInquiry, type InquiryItem } from "@/components/inquiry-provider";
import { allowedAttachmentTypes, maxAttachmentBytes } from "@/lib/inquiry-validation";
import styles from "../rebuild.module.css";

const countries = [
  "Pakistan",
  "United Kingdom",
  "United States",
  "Germany",
  "United Arab Emirates",
  "Saudi Arabia",
  "Other"
];

type BuyerState = {
  fullName: string;
  companyName: string;
  country: string;
  email: string;
  phone: string;
  preferredContact: "email" | "phone" | "whatsapp";
  consent: boolean;
};

const initialBuyer: BuyerState = {
  fullName: "",
  companyName: "",
  country: "",
  email: "",
  phone: "",
  preferredContact: "email",
  consent: false
};

function FieldError({ error }: { error?: string }) {
  return error ? <p className={styles.fieldError} role="alert">{error}</p> : null;
}

export function InquiryClient() {
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
    if (searchParams.get("manual") === "1") setShowManual(true);
  }, [searchParams]);

  const addManual = () => {
    if (!manualName.trim()) {
      setErrors(current => ({
        ...current,
        manualName: "Enter the known product name or description."
      }));
      return;
    }
    inquiry.addManualItem(manualName, manualCode);
    setManualName("");
    setManualCode("");
    setShowManual(false);
    setErrors(current => ({ ...current, manualName: "" }));
  };

  const removeItem = (key: string) => {
    const item = inquiry.removeItem(key);
    if (item) setRemoved(item);
  };

  const validateClient = () => {
    const next: Record<string, string> = {};
    if (!inquiry.items.length) next.items = "Add at least one catalogue product or manual item.";
    if (buyer.fullName.trim().length < 2) next["buyer.fullName"] = "Enter your full name.";
    if (buyer.companyName.trim().length < 2) next["buyer.companyName"] = "Enter the company or organization name.";
    if (!buyer.country) next["buyer.country"] = "Country is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyer.email)) next["buyer.email"] = "Enter a valid email address.";
    if ((buyer.preferredContact === "phone" || buyer.preferredContact === "whatsapp") && !buyer.phone.trim()) {
      next["buyer.phone"] = "Enter a phone number for this contact method.";
    }
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
      const result = await response.json() as {
        ok: boolean;
        reference?: string;
        storageMode?: string;
        message?: string;
        errors?: Record<string, string>;
      };
      if (!response.ok || !result.ok) {
        setErrors(result.errors ?? {});
        setServerMessage(result.message ?? "The inquiry could not be submitted. Your information has been preserved.");
        return;
      }
      router.push(
        `/rebuild/inquiry/success?reference=${encodeURIComponent(result.reference ?? "PENDING")}` +
        `&storage=${encodeURIComponent(result.storageMode ?? "unknown")}`
      );
    } catch {
      setServerMessage("The inquiry could not reach the server. Your products and form information remain available.");
    } finally {
      setSubmitting(false);
    }
  };

  return <form className={styles.structuredInquiry} onSubmit={submit} noValidate>
    <div className={styles.inquiryMain}>
      <section className={styles.inquiryBlock} aria-labelledby="rebuild-products-title">
        <div className={styles.blockHeading}>
          <div><p>01 · Products</p><h2 id="rebuild-products-title">Review selected instruments</h2></div>
          <span>{inquiry.count} {inquiry.count === 1 ? "line" : "lines"} · quantity {inquiry.totalQuantity}</span>
        </div>
        <FieldError error={errors.items} />
        {inquiry.items.length === 0
          ? <div className={styles.emptyInquiry}>
              <h3>Your Inquiry List is empty.</h3>
              <p>Add catalogue products or enter an unlisted reference.</p>
              <div><Link href="/rebuild/products">Browse products</Link><button type="button" onClick={() => setShowManual(true)}>Add unlisted item</button></div>
            </div>
          : <div>{inquiry.items.map(item => <article className={styles.inquiryItem} key={item.key}>
              <div><h3>{item.name}</h3><code>{item.variantLabel ?? item.code}</code></div>
              <label>Quantity<input type="number" min="1" max="9999" value={item.quantity} onChange={event => inquiry.updateItem(item.key, { quantity: Number(event.target.value) || 1 })} /></label>
              <label>Item note<input value={item.note} maxLength={1000} onChange={event => inquiry.updateItem(item.key, { note: event.target.value })} placeholder="Optional" /></label>
              <button type="button" onClick={() => removeItem(item.key)}>Remove</button>
            </article>)}</div>}
        {removed && <div className={styles.undoBanner} role="status"><span>{removed.name} removed.</span><button type="button" onClick={() => { inquiry.restoreItem(removed); setRemoved(null); }}>Undo</button></div>}
        <div className={styles.inquiryAddActions}><Link href="/rebuild/products">Add another product</Link><button type="button" onClick={() => setShowManual(value => !value)}>Add unlisted item</button></div>
        {showManual && <div className={styles.manualPanel}>
          <h3>Add an unlisted instrument</h3>
          <label htmlFor="rebuild-manual-name">Known name or description</label>
          <input id="rebuild-manual-name" value={manualName} onChange={event => setManualName(event.target.value)} />
          <FieldError error={errors.manualName} />
          <label htmlFor="rebuild-manual-code">Known code or reference</label>
          <input id="rebuild-manual-code" value={manualCode} onChange={event => setManualCode(event.target.value)} />
          <button type="button" onClick={addManual}>Add to inquiry</button>
        </div>}
      </section>

      <section className={styles.inquiryBlock} aria-labelledby="rebuild-requirements-title">
        <p>02 · Requirements</p>
        <h2 id="rebuild-requirements-title">General requirements and attachment</h2>
        <label htmlFor="rebuild-requirements">Requirements applying to the full inquiry</label>
        <textarea id="rebuild-requirements" rows={6} value={inquiry.generalRequirements} maxLength={4000} onChange={event => inquiry.setGeneralRequirements(event.target.value)} placeholder="Packaging, quantities, equivalent references, or other context" />
        <label htmlFor="rebuild-attachment">Optional reference attachment</label>
        <input id="rebuild-attachment" type="file" accept={allowedAttachmentTypes.join(",")} onChange={event => onAttachment(event.target.files?.[0])} />
        <p className={styles.helperText}>PDF, JPG, PNG, or WebP. Maximum 8 MB. This development build validates file metadata only.</p>
        <FieldError error={errors.attachment} />
        {inquiry.attachment && <div className={styles.attachmentSummary}><span><strong>{inquiry.attachment.name}</strong><small>{Math.ceil(inquiry.attachment.size / 1024)} KB · metadata only</small></span><button type="button" onClick={() => inquiry.setAttachment(undefined)}>Remove</button></div>}
      </section>

      <section className={styles.inquiryBlock} aria-labelledby="rebuild-buyer-title">
        <p>03 · Buyer details</p>
        <h2 id="rebuild-buyer-title">Tell THROHI how to respond</h2>
        <div className={styles.buyerGrid}>
          <div><label htmlFor="rebuild-full-name">Full name</label><input id="rebuild-full-name" autoComplete="name" value={buyer.fullName} onChange={event => setBuyer(current => ({ ...current, fullName: event.target.value }))} aria-invalid={Boolean(errors["buyer.fullName"])} /><FieldError error={errors["buyer.fullName"]} /></div>
          <div><label htmlFor="rebuild-company">Company name</label><input id="rebuild-company" autoComplete="organization" value={buyer.companyName} onChange={event => setBuyer(current => ({ ...current, companyName: event.target.value }))} aria-invalid={Boolean(errors["buyer.companyName"])} /><FieldError error={errors["buyer.companyName"]} /></div>
          <div><label htmlFor="rebuild-country">Country</label><select id="rebuild-country" value={buyer.country} onChange={event => setBuyer(current => ({ ...current, country: event.target.value }))}><option value="">Select country</option>{countries.map(country => <option key={country}>{country}</option>)}</select><FieldError error={errors["buyer.country"]} /></div>
          <div><label htmlFor="rebuild-email">Email</label><input id="rebuild-email" type="email" autoComplete="email" value={buyer.email} onChange={event => setBuyer(current => ({ ...current, email: event.target.value }))} aria-invalid={Boolean(errors["buyer.email"])} /><FieldError error={errors["buyer.email"]} /></div>
          <div><label htmlFor="rebuild-phone">Phone or WhatsApp</label><input id="rebuild-phone" type="tel" autoComplete="tel" value={buyer.phone} onChange={event => setBuyer(current => ({ ...current, phone: event.target.value }))} aria-invalid={Boolean(errors["buyer.phone"])} /><FieldError error={errors["buyer.phone"]} /></div>
          <div><label htmlFor="rebuild-contact-method">Preferred contact</label><select id="rebuild-contact-method" value={buyer.preferredContact} onChange={event => setBuyer(current => ({ ...current, preferredContact: event.target.value as BuyerState["preferredContact"] }))}><option value="email">Email</option><option value="phone">Phone</option><option value="whatsapp">WhatsApp</option></select></div>
        </div>
        <label className={styles.consentRow}><input type="checkbox" checked={buyer.consent} onChange={event => setBuyer(current => ({ ...current, consent: event.target.checked }))} /><span>I confirm that the provided information may be used to respond to this inquiry.</span></label>
        <FieldError error={errors.consent} />
      </section>
    </div>

    <aside className={styles.inquiryReview}>
      <p>04 · Final review</p>
      <h2>Inquiry summary</h2>
      <dl><div><dt>Product lines</dt><dd>{inquiry.count}</dd></div><div><dt>Total quantity</dt><dd>{inquiry.totalQuantity}</dd></div><div><dt>Product notes</dt><dd>{inquiry.items.filter(item => item.note.trim()).length}</dd></div><div><dt>Attachment</dt><dd>{inquiry.attachment ? "1 file" : "None"}</dd></div></dl>
      <p>This is a product inquiry, not an online order or payment.</p>
      {serverMessage && <div className={styles.submissionError} role="alert"><strong>Submission not completed</strong><span>{serverMessage}</span></div>}
      <button type="submit" disabled={submitting || inquiry.count === 0}>{submitting ? "Submitting…" : "Submit inquiry"}</button>
      <small>Duplicate submission is prevented with a one-time browser token. Production delivery is not configured.</small>
    </aside>
  </form>;
}
