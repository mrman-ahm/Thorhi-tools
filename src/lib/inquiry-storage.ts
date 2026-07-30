import type { InquiryPayload } from "@/lib/inquiry-validation";

export type InquiryStorageMode = "development-memory" | "cloudflare-d1-r2";

export type StoredInquiry = InquiryPayload & {
  reference: string;
  submittedAt: string;
  storageMode: InquiryStorageMode;
};

export interface InquiryStorage {
  findByToken(token: string): Promise<StoredInquiry | undefined>;
  save(inquiry: StoredInquiry): Promise<void>;
}

declare global {
  var __throhiInquiryStore: Map<string, StoredInquiry> | undefined;
}

const memoryStore = globalThis.__throhiInquiryStore ?? new Map<string, StoredInquiry>();
if (process.env.NODE_ENV !== "production") {
  globalThis.__throhiInquiryStore = memoryStore;
}

export const developmentInquiryStorage: InquiryStorage = {
  async findByToken(token) {
    return memoryStore.get(token);
  },
  async save(inquiry) {
    memoryStore.set(inquiry.submissionToken, inquiry);
  },
};

export function createInquiryReference(now = new Date()) {
  const date = now.toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = crypto.randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase();
  return `THR-${date}-${suffix}`;
}

export function getInquiryStorage(): InquiryStorage {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "The development inquiry storage adapter is disabled in production.",
    );
  }
  return developmentInquiryStorage;
}
