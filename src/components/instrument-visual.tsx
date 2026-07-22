type InstrumentVisualProps = { variant?: "hero" | "macro"; label: string };

export function InstrumentVisual({ variant = "hero", label }: InstrumentVisualProps) {
  return <div className={`instrument-visual ${variant}`} role="img" aria-label={label}>
    <span className="asset-note">IMAGE PLACEHOLDER · APPROVED ASSET REQUIRED</span>
    <svg className="instrument-svg" viewBox="0 0 900 900" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`steel-${variant}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#173c31" />
          <stop offset="0.42" stopColor="#63ffb2" />
          <stop offset="0.62" stopColor="#72d6ff" />
          <stop offset="1" stopColor="#0d2b24" />
        </linearGradient>
        <filter id={`soft-${variant}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>
      <ellipse cx="485" cy="475" rx="260" ry="260" fill="none" stroke="#184d3a" strokeWidth="1" opacity=".7" />
      <ellipse cx="485" cy="475" rx="190" ry="190" fill="none" stroke="#17435b" strokeWidth="1" opacity=".65" />
      <path d="M168 655 C252 577 334 520 443 459" fill="none" stroke="#22d87f" strokeWidth="34" strokeLinecap="round" opacity=".14" filter={`url(#soft-${variant})`} />
      <path d="M443 459 C583 350 690 246 790 126" fill="none" stroke="#21a8e8" strokeWidth="30" strokeLinecap="round" opacity=".12" filter={`url(#soft-${variant})`} />
      <path d="M184 678 C280 584 356 520 446 462" fill="none" stroke={`url(#steel-${variant})`} strokeWidth="18" strokeLinecap="round" />
      <path d="M449 461 C577 361 681 255 785 129" fill="none" stroke={`url(#steel-${variant})`} strokeWidth="14" strokeLinecap="round" />
      <path d="M189 281 C287 360 363 412 448 458" fill="none" stroke={`url(#steel-${variant})`} strokeWidth="18" strokeLinecap="round" />
      <path d="M451 458 C577 498 689 546 806 610" fill="none" stroke={`url(#steel-${variant})`} strokeWidth="14" strokeLinecap="round" />
      <circle cx="447" cy="460" r="36" fill="#050706" stroke="#ff8a2a" strokeWidth="8" />
      <circle cx="447" cy="460" r="8" fill="#ffb13b" />
      <circle cx="159" cy="704" r="92" fill="none" stroke="#45e49a" strokeWidth="18" />
      <circle cx="158" cy="257" r="92" fill="none" stroke="#45e49a" strokeWidth="18" />
      <line x1="530" y1="95" x2="530" y2="825" stroke="#28483d" strokeWidth="1" strokeDasharray="6 16" />
      <line x1="84" y1="540" x2="834" y2="540" stroke="#173d52" strokeWidth="1" strokeDasharray="6 16" />
    </svg>
    <span className="visual-code">THR / OBJECT STUDY / 001</span>
    {variant === "macro" && <div className="annotation-set"><span className="annotation a1">01 · WORKING END</span><span className="annotation a2">02 · JOINT</span><span className="annotation a3">03 · HANDLE</span></div>}
  </div>;
}
