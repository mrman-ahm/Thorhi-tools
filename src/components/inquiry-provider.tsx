"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type InquiryItem = {
  productId?: string;
  code: string;
  name: string;
  quantity: number;
  note: string;
  manual: boolean;
};

export type InquiryProductInput = Pick<InquiryItem, "productId" | "code" | "name"> &
  Partial<Pick<InquiryItem, "quantity" | "note">>;

export type InquiryDraft = {
  items: InquiryItem[];
  generalRequirements: string;
  attachment?: { name: string; type: string; size: number };
};

type InquiryContextValue = InquiryDraft & {
  hydrated: boolean;
  count: number;
  addProduct: (item: InquiryProductInput) => "added" | "duplicate";
  addManualItem: (name: string, code?: string) => void;
  updateItem: (code: string, updates: Partial<Pick<InquiryItem, "quantity" | "note" | "name">>) => void;
  removeItem: (code: string) => InquiryItem | undefined;
  restoreItem: (item: InquiryItem) => void;
  setGeneralRequirements: (value: string) => void;
  setAttachment: (value: InquiryDraft["attachment"]) => void;
  clearInquiry: () => void;
};

const storageKey = "throhi-inquiry-v2";
const legacyStorageKey = "throhi-inquiry";
const initialDraft: InquiryDraft = { items: [], generalRequirements: "" };
const InquiryContext = createContext<InquiryContextValue | null>(null);

function normalizeQuantity(value: number | undefined) {
  if (value === undefined || !Number.isFinite(value)) return 1;
  return Math.max(1, Math.min(9999, Math.floor(value)));
}

function normalizeStoredItem(value: unknown): InquiryItem | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Partial<InquiryItem>;
  if (typeof item.code !== "string" || !item.code.trim()) return null;
  if (typeof item.name !== "string" || !item.name.trim()) return null;
  return {
    productId: typeof item.productId === "string" ? item.productId : undefined,
    code: item.code.trim(),
    name: item.name.trim(),
    quantity: normalizeQuantity(item.quantity),
    note: typeof item.note === "string" ? item.note : "",
    manual: Boolean(item.manual)
  };
}

function readDraft(): InquiryDraft {
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<InquiryDraft>;
      const items = Array.isArray(parsed.items)
        ? parsed.items.map(normalizeStoredItem).filter((item): item is InquiryItem => Boolean(item))
        : [];
      return {
        items,
        generalRequirements: typeof parsed.generalRequirements === "string" ? parsed.generalRequirements : "",
        attachment: parsed.attachment
      };
    }
    const legacy = window.localStorage.getItem(legacyStorageKey);
    if (legacy) {
      const codes = JSON.parse(legacy) as string[];
      return {
        ...initialDraft,
        items: codes.filter(code => typeof code === "string" && code.trim()).map(code => ({
          code: code.trim(),
          name: code.trim(),
          quantity: 1,
          note: "",
          manual: false
        }))
      };
    }
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
    window.localStorage.setItem(storageKey, JSON.stringify(draft));
    window.localStorage.setItem(legacyStorageKey, JSON.stringify(draft.items.filter(item => !item.manual).map(item => item.code)));
  }, [draft, hydrated]);

  const addProduct = useCallback((item: InquiryProductInput) => {
    const code = item.code.trim();
    const name = item.name.trim();
    if (!code || !name || draft.items.some(existing => existing.code === code)) return "duplicate";

    const nextItem: InquiryItem = {
      productId: item.productId,
      code,
      name,
      quantity: normalizeQuantity(item.quantity),
      note: item.note ?? "",
      manual: false
    };

    setDraft(current => {
      if (current.items.some(existing => existing.code === code)) return current;
      return { ...current, items: [...current.items, nextItem] };
    });
    return "added";
  }, [draft.items]);

  const addManualItem = useCallback((name: string, code = "") => {
    const normalizedName = name.trim();
    if (!normalizedName) return;
    const manualCode = code.trim() || `MANUAL-${Date.now()}`;
    setDraft(current => ({
      ...current,
      items: current.items.some(item => item.code === manualCode)
        ? current.items
        : [...current.items, { code: manualCode, name: normalizedName, quantity: 1, note: "", manual: true }]
    }));
  }, []);

  const updateItem = useCallback((code: string, updates: Partial<Pick<InquiryItem, "quantity" | "note" | "name">>) => {
    setDraft(current => ({
      ...current,
      items: current.items.map(item => {
        if (item.code !== code) return item;
        return {
          ...item,
          ...updates,
          quantity: updates.quantity === undefined ? item.quantity : normalizeQuantity(updates.quantity)
        };
      })
    }));
  }, []);

  const removeItem = useCallback((code: string) => {
    const removed = draft.items.find(item => item.code === code);
    if (!removed) return undefined;
    setDraft(current => ({
      ...current,
      items: current.items.filter(item => item.code !== code)
    }));
    return removed;
  }, [draft.items]);

  const restoreItem = useCallback((item: InquiryItem) => {
    setDraft(current => current.items.some(existing => existing.code === item.code)
      ? current
      : { ...current, items: [...current.items, { ...item, quantity: normalizeQuantity(item.quantity) }] });
  }, []);

  const setGeneralRequirements = useCallback((value: string) => setDraft(current => ({ ...current, generalRequirements: value })), []);
  const setAttachment = useCallback((value: InquiryDraft["attachment"]) => setDraft(current => ({ ...current, attachment: value })), []);
  const clearInquiry = useCallback(() => setDraft({ ...initialDraft, items: [] }), []);

  const value = useMemo<InquiryContextValue>(() => ({
    ...draft,
    hydrated,
    count: draft.items.length,
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
