"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const links = [["Products", "#products"], ["Company", "#company"], ["Resources", "#resources"], ["Contact", "#contact"]] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  useEffect(() => { document.body.dataset.menuOpen = String(open); return () => { delete document.body.dataset.menuOpen; }; }, [open]);
  return <header className="site-header">
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="header-inner">
      <Link className="brand" href="/" aria-label="THROHI Medical Tools home"><Image src="/logo.webp" alt="THROHI Medical Tools" width={161} height={121} priority /></Link>
      <nav className="desktop-nav" aria-label="Primary">{links.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}</nav>
      <div className="header-actions"><a className="icon-button" href="#search" aria-label="Search products">⌕</a><a className="inquiry-button" href="#inquiry">Inquiry <span aria-label="3 saved items">3</span></a><button className="menu-button" type="button" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(v => !v)}>{open ? "Close" : "Menu"}</button></div>
    </div>
    <nav id="mobile-menu" className="mobile-nav" aria-label="Mobile" hidden={!open}>{links.map(([label, href]) => <Link key={label} href={href} onClick={() => setOpen(false)}>{label}<span>→</span></Link>)}<a className="mobile-inquiry" href="#inquiry" onClick={() => setOpen(false)}>Review inquiry <strong>3 items</strong></a></nav>
  </header>;
}
