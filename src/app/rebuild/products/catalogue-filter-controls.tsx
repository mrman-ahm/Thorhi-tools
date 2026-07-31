import type { ChangeEvent } from "react";
import type { RuntimeFamily } from "@/lib/rebuild-catalogue";
import styles from "./catalogue.module.css";

export type CatalogueFilterControlsProps = {
  prefix: string;
  division: string;
  family: string;
  families: RuntimeFamily[];
  onDivision: (division: string) => void;
  onFamily: (event: ChangeEvent<HTMLSelectElement>) => void;
};

export function familyKey(family: RuntimeFamily) {
  return `${family.division}:${family.slug}`;
}

export function CatalogueFilterControls({
  prefix,
  division,
  family,
  families,
  onDivision,
  onFamily,
}: CatalogueFilterControlsProps) {
  return (
    <div className={styles.filterControls} data-catalogue-filter-controls>
      <fieldset>
        <legend>Division</legend>
        {[
          ["all", "All instruments"],
          ["surgical", "Surgical"],
          ["dental", "Dental"],
        ].map(([value, label]) => (
          <label key={value}>
            <input
              type="radio"
              name={`${prefix}-division`}
              value={value}
              checked={division === value}
              onChange={() => onDivision(value)}
            />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>

      <label className={styles.familySelect} htmlFor={`${prefix}-family`}>
        <span>Product family</span>
        <select id={`${prefix}-family`} value={family} onChange={onFamily}>
          <option value="all">All available families</option>
          {families.map((item) => (
            <option key={familyKey(item)} value={familyKey(item)}>
              {division === "all"
                ? `${item.division === "dental" ? "Dental" : "Surgical"} — `
                : ""}
              {item.label} ({item.productCount})
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
