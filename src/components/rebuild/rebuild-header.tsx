"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { FormEvent } from "react";
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

const focusableSelector =
  "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";

export function RebuildHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useInquiry();
  const [productsOpen, setProductsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const productsTriggerRef = useRef<HTMLButtonElement>(null);
  const productsPanelRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setProductsOpen(false);
    setSearchOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!productsOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (
        productsTriggerRef.current?.contains(target) ||
        productsPanelRef.current?.contains(target)
      ) return;
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
    if (!searchOpen) return;
    const frame = window.requestAnimationFrame(() => searchInputRef.current?.focus());
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", close);
    };
  }, [searchOpen]);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : mobileTriggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.dataset.rebuildMenuOpen = "true";
    document.body.style.overflow = "hidden";

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
      const focusable = Array.from(
        mobileMenuRef.current.querySelectorAll<HTMLElement>(focusableSelector)
      );
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
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyboard);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [mobileOpen]);

  const closeNavigation = () => {
    setProductsOpen(false);
    setSearchOpen(false);
    setMobileOpen(false);
  };

  const toggleSearch = () => {
    setProductsOpen(false);
    setSearchOpen((open) => !open);
  };

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    closeNavigation();
    router.push(
      value
        ? `/rebuild/products?q=${encodeURIComponent(value)}`
        : "/rebuild/products"
    );
  };

  const inquiryLabel = `${count} ${count === 1 ? "instrument" : "instruments"} in Inquiry List`;

  return (
    <header className={styles.header}>
      <a className={styles.skipLink} href="#main">Skip to content</a>
      <div className={styles.inner}>
        <Link
          className={styles.brand}
          href="/rebuild"
          aria-label="THROHI Medical Tools rebuild home"
          onClick={closeNavigation}
        >
          <Image
            src="/brand/throhi-logo-temporary.webp"
            alt="THROHI Medical Tools"
            width={1086}
            height={816}
            priority
          />
        </Link>

        <nav className={styles.desktopNav} aria-label="Primary navigation">
          {rebuildPrimaryNavigation.map((route) =>
            route.productsMenu ? (
              <div className={styles.productsControl} key={route.href}>
                <button
                  ref={productsTriggerRef}
                  type="button"
                  aria-expanded={productsOpen}
                  aria-controls="rebuild-products-menu"
                  aria-current={
                    isRebuildRouteActive(pathname, route.href) ? "page" : undefined
                  }
                  onClick={() => {
                    setSearchOpen(false);
                    setProductsOpen((value) => !value);
                  }}
                >
                  {route.label}<span aria-hidden="true">{productsOpen ? "−" : "+"}</span>
                </button>
              </div>
            ) : (
              <Link
                key={route.href}
                href={route.href}
                aria-current={
                  isRebuildRouteActive(pathname, route.href) ? "page" : undefined
                }
                onClick={closeNavigation}
              >
                {route.label}
              </Link>
            )
          )}
        </nav>

        <div className={styles.actions}>
          <button
            className={styles.search}
            type="button"
            onClick={toggleSearch}
            aria-expanded={searchOpen}
            aria-controls="rebuild-header-search"
          >
            Search
          </button>
          <Link
            className={styles.inquiry}
            href={rebuildPersistentUtilities.inquiry.href}
            aria-label={inquiryLabel}
            onClick={closeNavigation}
          >
            <span>{rebuildPersistentUtilities.inquiry.label}</span>
            <b>{String(count).padStart(2, "0")}</b>
          </Link>
          <button
            ref={mobileTriggerRef}
            className={styles.mobileTrigger}
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="rebuild-mobile-navigation"
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <div
        id="rebuild-header-search"
        className={styles.searchPanel}
        data-open={searchOpen}
        aria-hidden={!searchOpen}
        inert={!searchOpen}
      >
        <form role="search" onSubmit={submitSearch}>
          <label htmlFor="rebuild-desktop-search">Search the catalogue</label>
          <div>
            <input
              ref={searchInputRef}
              id="rebuild-desktop-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Product name or code"
            />
            <button type="submit">Search</button>
          </div>
        </form>
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
          <p>Product divisions</p>
          <nav aria-label="Product divisions">
            {rebuildDivisionNavigation.map((division) =>
              division.catalogueState === "structured" && division.href ? (
                <Link href={division.href} key={division.slug} onClick={closeNavigation}>
                  <span>
                    <strong>{division.label}</strong>
                    <small>{division.description}</small>
                  </span>
                  <b aria-hidden="true">↗</b>
                </Link>
              ) : (
                <div className={styles.pendingDivision} key={division.slug}>
                  <span>
                    <strong>{division.label}</strong>
                    <small>{division.description}</small>
                  </span>
                  <b>Pending source</b>
                </div>
              )
            )}
          </nav>
          <div className={styles.productUtilities}>
            {rebuildProductUtilities.map((utility) => (
              <Link href={utility.href} key={utility.href} onClick={closeNavigation}>
                {utility.label}<b aria-hidden="true">↗</b>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <aside
        ref={mobileMenuRef}
        id="rebuild-mobile-navigation"
        className={styles.mobilePanel}
        data-open={mobileOpen}
        aria-hidden={!mobileOpen}
        inert={!mobileOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
      >
        <div className={styles.mobilePanelInner}>
          <form className={styles.mobileSearchForm} role="search" onSubmit={submitSearch}>
            <label htmlFor="rebuild-mobile-search">Search the catalogue</label>
            <div>
              <input
                id="rebuild-mobile-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Product name or code"
              />
              <button type="submit">Search</button>
            </div>
          </form>
          <nav aria-label="Mobile navigation">
            <section aria-labelledby="mobile-products-heading">
              <h2 id="mobile-products-heading">Products</h2>
              {rebuildDivisionNavigation.map((division) =>
                division.catalogueState === "structured" && division.href ? (
                  <Link href={division.href} key={division.slug} onClick={closeNavigation}>
                    <span>{division.label}</span><b aria-hidden="true">↗</b>
                  </Link>
                ) : (
                  <div className={styles.mobilePending} key={division.slug}>
                    <span>{division.label}</span><small>Pending source</small>
                  </div>
                )
              )}
              <Link
                className={styles.mobileAllProducts}
                href="/rebuild/products"
                onClick={closeNavigation}
              >
                Browse all products <b aria-hidden="true">↗</b>
              </Link>
            </section>
            <section aria-label="Company routes">
              {rebuildPrimaryNavigation
                .filter((route) => !route.productsMenu)
                .map((route) => (
                  <Link href={route.href} key={route.href} onClick={closeNavigation}>
                    <span>{route.label}</span><b aria-hidden="true">↗</b>
                  </Link>
                ))}
            </section>
          </nav>
          <footer>
            <Link href={rebuildPersistentUtilities.inquiry.href} onClick={closeNavigation}>
              <span>Review Inquiry List</span><strong>{inquiryLabel}</strong>
            </Link>
          </footer>
        </div>
      </aside>
    </header>
  );
}
