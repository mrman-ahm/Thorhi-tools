"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const links = [["Products", "#products"], ["Company", "#company"], ["Resources", "#resources"], ["Contact", "#contact"]] as const;

function readInquiryCount() {
  try {
    const stored = window.localStorage.getItem("throhi-inquiry");
    return stored ? (JSON.parse(stored) as string[]).length : 0;
  } catch {
    return 0;
  }
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [inquiryCount, setInquiryCount] = useState(0);

  useEffect(() => {
    setInquiryCount(readInquiryCount());
    const refresh = () => setInquiryCount(readInquiryCount());
    window.addEventListener("throhi:inquiry-updated", refresh);
    return () => window.removeEventListener("throhi:inquiry-updated", refresh);
  }, []);

  useEffect(() => {
    document.body.dataset.menuOpen = String(open);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      delete document.body.dataset.menuOpen;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return <header className="site-header">
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="header-inner">
      <Link className="brand" href="/" aria-label="THROHI Medical Tools home"><Image src="/logo.webp" alt="THROHI Medical Tools" width={161} height={121} priority /></Link>
      <nav className="desktop-nav" aria-label="Primary">{links.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}</nav>
      <div className="header-actions">
        <a className="icon-button" href="#search" aria-label="Search products">⌕</a>
        <a className="inquiry-button" href="#inquiry">Inquiry <span aria-label={`${inquiryCount} saved items`}>{inquiryCount}</span></a>
        <button className="menu-button" type="button" aria-expanded={open} aria-controls="mobile-menu" aria-label={`${open ? "Close" : "Open"} navigation menu`} onClick={() => setOpen(value => !value)}>{open ? "Close" : "Menu"}</button>
      </div>
    </div>
    <nav id="mobile-menu" className="mobile-nav" aria-label="Mobile" hidden={!open}>{links.map(([label, href]) => <Link key={label} href={href} onClick={closeMenu}>{label}<span aria-hidden="true">→</span></Link>)}<a className="mobile-inquiry" href="#inquiry" onClick={closeMenu}>Review inquiry <strong>{inquiryCount} items</strong></a></nav>
  </header>;
}
