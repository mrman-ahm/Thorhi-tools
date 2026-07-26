import type { ReactNode } from "react";

export type TechnicalAccordionItem = {
  index: string;
  title: string;
  summary: string;
  detail?: ReactNode;
};

export function TechnicalAccordion({
  items,
  label
}: {
  items: readonly TechnicalAccordionItem[];
  label: string;
}) {
  return <div className="v3-technical-accordion" role="group" aria-label={label}>
    {items.map((item, index) => <details key={item.index} open={index === 0}>
      <summary>
        <span>{item.index}</span>
        <strong>{item.title}</strong>
        <small>{item.summary}</small>
        <b aria-hidden="true">+</b>
      </summary>
      <div className="v3-technical-accordion-panel">
        {item.detail ?? <p>{item.summary}</p>}
      </div>
    </details>)}
  </div>;
}
