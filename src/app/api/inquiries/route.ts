import { NextResponse } from "next/server";
import { createInquiryReference, getInquiryStorage, type StoredInquiry } from "@/lib/inquiry-storage";
import { validateInquiry } from "@/lib/inquiry-validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "The inquiry request was not valid JSON." }, { status: 400 });
  }

  const validation = validateInquiry(body);
  if (!validation.valid) {
    return NextResponse.json({ ok: false, message: "Review the highlighted inquiry fields.", errors: validation.errors }, { status: 422 });
  }

  const storage = getInquiryStorage();
  const existing = await storage.findByToken(validation.value.submissionToken);
  if (existing) {
    return NextResponse.json({ ok: true, duplicate: true, reference: existing.reference, storageMode: existing.storageMode });
  }

  // Integration points before launch:
  // 1. rate-limit by privacy-preserving request fingerprint
  // 2. bot-protection challenge verification
  // 3. durable database storage
  // 4. attachment upload/object storage
  // 5. approved email or CRM delivery
  const inquiry: StoredInquiry = {
    ...validation.value,
    reference: createInquiryReference(),
    submittedAt: new Date().toISOString(),
    storageMode: "development-memory"
  };
  await storage.save(inquiry);

  return NextResponse.json({
    ok: true,
    duplicate: false,
    reference: inquiry.reference,
    storageMode: inquiry.storageMode,
    message: "Inquiry validated in the development adapter. Durable production delivery is not configured yet."
  }, { status: 201 });
}
