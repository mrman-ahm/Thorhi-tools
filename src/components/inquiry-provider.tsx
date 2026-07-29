"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type InquiryItem = {
  key: string;
  productId?: string;
  productCode?: string;
  variantId?: string;
  variantLabel?: string;
  code: string;
  name: string;
  quantity: number;
  note: string;
  manual: boolean;
};

export type InquiryDraft = {
  items: InquiryItem[];
  generalRequirements: string;
  attachment?: { name: string; type: string; size: number };
};

type InquiryContextValue = InquiryDraft & {
  hydrated: boolean;
  count: number;
  totalQuantity: number;
  addProduct: (
    item: Omit<InquiryItem, "key" | "quantity" | "note" | "manual"> & { key?: string }
  ) => "added" | "incremented";
  addManualItem: (name: string, code?: string) => void;
  updateItem: (keyOrCode: string, updates: Partial<Pick<InquiryItem, "quantity" | "note" | "name">>) => void;
  removeItem: (keyOrCode: string) => InquiryItem | undefined;
  restoreItem: (item: InquiryItem) => void;
  setGeneralRequirements: (value: string) => void;
  setAttachment: (value: InquiryDraft["attachment"]) => void;
  clearInquiry: () => void;
};

const storageKey = "throhi-inquiry-v3";
const previousStorageKeys = [
  "throhi-rebuild-inquiry-v1",
  "throhi-inquiry-v2",
  "throhi-inquiry"
] as const;
const initialDraft: InquiryDraft = { items: [], generalRequirements: "" };
const InquiryContext = createContext<InquiryContextValue | null>(null);

function normalizeQuantity(value: unknown) {
  const quantity = Number(value);
  return Number.isFinite(quantity) ? Math.max(1, Math.min(9999, Math.floor(quantity))) : 1;
}

function normalizeStoredItem(value: unknown): InquiryItem | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Partial<InquiryItem>;
  const storedCode = typeof item.code === "string" ? item.code.trim().toUpperCase() : "";
  const name = typeof item.name === "string" ? item.name.trim() : "";
  if (!storedCode || !name) return null;

  const manual = Boolean(item.manual);
  const productId = typeof item.productId === "string" && item.productId.trim()
    ? item.productId.trim()
    : undefined;
  const variantId = typeof item.variantId === "string" && item.variantId.trim()
    ? item.variantId.trim()
    : undefined;
  const variantLabel = typeof item.variantLabel === "string" && item.variantLabel.trim()
    ? item.variantLabel.trim().toUpperCase()
    : undefined;
  const code = variantId && variantLabel ? variantLabel : storedCode;
  const explicitKey = typeof item.key === "string" && item.key.trim() ? item.key.trim() : undefined;
  const key = explicitKey ??
    (manual ? `manual:${code}` : variantId && productId ? `${productId}:${variantId}` : productId ?? `code:${code}`);

  return {
    key,
    productId,
    productCode: typeof item.productCode === "string" && item.productCode.trim()
      ? item.productCode.trim().toUpperCase()
      : productId ? storedCode : undefined,
    variantId,
    variantLabel,
    code,
    name,
    quantity: normalizeQuantity(item.quantity),
    note: typeof item.note === "string" ? item.note.slice(0, 1000) : "",
    manual
  };
}

function parseStoredDraft(value: string | null, sourceKey: string): InquiryDraft | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as unknown;
    if (sourceKey === "throhi-inquiry" && Array.isArray(parsed)) {
      return {
        ...initialDraft,
        items: parsed
          .filter(code => typeof code === "string" && code.trim())
          .map(code => normalizeStoredItem({
            code,
            name: code,
            quantity: 1,
            note: "",
            manual: false
          }))
          .filter((item): item is InquiryItem => Boolean(item))
      };
    }
    if (sourceKey === "throhi-rebuild-inquiry-v1" && Array.isArray(parsed)) {
      return {
        ...initialDraft,
        items: parsed
          .map(normalizeStoredItem)
          .filter((item): item is InquiryItem => Boolean(item))
      };
    }
    if (!parsed || typeof parsed !== "object") return null;
    const draft = parsed as Partial<InquiryDraft>;
    return {
      items: (Array.isArray(draft.items) ? draft.items : [])
        .map(normalizeStoredItem)
        .filter((item): item is InquiryItem => Boolean(item)),
      generalRequirements: typeof draft.generalRequirements === "string"
        ? draft.generalRequirements.slice(0, 4000)
        : "",
      attachment: draft.attachment && typeof draft.attachment === "object"
        ? draft.attachment
        : undefined
    };
  } catch {
    return null;
  }
}

