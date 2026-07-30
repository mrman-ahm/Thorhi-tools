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
      className={styles.company}
      aria-label="About THROHI"
    >
      <div className={styles.companyHeading}>
        <h2 id="home-company-title">{homeCompanyCopy.heading}</h2>
      </div>
      <div className={styles.companyBody}>
        {homeCompanyCopy.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <ul aria-label="THROHI instrument divisions">
          {divisions.map((division) => (
            <li key={division}>{division}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
