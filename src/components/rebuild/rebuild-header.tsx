"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useInquiry } from "@/components/inquiry-provider";
import {
  isRebuildRouteActive,
  rebuildDivisionNavigation,
  rebuildPersistentUtilities,
  rebuildPrimaryNavigation,
  rebuildProductUtilities,
} from "@/rebuild/navigation";
import styles from "./rebuild-header.module.css";

const focusableSelector = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";

export function RebuildHeader() {
  const pathname = usePathname();
  const { count } = useInquiry();
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const productsTriggerRef = useRef<HTMLButtonElement>(null);
  const productsPanelRef = useRef<HTMLDivElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setProductsOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!productsOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (productsTriggerRef.current?.contains(target) || productsPanelRef.current?.contains(target)) return;
      setProductsOpen(false);
    };

    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setProductsOpen(false);
      productsTriggerRef.current?.focus();
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyboard);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyboard);
    };
  }, [productsOpen]);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : mobileTriggerRef.current;
    document.body.dataset.rebuildMenuOpen = "true";

    const focusFrame = window.requestAnimationFrame(() => {
      mobileMenuRef.current?.querySelector<HTMLElement>(focusableSelector)?.focus();
    });

    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMobileOpen(false);
        return;
      }

      if (event.key !== "Tab" || !mobileMenuRef.current) return;
      const focusable = Array.from(mobileMenuRef.current.querySelectorAll<HTMLElement>(focusableSelector));
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
      window.cancelAnimationFrame(focusFrame);
      delete document.body.dataset.rebuildMenuOpen;
      window.removeEventListener("keydown", handleKeyboard);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [mobileOpen]);

  const openSearch = () => {
    setProductsOpen(false);
    setMobileOpen(false);
    window.dispatchEvent(new Event("throhi:open-search"));
  };

  const closeNavigation = () => {
    setProductsOpen(false);
    setMobileOpen(false);
  };

  const inquiryLabel = `${count} ${count === 1 ? "instrument" : "instruments"} in Inquiry List`;

  return <header className={styles.header}>
    <a className={styles.skipLink} href="#main">Skip to content</a>
    <div className={styles.inner}>
      <Link className={styles.brand} href="/" aria-label="THROHI Medical Tools home" onClick={closeNavigation}>
        <Image src="/brand/throhi-logo-clean.webp" alt="THROHI Medical Tools" width={900} height={671} priority />
      </Link>

      <nav className={styles.desktopNav} aria-label="Primary navigation">
        {rebuildPrimaryNavigation.map((route) => route.productsMenu ? <div className={styles.productsControl} key={route.href}>
          <button
            ref={productsTriggerRef}
            type="button"
            aria-expanded={productsOpen}
            aria-controls="rebuild-products-menu"
            aria-current={isRebuildRouteActive(pathname, route.href) ? "page" : undefined}
            onClick={() => setProductsOpen((value) => !value)}
          >
            {route.label}<span aria-hidden="true">{productsOpen ? "−" : "+"}</span>
          </button>
        </div> : <Link
          key={route.href}
          href={route.href}
          aria-current={isRebuildRouteActive(pathname, route.href) ? "page" : undefined}
          onClick={closeNavigation}
        >{route.label}</Link>)}
      </nav>

      <div className={styles.actions}>
        <button className={styles.search} type="button" onClick={openSearch} aria-label="Search the THROHI catalogue">Search</button>
        <Link className={styles.inquiry} href={rebuildPersistentUtilities.inquiry.href} aria-label={inquiryLabel} onClick={closeNavigation}>
          <span>{rebuildPersistentUtilities.inquiry.label}</span><b>{String(count).padStart(2, "0")}</b>
        </Link>
        <Link className={styles.whatsapp} href={rebuildPersistentUtilities.whatsapp.href} onClick={closeNavigation}>WhatsApp</Link>
        <button
          ref={mobileTriggerRef}
          className={styles.mobileTrigger}
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="rebuild-mobile-navigation"
          onClick={() => setMobileOpen((value) => !value)}
        >{mobileOpen ? "Close" : "Menu"}</button>
      </div>
    </div>

    <div
      ref={productsPanelRef}
      id="rebuild-products-menu"
      className={styles.productsPanel}
      data-open={productsOpen}
      aria-hidden={!productsOpen}
      inert={!productsOpen}
    >
      <div className={styles.productsPanelInner}>
        <p>Browse product divisions</p>
        <nav aria-label="Product divisions">
          {rebuildDivisionNavigation.map((division) => <Link href={division.href} key={division.slug} onClick={closeNavigation}>
            <span><strong>{division.label}</strong><small>{division.description}</small></span><b aria-hidden="true">↗</b>
          </Link>)}
        </nav>
        <div className={styles.productUtilities}>{rebuildProductUtilities.map((utility) => utility.href === "/search" ? <button type="button" key={utility.href} onClick={openSearch}>{utility.label}<b aria-hidden="true">↗</b></button> : <Link href={utility.href} key={utility.href} onClick={closeNavigation}>{utility.label}<b aria-hidden="true">↗</b></Link>)}</div>
      </div>
    </div>

    <aside
      ref={mobileMenuRef}
      id="rebuild-mobile-navigation"
      className={styles.mobilePanel}
      data-open={mobileOpen}
      aria-hidden={!mobileOpen}
      inert={!mobileOpen}
    >
      <div className={styles.mobilePanelInner}>
        <button className={styles.mobileSearch} type="button" onClick={openSearch}>Search by product name or code <b aria-hidden="true">↗</b></button>
        <nav aria-label="Mobile navigation">
          <section aria-labelledby="mobile-products-heading">
            <h2 id="mobile-products-heading">Products</h2>
            {rebuildDivisionNavigation.map((division) => <Link href={division.href} key={division.slug} onClick={closeNavigation}><span>{division.label}</span><b aria-hidden="true">↗</b></Link>)}
            <Link className={styles.mobileAllProducts} href="/products" onClick={closeNavigation}>Browse all products <b aria-hidden="true">↗</b></Link>
          </section>
          <section aria-label="Company routes">
            {rebuildPrimaryNavigation.filter((route) => !route.productsMenu).map((route) => <Link href={route.href} key={route.href} onClick={closeNavigation}><span>{route.label}</span><b aria-hidden="true">↗</b></Link>)}
          </section>
        </nav>
        <footer>
          <Link href={rebuildPersistentUtilities.inquiry.href} onClick={closeNavigation}><span>Review Inquiry List</span><strong>{inquiryLabel}</strong></Link>
          <Link href={rebuildPersistentUtilities.whatsapp.href} onClick={closeNavigation}>Contact through WhatsApp <b aria-hidden="true">↗</b></Link>
        </footer>
      </div>
    </aside>
  </header>;
}
