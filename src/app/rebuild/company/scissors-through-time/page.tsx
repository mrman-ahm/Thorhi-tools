import type { Metadata } from "next";
import { FrameEvolutionScene } from "@/components/frame-evolution-scene";
import { RebuildActionRail } from "@/components/rebuild/corporate/rebuild-action-rail";
import { RebuildPageHero } from "@/components/rebuild/corporate/rebuild-page-hero";
import { scissorsEditorialCopy } from "@/rebuild/company-content";
import styles from "./scissors-through-time.module.css";

export const metadata: Metadata = {
  title: "Scissors Through Time | THROHI Medical Tools",
  description:
    "Explore a scroll-linked editorial sequence describing changes in cutting and surgical instrument form.",
  robots: { index: false, follow: false },
};

const actions = [
  {
    href: "/rebuild/products",
    label: "Browse products",
    description: "Move from the editorial sequence into present-day catalogue discovery.",
    emphasis: "primary" as const,
  },
  {
    href: "/rebuild/inquiry",
    label: "Build an inquiry",
    description: "Collect known instruments, variants, quantities, and unlisted references.",
  },
  {
    href: "/rebuild/company",
    label: "Return to Company",
    description: "Review THROHI identity, instrument divisions, and publication boundaries.",
  },
] as const;

export default function ScissorsThroughTimePage() {
  return (
    <main id="main" tabIndex={-1} className={styles.page}>
      <RebuildPageHero
        eyebrow="Editorial instrument study"
        title={scissorsEditorialCopy.title}
        summary={scissorsEditorialCopy.introduction}
        meta={["260 supplied frames", "Four broad chapters", "Reduced-motion reading mode"]}
        tone="navy"
      />

      <section className={styles.editorialNote} aria-label="Editorial context">
        <h2>Instrument form changes around function.</h2>
        <div>
          <p>{scissorsEditorialCopy.disclaimer}</p>
          <p>
            The sequence is presented as a restrained visual overview. It does not add
            unsupported dates, makers, materials, procedures, or company-history claims.
          </p>
        </div>
      </section>

      <section
        className={styles.evolutionWrap}
        role="region"
        aria-label="Scissors through time evolution"
      >
        <FrameEvolutionScene
          variant="full"
          eyebrow="Scissors through time"
          title={<>Form, joint, handle and working end.</>}
          accessibleLabel="Scissors through time evolution"
        />
      </section>

      <section className={styles.closing} aria-label="Present-day catalogue connection">
        <h2>From instrument form to catalogue identity.</h2>
        <p>{scissorsEditorialCopy.closing}</p>
      </section>

      <RebuildActionRail actions={actions} />
    </main>
  );
}
