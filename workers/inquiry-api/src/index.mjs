const MAX_ATTACHMENT_BYTES = 8 * 1024 * 1024;
const ALLOWED_ATTACHMENT_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_ATTEMPTS = 5;

class HttpError extends Error {
  constructor(message, status = 400, errors) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.errors = errors;
  }
}

function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      "referrer-policy": "no-referrer",
    },
  });
}

function asRecord(value) {
  return value && typeof value === "object" ? value : {};
}

function cleanText(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function sanitizeFilename(value) {
  return cleanText(value, 200)
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 120);
}

function allowedOrigins(env) {
  return cleanText(env.ALLOWED_ORIGINS, 4000)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

async function sha256(value) {
  return new Uint8Array(
    await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)),
  );
}

async function constantTimeEqual(left, right) {
  const [leftHash, rightHash] = await Promise.all([
    sha256(left ?? ""),
    sha256(right ?? ""),
  ]);
  let difference = 0;
  for (let index = 0; index < leftHash.length; index += 1) {
    difference |= leftHash[index] ^ rightHash[index];
  }
  return difference === 0;
}

async function requireProxyAuthentication(request, env) {
  const configuredSecret = cleanText(env.INQUIRY_API_SECRET, 4096);
  if (!configuredSecret) {
    throw new HttpError("Inquiry API authentication is not configured.", 503);
  }
  const providedSecret = request.headers.get("x-throhi-api-secret") ?? "";
  if (!(await constantTimeEqual(providedSecret, configuredSecret))) {
    throw new HttpError("Inquiry API authentication failed.", 401);
  }

  const origin = cleanText(request.headers.get("x-throhi-origin"), 500);
  const origins = allowedOrigins(env);
  if (!origins.length) {
    throw new HttpError("Allowed inquiry origins are not configured.", 503);
  }
  if (!origin || !origins.includes(origin)) {
    throw new HttpError("This inquiry origin is not allowed.", 403);
  }
  return origin;
}

function validatePayload(value) {
  const errors = {};
  const raw = asRecord(value);
  const buyerRaw = asRecord(raw.buyer);
  const rawItems = Array.isArray(raw.items) ? raw.items.slice(0, 100) : [];
  const submissionToken = cleanText(raw.submissionToken, 120);
  if (submissionToken.length < 12) {
    errors.submissionToken = "Submission token is missing.";
  }

  const items = rawItems.map((entry, index) => {
    const item = asRecord(entry);
    const quantity = Number(item.quantity);
    const normalized = {
      key: cleanText(item.key, 240),
      productId: cleanText(item.productId, 240) || undefined,
      productCode: cleanText(item.productCode, 80).toUpperCase() || undefined,
      variantId: cleanText(item.variantId, 240) || undefined,
      variantLabel: cleanText(item.variantLabel, 80).toUpperCase() || undefined,
      code: cleanText(item.code, 80).toUpperCase(),
      name: cleanText(item.name, 160),
      quantity,
      note: cleanText(item.note, 1000) || undefined,
      manual: item.manual === true,
    };
    if (!normalized.key) errors[`items.${index}.key`] = "The inquiry line identifier is missing.";
    if (!normalized.code) errors[`items.${index}.code`] = "Product code or manual reference is required.";
    if (!normalized.name) errors[`items.${index}.name`] = "Product name is required.";
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 9999) {
      errors[`items.${index}.quantity`] = "Quantity must be between 1 and 9999.";
    }
    return normalized;
  });
  if (!items.length) errors.items = "Add at least one product or manual item.";

  const buyer = {
    fullName: cleanText(buyerRaw.fullName, 120),
    companyName: cleanText(buyerRaw.companyName, 160),
    country: cleanText(buyerRaw.country, 100),
    email: cleanText(buyerRaw.email, 200).toLowerCase(),
    phone: cleanText(buyerRaw.phone, 60) || undefined,
    preferredContact: cleanText(buyerRaw.preferredContact, 20),
  };
  if (buyer.fullName.length < 2) errors["buyer.fullName"] = "Enter your full name.";
  if (buyer.companyName.length < 2) errors["buyer.companyName"] = "Enter the company or organization name.";
  if (!buyer.country) errors["buyer.country"] = "Country is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyer.email)) {
    errors["buyer.email"] = "Enter a valid email address.";
  }
  if (!["email", "phone", "whatsapp"].includes(buyer.preferredContact)) {
    errors["buyer.preferredContact"] = "Choose a preferred contact method.";
  }
  if (
    (buyer.preferredContact === "phone" || buyer.preferredContact === "whatsapp") &&
    !buyer.phone
  ) {
    errors["buyer.phone"] = "A phone number is required for this contact method.";
  }

  if (raw.consent !== true) errors.consent = "Consent is required before submission.";

  let attachment;
  if (raw.attachment && typeof raw.attachment === "object") {
    const file = asRecord(raw.attachment);
    attachment = {
      name: sanitizeFilename(file.name),
      type: cleanText(file.type, 100),
      size: Number(file.size),
    };
    if (!attachment.name) errors["attachment.name"] = "Attachment filename is invalid.";
    if (!ALLOWED_ATTACHMENT_TYPES.has(attachment.type)) {
      errors["attachment.type"] = "Use PDF, JPG, PNG, or WebP.";
    }
    if (
      !Number.isFinite(attachment.size) ||
      attachment.size < 1 ||
      attachment.size > MAX_ATTACHMENT_BYTES
    ) {
      errors["attachment.size"] = "Attachment must be smaller than 8 MB.";
    }
  }

  if (Object.keys(errors).length) {
    throw new HttpError("Review the highlighted inquiry fields.", 422, errors);
  }

  return {
    submissionToken,
    items,
    buyer,
    generalRequirements: cleanText(raw.generalRequirements, 4000) || undefined,
    attachment,
    consent: true,
  };
}

