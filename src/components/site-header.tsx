"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useInquiry } from "@/components/inquiry-provider";

const primaryLinks = [["Products", "/products"], ["Search", "/search"], ["Company", "/company"], ["Resources", "/resources"]] as const;
const divisionLinks = [
  ["01", "Surgical", "/products/surgical", "Cutting, holding, clamping, retracting, and suturing."],
  ["02", "Dental", "/products/dental", "Diagnostic, extraction, periodontal, and restorative."],
  ["03", "Veterinary", "/products/veterinary", "General, equine, hoof, obstetrical, and specialist."],
  ["04", "Beauty", "/products/beauty", "Hair, tweezer, nail, cuticle, and salon instruments."]
] as const;

const focusableSelector = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const lastScroll = useRef(0);
  const scrollFrame = useRef<number | null>(null);
  const { count } = useInquiry();

  useEffect(() => {
    const updateHeader = () => {
      const current = window.scrollY;
      const delta = current - lastScroll.current;
      setScrolled(current > 24);

      if (!open) {
        if (current > 170 && delta > 7) setHidden(true);
        if (delta < -7 || current < 90) setHidden(false);
      }

      lastScroll.current = current;
      scrollFrame.current = null;
    };

    const onScroll = () => {
      if (scrollFrame.current === null) scrollFrame.current = window.requestAnimationFrame(updateHeader);
    };

    lastScroll.current = window.scrollY;
    updateHeader();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollFrame.current !== null) window.cancelAnimationFrame(scrollFrame.current);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : triggerRef.current;
    document.body.dataset.menuOpen = "true";
    setHidden(false);

    const focusMenu = window.requestAnimationFrame(() => {
      const first = menuRef.current?.querySelector<HTMLElement>(focusableSelector);
      first?.focus();
    });

    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== "Tab" || !menuRef.current) return;
      const focusable = Array.from(menuRef.current.querySelectorAll<HTMLElement>(focusableSelector)).filter(element => !element.hasAttribute("disabled"));
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyboard);
    return () => {
      window.cancelAnimationFrame(focusMenu);
      delete document.body.dataset.menuOpen;
      window.removeEventListener("keydown", handleKeyboard);
      previousFocus?.focus();
    };
  }, [open]);

  const closeMenu = () => setOpen(false);
  const openSearch = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setOpen(false);
    window.dispatchEvent(new Event("throhi:open-search"));
  };
  const itemLabel = `${count} saved ${count === 1 ? "item" : "items"}`;
  const headerClass = ["site-header", scrolled && "is-scrolled", hidden && "is-hidden", open && "menu-is-open"].filter(Boolean).join(" ");

  return <header className={headerClass} data-scrolled={scrolled} data-hidden={hidden}>
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="header-inner">
      <Link className="brand" href="/" aria-label="THROHI Medical Tools home">
        <span className="brand-index">TM / 01</span>
        <span className="brand-image"><Image src="/brand/throhi-logo-clean.webp" alt="THROHI Medical Tools" width={900} height={671} priority /></span>
      </Link>
      <nav className="desktop-nav" aria-label="Primary">{primaryLinks.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}</nav>
      <div className="header-actions">
        <Link className="icon-button" href="/search" aria-label="Open catalogue search command" aria-haspopup="dialog" onClick={openSearch}><span aria-hidden="true">⌕</span><small>SEARCH</small></Link>
        <Link className="inquiry-button" href="/inquiry"><span className="inquiry-label">Inquiry</span><span aria-label={itemLabel}>{String(count).padStart(2, "0")}</span></Link>
        <button ref={triggerRef} className="menu-button" type="button" aria-expanded={open} aria-controls="site-menu" aria-label={`${open ? "Close" : "Open"} navigation menu`} onClick={() => setOpen(value => !value)}>{open ? "Close" : "Menu"}</button>
      </div>
    </div>

    <div className="menu-layer" data-open={open} aria-hidden={!open} inert={!open}>
      <nav ref={menuRef} id="site-menu" className="mobile-nav" aria-label="Mobile">
        <header className="menu-heading" aria-hidden="true"><span>THROHI / INDEX</span><span>SELECT A DIVISION OR DIRECT ROUTE</span></header>
        <div className="mobile-nav-primary">{divisionLinks.map(([index, label, href, description], itemIndex) => <Link key={label} href={href} onClick={closeMenu} style={{ "--menu-index": itemIndex } as CSSProperties}><span>{index}</span><strong>{label}</strong><small>{description}</small><b aria-hidden="true">↗</b></Link>)}</div>
        <div className="menu-utility-row">
          <div className="mobile-nav-utility">{primaryLinks.map(([label, href]) => <Link key={label} href={href} onClick={label === "Search" ? openSearch : closeMenu}>{label}</Link>)}<Link href="/contact" onClick={closeMenu}>Contact</Link></div>
          <Link className="mobile-inquiry" href="/inquiry" onClick={closeMenu}><span>Review inquiry</span><strong>{itemLabel}</strong></Link>
        </div>
      </nav>
    </div>
  </header>;
}
