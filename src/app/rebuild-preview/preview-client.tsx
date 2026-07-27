"use client";

import { useState } from "react";
import { CataloguePreview } from "./catalogue-preview";
import { HomePreview } from "./home-preview";
import { PreviewHeader, type PreviewView } from "./preview-header";
import styles from "./preview.module.css";
import { ProductPreview } from "./product-preview";

export function RebuildPreviewClient() {
  const [view, setView] = useState<PreviewView>("home");

  return <div className={styles.previewRoot}>
    <PreviewHeader view={view} onView={setView} />
    {view === "home" ? <HomePreview onView={setView} /> : view === "catalogue" ? <CataloguePreview onView={setView} /> : <ProductPreview />}
    <div className={styles.previewSwitcher} aria-label="Prototype views">
      <span>Prototype</span>
      <button type="button" aria-pressed={view === "home"} onClick={() => setView("home")}>Home</button>
      <button type="button" aria-pressed={view === "catalogue"} onClick={() => setView("catalogue")}>Catalogue</button>
      <button type="button" aria-pressed={view === "product"} onClick={() => setView("product")}>Product</button>
    </div>
  </div>;
}
