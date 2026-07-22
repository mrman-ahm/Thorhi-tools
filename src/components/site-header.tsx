"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useInquiry } from "@/components/inquiry-provider";

const links = [["Products", "/products"], ["Company", "/company"], ["Resources", "/resources"], ["Contact", "/contact"]] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { count } = useInquiry();

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
  const itemLabel = `${count} saved ${count === 1 ? "item" : "items"}`;

  return <header className="site-header">
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="header-inner">
      <Link className="brand" href="/" aria-label="THROHI Medical Tools home"><Image src="/logo.webp" alt="THROHI Medical Tools" width={161} height={121} priority /></Link>
      <nav className="desktop-nav" aria-label="Primary">{links.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}</nav>
      <div className="header-actions">
        <Link className="icon-button" href="/search" aria-label="Search products">⌕</Link>
        <Link className="inquiry-button" href="/inquiry">Inquiry <span aria-label={itemLabel}>{count}</span></Link>
        <button className="menu-button" type="button" aria-expanded={open} aria-controls="mobile-menu" aria-label={`${open ? "Close" : "Open"} navigation menu`} onClick={() => setOpen(value => !value)}>{open ? "Close" : "Menu"}</button>
      </div>
    </div>
    <nav id="mobile-menu" className="mobile-nav" aria-label="Mobile" hidden={!open}>{links.map(([label, href]) => <Link key={label} href={href} onClick={closeMenu}>{label}<span aria-hidden="true">→</span></Link>)}<Link className="mobile-inquiry" href="/inquiry" onClick={closeMenu}>Review inquiry <strong>{itemLabel}</strong></Link></nav>
  </header>;
}
