"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ChangeEvent, CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useInquiry } from "@/components/inquiry-provider";
import {
  rebuildCatalogue,
  scoreRebuildProduct,
  type RuntimeFamily,
  type RuntimeProduct,
} from "@/lib/rebuild-catalogue";
import { CatalogueMedia } from "./catalogue-media";
import styles from "./catalogue.module.css";

const PAGE_SIZE = 24;
const validDivisions = new Set(["all", "surgical", "dental"]);
const validSorts = new Set(["relevance", "name", "code"]);

type SortMode = "relevance" | "name" | "code";

function familyKey(family: RuntimeFamily) {
  return `${family.division}:${family.slug}`;
}

export function CatalogueClient() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const paramsKey = params.toString();
  const queryParam = params.get("q") ?? "";
  const divisionParam = params.get("division") ?? "all";
  const familyParam = params.get("family") ?? "all";
  const sortParam = params.get("sort") ?? "relevance";
  const pageParam = Number.parseInt(params.get("page") ?? "1", 10);

  const [query, setQuery] = useState(queryParam);
  const [announcement, setAnnouncement] = useState("");
  const { items, addProduct } = useInquiry();

  const division = validDivisions.has(divisionParam) ? divisionParam : "all";
  const sort = (validSorts.has(sortParam) ? sortParam : "relevance") as SortMode;

  const selectedFamily = useMemo(() => {
    if (familyParam === "all") return undefined;
    const exact = rebuildCatalogue.families.find(
      (family) => familyKey(family) === familyParam
    );
    if (exact) return exact;
    return rebuildCatalogue.families.find(
      (family) =>
        family.slug === familyParam &&
        (division === "all" || family.division === division)
    );
  }, [division, familyParam]);

  const availableFamilies = useMemo(
    () =>
      rebuildCatalogue.families
        .filter((family) => division === "all" || family.division === division)
        .sort(
          (left, right) =>
            left.division.localeCompare(right.division) ||
            left.order - right.order
        ),
    [division]
  );

  const updateParams = useCallback(
    (
      updates: Record<string, string | null>,
      mode: "push" | "replace" = "push"
    ) => {
      const next = new URLSearchParams(paramsKey);
      Object.entries(updates).forEach(([key, value]) => {
        if (!value || value === "all" || (key === "sort" && value === "relevance")) {
          next.delete(key);
        } else {
          next.set(key, value);
        }
      });
      const search = next.toString();
      router[mode](search ? `${pathname}?${search}` : pathname, { scroll: false });
    },
    [paramsKey, pathname, router]
  );

  useEffect(() => {
    setQuery(queryParam);
  }, [queryParam]);

  useEffect(() => {
    const nextQuery = query.trim();
    if (nextQuery === queryParam) return;
    const timer = window.setTimeout(() => {
      updateParams({ q: nextQuery || null, page: null }, "replace");
    }, 220);
    return () => window.clearTimeout(timer);
  }, [query, queryParam, updateParams]);

  const results = useMemo(() => {
    const matches = rebuildCatalogue.products
      .map((product) => ({
        product,
        rank: scoreRebuildProduct(product, queryParam),
      }))
      .filter(
        ({ product, rank }) =>
          rank > 0 &&
          (division === "all" || product.division === division) &&
          (!selectedFamily ||
            (product.division === selectedFamily.division &&
              product.family === selectedFamily.slug))
      );

    matches.sort((left, right) => {
      if (sort === "name") {
        return (
          left.product.name.localeCompare(right.product.name) ||
          left.product.code.localeCompare(right.product.code)
        );
      }
      if (sort === "code") {
        return left.product.code.localeCompare(right.product.code, undefined, {
          numeric: true,
        });
      }
      return (
        right.rank - left.rank ||
        left.product.name.localeCompare(right.product.name)
      );
    });

    return matches.map(({ product }) => product);
  }, [division, queryParam, selectedFamily, sort]);

  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const currentPage = Number.isFinite(pageParam)
    ? Math.min(Math.max(pageParam, 1), pageCount)
    : 1;
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageResults = results.slice(pageStart, pageStart + PAGE_SIZE);
  const activeFilterCount =
    Number(Boolean(queryParam)) +
    Number(division !== "all") +
    Number(Boolean(selectedFamily));

  const setDivision = (nextDivision: string) => {
    updateParams({
      division: nextDivision,
      family: null,
      page: null,
    });
  };

  const setFamily = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    updateParams({ family: value, page: null });
  };

  const reset = () => {
    setQuery("");
    router.push(pathname, { scroll: false });
  };

  const add = (product: RuntimeProduct) => {
    const result = addProduct({
      productId: product.id,
      productCode: product.code,
      code: product.code,
      name: product.name,
    });
    setAnnouncement(
      result === "added"
        ? `${product.name} added to the Inquiry List.`
        : `${product.name} quantity increased in the Inquiry List.`
    );
  };

  return (
    <section className={styles.catalogueWorkspace}>
      <span className={styles.srOnly} aria-live="polite">{announcement}</span>
      <div className={styles.workspaceInner}>
        <div className={styles.primarySearch}>
          <label htmlFor="catalogue-query">Search by product name or code</label>
          <div>
            <input
              id="catalogue-query"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="04-0101 or operating scissors"
              autoComplete="off"
            />
            {query ? (
              <button type="button" onClick={() => setQuery("")}>Clear</button>
            ) : (
              <span>Search</span>
            )}
          </div>
        </div>

        <details className={styles.mobileFilters}>
          <summary>
            Filters
            <span>{activeFilterCount ? `${activeFilterCount} active` : "All products"}</span>
          </summary>
          <FilterControls
            prefix="mobile"
            division={division}
            family={selectedFamily ? familyKey(selectedFamily) : "all"}
            families={availableFamilies}
            onDivision={setDivision}
            onFamily={setFamily}
          />
        </details>

        <div className={styles.catalogueLayout}>
          <aside className={styles.desktopFilters} aria-label="Catalogue filters">
            <div className={styles.stickyFilters}>
              <div className={styles.filterHeading}>
                <p>Refine catalogue</p>
                {activeFilterCount ? (
                  <button type="button" onClick={reset}>Reset</button>
                ) : null}
              </div>
              <FilterControls
                prefix="desktop"
                division={division}
                family={selectedFamily ? familyKey(selectedFamily) : "all"}
                families={availableFamilies}
                onDivision={setDivision}
                onFamily={setFamily}
              />
              <div className={styles.sourceBoundary}>
                <strong>Source status</strong>
                <p>Product identity and catalogue references are indexed. Technical details remain under review.</p>
              </div>
            </div>
          </aside>

          <div className={styles.results}>
            <div className={styles.resultToolbar}>
              <div aria-live="polite">
                <strong>{results.length}</strong>
                <span>{results.length === 1 ? "product match" : "product matches"}</span>
                {selectedFamily ? <small>{selectedFamily.label}</small> : null}
              </div>
              <label>
                <span>Sort</span>
                <select
                  value={sort}
                  onChange={(event) =>
                    updateParams({ sort: event.target.value, page: null })
                  }
                >
                  <option value="relevance">Best match</option>
                  <option value="name">Name A–Z</option>
                  <option value="code">Catalogue code</option>
                </select>
              </label>
            </div>

            {activeFilterCount ? (
              <div className={styles.activeContext}>
                {queryParam ? (
                  <button type="button" onClick={() => setQuery("")}>
                    Search: {queryParam} <span aria-hidden="true">×</span>
                  </button>
                ) : null}
                {division !== "all" ? (
                  <button type="button" onClick={() => setDivision("all")}>
                    {division === "dental" ? "Dental & Orthodontic" : "Surgical"}
                    <span aria-hidden="true">×</span>
                  </button>
                ) : null}
                {selectedFamily ? (
                  <button
                    type="button"
                    onClick={() => updateParams({ family: null, page: null })}
                  >
                    {selectedFamily.label} <span aria-hidden="true">×</span>
                  </button>
                ) : null}
              </div>
            ) : null}

            {pageResults.length ? (
              <div className={styles.productGrid}>
                {pageResults.map((product, index) => {
                  const inquiryItem = items.find((item) => item.key === product.id);
                  const currentLocation = `${pathname}${paramsKey ? `?${paramsKey}` : ""}`;
                  const detailHref = `/rebuild/products/${product.id}?from=${encodeURIComponent(currentLocation)}`;
                  return (
                    <article
                      className={styles.productCard}
                      key={product.id}
                      style={{ "--result-order": index } as CSSProperties}
                    >
                      <Link
                        href={detailHref}
                        className={styles.cardStage}
                        aria-label={`View ${product.name}, catalogue code ${product.code}`}
                      >
                        <CatalogueMedia
                          product={product}
                          className={styles.cardSprite}
                        />
                        <span className={styles.stageCode}>{product.code}</span>
                        <span className={styles.viewLabel}>View instrument <b aria-hidden="true">↗</b></span>
                      </Link>
                      <div className={styles.cardCopy}>
                        <p>
                          {product.division === "dental"
                            ? "Dental & Orthodontic"
                            : "Surgical"}
                          <span>{product.familyLabel}</span>
                        </p>
                        <h2>
                          <Link href={detailHref}>
                            {product.name}
                          </Link>
                        </h2>
                        <div className={styles.cardMeta}>
                          <span>
                            {product.variants.length
                              ? `${product.variants.length} ${
                                  product.variants.length === 1
                                    ? "variant code"
                                    : "variant codes"
                                }`
                              : "Single catalogue code"}
                          </span>
                          <button
                            type="button"
                            data-selected={Boolean(inquiryItem)}
                            onClick={() => add(product)}
                          >
                            {inquiryItem ? `Add another · ${inquiryItem.quantity}` : "Add to Inquiry"}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <NoResults query={queryParam} onReset={reset} />
            )}

            {results.length > PAGE_SIZE ? (
              <nav className={styles.pagination} aria-label="Catalogue pagination">
                {currentPage > 1 ? (
                  <button
                    type="button"
                    onClick={() =>
                      updateParams({ page: String(currentPage - 1) })
                    }
                  >
                    Previous
                  </button>
                ) : <span />}
                <p>Page <strong>{currentPage}</strong> of {pageCount}</p>
                {currentPage < pageCount ? (
                  <button
                    type="button"
                    onClick={() =>
                      updateParams({ page: String(currentPage + 1) })
                    }
                  >
                    Next
                  </button>
                ) : <span />}
              </nav>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

type FilterControlsProps = {
  prefix: string;
  division: string;
  family: string;
  families: RuntimeFamily[];
  onDivision: (division: string) => void;
  onFamily: (event: ChangeEvent<HTMLSelectElement>) => void;
};

function FilterControls({
  prefix,
  division,
  family,
  families,
  onDivision,
  onFamily,
}: FilterControlsProps) {
  return (
    <div className={styles.filterControls}>
      <fieldset>
        <legend>Division</legend>
        {[
          ["all", "All"],
          ["surgical", "Surgical"],
          ["dental", "Dental"],
        ].map(([value, label]) => (
          <label key={value}>
            <input
              type="radio"
              name={`${prefix}-division`}
              value={value}
              checked={division === value}
              onChange={() => onDivision(value)}
            />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>
      <label className={styles.familySelect} htmlFor={`${prefix}-family`}>
        <span>Product family</span>
        <select id={`${prefix}-family`} value={family} onChange={onFamily}>
          <option value="all">All available families</option>
          {families.map((item) => (
            <option key={familyKey(item)} value={familyKey(item)}>
              {division === "all"
                ? `${item.division === "dental" ? "Dental" : "Surgical"} — `
                : ""}
              {item.label} ({item.productCount})
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

function NoResults({
  query,
  onReset,
}: {
  query: string;
  onReset: () => void;
}) {
  return (
    <section className={styles.noResults}>
      <p>No catalogue match</p>
      <h2>{query ? `Nothing matched “${query}”.` : "No products match these filters."}</h2>
      <p>
        Try a shorter catalogue code, clear one filter, or add the known
        reference directly to the Inquiry List.
      </p>
      <div>
        <button type="button" onClick={onReset}>Reset catalogue</button>
        <Link href="/rebuild/inquiry?manual=1">Add an unlisted reference</Link>
      </div>
    </section>
  );
}