async function parseSubmission(request) {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.includes("multipart/form-data")) {
    throw new HttpError("Inquiry API requires multipart form data.", 415);
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    throw new HttpError("The inquiry form data could not be read.", 400);
  }
  const payloadEntry = formData.get("payload");
  if (typeof payloadEntry !== "string") {
    throw new HttpError("The inquiry payload is missing.", 400);
  }

  let rawPayload;
  try {
    rawPayload = JSON.parse(payloadEntry);
  } catch {
    throw new HttpError("The inquiry payload was not valid JSON.", 400);
  }
  const payload = validatePayload(rawPayload);
  const attachmentEntry = formData.get("attachment");
  const attachment = attachmentEntry instanceof File && attachmentEntry.size > 0
    ? attachmentEntry
    : undefined;

  if (payload.attachment && !attachment) {
    throw new HttpError("The attachment file bytes are missing.", 422, {
      attachment: "Select the attachment again before submitting.",
    });
  }
  if (attachment) {
    if (!payload.attachment) {
      throw new HttpError("Attachment metadata is missing.", 422, {
        attachment: "Remove and select the attachment again.",
      });
    }
    if (
      attachment.size !== payload.attachment.size ||
      attachment.type !== payload.attachment.type ||
      sanitizeFilename(attachment.name) !== payload.attachment.name
    ) {
      throw new HttpError("Attachment metadata does not match the uploaded file.", 422, {
        attachment: "Remove and select the attachment again.",
      });
    }
  }

  const turnstileEntry = formData.get("turnstileToken");
  const turnstileToken = typeof turnstileEntry === "string"
    ? turnstileEntry.trim().slice(0, 4096)
    : "";
  return { payload, attachment, turnstileToken };
}

async function validateTurnstile(env, token) {
  const secret = cleanText(env.TURNSTILE_SECRET_KEY, 4096);
  if (!secret) return;
  if (!token) {
    throw new HttpError("Complete the anti-spam verification and submit again.", 403);
  }

  const formData = new FormData();
  formData.set("secret", secret);
  formData.set("response", token);
  let response;
  try {
    response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body: formData },
    );
  } catch {
    throw new HttpError("Anti-spam verification is temporarily unavailable.", 503);
  }
  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.success !== true) {
    throw new HttpError("Anti-spam verification failed. Refresh and try again.", 403);
  }
}

