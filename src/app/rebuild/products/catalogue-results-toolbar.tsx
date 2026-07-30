import styles from "./catalogue.module.css";

export type CatalogueSortMode = "relevance" | "name" | "code";

export type CatalogueResultsToolbarProps = {
  resultCount: number;
  selectedFamilyLabel?: string;
  sort: CatalogueSortMode;
  query: string;
  division: string;
  onSort: (sort: CatalogueSortMode) => void;
  onClearQuery: () => void;
  onClearDivision: () => void;
  onClearFamily: () => void;
};

export function CatalogueResultsToolbar({
  resultCount,
  selectedFamilyLabel,
  sort,
  query,
  division,
  onSort,
  onClearQuery,
  onClearDivision,
  onClearFamily,
}: CatalogueResultsToolbarProps) {
  const hasContext = Boolean(query || division !== "all" || selectedFamilyLabel);
  const divisionLabel = division === "dental" ? "Dental & Orthodontic" : "Surgical";

  return (
    <div className={styles.resultsHeader}>
      <div className={styles.resultToolbar}>
        <div aria-live="polite">
          <strong>{resultCount}</strong>
          <span>{resultCount === 1 ? "product match" : "product matches"}</span>
          {selectedFamilyLabel ? <small>{selectedFamilyLabel}</small> : null}
        </div>
        <label>
          <span>Sort</span>
          <select
            value={sort}
            onChange={(event) => onSort(event.target.value as CatalogueSortMode)}
          >
            <option value="relevance">Best match</option>
            <option value="name">Name A–Z</option>
            <option value="code">Catalogue code</option>
          </select>
        </label>
      </div>

      {hasContext ? (
        <div className={styles.activeContext} aria-label="Active catalogue filters">
          {query ? (
            <button type="button" onClick={onClearQuery}>
              Search: {query} <span aria-hidden="true">×</span>
            </button>
          ) : null}
          {division !== "all" ? (
            <button type="button" onClick={onClearDivision}>
              {divisionLabel} <span aria-hidden="true">×</span>
            </button>
          ) : null}
          {selectedFamilyLabel ? (
            <button type="button" onClick={onClearFamily}>
              {selectedFamilyLabel} <span aria-hidden="true">×</span>
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
