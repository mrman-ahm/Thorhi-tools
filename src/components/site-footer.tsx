import Link from "next/link";

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-display" aria-hidden="true"><span>T</span><span>H</span><span>R</span><span>O</span><span>H</span><span>I</span></div>
    <div className="container footer-grid">
      <div className="footer-identity"><strong>THROHI</strong><span>Medical tools · catalogue and structured inquiry</span></div>
      <nav aria-label="Footer">
        <Link href="/products">Products</Link>
        <Link href="/search">Search</Link>
        <Link href="/inquiry">Inquiry</Link>
        <Link href="/company">Company</Link>
        <Link href="/resources">Resources</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
      </nav>
    </div>
    <div className="container footer-meta"><span>VERIFIED INFORMATION ONLY</span><span>SEED CATALOGUE RECORDS REMAIN IDENTIFIED</span><span>PRE-PRODUCTION REVIEW BUILD</span></div>
  </footer>;
}
