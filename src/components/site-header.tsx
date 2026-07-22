"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useInquiry } from "@/components/inquiry-provider";

const primaryLinks = [["Products", "/products"], ["Search", "/search"], ["Company", "/company"], ["Resources", "/resources"]] as const;
const divisionLinks = [["01", "Surgical", "/products/surgical"], ["02", "Dental", "/products/dental"], ["03", "Veterinary", "/products/veterinary"], ["04", "Beauty", "/products/beauty"]] as const;

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
      <Link className="brand" href="/" aria-label="THROHI Medical Tools home">
        <span className="brand-index">TM / 01</span>
        <span className="brand-image"><Image src="/logo.webp" alt="THROHI Medical Tools" width={161} height={121} priority /></span>
      </Link>
      <nav className="desktop-nav" aria-label="Primary">{primaryLinks.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}</nav>
      <div className="header-actions">
        <Link className="icon-button" href="/search" aria-label="Search products"><span aria-hidden="true">⌕</span><small>SEARCH</small></Link>
        <Link className="inquiry-button" href="/inquiry"><span className="inquiry-label">Inquiry</span><span aria-label={itemLabel}>{String(count).padStart(2, "0")}</span></Link>
        <button className="menu-button" type="button" aria-expanded={open} aria-controls="mobile-menu" aria-label={`${open ? "Close" : "Open"} navigation menu`} onClick={() => setOpen(value => !value)}>{open ? "Close" : "Menu"}</button>
      </div>
    </div>
    <nav id="mobile-menu" className="mobile-nav" aria-label="Mobile" hidden={!open}>
      <div className="mobile-nav-primary">{divisionLinks.map(([index, label, href]) => <Link key={label} href={href} onClick={closeMenu}><span>{index}</span><strong>{label}</strong><b aria-hidden="true">↗</b></Link>)}</div>
      <div className="mobile-nav-utility">{primaryLinks.map(([label, href]) => <Link key={label} href={href} onClick={closeMenu}>{label}</Link>)}<Link href="/contact" onClick={closeMenu}>Contact</Link></div>
      <Link className="mobile-inquiry" href="/inquiry" onClick={closeMenu}><span>Review inquiry</span><strong>{itemLabel}</strong></Link>
    </nav>
  </header>;
}
