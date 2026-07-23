"use client";

import { createScope, createTimeline, stagger, svg } from "animejs";
import { useEffect, useRef } from "react";
import { ProductImage } from "@/components/catalogue-ui";
import type { Product } from "@/lib/catalogue";

export function ProductExaminationMotion({ product }: { product: Product }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.dataset.specialMotion = "reduced";
      return;
    }

    const scope = createScope({ root: rootRef }).add(() => {
      const geometry = Array.from(root.querySelectorAll<SVGGeometryElement>(".product-measurement-drawable"));
      const drawables = geometry.flatMap(element => svg.createDrawable(element));
      const sweep = root.querySelector<HTMLElement>(".product-inspection-sweep");
      const code = root.querySelector<HTMLElement>(".product-stage-engraving span");
      const codeScan = root.querySelector<HTMLElement>(".product-stage-engraving i");
      const labels = Array.from(root.querySelectorAll<HTMLElement>(".product-measurement-label"));
      const timeline = createTimeline({ defaults: { ease: "out(5)" } });

      if (drawables.length) timeline.add(drawables, {
        draw: ["0 0", "0 1"],
        delay: stagger(28),
        duration: 720,
        ease: "inOutSine"
      }, 80);
      if (sweep) timeline.add(sweep, {
        x: { from: "-135%", to: "145%" },
        opacity: [0, .68, 0],
        duration: 980,
        ease: "inOutSine"
      }, 160);
      if (labels.length) timeline.add(labels, {
        clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
        delay: stagger(70),
        duration: 420,
        ease: "inOutSine"
      }, 520);
      if (code) timeline.add(code, {
        clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
        duration: 620,
        ease: "inOutSine"
      }, 620);
      if (codeScan) timeline.add(codeScan, {
        scaleX: { from: 0, to: 1 },
        transformOrigin: "left center",
        duration: 360,
        ease: "inOutSine"
      }, 620).add(codeScan, {
        x: { from: "0%", to: "112%" },
        opacity: { from: .72, to: 0 },
        duration: 480,
        ease: "inOutSine"
      }, 880);

      root.dataset.specialMotion = "ready";
    });

    return () => scope.revert();
  }, []);

  return <div ref={rootRef} className="product-examination-motion">
    <ProductImage product={product} />
    <div className="product-inspection-sweep" aria-hidden="true" />
    <svg className="product-measurement-overlay" viewBox="0 0 1000 780" aria-hidden="true" focusable="false">
      <rect className="product-measurement-drawable" x="72" y="70" width="856" height="632" rx="18" />
      <path className="product-measurement-drawable" d="M118 128 H278 M118 128 V278" />
      <path className="product-measurement-drawable" d="M882 128 H722 M882 128 V278" />
      <path className="product-measurement-drawable" d="M118 646 H278 M118 646 V496" />
      <path className="product-measurement-drawable" d="M882 646 H722 M882 646 V496" />
      <path className="product-measurement-drawable" d="M500 82 V146 M500 634 V698" />
      <path className="product-measurement-drawable" d="M84 388 H148 M852 388 H916" />
    </svg>
    <span className="product-measurement-label label-working-end" aria-hidden="true">WORKING END</span>
    <span className="product-measurement-label label-pivot" aria-hidden="true">PIVOT REGION</span>
    <span className="product-measurement-label label-grip" aria-hidden="true">GRIP REGION</span>
    <span className="product-stage-engraving" aria-hidden="true"><span>{product.code}</span><i /></span>
  </div>;
}
