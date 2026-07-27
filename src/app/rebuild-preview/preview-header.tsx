"use client";

import Image from "next/image";
import { useState } from "react";
import {
  rebuildDivisionNavigation,
  rebuildPersistentUtilities,
  rebuildPrimaryNavigation,
} from "@/rebuild/navigation";
import styles from "./preview.module.css";

export type PreviewView = "home" | "catalogue" | "product";

type PreviewHeaderProps = {
  view: PreviewView;
  onView: (view: PreviewView) => void;
};

const previewHashByRoute = {
  "/company": "#company",
  "/catalogues": "#catalogues",
  "/contact": "#contact",
} as const;

export function PreviewHeader({ view, onView }: PreviewHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const openCatalogue = () => {
    onView("catalogue");
    closeMenu();
  };

  return <>
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <button className={styles.brandButton} type="button" onClick={() => onView("home")} aria-label="Open homepage preview">
          <Image src="/brand/throhi-logo-clean.webp" alt="THROHI Medical Tools" width={900} height={671} priority />
        </button>
        <nav className={styles.desktopNav} aria-label="Preview navigation">
          {rebuildPrimaryNavigation.map((route) => route.productsMenu ? <button
            key={route.href}
            type="button"
            aria-current={view === "catalogue" ? "page" : undefined}
            onClick={openCatalogue}
          >{route.label}</button> : <a
            key={route.href}
            href={previewHashByRoute[route.href as keyof typeof previewHashByRoute]}
          >{route.label}</a>)}
        </nav>
        <div className={styles.headerActions}>
          <button className={styles.searchButton} type="button" onClick={openCatalogue}>{rebuildPersistentUtilities.search.label}</button>
          <button className={styles.inquiryButton} type="button"><span>{rebuildPersistentUtilities.inquiry.label}</span><b>0</b></button>
          <a className={styles.whatsappButton} href="#contact">{rebuildPersistentUtilities.whatsapp.label}</a>
          <button className={styles.menuButton} type="button" aria-expanded={menuOpen} aria-controls="rebuild-mobile-menu" onClick={() => setMenuOpen((value) => !value)}>{menuOpen ? "Close" : "Menu"}</button>
        </div>
      </div>
    </header>
    <aside id="rebuild-mobile-menu" className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`} aria-hidden={!menuOpen} inert={!menuOpen}>
      <button type="button" onClick={openCatalogue}>Products</button>
      <div className={styles.mobileDivisions}>
        {rebuildDivisionNavigation.map((division) => division.catalogueState === "structured" ? <button
          type="button"
          key={division.slug}
          onClick={openCatalogue}
        >{division.label}</button> : <a key={division.slug} href="#contact" onClick={closeMenu}>{division.label}</a>)}
      </div>
      {rebuildPrimaryNavigation.filter((route) => !route.productsMenu).map((route) => <a
        key={route.href}
        href={previewHashByRoute[route.href as keyof typeof previewHashByRoute]}
        onClick={closeMenu}
      >{route.label}</a>)}
    </aside>
  </>;
}