async function enforceRateLimit(env, fingerprint) {
  if (!fingerprint || fingerprint.length < 32) {
    throw new HttpError("Inquiry request fingerprint is missing.", 400);
  }
  const windowStart = Math.floor(Date.now() / RATE_LIMIT_WINDOW_MS) * RATE_LIMIT_WINDOW_MS;
  const current = await env.DB.prepare(
    "SELECT attempts FROM inquiry_rate_limits WHERE fingerprint = ? AND window_start = ?",
  )
    .bind(fingerprint, windowStart)
    .first();
  if (current && Number(current.attempts) >= RATE_LIMIT_ATTEMPTS) {
    throw new HttpError("Too many inquiry attempts. Try again later.", 429);
  }
  await env.DB.prepare(
    `INSERT INTO inquiry_rate_limits (fingerprint, window_start, attempts, updated_at)
     VALUES (?, ?, 1, datetime('now'))
     ON CONFLICT(fingerprint, window_start)
     DO UPDATE SET attempts = attempts + 1, updated_at = datetime('now')`,
  )
    .bind(fingerprint, windowStart)
    .run();
  return windowStart;
}

function createReference(now = new Date()) {
  const date = now.toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = crypto.randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase();
  return `THR-${date}-${suffix}`;
}

function attachmentKey(reference, filename, now = new Date()) {
  const date = now.toISOString().slice(0, 10);
  return `inquiries/${date}/${reference}/${crypto.randomUUID()}-${sanitizeFilename(filename)}`;
}

async function hmacHex(secret, message) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message)),
  );
  return Array.from(signature, (value) => value.toString(16).padStart(2, "0")).join("");
}

async function deliverOutbox(env, reference, payloadJson) {
  const webhookUrl = cleanText(env.INQUIRY_DELIVERY_WEBHOOK_URL, 2048);
  const webhookSecret = cleanText(env.INQUIRY_DELIVERY_WEBHOOK_SECRET, 4096);
  if (!webhookUrl || !webhookSecret) return;

  try {
    const signature = await hmacHex(webhookSecret, payloadJson);
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-throhi-signature": `sha256=${signature}`,
        "idempotency-key": reference,
      },
      body: payloadJson,
    });
    if (!response.ok) throw new Error(`Delivery endpoint returned ${response.status}.`);
    await env.DB.batch([
      env.DB.prepare(
        `UPDATE inquiry_delivery_outbox
         SET status = 'delivered', attempt_count = attempt_count + 1,
             delivered_at = datetime('now'), updated_at = datetime('now'), last_error = NULL
         WHERE inquiry_reference = ? AND status != 'delivered'`,
      ).bind(reference),
      env.DB.prepare(
        `UPDATE inquiries
         SET delivery_status = 'delivered', updated_at = datetime('now')
         WHERE reference = ?`,
      ).bind(reference),
    ]);
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 1000) : "Unknown delivery error.";
    await env.DB.batch([
      env.DB.prepare(
        `UPDATE inquiry_delivery_outbox
         SET status = 'retry', attempt_count = attempt_count + 1,
             next_attempt_at = datetime('now', '+15 minutes'),
             last_error = ?, updated_at = datetime('now')
         WHERE inquiry_reference = ?`,
      ).bind(message, reference),
      env.DB.prepare(
        `UPDATE inquiries
         SET delivery_status = 'retry', updated_at = datetime('now')
         WHERE reference = ?`,
      ).bind(reference),
    ]);
  }
}

