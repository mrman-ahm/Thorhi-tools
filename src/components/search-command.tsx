"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { productHref } from "@/lib/catalogue";
import { searchProducts } from "@/lib/search";

const OPEN_EVENT = "throhi:open-search";
const focusableSelector = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return target.matches("input, textarea, select, [contenteditable='true']") || Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
}

function matchClass(reason: string) {
  if (reason === "exact code") return "exact";
  if (reason.includes("code")) return "technical";
  if (reason.includes("family") || reason.includes("division")) return "contextual";
  return "name";
}

export function SearchCommand() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const results = useMemo(() => searchProducts(query).slice(0, 6), [query]);

  useEffect(() => {
    const openCommand = () => setOpen(true);
    const handleGlobalShortcut = (event: KeyboardEvent) => {
      const commandKey = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      const slashKey = event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey && !isTypingTarget(event.target);
      if (!commandKey && !slashKey) return;
      event.preventDefault();
      setOpen(true);
    };

    window.addEventListener(OPEN_EVENT, openCommand);
    window.addEventListener("keydown", handleGlobalShortcut);
    return () => {
      window.removeEventListener(OPEN_EVENT, openCommand);
      window.removeEventListener("keydown", handleGlobalShortcut);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.dataset.searchOpen = "true";
    setActiveIndex(0);

    const focusFrame = window.requestAnimationFrame(() => inputRef.current?.focus());
    const handleDialogKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key === "ArrowDown" && results.length) {
        event.preventDefault();
        setActiveIndex(index => (index + 1) % results.length);
        return;
      }

      if (event.key === "ArrowUp" && results.length) {
        event.preventDefault();
        setActiveIndex(index => (index - 1 + results.length) % results.length);
        return;
      }

      if (event.key === "Enter" && document.activeElement === inputRef.current && results[activeIndex]) {
        event.preventDefault();
        router.push(productHref(results[activeIndex].product));
        setOpen(false);
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector));
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

    window.addEventListener("keydown", handleDialogKeyboard);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      delete document.body.dataset.searchOpen;
      window.removeEventListener("keydown", handleDialogKeyboard);
      previousFocus.current?.focus();
    };
  }, [activeIndex, open, results, router]);

  useEffect(() => {
    if (activeIndex >= results.length) setActiveIndex(0);
  }, [activeIndex, results.length]);

  const goToResult = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  const submitSearch = () => {
    router.push(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : "/search");
    setOpen(false);
  };

  return <div className="search-command-layer" data-open={open} aria-hidden={!open} inert={!open}>
    <button className="search-command-backdrop" type="button" aria-label="Close catalogue command" onClick={() => setOpen(false)} />
    <div ref={dialogRef} className="search-command-dialog" role="dialog" aria-modal="true" aria-labelledby="search-command-title">
      <header className="search-command-heading">
        <div><span>THROHI / CATALOGUE COMMAND</span><h2 id="search-command-title">Find an instrument.</h2></div>
        <button type="button" onClick={() => setOpen(false)} aria-label="Close catalogue command">ESC</button>
      </header>

      <div className="search-command-input-wrap">
        <span aria-hidden="true">⌕</span>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={event => { setQuery(event.target.value); setActiveIndex(0); }}
          placeholder="Name, family, or exact / partial code"
          role="combobox"
          aria-expanded="true"
          aria-controls="search-command-results"
          aria-activedescendant={results[activeIndex] ? `search-command-result-${results[activeIndex].product.id}` : undefined}
          autoComplete="off"
        />
        <kbd>⌘K</kbd>
      </div>

      <div className="search-command-summary" aria-live="polite">
        <span>{query ? `${results.length} preview ${results.length === 1 ? "result" : "results"}` : "Recent catalogue structure"}</span>
        <small>↑ ↓ SELECT · ENTER OPEN · ESC CLOSE</small>
      </div>

      <div id="search-command-results" className="search-command-results" role="listbox" aria-label="Catalogue search suggestions">
        {results.length > 0 ? results.map((result, index) => <button
          id={`search-command-result-${result.product.id}`}
          type="button"
          role="option"
          aria-selected={index === activeIndex}
          className={`search-command-result match-${matchClass(result.reason)}`}
          key={result.product.id}
          onMouseEnter={() => setActiveIndex(index)}
          onFocus={() => setActiveIndex(index)}
          onClick={() => goToResult(productHref(result.product))}
        >
          <span className="command-result-index">{String(index + 1).padStart(2, "0")}</span>
          <span className="command-result-copy"><strong>{result.product.name}</strong><small>{result.product.division.toUpperCase()} · {result.product.family.replaceAll("-", " ").toUpperCase()}</small></span>
          <code>{result.product.code}</code>
          <span className="command-result-reason">{result.reason}</span>
          <b aria-hidden="true">↗</b>
        </button>) : <div className="search-command-empty">
          <span>NO PREVIEW MATCH</span>
          <strong>Search the full catalogue or add the known reference manually.</strong>
        </div>}
      </div>

      <footer className="search-command-footer">
        <button type="button" onClick={submitSearch}><span>View full search</span><strong>{query || "All catalogue records"}</strong></button>
        <button type="button" onClick={() => goToResult(`/inquiry?manual=1&reference=${encodeURIComponent(query)}`)}><span>Cannot find it?</span><strong>Add an unlisted item</strong></button>
      </footer>
    </div>
  </div>;
}
