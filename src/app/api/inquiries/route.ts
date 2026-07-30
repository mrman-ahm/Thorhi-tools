import { NextResponse } from "next/server";
import {
  createClientFingerprint,
  DurableInquiryError,
  isDurableInquiryConfigured,
  submitDurableInquiry,
} from "@/lib/inquiry-backend";
import {
  InquiryRequestError,
  parseInquiryRequest,
  type ParsedInquiryRequest,
} from "@/lib/inquiry-request";
import {
  createInquiryReference,
  getInquiryStorage,
  type StoredInquiry,
} from "@/lib/inquiry-storage";
import { validateInquiry } from "@/lib/inquiry-validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let parsed: ParsedInquiryRequest;
  try {
    parsed = await parseInquiryRequest(request);
  } catch (error) {
    if (error instanceof InquiryRequestError) {
      return NextResponse.json(
        { ok: false, message: error.message, errors: error.errors },
        { status: error.status },
      );
    }
    return NextResponse.json(
      { ok: false, message: "The inquiry request could not be read." },
      { status: 400 },
    );
  }

  const validation = validateInquiry(parsed.body);
  if (!validation.valid) {
    return NextResponse.json(
      {
        ok: false,
        message: "Review the highlighted inquiry fields.",
        errors: validation.errors,
      },
      { status: 422 },
    );
  }

  const durableConfigured = isDurableInquiryConfigured();
  if (process.env.NODE_ENV === "production" && !durableConfigured) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Inquiry delivery is temporarily unavailable. Your form information remains in this browser.",
      },
      { status: 503 },
    );
  }

  if (durableConfigured) {
    if (validation.value.attachment && !parsed.attachment) {
      return NextResponse.json(
        {
          ok: false,
          message: "Select the attachment again before submitting.",
          errors: {
            attachment:
              "The attachment metadata was present but the file bytes were missing.",
          },
        },
        { status: 422 },
      );
    }

    try {
      const fingerprint = await createClientFingerprint(request);
      const result = await submitDurableInquiry({
        payload: validation.value,
        attachment: parsed.attachment,
        turnstileToken: parsed.turnstileToken,
        fingerprint,
        origin: request.headers.get("origin") ?? new URL(request.url).origin,
      });
      return NextResponse.json(result, {
        status: result.duplicate ? 200 : 201,
      });
    } catch (error) {
      if (error instanceof DurableInquiryError) {
        return NextResponse.json(
          { ok: false, message: error.message, errors: error.errors },
          { status: error.status },
        );
      }
      return NextResponse.json(
        {
          ok: false,
          message:
            "The durable inquiry service failed unexpectedly. Your form information remains in this browser.",
        },
        { status: 503 },
      );
    }
  }

  const storage = getInquiryStorage();
  const existing = await storage.findByToken(
    validation.value.submissionToken,
  );
  if (existing) {
    return NextResponse.json({
      ok: true,
      duplicate: true,
      reference: existing.reference,
      storageMode: existing.storageMode,
    });
  }

  const inquiry: StoredInquiry = {
    ...validation.value,
    reference: createInquiryReference(),
    submittedAt: new Date().toISOString(),
    storageMode: "development-memory",
  };
  await storage.save(inquiry);

  return NextResponse.json(
    {
      ok: true,
      duplicate: false,
      reference: inquiry.reference,
      storageMode: inquiry.storageMode,
      message:
        "Inquiry validated in the local development adapter. Production uses the durable Cloudflare service.",
    },
    { status: 201 },
  );
}
