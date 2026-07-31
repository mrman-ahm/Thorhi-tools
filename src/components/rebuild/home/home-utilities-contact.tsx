import Link from "next/link";
import { verifiedContact } from "@/rebuild/contact";
import styles from "./home-sections.module.css";
import utilityStyles from "./home-utilities.module.css";

const options = [
  {
    href: "/rebuild/products",
    title: "Browse the digital catalogue",
    description: "Search validated product families by instrument name or catalogue code.",
  },
  {
    href: "/rebuild/inquiry",
    title: "Review Inquiry List",
    description: "Combine selected instruments, quantities and notes into one structured request.",
  },
  {
    href: "/rebuild/inquiry?manual=1",
    title: "Request an unlisted instrument",
    description: "Add a known name, reference code or description when the product is not yet indexed.",
  },
] as const;

export function HomeUtilitiesContact() {
  const hasDirectContact = Boolean(
    verifiedContact.email ||
      (verifiedContact.phoneDisplay && verifiedContact.phoneHref) ||
      verifiedContact.whatsappHref,
  );

  return (
    <section
      id="contact"
      className={utilityStyles.band}
      aria-label="Catalogue and inquiry options"
      data-home-utilities
      data-redesign-dark
    >
      <div className={styles.utilities} data-redesign-section>
        <header className={styles.utilitiesHeading}>
          <div>
            <p>06 / Next action</p>
            <h2 id="home-utilities-title">Continue with a precise request.</h2>
          </div>
          <p>
            Use the catalogue when the instrument is known, or describe the
            requirement directly in the Inquiry List.
          </p>
        </header>

        <div className={styles.utilityRows} data-redesign-ledger>
          {options.map((option, index) => (
            <Link href={option.href} key={option.href}>
              <span className={styles.utilityNumber}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>
                <strong>{option.title}</strong>
                <small>{option.description}</small>
              </span>
              <b aria-hidden="true">↗</b>
            </Link>
          ))}
        </div>

        <div className={styles.contactLine}>
          <div>
            <span>Verified location</span>
            <strong>{verifiedContact.location}</strong>
          </div>
          <div className={styles.contactActions}>
            {verifiedContact.email ? (
              <a href={`mailto:${verifiedContact.email}`}>{verifiedContact.email}</a>
            ) : null}
            {verifiedContact.phoneHref && verifiedContact.phoneDisplay ? (
              <a href={verifiedContact.phoneHref}>{verifiedContact.phoneDisplay}</a>
            ) : null}
            {verifiedContact.whatsappHref ? (
              <a href={verifiedContact.whatsappHref}>Continue through WhatsApp</a>
            ) : null}
            {!hasDirectContact ? (
              <Link href="/rebuild/inquiry">Start a structured inquiry</Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
