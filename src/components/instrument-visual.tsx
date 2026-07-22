type InstrumentVisualProps = { variant?: "hero" | "macro"; label: string };

export function InstrumentVisual({ variant = "hero", label }: InstrumentVisualProps) {
  return <div className={`instrument-visual ${variant}`} role="img" aria-label={label}>
    <span className="asset-note">Replace with approved asset</span><span className="blade blade-a" /><span className="blade blade-b" /><span className="ring ring-a" /><span className="ring ring-b" />
    {variant === "macro" && <><span className="annotation a1">01 · WORKING END</span><span className="annotation a2">02 · JOINT</span><span className="annotation a3">03 · HANDLE</span></>}
  </div>;
}
