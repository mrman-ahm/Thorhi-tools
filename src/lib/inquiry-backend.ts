import type { InquiryPayload } from "@/lib/inquiry-validation";

export type DurableInquiryResult = {
  ok: true;
  duplicate: boolean;
  reference: string;
  storageMode: "cloudflare-d1-r2";
  message?: string;
};

export class DurableInquiryError extends Error {
  readonly status: number;
  readonly errors?: Record<string, string>;

  constructor(
    message: string,
    status = 502,
    errors?: Record<string, string>,
  ) {
    super(message);
    this.name = "DurableInquiryError";
    this.status = status;
    this.errors = errors;
  }
}

export function isDurableInquiryConfigured() {
  return Boolean(
    process.env.INQUIRY_API_URL?.trim() &&
      process.env.INQUIRY_API_SECRET?.trim() &&
      process.env.INQUIRY_FINGERPRINT_SECRET?.trim(),
  );
}

function bytesToHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer), (value) =>
    value.toString(16).padStart(2, "0"),
  ).join("");
}

export async function createClientFingerprint(request: Request) {
  const forwardedIp =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",", 1)[0]?.trim() ??
    "unknown";
  const userAgent = (request.headers.get("user-agent") ?? "unknown").slice(
    0,
    256,
  );
  const day = new Date().toISOString().slice(0, 10);
  const secret = process.env.INQUIRY_FINGERPRINT_SECRET?.trim();

  if (!secret) {
    throw new DurableInquiryError(
      "Durable inquiry fingerprinting is not configured.",
      503,
    );
  }

  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${secret}:${day}:${forwardedIp}:${userAgent}`),
  );
  return bytesToHex(digest);
}

function normalizeUrl(value: string) {
  return value.replace(/\/+$/, "");
}

export async function submitDurableInquiry(input: {
  payload: InquiryPayload;
  attachment?: File;
  turnstileToken?: string;
  fingerprint: string;
  origin: string;
}): Promise<DurableInquiryResult> {
  const apiUrl = process.env.INQUIRY_API_URL?.trim();
  const apiSecret = process.env.INQUIRY_API_SECRET?.trim();
  if (!apiUrl || !apiSecret) {
    throw new DurableInquiryError(
      "Durable inquiry storage is not configured.",
      503,
    );
  }

  const formData = new FormData();
  formData.set("payload", JSON.stringify(input.payload));
  if (input.attachment) {
    formData.set("attachment", input.attachment);
  }
  if (input.turnstileToken) {
    formData.set("turnstileToken", input.turnstileToken);
  }

  let response: Response;
  try {
    response = await fetch(`${normalizeUrl(apiUrl)}/v1/inquiries`, {
      method: "POST",
      headers: {
        "x-throhi-api-secret": apiSecret,
        "x-throhi-client-fingerprint": input.fingerprint,
        "x-throhi-origin": input.origin,
      },
      body: formData,
      cache: "no-store",
    });
  } catch {
    throw new DurableInquiryError(
      "The durable inquiry service could not be reached.",
      503,
    );
  }

  let result: unknown;
  try {
    result = await response.json();
  } catch {
    throw new DurableInquiryError(
      "The durable inquiry service returned an invalid response.",
      502,
    );
  }

  const record = result && typeof result === "object"
    ? (result as Record<string, unknown>)
    : {};
  const message = typeof record.message === "string"
    ? record.message
    : "The inquiry could not be stored.";
  const errors = record.errors && typeof record.errors === "object"
    ? (record.errors as Record<string, string>)
    : undefined;

  if (!response.ok || record.ok !== true) {
    throw new DurableInquiryError(message, response.status || 502, errors);
  }

  if (
    typeof record.reference !== "string" ||
    record.storageMode !== "cloudflare-d1-r2"
  ) {
    throw new DurableInquiryError(
      "The durable inquiry service response was incomplete.",
      502,
    );
  }

  return {
    ok: true,
    duplicate: record.duplicate === true,
    reference: record.reference,
    storageMode: "cloudflare-d1-r2",
    message,
  };
}
