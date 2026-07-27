"use client";

import { animate, createScope, createTimeline, stagger } from "animejs";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

const SECTION_SELECTOR = [
  "main > section:not(.v2-hero):not(.frame-evolution-section)",
  ".utility-section",
  ".family-listing-section",
  ".related-object-section",
  ".division-product-preview",
  ".division-family-routes"
].join(",");

const GROUP_SELECTOR = [
  ".catalogue-editorial-grid",
  ".catalogue-listing-grid",
  ".catalogue-division-list",
  ".catalogue-family-grid",
  ".catalogue-object-list",
  ".proof-lines",
  ".resource-stack",
  ".resource-document-grid",
  ".contact-route-grid",
  ".company-proof-list",
  ".inquiry-progress",
  ".legal-index",
  ".search-v2-results",
  ".v3-division-rail",
  ".v3-function-list",
  ".v3-family-shelves",
  ".v3-inquiry-steps",
  ".v3-verification-statuses"
].join(",");

function routeKind(pathname: string) {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/products")) return "catalogue";
  if (pathname.startsWith("/search")) return "search";
  if (pathname.startsWith("/inquiry")) return "inquiry";
  return "utility";
}

function childrenOf(element: Element) {
  return Array.from(element.children).filter(child => child instanceof HTMLElement) as HTMLElement[];
}

function saveDataEnabled() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return Boolean(connection?.saveData);
}

