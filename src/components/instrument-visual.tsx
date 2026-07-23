import type { CSSProperties } from "react";

type InstrumentVisualProps = { variant?: "hero" | "macro"; label: string };

export function InstrumentVisual({ variant = "hero", label }: InstrumentVisualProps) {
  const steelId = `steel-${variant}`;
  const sweepId = `sweep-${variant}`;
  const clipId = `instrument-clip-${variant}`;

  return <div className={`instrument-visual ${variant}`} role="img" aria-label={label} data-instrument-variant={variant}>
    <span className="asset-note">IMAGE PLACEHOLDER · APPROVED ASSET REQUIRED</span>
    <svg className="instrument-svg" viewBox="0 0 900 900" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={steelId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#12382d" />
          <stop offset="0.34" stopColor="#d8eee4" />
          <stop offset="0.48" stopColor="#63ffb2" />
          <stop offset="0.63" stopColor="#72d6ff" />
          <stop offset="1" stopColor="#0d2b24" />
        </linearGradient>
        <linearGradient id={sweepId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="white" stopOpacity="0" />
          <stop offset="0.46" stopColor="white" stopOpacity="0" />
          <stop offset="0.5" stopColor="white" stopOpacity="0.9" />
          <stop offset="0.54" stopColor="#bfffe1" stopOpacity="0.32" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <clipPath id={clipId}>
          <path d="M184 678 C280 584 356 520 446 462 M449 461 C577 361 681 255 785 129 M189 281 C287 360 363 412 448 458 M451 458 C577 498 689 546 806 610" fill="none" stroke="white" strokeWidth="24" strokeLinecap="round" />
          <circle cx="159" cy="704" r="101" fill="none" stroke="white" strokeWidth="24" />
          <circle cx="158" cy="257" r="101" fill="none" stroke="white" strokeWidth="24" />
        </clipPath>
      </defs>

      <g className="instrument-measurement-system" fill="none">
        <ellipse className="instrument-drawable measurement-orbit outer" cx="447" cy="460" rx="300" ry="300" stroke="#1d5845" strokeWidth="1" opacity=".74" />
        <ellipse className="instrument-drawable measurement-orbit inner" cx="447" cy="460" rx="218" ry="218" stroke="#1d4f69" strokeWidth="1" opacity=".62" />
        <path className="instrument-drawable measurement-arc" d="M188 420 A270 270 0 0 1 690 300" stroke="#3a7861" strokeWidth="1.5" />
        <path className="instrument-drawable measurement-arc" d="M292 699 A270 270 0 0 0 710 582" stroke="#285f78" strokeWidth="1.5" />
        <g className="measurement-ticks" stroke="#5a8c77" strokeWidth="1">
          {Array.from({ length: 13 }, (_, index) => <line key={index} className="instrument-drawable measurement-tick" x1="447" y1="137" x2="447" y2={index % 3 === 0 ? "157" : "150"} transform={`rotate(${index * 30} 447 460)`} />)}
        </g>
      </g>

      <g className="instrument-assembly" style={{ transformOrigin: "447px 460px" } as CSSProperties}>
        <g className="instrument-half instrument-half-upper" style={{ transformOrigin: "447px 460px" } as CSSProperties}>
          <path className="instrument-shadow upper-shadow" d="M189 281 C287 360 363 412 448 458 M451 458 C577 498 689 546 806 610" fill="none" stroke="#21a8e8" strokeWidth="30" strokeLinecap="round" opacity=".08" />
          <path className="instrument-shank upper-shank" d="M189 281 C287 360 363 412 448 458" fill="none" stroke={`url(#${steelId})`} strokeWidth="18" strokeLinecap="round" />
          <path className="instrument-blade upper-blade" d="M451 458 C577 498 689 546 806 610" fill="none" stroke={`url(#${steelId})`} strokeWidth="14" strokeLinecap="round" />
          <circle className="instrument-ring upper-ring" cx="158" cy="257" r="92" fill="none" stroke="#45e49a" strokeWidth="18" />
        </g>

        <g className="instrument-half instrument-half-lower" style={{ transformOrigin: "447px 460px" } as CSSProperties}>
          <path className="instrument-shadow lower-shadow" d="M184 678 C280 584 356 520 446 462 M449 461 C577 361 681 255 785 129" fill="none" stroke="#22d87f" strokeWidth="34" strokeLinecap="round" opacity=".09" />
          <path className="instrument-shank lower-shank" d="M184 678 C280 584 356 520 446 462" fill="none" stroke={`url(#${steelId})`} strokeWidth="18" strokeLinecap="round" />
          <path className="instrument-blade lower-blade" d="M449 461 C577 361 681 255 785 129" fill="none" stroke={`url(#${steelId})`} strokeWidth="14" strokeLinecap="round" />
          <circle className="instrument-ring lower-ring" cx="159" cy="704" r="92" fill="none" stroke="#45e49a" strokeWidth="18" />
        </g>

        <g className="instrument-pivot" style={{ transformOrigin: "447px 460px" } as CSSProperties}>
          <circle cx="447" cy="460" r="36" fill="#050706" stroke="#ff8a2a" strokeWidth="8" />
          <circle className="pivot-core" cx="447" cy="460" r="8" fill="#ffb13b" />
          <circle className="pivot-calibration" cx="447" cy="460" r="49" fill="none" stroke="#63ffb2" strokeWidth="1" strokeDasharray="2 8" opacity=".62" />
        </g>
      </g>

      <g className="instrument-steel-sweep" clipPath={`url(#${clipId})`} opacity="0">
        <rect className="steel-sweep-band" x="-620" y="0" width="520" height="900" fill={`url(#${sweepId})`} />
      </g>

      <g className="instrument-connectors" fill="none" strokeLinecap="round">
        <path className="instrument-drawable connector-line connector-edge" d="M730 178 L824 114 L866 114" stroke="#63ffb2" strokeWidth="1.4" />
        <path className="instrument-drawable connector-line connector-pivot" d="M480 427 L568 350 L624 350" stroke="#ffb13b" strokeWidth="1.4" />
        <path className="instrument-drawable connector-line connector-grip" d="M204 663 L104 748 L48 748" stroke="#72d6ff" strokeWidth="1.4" />
        <g className="connector-label connector-label-edge"><text x="824" y="102">EDGE</text></g>
        <g className="connector-label connector-label-pivot"><text x="624" y="338">PIVOT</text></g>
        <g className="connector-label connector-label-grip"><text x="48" y="736">GRIP</text></g>
      </g>

      <line className="instrument-axis vertical instrument-drawable" x1="530" y1="95" x2="530" y2="825" stroke="#28483d" strokeWidth="1" strokeDasharray="6 16" />
      <line className="instrument-axis horizontal instrument-drawable" x1="84" y1="540" x2="834" y2="540" stroke="#173d52" strokeWidth="1" strokeDasharray="6 16" />
    </svg>

    <span className="visual-code"><span>THR / OBJECT STUDY / 001</span><i aria-hidden="true" /></span>
    {variant === "macro" && <div className="annotation-set"><span className="annotation a1">01 · WORKING END</span><span className="annotation a2">02 · JOINT</span><span className="annotation a3">03 · HANDLE</span></div>}
  </div>;
}
