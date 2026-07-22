import Link from "next/link";

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="container footer-grid">
      <div><strong>THROHI</strong><span>MEDICAL TOOLS</span></div>
      <nav aria-label="Footer">
        <Link href="/products">Products</Link>
        <Link href="/company">Company</Link>
        <Link href="/resources">Resources</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
      </nav>
    </div>
    <p>Verified information only · Seed catalogue records are identified before approval</p>
  </footer>;
}