export function MotionShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rootElement = root.current;
    if (!rootElement) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const narrowViewport = window.matchMedia("(max-width: 900px)").matches;
    const constrained = reducedMotion || saveDataEnabled();
    const kind = routeKind(pathname);

    rootElement.dataset.motionRoute = kind;
    rootElement.dataset.motionState = constrained ? "reduced" : "initializing";
    rootElement.dataset.dataSaver = saveDataEnabled() ? "true" : "false";
    rootElement.dataset.pointer = coarsePointer ? "coarse" : "fine";
    document.documentElement.dataset.animeMotion = constrained ? "reduced" : "active";

    if (constrained) {
      rootElement.dataset.motionState = "ready";
      return () => {
        delete rootElement.dataset.motionState;
        delete rootElement.dataset.motionRoute;
        delete rootElement.dataset.dataSaver;
        delete rootElement.dataset.pointer;
        delete document.documentElement.dataset.animeMotion;
      };
    }

    const scope = createScope({
      root,
      defaults: {
        duration: narrowViewport ? 500 : 640,
        ease: "out(4)"
      }
    }).add(() => {
      const animated = new WeakSet<Element>();
      const mutationObservers: MutationObserver[] = [];

      /* The homepage hero, cinematic, division selector, macro scene, and evolution scene
         own their bespoke timelines. MotionShell intentionally does not animate them again. */
      if (kind !== "home") {
        const headerTargets = Array.from(rootElement.querySelectorAll<HTMLElement>(
          ".site-header .brand, .site-header .desktop-nav a, .site-header .header-actions > *"
        ));
        if (headerTargets.length) {
          animate(headerTargets, {
            y: { from: -8 },
            delay: stagger(narrowViewport ? 24 : 34),
            duration: narrowViewport ? 380 : 500,
            ease: "out(5)"
          });
        }

        const routeHeroTargets = Array.from(rootElement.querySelectorAll<HTMLElement>([
          ".catalogue-hub-copy > *",
          ".division-catalogue-hero-grid > div:first-child > *",
          ".family-catalogue-hero-grid > div:first-child > *",
          ".product-examination-summary > *",
          ".search-v2-intro > *",
          ".utility-hero-grid > *"
        ].join(",")));

        if (routeHeroTargets.length) {
          animate(routeHeroTargets, {
            y: { from: narrowViewport ? 12 : 20 },
            delay: stagger(narrowViewport ? 32 : 46),
            duration: narrowViewport ? 480 : 620,
            ease: "out(4)"
          });
        }
      }

      const reveal = (element: HTMLElement, distance = 20) => {
        if (animated.has(element)) return;
        animated.add(element);
        animate(element, {
          y: { from: narrowViewport ? Math.min(distance, 12) : distance },
          duration: narrowViewport ? 460 : 610,
          ease: "out(4)"
        });
      };

      const revealGroup = (element: HTMLElement) => {
        if (animated.has(element)) return;
        animated.add(element);
        const targets = childrenOf(element);
        if (!targets.length) return;
        animate(targets, {
          y: { from: narrowViewport ? 10 : 17 },
          scale: { from: 0.994 },
          delay: stagger(narrowViewport ? 24 : 38),
          duration: narrowViewport ? 440 : 580,
          ease: "out(4)"
        });
      };

      const intersectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting || document.hidden) return;
          const element = entry.target as HTMLElement;
          if (element.matches(GROUP_SELECTOR)) revealGroup(element);
          else reveal(element);
          intersectionObserver.unobserve(element);
        });
      }, { rootMargin: "0px 0px -10%", threshold: 0.08 });

      rootElement.querySelectorAll<HTMLElement>(SECTION_SELECTOR).forEach(element => intersectionObserver.observe(element));
      rootElement.querySelectorAll<HTMLElement>(GROUP_SELECTOR).forEach(element => intersectionObserver.observe(element));

      const menuLayer = rootElement.querySelector<HTMLElement>(".menu-layer");
      if (menuLayer) {
        const observer = new MutationObserver(() => {
          if (menuLayer.dataset.open !== "true" || document.hidden) return;
          const heading = menuLayer.querySelector<HTMLElement>(".menu-heading");
          const links = Array.from(menuLayer.querySelectorAll<HTMLElement>(".mobile-nav-primary a"));
          const utility = menuLayer.querySelector<HTMLElement>(".menu-utility-row");
          const timeline = createTimeline({ defaults: { ease: "out(5)" } });
          if (heading) timeline.add(heading, { y: { from: -6 }, duration: 280 }, 0);
          if (links.length) timeline.add(links, {
            x: { from: narrowViewport ? -10 : -18 },
            y: { from: narrowViewport ? 8 : 14 },
            delay: stagger(narrowViewport ? 36 : 48),
            duration: narrowViewport ? 430 : 560
          }, 40);
          if (utility) timeline.add(utility, { y: { from: 10 }, duration: 380 }, 160);
        });
        observer.observe(menuLayer, { attributes: true, attributeFilter: ["data-open"] });
        mutationObservers.push(observer);
      }

      const searchLayer = rootElement.querySelector<HTMLElement>(".search-command-layer");
      if (searchLayer) {
        const animateSearchResults = () => {
          if (document.hidden) return;
          const results = Array.from(searchLayer.querySelectorAll<HTMLElement>(".search-command-result"));
          if (!results.length) return;
          animate(results, {
            x: { from: 9 },
            delay: stagger(26),
            duration: 330,
            ease: "out(4)"
          });
        };

        const observer = new MutationObserver(mutations => {
          const opened = mutations.some(mutation => mutation.type === "attributes") && searchLayer.dataset.open === "true";
          if (opened && !document.hidden) {
            const dialog = searchLayer.querySelector<HTMLElement>(".search-command-dialog");
            const heading = searchLayer.querySelector<HTMLElement>(".search-command-heading");
            const input = searchLayer.querySelector<HTMLElement>(".search-command-input-wrap");
            const timeline = createTimeline({ defaults: { ease: "out(5)" } });
            if (dialog) timeline.add(dialog, { y: { from: -14 }, scale: { from: 0.99 }, duration: 430 }, 0);
            if (heading) timeline.add(heading, { y: { from: -6 }, duration: 280 }, 60);
            if (input) timeline.add(input, { y: { from: 8 }, duration: 320 }, 100);
            timeline.call(animateSearchResults, 150);
          }
          if (mutations.some(mutation => mutation.type === "childList")) animateSearchResults();
        });
        observer.observe(searchLayer, { attributes: true, attributeFilter: ["data-open"], childList: true, subtree: true });
        mutationObservers.push(observer);
      }

      rootElement.dataset.motionState = "ready";

      return () => {
        intersectionObserver.disconnect();
        mutationObservers.forEach(observer => observer.disconnect());
      };
    });

    return () => {
      scope.revert();
      delete rootElement.dataset.motionState;
      delete rootElement.dataset.motionRoute;
      delete rootElement.dataset.dataSaver;
      delete rootElement.dataset.pointer;
      delete document.documentElement.dataset.animeMotion;
    };
  }, [pathname]);

  return <div ref={root} className="motion-shell">{children}</div>;
}