function readDraft(): InquiryDraft {
  try {
    const sources = [storageKey, ...previousStorageKeys]
      .map(key => ({ key, draft: parseStoredDraft(window.localStorage.getItem(key), key) }))
      .filter((entry): entry is { key: string; draft: InquiryDraft } => Boolean(entry.draft));
    if (!sources.length) return initialDraft;

    const canonical = sources.find(entry => entry.key === storageKey);
    if (canonical) return canonical.draft;

    const items = new Map<string, InquiryItem>();
    for (const { draft } of sources) {
      for (const item of draft.items) {
        const existing = items.get(item.key);
        if (!existing) {
          items.set(item.key, item);
          continue;
        }
        items.set(item.key, {
          ...existing,
          quantity: Math.max(existing.quantity, item.quantity),
          note: existing.note || item.note
        });
      }
    }
    const fullDraft = sources.find(entry => entry.draft.generalRequirements || entry.draft.attachment)?.draft;
    return {
      items: Array.from(items.values()),
      generalRequirements: fullDraft?.generalRequirements ?? "",
      attachment: fullDraft?.attachment
    };
  } catch {
    return initialDraft;
  }
  return initialDraft;
}

export function InquiryProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<InquiryDraft>(initialDraft);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setDraft(readDraft());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(draft));
      previousStorageKeys.forEach(key => window.localStorage.removeItem(key));
    } catch {
      // A full or unavailable storage area must not make the inquiry unusable.
    }
  }, [draft, hydrated]);

  const addProduct = useCallback((
    item: Omit<InquiryItem, "key" | "quantity" | "note" | "manual"> & { key?: string }
  ) => {
    let result: "added" | "incremented" = "added";
    const key = item.key ??
      (item.variantId && item.productId ? `${item.productId}:${item.variantId}` : item.productId ?? `code:${item.code}`);
    setDraft(current => {
      const existing = current.items.find(entry => entry.key === key);
      if (existing) {
        result = "incremented";
        return {
          ...current,
          items: current.items.map(entry => entry.key === key
            ? { ...entry, quantity: normalizeQuantity(entry.quantity + 1) }
            : entry)
        };
      }
      return {
        ...current,
        items: [...current.items, {
          ...item,
          key,
          productCode: item.productCode ?? item.code,
          quantity: 1,
          note: "",
          manual: false
        }]
      };
    });
    return result;
  }, []);

  const addManualItem = useCallback((name: string, code = "") => {
    const normalizedName = name.trim();
    if (!normalizedName) return;
    const manualCode = code.trim() || `MANUAL-${Date.now()}`;
    setDraft(current => ({
      ...current,
      items: [...current.items, {
        key: `manual:${crypto.randomUUID()}`,
        code: manualCode.toUpperCase(),
        name: normalizedName,
        quantity: 1,
        note: "",
        manual: true
      }]
    }));
  }, []);

  const updateItem = useCallback((keyOrCode: string, updates: Partial<Pick<InquiryItem, "quantity" | "note" | "name">>) => {
    setDraft(current => ({
      ...current,
      items: current.items.map(item =>
        item.key === keyOrCode || item.code === keyOrCode
          ? {
              ...item,
              ...updates,
              quantity: updates.quantity === undefined
                ? item.quantity
                : normalizeQuantity(updates.quantity)
            }
          : item
      )
    }));
  }, []);

  const removeItem = useCallback((keyOrCode: string) => {
    const removed = draft.items.find(item => item.key === keyOrCode || item.code === keyOrCode);
    if (!removed) return undefined;
    setDraft(current => ({
      ...current,
      items: current.items.filter(item => item.key !== removed.key)
    }));
    return removed;
  }, [draft.items]);

  const restoreItem = useCallback((item: InquiryItem) => {
    setDraft(current => current.items.some(existing => existing.key === item.key) ? current : { ...current, items: [...current.items, item] });
  }, []);

  const setGeneralRequirements = useCallback((value: string) => setDraft(current => ({ ...current, generalRequirements: value })), []);
  const setAttachment = useCallback((value: InquiryDraft["attachment"]) => setDraft(current => ({ ...current, attachment: value })), []);
  const clearInquiry = useCallback(() => setDraft(initialDraft), []);

  const value = useMemo<InquiryContextValue>(() => ({
    ...draft,
    hydrated,
    count: draft.items.length,
    totalQuantity: draft.items.reduce((sum, item) => sum + item.quantity, 0),
    addProduct,
    addManualItem,
    updateItem,
    removeItem,
    restoreItem,
    setGeneralRequirements,
    setAttachment,
    clearInquiry
  }), [draft, hydrated, addProduct, addManualItem, updateItem, removeItem, restoreItem, setGeneralRequirements, setAttachment, clearInquiry]);

  return <InquiryContext.Provider value={value}>{children}</InquiryContext.Provider>;
}

export function useInquiry() {
  const context = useContext(InquiryContext);
  if (!context) throw new Error("useInquiry must be used inside InquiryProvider");
  return context;
}
