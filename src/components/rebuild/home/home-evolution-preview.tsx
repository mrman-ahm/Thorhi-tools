import { FrameEvolutionScene } from "@/components/frame-evolution-scene";

export function HomeEvolutionPreview() {
  return (
    <div role="region" aria-label="Scissors through time">
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
    </div>
  );
}
