import {
  allowedAttachmentTypes,
  maxAttachmentBytes,
  sanitizeFilename,
} from "@/lib/inquiry-validation";

export class InquiryRequestError extends Error {
  readonly status: number;
  readonly errors?: Record<string, string>;

  constructor(
    message: string,
    status = 400,
    errors?: Record<string, string>,
  ) {
    super(message);
    this.name = "InquiryRequestError";
    this.status = status;
    this.errors = errors;
  }
}

export type ParsedInquiryRequest = {
  body: unknown;
  attachment?: File;
  turnstileToken?: string;
};

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function attachmentErrors(file: File) {
  const errors: Record<string, string> = {};
  if (
    !allowedAttachmentTypes.includes(
      file.type as (typeof allowedAttachmentTypes)[number],
    )
  ) {
    errors["attachment.type"] = "Use PDF, JPG, PNG, or WebP.";
  }
  if (file.size < 1 || file.size > maxAttachmentBytes) {
    errors["attachment.size"] = "Attachment must be smaller than 8 MB.";
  }
  if (!sanitizeFilename(file.name)) {
    errors["attachment.name"] = "Attachment filename is invalid.";
  }
  return errors;
}

export async function parseInquiryRequest(
  request: Request,
): Promise<ParsedInquiryRequest> {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";

  if (contentType.includes("multipart/form-data")) {
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      throw new InquiryRequestError(
        "The inquiry form data could not be read.",
        400,
      );
    }

    const payloadEntry = formData.get("payload");
    if (typeof payloadEntry !== "string") {
      throw new InquiryRequestError(
        "The inquiry payload is missing.",
        400,
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(payloadEntry);
    } catch {
      throw new InquiryRequestError(
        "The inquiry payload was not valid JSON.",
        400,
      );
    }

    const attachmentEntry = formData.get("attachment");
    const attachment = attachmentEntry instanceof File && attachmentEntry.size > 0
      ? attachmentEntry
      : undefined;

    if (attachment) {
      const errors = attachmentErrors(attachment);
      if (Object.keys(errors).length) {
        throw new InquiryRequestError(
          "Review the selected attachment.",
          422,
          errors,
        );
      }
      parsed = {
        ...record(parsed),
        attachment: {
          name: attachment.name,
          type: attachment.type,
          size: attachment.size,
        },
      };
    }

    const turnstileEntry = formData.get("turnstileToken");
    const turnstileToken = typeof turnstileEntry === "string"
      ? turnstileEntry.trim().slice(0, 4096)
      : undefined;

    return { body: parsed, attachment, turnstileToken };
  }

  if (!contentType.includes("application/json")) {
    throw new InquiryRequestError(
      "Submit the inquiry as multipart form data or JSON.",
      415,
    );
  }

  try {
    const body = await request.json();
    const raw = record(body);
    const turnstileToken = typeof raw.turnstileToken === "string"
      ? raw.turnstileToken.trim().slice(0, 4096)
      : undefined;
    return { body, turnstileToken };
  } catch {
    throw new InquiryRequestError(
      "The inquiry request was not valid JSON.",
      400,
    );
  }
}
