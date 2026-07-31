import Link from "next/link";
import { homeCompanyCopy } from "@/rebuild/home-content";
import styles from "./home-sections.module.css";

const divisions = [
  "Surgical",
  "Dental and Orthodontic",
  "Veterinary",
  "Beauty",
] as const;

export function HomeCompanyIntro() {
  return (
    <section
      id="company"
      role="region"
      className={styles.company}
      aria-label="About THROHI"
      data-home-company
      data-redesign-section
    >
      <div className={styles.companyHeading}>
        <p>04 / Company</p>
        <h2 id="home-company-title">{homeCompanyCopy.heading}</h2>
        <Link href="/rebuild/company">Read the company profile</Link>
      </div>
      <div className={styles.companyBody}>
        {homeCompanyCopy.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <ul aria-label="THROHI instrument divisions">
          {divisions.map((division, index) => (
            <li key={division}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{division}</strong>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
