import type { InquiryPayload } from "@/lib/inquiry-validation";

export type StoredInquiry = InquiryPayload & {
  reference: string;
  submittedAt: string;
  storageMode: "development-memory";
};

export interface InquiryStorage {
  findByToken(token: string): Promise<StoredInquiry | undefined>;
  save(inquiry: StoredInquiry): Promise<void>;
}

declare global {
  var __throhiInquiryStore: Map<string, StoredInquiry> | undefined;
}

const memoryStore = globalThis.__throhiInquiryStore ?? new Map<string, StoredInquiry>();
if (process.env.NODE_ENV !== "production") globalThis.__throhiInquiryStore = memoryStore;

export const developmentInquiryStorage: InquiryStorage = {
  async findByToken(token) {
    return memoryStore.get(token);
  },
  async save(inquiry) {
    memoryStore.set(inquiry.submissionToken, inquiry);
  }
};

export function createInquiryReference(now = new Date()) {
  const date = now.toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = crypto.randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase();
  return `THR-${date}-${suffix}`;
}

export function getInquiryStorage(): InquiryStorage {
  // Production adapters for D1/PostgreSQL, object storage, email, CRM, rate limiting,
  // and bot protection must be injected here before public launch.
  return developmentInquiryStorage;
}
