"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { CatalogueMedia } from "@/app/rebuild/products/catalogue-media";
import styles from "./review.module.css";

const STORAGE_KEY = "throhi-catalogue-review-v1";
const STATUSES = [
  "pending",
  "approved",
  "corrected",
  "needs-client",
  "rejected",
] as const;

type ReviewStatus = (typeof STATUSES)[number];

export type ReviewRecord = {
  id: string;
  code: string;
  name: string;
  division: string;
  divisionLabel: string;
  family: string;
  familyLabel: string;
  flags: string[];
  variants: Array<{
    id: string;
    code: string;
    sourcePrintedPage: number | null;
    status: string;
  }>;
  sourceFile: string;
  sourcePdfPage: number | null;
  sourcePrintedPage: number | null;
  imageSprite: { row: number; column: number };
};

type ReviewFamily = {
  slug: string;
  label: string;
  division: string;
};

type Decision = {
  productId: string;
  status: ReviewStatus;
  reviewedAt?: string;
  approvedName: string;
  approvedCode: string;
  approvedFamily: string;
  confirmImage: boolean;
  confirmVariants: boolean;
  confirmSourceReference: boolean;
  notes: string;
};

type StoredReview = {
  version: 1;
  reviewer: string;
  decisions: Decision[];
};

const flagLabels: Record<string, string> = {
  "long-name": "Long source name",
  "dangling-copy": "Possible trailing copy",
  "ocr-punctuation": "OCR punctuation",
  "known-ocr-token": "Known OCR token",
  "missing-variants": "No variant record",
  "missing-source-file": "Missing source file",
  "missing-source-page": "Missing source page",
  "incomplete-variant-code": "Incomplete variant code",
};

function emptyDecision(record: ReviewRecord): Decision {
  return {
    productId: record.id,
    status: "pending",
    approvedName: record.name,
    approvedCode: record.code,
    approvedFamily: record.family,
    confirmImage: false,
    confirmVariants: false,
    confirmSourceReference: false,
    notes: "",
  };
}

function isReviewStatus(value: unknown): value is ReviewStatus {
  return typeof value === "string" && STATUSES.includes(value as ReviewStatus);
}

function parseStoredReview(value: string, recordIds: Set<string>): StoredReview | null {
  try {
    const parsed = JSON.parse(value) as Partial<StoredReview>;
    if (parsed.version !== 1 || !Array.isArray(parsed.decisions)) return null;
    const decisions = parsed.decisions.filter((decision): decision is Decision => {
      return Boolean(
        decision &&
        typeof decision === "object" &&
        typeof decision.productId === "string" &&
        recordIds.has(decision.productId) &&
        isReviewStatus(decision.status)
      );
    });
    return {
      version: 1,
      reviewer: typeof parsed.reviewer === "string" ? parsed.reviewer : "",
      decisions,
    };
  } catch {
    return null;
  }
}

function decisionMap(decisions: Decision[]) {
  return Object.fromEntries(decisions.map((decision) => [decision.productId, decision]));
}

