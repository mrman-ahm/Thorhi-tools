import Link from "next/link";
import { FrameEvolutionScene } from "@/components/frame-evolution-scene";
import styles from "./home-sections.module.css";

export function HomeEvolutionPreview() {
  return (
    <section
      className={styles.evolution}
      role="region"
      aria-label="Scissors through time"
      data-home-evolution
      data-redesign-dark
    >
      <div className={styles.evolutionIndex}>
        <span>05 / Instrument history</span>
        <Link href="/rebuild/company/scissors-through-time">
          View the full sequence
        </Link>
      </div>
      <FrameEvolutionScene
        variant="preview"
        eyebrow="SCISSORS THROUGH TIME"
        title={
          <>
            A familiar form,
            <br />
            <span>refined across eras.</span>
          </>
        }
        accessibleLabel="Evolution of cutting and surgical instruments"
      />
    </section>
  );
}
