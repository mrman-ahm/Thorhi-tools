import Link from "next/link";
import type { VerifiedContactConfig } from "@/rebuild/contact";
import styles from "./corporate-components.module.css";

export function RebuildContactRoutes({ contact }: { contact: VerifiedContactConfig }) {
  const direct = [
    contact.email ? { label: "Email", href: `mailto:${contact.email}`, value: contact.email } : null,
    contact.phoneDisplay && contact.phoneHref
      ? { label: "Phone", href: contact.phoneHref, value: contact.phoneDisplay }
      : null,
    contact.whatsappHref
      ? { label: "WhatsApp", href: contact.whatsappHref, value: "Continue through WhatsApp" }
      : null,
  ].filter((item): item is { label: string; href: string; value: string } => Boolean(item));

  return (
    <section className={styles.contactRoutes} aria-label="Contact and inquiry routes">
      <div className={styles.contactPrimary}>
        <p className={styles.contactLabel}>Recommended product-request route</p>
        <h2>Send one organized instrument request.</h2>
        <p>
          Select catalogue products or add an unlisted instrument, then include
          quantity, requirements, buyer details, and any useful reference.
        </p>
        <div className={styles.contactLinks}>
          <Link href="/rebuild/inquiry">Open Inquiry List</Link>
          <Link href="/rebuild/inquiry?manual=1">Add an unlisted instrument</Link>
        </div>
      </div>
      <aside className={styles.contactDirect} aria-label="Verified direct contact">
        <p className={styles.contactLabel}>Verified public details</p>
        <dl>
          <div>
            <dt>Location</dt>
            <dd>{contact.location}</dd>
          </div>
          {direct.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd><a href={item.href}>{item.value}</a></dd>
            </div>
          ))}
        </dl>
        {!direct.length ? (
          <p>Direct contact channels will appear here only after publication details are verified.</p>
        ) : null}
      </aside>
    </section>
  );
}
