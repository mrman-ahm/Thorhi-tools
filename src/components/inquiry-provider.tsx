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

export type InquiryDraft = {
  items: InquiryItem[];
  generalRequirements: string;
  attachment?: { name: string; type: string; size: number };
};

type InquiryContextValue = InquiryDraft & {
  hydrated: boolean;
  count: number;
  addProduct: (item: Omit<InquiryItem, "quantity" | "note" | "manual">) => "added" | "duplicate";
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

function readDraft(): InquiryDraft {
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored) as InquiryDraft;
      return { ...initialDraft, ...parsed, items: Array.isArray(parsed.items) ? parsed.items : [] };
    }
    const legacy = window.localStorage.getItem(legacyStorageKey);
    if (legacy) {
      const codes = JSON.parse(legacy) as string[];
      return {
        ...initialDraft,
        items: codes.map(code => ({ code, name: code, quantity: 1, note: "", manual: false }))
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

  const addProduct = useCallback((item: Omit<InquiryItem, "quantity" | "note" | "manual">) => {
    let result: "added" | "duplicate" = "added";
    setDraft(current => {
      if (current.items.some(existing => existing.code === item.code)) {
        result = "duplicate";
        return current;
      }
      return { ...current, items: [...current.items, { ...item, quantity: 1, note: "", manual: false }] };
    });
    return result;
  }, []);

  const addManualItem = useCallback((name: string, code = "") => {
    const normalizedName = name.trim();
    if (!normalizedName) return;
    const manualCode = code.trim() || `MANUAL-${Date.now()}`;
    setDraft(current => ({
      ...current,
      items: [...current.items, { code: manualCode, name: normalizedName, quantity: 1, note: "", manual: true }]
    }));
  }, []);

  const updateItem = useCallback((code: string, updates: Partial<Pick<InquiryItem, "quantity" | "note" | "name">>) => {
    setDraft(current => ({
      ...current,
      items: current.items.map(item => item.code === code ? { ...item, ...updates, quantity: updates.quantity ? Math.max(1, Math.min(9999, Math.floor(updates.quantity))) : item.quantity } : item)
    }));
  }, []);

  const removeItem = useCallback((code: string) => {
    let removed: InquiryItem | undefined;
    setDraft(current => {
      removed = current.items.find(item => item.code === code);
      return { ...current, items: current.items.filter(item => item.code !== code) };
    });
    return removed;
  }, []);

  const restoreItem = useCallback((item: InquiryItem) => {
    setDraft(current => current.items.some(existing => existing.code === item.code) ? current : { ...current, items: [...current.items, item] });
  }, []);

  const setGeneralRequirements = useCallback((value: string) => setDraft(current => ({ ...current, generalRequirements: value })), []);
  const setAttachment = useCallback((value: InquiryDraft["attachment"]) => setDraft(current => ({ ...current, attachment: value })), []);
  const clearInquiry = useCallback(() => setDraft(initialDraft), []);

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
