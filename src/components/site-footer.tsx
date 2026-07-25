import Image from "next/image";
import Link from "next/link";

const primary = [
  ["Products", "/products"],
  ["Search", "/search"],
  ["Inquiry", "/inquiry"],
  ["Company", "/company"]
] as const;

const utility = [
  ["Resources", "/resources"],
  ["Contact", "/contact"],
  ["Privacy", "/privacy"],
  ["Terms", "/terms"]
] as const;

export function SiteFooter() {
  return <footer className="site-footer v3-footer">
    <div className="container v3-footer-grid">
      <div className="v3-footer-identity">
        <Link href="/" aria-label="THROHI Medical Tools home">
          <Image src="/brand/throhi-logo-clean.webp" alt="THROHI Medical Tools" width={900} height={671} />
        </Link>
        <p>Medical tools catalogue and structured inquiry.</p>
      </div>

      <nav aria-label="Footer catalogue routes">
        <span>Catalogue</span>
        {primary.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
      </nav>

      <nav aria-label="Footer utility routes">
        <span>Information</span>
        {utility.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
      </nav>

      <div className="v3-footer-note">
        <span>Publishing rule</span>
        <p>Product and company information appears publicly only after verification and approval.</p>
      </div>
    </div>

    <div className="container v3-footer-meta">
      <span>THROHI Medical Tools</span>
      <span>Verified information only</span>
      <span>Experimental V3 visual branch</span>
    </div>
  </footer>;
}
