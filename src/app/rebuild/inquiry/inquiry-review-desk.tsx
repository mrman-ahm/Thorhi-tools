import styles from "./inquiry.module.css";

type InquiryReviewDeskProps = {
  lineCount: number;
  totalQuantity: number;
  noteCount: number;
  attachmentName?: string;
  serverMessage: string;
  submitting: boolean;
};

export function InquiryReviewDesk({
  lineCount,
  totalQuantity,
  noteCount,
  attachmentName,
  serverMessage,
  submitting,
}: InquiryReviewDeskProps) {
  return (
    <aside className={styles.reviewDesk} data-inquiry-review>
      <div className={styles.reviewHeading} data-inquiry-review-heading>
        <p>04 · Final review</p>
        <h2>Inquiry summary</h2>
      </div>

      <dl data-inquiry-review-ledger>
        <div>
          <dt>Product lines</dt>
          <dd>{lineCount.toString().padStart(2, "0")}</dd>
        </div>
        <div>
          <dt>Total quantity</dt>
          <dd>{totalQuantity.toString().padStart(2, "0")}</dd>
        </div>
        <div>
          <dt>Product notes</dt>
          <dd>{noteCount.toString().padStart(2, "0")}</dd>
        </div>
        <div>
          <dt>Attachment</dt>
          <dd>{attachmentName ? "01 file" : "None"}</dd>
        </div>
      </dl>

      {attachmentName ? (
        <p className={styles.reviewAttachment}>{attachmentName}</p>
      ) : null}

      <p className={styles.reviewBoundary} data-inquiry-review-boundary>
        This is a product inquiry, not an online order or payment.
      </p>

      {serverMessage ? (
        <div className={styles.submissionError} role="alert">
          <strong>Submission not completed</strong>
          <span>{serverMessage}</span>
        </div>
      ) : null}

      <button type="submit" disabled={submitting || lineCount === 0}>
        <span>{submitting ? "Submitting…" : "Submit inquiry"}</span>
        <b aria-hidden="true">↗</b>
      </button>

      <small>
        Duplicate submission is prevented with a one-time browser token.
        Production delivery is not configured.
      </small>
    </aside>
  );
}
