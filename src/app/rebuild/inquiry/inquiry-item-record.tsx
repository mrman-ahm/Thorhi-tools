import type { InquiryItem } from "@/components/inquiry-provider";
import styles from "./inquiry.module.css";

type InquiryItemRecordProps = {
  item: InquiryItem;
  index: number;
  onUpdate: (
    key: string,
    updates: Partial<Pick<InquiryItem, "quantity" | "note" | "name">>,
  ) => void;
  onRemove: (key: string) => void;
};

export function InquiryItemRecord({
  item,
  index,
  onUpdate,
  onRemove,
}: InquiryItemRecordProps) {
  const code = item.variantLabel ?? item.code;

  return (
    <article className={styles.itemRecord} data-inquiry-item>
      <span className={styles.itemIndex} data-inquiry-item-index>
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className={styles.itemIdentity} data-inquiry-item-identity>
        <small>{item.manual ? "Unlisted reference" : "Catalogue instrument"}</small>
        <h3>{item.name}</h3>
        <code>{code}</code>
      </div>
      <label className={styles.quantityField} data-inquiry-item-field>
        <span>Quantity</span>
        <input
          type="number"
          min="1"
          max="9999"
          value={item.quantity}
          onChange={(event) =>
            onUpdate(item.key, { quantity: Number(event.target.value) || 1 })
          }
        />
      </label>
      <label className={styles.noteField} data-inquiry-item-field>
        <span>Item note</span>
        <input
          value={item.note}
          maxLength={1000}
          onChange={(event) => onUpdate(item.key, { note: event.target.value })}
          placeholder="Optional reference, size, or packaging note"
        />
      </label>
      <button
        className={styles.removeItem}
        type="button"
        onClick={() => onRemove(item.key)}
        data-inquiry-remove
      >
        Remove
      </button>
    </article>
  );
}