export function CatalogueReviewClient({
  records,
  families,
}: {
  records: ReviewRecord[];
  families: ReviewFamily[];
}) {
  const recordIds = useMemo(() => new Set(records.map((record) => record.id)), [records]);
  const [reviewer, setReviewer] = useState("");
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [selectedId, setSelectedId] = useState(records[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | "all">("all");
  const [flagFilter, setFlagFilter] = useState("all");
  const [divisionFilter, setDivisionFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const importInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = parseStoredReview(window.localStorage.getItem(STORAGE_KEY) ?? "", recordIds);
    if (stored) {
      setReviewer(stored.reviewer);
      setDecisions(decisionMap(stored.decisions));
    }
    setHydrated(true);
  }, [recordIds]);

  useEffect(() => {
    if (!hydrated) return;
    const payload: StoredReview = {
      version: 1,
      reviewer,
      decisions: Object.values(decisions),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [decisions, hydrated, reviewer]);

  const statuses = useMemo(() => {
    return records.reduce<Record<ReviewStatus, number>>(
      (counts, record) => {
        counts[decisions[record.id]?.status ?? "pending"] += 1;
        return counts;
      },
      { pending: 0, approved: 0, corrected: 0, "needs-client": 0, rejected: 0 }
    );
  }, [decisions, records]);

  const flags = useMemo(
    () => Array.from(new Set(records.flatMap((record) => record.flags))).sort(),
    [records]
  );
  const divisions = useMemo(
    () =>
      Array.from(
        new Map(records.map((record) => [record.division, record.divisionLabel])).entries()
      ),
    [records]
  );
  const filteredRecords = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    return records.filter((record) => {
      const status = decisions[record.id]?.status ?? "pending";
      return (
        (statusFilter === "all" || status === statusFilter) &&
        (flagFilter === "all" || record.flags.includes(flagFilter)) &&
        (divisionFilter === "all" || record.division === divisionFilter) &&
        (!normalized ||
          record.code.toLowerCase().includes(normalized) ||
          record.name.toLowerCase().includes(normalized) ||
          record.familyLabel.toLowerCase().includes(normalized))
      );
    });
  }, [decisions, divisionFilter, flagFilter, query, records, statusFilter]);

  const selected =
    filteredRecords.find((record) => record.id === selectedId) ??
    filteredRecords[0] ??
    records[0];
  const currentDecision = selected
    ? decisions[selected.id] ?? emptyDecision(selected)
    : null;
  const reviewed = records.length - statuses.pending;

  function updateDecision(productId: string, patch: Partial<Decision>) {
    const record = records.find((item) => item.id === productId);
    if (!record) return;
    setDecisions((current) => {
      const base = current[productId] ?? emptyDecision(record);
      const status = patch.status ?? base.status;
      return {
        ...current,
        [productId]: {
          ...base,
          ...patch,
          reviewedAt: status === "pending" ? undefined : new Date().toISOString(),
        },
      };
    });
  }

  function exportReview() {
    if (!reviewer.trim()) {
      setMessage("Enter the reviewer name before exporting.");
      return;
    }
    const payload = {
      version: 1,
      reviewer: reviewer.trim(),
      exportedAt: new Date().toISOString(),
      decisions: records.map((record) => decisions[record.id] ?? emptyDecision(record)),
    };
    const blob = new Blob([`${JSON.stringify(payload, null, 2)}\n`], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "catalogue-review.decisions.json";
    link.click();
    URL.revokeObjectURL(url);
    setMessage("Review export created. Move it into data/working before promotion.");
  }

  async function importReview(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const imported = parseStoredReview(await file.text(), recordIds);
    if (!imported) {
      setMessage("That file is not a valid catalogue review export.");
      return;
    }
    setReviewer(imported.reviewer);
    setDecisions(decisionMap(imported.decisions));
    setMessage(`Imported ${imported.decisions.length} review decisions.`);
  }

  function resetReview() {
    if (!window.confirm("Clear the local catalogue review draft? This cannot be undone.")) return;
    setReviewer("");
    setDecisions({});
    window.localStorage.removeItem(STORAGE_KEY);
    setMessage("Local review draft cleared.");
  }

  if (!selected || !currentDecision) {
    return <p className={styles.empty}>No catalogue records require review.</p>;
  }

  const selectedFamilies = families.filter(
    (family) => family.division === selected.division
  );

  return (
    <div className={styles.workspace}>
      <header className={styles.workspaceHeader}>
        <div>
          <p className={styles.kicker}>Phase 11 / Internal catalogue control</p>
          <h1>Catalogue review</h1>
          <p>
            Validate identity records before any promotion into approved data.
            Technical claims remain unavailable in this tool.
          </p>
        </div>
        <div className={styles.progressBlock}>
          <span>
            <strong>{reviewed}</strong> / {records.length} reviewed
          </span>
          <progress max={records.length} value={reviewed}>
            {reviewed} of {records.length}
          </progress>
        </div>
      </header>

      <aside className={styles.securityNotice}>
        <strong>Development-only workspace.</strong>
        <span>
          Drafts stay in this browser. This route is no-indexed but not access-controlled;
          do not deploy it publicly without authentication.
        </span>
      </aside>

      <section className={styles.toolbar} aria-label="Review controls">
        <label className={styles.reviewer}>
          <span>Reviewer name</span>
          <input
            value={reviewer}
            onChange={(event) => setReviewer(event.target.value)}
            placeholder="Required for export"
          />
        </label>
        <div className={styles.fileActions}>
          <input
            ref={importInput}
            className={styles.hiddenInput}
            type="file"
            accept="application/json,.json"
            onChange={importReview}
          />
          <button type="button" onClick={() => importInput.current?.click()}>
            Import JSON
          </button>
          <button type="button" className={styles.primaryAction} onClick={exportReview}>
            Export review
          </button>
          <button type="button" className={styles.quietAction} onClick={resetReview}>
            Clear draft
          </button>
        </div>
        <p className={styles.liveMessage} aria-live="polite">{message}</p>
      </section>

      <section className={styles.reviewLayout}>
        <aside className={styles.queue}>
          <div className={styles.filters}>
            <label>
              <span>Search queue</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Code, name, or family"
              />
            </label>
            <div className={styles.filterGrid}>
              <label>
                <span>Status</span>
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as ReviewStatus | "all")
                  }
                >
                  <option value="all">All statuses</option>
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>Audit flag</span>
                <select
                  value={flagFilter}
                  onChange={(event) => setFlagFilter(event.target.value)}
                >
                  <option value="all">All flags</option>
                  {flags.map((flag) => (
                    <option key={flag} value={flag}>{flagLabels[flag] ?? flag}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>Division</span>
                <select
                  value={divisionFilter}
                  onChange={(event) => setDivisionFilter(event.target.value)}
                >
                  <option value="all">All divisions</option>
                  {divisions.map(([slug, label]) => (
                    <option key={slug} value={slug}>{label}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <p className={styles.queueCount}>{filteredRecords.length} records shown</p>
          <div className={styles.recordList}>
            {filteredRecords.map((record) => {
              const status = decisions[record.id]?.status ?? "pending";
              return (
                <button
                  type="button"
                  key={record.id}
                  className={styles.recordButton}
                  data-selected={record.id === selected.id}
                  onClick={() => setSelectedId(record.id)}
                >
                  <span>
                    <code>{record.code}</code>
                    <small data-status={status}>{status}</small>
                  </span>
                  <strong>{record.name}</strong>
                  <em>{record.flags.map((flag) => flagLabels[flag] ?? flag).join(" / ")}</em>
                </button>
              );
            })}
            {!filteredRecords.length && (
              <p className={styles.noResults}>No review records match these filters.</p>
            )}
          </div>
        </aside>

        <article className={styles.inspector}>
          <div className={styles.identityBand}>
            <span>{selected.divisionLabel}</span>
            <code>{selected.code}</code>
          </div>
          <div className={styles.productReview}>
            <CatalogueMedia
              key={selected.id}
              product={selected}
              className={styles.productMedia}
              labelled
              priority
            />
            <div className={styles.sourceIdentity}>
              <p>Source-derived identity</p>
              <h2>{selected.name}</h2>
              <dl>
                <div><dt>Family</dt><dd>{selected.familyLabel}</dd></div>
                <div><dt>Variants</dt><dd>{selected.variants.length}</dd></div>
                <div><dt>PDF page</dt><dd>{selected.sourcePdfPage ?? "Missing"}</dd></div>
                <div><dt>Printed page</dt><dd>{selected.sourcePrintedPage ?? "Missing"}</dd></div>
              </dl>
            </div>
          </div>

          <div className={styles.flagPanel}>
            <p>Why this record is queued</p>
            <div>
              {selected.flags.map((flag) => (
                <span key={flag}>{flagLabels[flag] ?? flag}</span>
              ))}
            </div>
          </div>

          <fieldset className={styles.statusControl}>
            <legend>Review decision</legend>
            <div>
              {STATUSES.map((status) => (
                <button
                  type="button"
                  key={status}
                  data-active={currentDecision.status === status}
                  onClick={() => updateDecision(selected.id, { status })}
                >
                  {status}
                </button>
              ))}
            </div>
          </fieldset>

          <div className={styles.correctionGrid}>
            <label>
              <span>Approved product name</span>
              <input
                value={currentDecision.approvedName}
                onChange={(event) =>
                  updateDecision(selected.id, {
                    approvedName: event.target.value,
                    status: "corrected",
                  })
                }
              />
            </label>
            <label>
              <span>Approved product code</span>
              <input
                value={currentDecision.approvedCode}
                onChange={(event) =>
                  updateDecision(selected.id, {
                    approvedCode: event.target.value,
                    status: "corrected",
                  })
                }
              />
            </label>
            <label className={styles.fullField}>
              <span>Approved family</span>
              <select
                value={currentDecision.approvedFamily}
                onChange={(event) =>
                  updateDecision(selected.id, {
                    approvedFamily: event.target.value,
                    status: "corrected",
                  })
                }
              >
                {selectedFamilies.map((family) => (
                  <option key={family.slug} value={family.slug}>{family.label}</option>
                ))}
              </select>
            </label>
          </div>

          <fieldset className={styles.confirmations}>
            <legend>Confirm reviewed source elements</legend>
            <label>
              <input
                type="checkbox"
                checked={currentDecision.confirmImage}
                onChange={(event) =>
                  updateDecision(selected.id, { confirmImage: event.target.checked })
                }
              />
              <span>Representative image matches this product family</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={currentDecision.confirmVariants}
                onChange={(event) =>
                  updateDecision(selected.id, { confirmVariants: event.target.checked })
                }
              />
              <span>{selected.variants.length} variant code records are confirmed</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={currentDecision.confirmSourceReference}
                onChange={(event) =>
                  updateDecision(selected.id, {
                    confirmSourceReference: event.target.checked,
                  })
                }
              />
              <span>Catalogue file and page reference are confirmed</span>
            </label>
          </fieldset>

          <label className={styles.notes}>
            <span>Review notes</span>
            <textarea
              rows={4}
              value={currentDecision.notes}
              onChange={(event) =>
                updateDecision(selected.id, { notes: event.target.value })
              }
              placeholder="Record only identity-review context. Do not add technical claims."
            />
          </label>

          <footer className={styles.recordFooter}>
            <span>Source: {selected.sourceFile}</span>
            <button
              type="button"
              onClick={() => {
                const index = filteredRecords.findIndex((record) => record.id === selected.id);
                const next = filteredRecords[index + 1];
                if (next) setSelectedId(next.id);
              }}
              disabled={
                filteredRecords.findIndex((record) => record.id === selected.id) >=
                filteredRecords.length - 1
              }
            >
              Next record
            </button>
          </footer>
        </article>
      </section>
    </div>
  );
}
