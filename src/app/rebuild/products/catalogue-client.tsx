"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ChangeEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useInquiry } from "@/components/inquiry-provider";
import {
  rebuildCatalogue,
  scoreRebuildProduct,
  type RuntimeProduct,
} from "@/lib/rebuild-catalogue";
import { CatalogueEmptyState } from "./catalogue-empty-state";
import {
  CatalogueFilterControls,
  familyKey,
} from "./catalogue-filter-controls";
import { CatalogueProductEntry } from "./catalogue-product-entry";
import {
  CatalogueResultsToolbar,
  type CatalogueSortMode,
} from "./catalogue-results-toolbar";
import styles from "./catalogue.module.css";

const PAGE_SIZE = 24;
const validDivisions = new Set(["all", "surgical", "dental"]);
const validSorts = new Set(["relevance", "name", "code"]);

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
  const sort = (validSorts.has(sortParam)
    ? sortParam
    : "relevance") as CatalogueSortMode;

  const selectedFamily = useMemo(() => {
    if (familyParam === "all") return undefined;
    const exact = rebuildCatalogue.families.find(
      (family) => familyKey(family) === familyParam,
    );
    if (exact) return exact;
    return rebuildCatalogue.families.find(
      (family) =>
        family.slug === familyParam &&
        (division === "all" || family.division === division),
    );
  }, [division, familyParam]);

  const availableFamilies = useMemo(
    () =>
      rebuildCatalogue.families
        .filter((family) => division === "all" || family.division === division)
        .sort(
          (left, right) =>
            left.division.localeCompare(right.division) || left.order - right.order,
        ),
    [division],
  );

  const updateParams = useCallback(
    (
      updates: Record<string, string | null>,
      mode: "push" | "replace" = "push",
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
    [paramsKey, pathname, router],
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
              product.family === selectedFamily.slug)),
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
        right.rank - left.rank || left.product.name.localeCompare(right.product.name)
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
    updateParams({ family: event.target.value, page: null });
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
        : `${product.name} quantity increased in the Inquiry List.`,
    );
  };

  const movePage = (nextPage: number) => {
    updateParams({ page: String(nextPage) });
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const ledger = document.querySelector<HTMLElement>("[data-catalogue-ledger]");
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        ledger?.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start",
        });
      });
    });
  };

  return (
    <section className={styles.catalogueWorkspace}>
      <span className={styles.srOnly} aria-live="polite">
        {announcement}
      </span>
      <div className={styles.workspaceInner}>
        <div className={styles.primarySearch} data-catalogue-search>
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
              <button type="button" onClick={() => setQuery("")}>
                Clear
              </button>
            ) : (
              <span aria-hidden="true">Search</span>
            )}
          </div>
        </div>

        <details className={styles.mobileFilters}>
          <summary>
            <span>Filters</span>
            <strong>
              {activeFilterCount ? `${activeFilterCount} active` : "All products"}
            </strong>
          </summary>
          <div className={styles.mobileFilterBody}>
            <CatalogueFilterControls
              prefix="mobile"
              division={division}
              family={selectedFamily ? familyKey(selectedFamily) : "all"}
              families={availableFamilies}
              onDivision={setDivision}
              onFamily={setFamily}
            />
            {activeFilterCount ? (
              <button type="button" className={styles.mobileReset} onClick={reset}>
                Reset catalogue
              </button>
            ) : null}
          </div>
        </details>

        <div className={styles.catalogueLayout}>
          <aside className={styles.desktopFilters} aria-label="Catalogue filters">
            <div className={styles.stickyFilters}>
              <div className={styles.filterHeading}>
                <div>
                  <p>Refine catalogue</p>
                  <span>{activeFilterCount} active filters</span>
                </div>
                {activeFilterCount ? (
                  <button type="button" onClick={reset}>
                    Reset
                  </button>
                ) : null}
              </div>
              <CatalogueFilterControls
                prefix="desktop"
                division={division}
                family={selectedFamily ? familyKey(selectedFamily) : "all"}
                families={availableFamilies}
                onDivision={setDivision}
                onFamily={setFamily}
              />
              <div className={styles.sourceBoundary}>
                <strong>Source status</strong>
                <p>
                  Product identities, catalogue references, and imagery are indexed.
                  Technical specifications remain under review.
                </p>
              </div>
            </div>
          </aside>

          <div className={styles.results} data-catalogue-ledger>
            <CatalogueResultsToolbar
              resultCount={results.length}
              selectedFamilyLabel={selectedFamily?.label}
              sort={sort}
              query={queryParam}
              division={division}
              onSort={(nextSort) => updateParams({ sort: nextSort, page: null })}
              onClearQuery={() => setQuery("")}
              onClearDivision={() => setDivision("all")}
              onClearFamily={() => updateParams({ family: null, page: null })}
            />

            {pageResults.length ? (
              <div className={styles.catalogueLedger}>
                {pageResults.map((product, index) => {
                  const inquiryItem = items.find((item) => item.key === product.id);
                  const currentLocation = `${pathname}${
                    paramsKey ? `?${paramsKey}` : ""
                  }`;
                  const detailHref = `/rebuild/products/${product.id}?from=${encodeURIComponent(
                    currentLocation,
                  )}`;

                  return (
                    <CatalogueProductEntry
                      key={product.id}
                      product={product}
                      detailHref={detailHref}
                      inquiryQuantity={inquiryItem?.quantity ?? 0}
                      resultOrder={index}
                      onAdd={add}
                    />
                  );
                })}
              </div>
            ) : (
              <CatalogueEmptyState query={queryParam} onReset={reset} />
            )}

            {results.length > PAGE_SIZE ? (
              <nav className={styles.pagination} aria-label="Catalogue pagination">
                {currentPage > 1 ? (
                  <button type="button" onClick={() => movePage(currentPage - 1)}>
                    Previous
                  </button>
                ) : (
                  <span />
                )}
                <p>
                  Page <strong>{currentPage}</strong> of {pageCount}
                </p>
                {currentPage < pageCount ? (
                  <button type="button" onClick={() => movePage(currentPage + 1)}>
                    Next
                  </button>
                ) : (
                  <span />
                )}
              </nav>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