async function handleInquiry(request, env, ctx) {
  const origin = await requireProxyAuthentication(request, env);
  const fingerprint = cleanText(
    request.headers.get("x-throhi-client-fingerprint"),
    256,
  );
  const { payload, attachment, turnstileToken } = await parseSubmission(request);
  await validateTurnstile(env, turnstileToken);

  const duplicate = await env.DB.prepare(
    "SELECT reference FROM inquiries WHERE submission_token = ?",
  )
    .bind(payload.submissionToken)
    .first();
  if (duplicate?.reference) {
    return json({
      ok: true,
      duplicate: true,
      reference: duplicate.reference,
      storageMode: "cloudflare-d1-r2",
      message: "This inquiry was already received.",
    });
  }

  const windowStart = await enforceRateLimit(env, fingerprint);
  const submittedAt = new Date().toISOString();
  const reference = createReference(new Date(submittedAt));
  let storedAttachmentKey;

  if (attachment) {
    storedAttachmentKey = attachmentKey(reference, attachment.name, new Date(submittedAt));
    await env.ATTACHMENTS.put(storedAttachmentKey, attachment.stream(), {
      httpMetadata: { contentType: attachment.type },
      customMetadata: {
        reference,
        originalName: sanitizeFilename(attachment.name),
      },
    });
  }

  const durablePayload = {
    reference,
    submittedAt,
    origin,
    buyer: payload.buyer,
    items: payload.items,
    generalRequirements: payload.generalRequirements,
    attachment: payload.attachment
      ? {
          name: payload.attachment.name,
          type: payload.attachment.type,
          size: payload.attachment.size,
          stored: true,
        }
      : undefined,
  };
  const payloadJson = JSON.stringify(durablePayload);

  const statements = [
    env.DB.prepare(
      `INSERT INTO inquiries (
        reference, submission_token, submitted_at, status,
        buyer_full_name, buyer_company_name, buyer_country, buyer_email,
        buyer_phone, preferred_contact, general_requirements, consent_at,
        attachment_key, attachment_name, attachment_type, attachment_size,
        client_fingerprint, payload_json, delivery_status
      ) VALUES (?, ?, ?, 'received', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
    ).bind(
      reference,
      payload.submissionToken,
      submittedAt,
      payload.buyer.fullName,
      payload.buyer.companyName,
      payload.buyer.country,
      payload.buyer.email,
      payload.buyer.phone ?? null,
      payload.buyer.preferredContact,
      payload.generalRequirements ?? null,
      submittedAt,
      storedAttachmentKey ?? null,
      payload.attachment?.name ?? null,
      payload.attachment?.type ?? null,
      payload.attachment?.size ?? null,
      fingerprint,
      payloadJson,
    ),
    ...payload.items.map((item, index) =>
      env.DB.prepare(
        `INSERT INTO inquiry_items (
          inquiry_reference, line_index, item_key, product_id, product_code,
          variant_id, variant_label, code, name, quantity, note, manual
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ).bind(
        reference,
        index,
        item.key,
        item.productId ?? null,
        item.productCode ?? null,
        item.variantId ?? null,
        item.variantLabel ?? null,
        item.code,
        item.name,
        item.quantity,
        item.note ?? null,
        item.manual ? 1 : 0,
      ),
    ),
    env.DB.prepare(
      `INSERT INTO inquiry_delivery_outbox (
        inquiry_reference, event_type, payload_json, status, attempt_count
      ) VALUES (?, 'inquiry.received', ?, 'pending', 0)`,
    ).bind(reference, payloadJson),
  ];

  try {
    await env.DB.batch(statements);
  } catch (error) {
    if (storedAttachmentKey) {
      await env.ATTACHMENTS.delete(storedAttachmentKey).catch(() => undefined);
    }
    throw error;
  }

  ctx.waitUntil(deliverOutbox(env, reference, payloadJson));
  ctx.waitUntil(
    env.DB.prepare(
      "DELETE FROM inquiry_rate_limits WHERE window_start < ?",
    )
      .bind(windowStart - 24 * 60 * 60 * 1000)
      .run(),
  );

  return json(
    {
      ok: true,
      duplicate: false,
      reference,
      storageMode: "cloudflare-d1-r2",
      message: "Inquiry stored successfully.",
    },
    201,
  );
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/health") {
      return json({
        ok: true,
        service: "throhi-inquiry-api",
        d1: Boolean(env.DB),
        r2: Boolean(env.ATTACHMENTS),
        allowedOriginsConfigured: allowedOrigins(env).length > 0,
        turnstileConfigured: Boolean(env.TURNSTILE_SECRET_KEY),
        deliveryConfigured: Boolean(
          env.INQUIRY_DELIVERY_WEBHOOK_URL &&
            env.INQUIRY_DELIVERY_WEBHOOK_SECRET,
        ),
      });
    }

    if (request.method !== "POST" || url.pathname !== "/v1/inquiries") {
      return json({ ok: false, message: "Not found." }, 404);
    }

    try {
      return await handleInquiry(request, env, ctx);
    } catch (error) {
      if (error instanceof HttpError) {
        return json(
          { ok: false, message: error.message, errors: error.errors },
          error.status,
        );
      }
      console.error("Inquiry persistence failed", error);
      return json(
        {
          ok: false,
          message: "The inquiry could not be stored. Try again later.",
        },
        503,
      );
    }
  },
};
