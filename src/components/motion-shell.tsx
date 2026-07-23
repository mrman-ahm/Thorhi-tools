"use client";

import { animate, createScope, createTimeline, stagger } from "animejs";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

const SECTION_SELECTOR = [
  "main > section:not(.v2-hero)",
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
  ".search-v2-results"
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

export function MotionShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rootElement = root.current;
    if (!rootElement) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const narrowViewport = window.matchMedia("(max-width: 900px)").matches;
    const kind = routeKind(pathname);

    rootElement.dataset.motionRoute = kind;
    rootElement.dataset.motionState = reducedMotion ? "reduced" : "initializing";
    document.documentElement.dataset.animeMotion = reducedMotion ? "reduced" : "active";

    if (reducedMotion) {
      rootElement.dataset.motionState = "ready";
      return () => {
        delete document.documentElement.dataset.animeMotion;
      };
    }

    const scope = createScope({
      root,
      defaults: {
        duration: narrowViewport ? 520 : 680,
        ease: "out(4)"
      }
    }).add(() => {
      const observed = new WeakSet<Element>();
      const observers: MutationObserver[] = [];

      const headerTargets = Array.from(rootElement.querySelectorAll<HTMLElement>(
        ".site-header .brand, .site-header .desktop-nav a, .site-header .header-actions > *"
      ));
      if (headerTargets.length) {
        animate(headerTargets, {
          opacity: { from: 0 },
          y: { from: -10 },
          delay: stagger(narrowViewport ? 28 : 42),
          duration: narrowViewport ? 420 : 560,
          ease: "out(5)"
        });
      }

      if (kind === "home") {
        const heroTimeline = createTimeline({ defaults: { ease: "out(5)" } });
        const heroIndex = rootElement.querySelectorAll<HTMLElement>(".hero-index > span");
        const heroWords = rootElement.querySelectorAll<HTMLElement>(".hero-type > span");
        const heroObject = rootElement.querySelector<HTMLElement>(".hero-object");
        const heroMarkers = rootElement.querySelectorAll<HTMLElement>(".hero-marker");
        const heroStatement = rootElement.querySelectorAll<HTMLElement>(".hero-statement > p");
        const heroSearch = rootElement.querySelector<HTMLElement>(".hero-search");
        const heroScroll = rootElement.querySelector<HTMLElement>(".hero-scroll-note");

        if (heroIndex.length) heroTimeline.add(heroIndex, {
          opacity: { from: 0 },
          y: { from: -10 },
          delay: stagger(35),
          duration: 440
        }, 20);
        if (heroWords.length) heroTimeline.add(heroWords, {
          opacity: { from: 0 },
          x: { from: narrowViewport ? -18 : -34 },
          y: { from: narrowViewport ? 16 : 28 },
          delay: stagger(narrowViewport ? 70 : 95),
          duration: narrowViewport ? 650 : 820
        }, 80);
        if (heroObject) heroTimeline.add(heroObject, {
          opacity: { from: 0 },
          x: { from: narrowViewport ? 16 : 46 },
          y: { from: narrowViewport ? 24 : 34 },
          rotate: { from: narrowViewport ? 0.4 : 1.2 },
          scale: { from: narrowViewport ? 0.985 : 0.965 },
          duration: narrowViewport ? 720 : 930
        }, 170);
        if (heroMarkers.length && !coarsePointer) heroTimeline.add(heroMarkers, {
          opacity: { from: 0 },
          scale: { from: 0.94 },
          delay: stagger(60),
          duration: 480
        }, 430);
        if (heroStatement.length) heroTimeline.add(heroStatement, {
          opacity: { from: 0 },
          y: { from: 14 },
          delay: stagger(45),
          duration: 480
        }, 360);
        if (heroSearch) heroTimeline.add(heroSearch, {
          opacity: { from: 0 },
          y: { from: 18 },
          scale: { from: 0.992 },
          duration: 590
        }, 430);
        if (heroScroll && !narrowViewport) heroTimeline.add(heroScroll, {
          opacity: { from: 0 },
          y: { from: 10 },
          duration: 440
        }, 610);
      } else {
        const routeHeroTargets = Array.from(rootElement.querySelectorAll<HTMLElement>([
          ".catalogue-hub-copy > *",
          ".division-catalogue-copy > *",
          ".family-catalogue-copy > *",
          ".product-examination-summary > *",
          ".search-v2-hero > .container > *",
          ".utility-hero-grid > *"
        ].join(",")));

        if (routeHeroTargets.length) {
          animate(routeHeroTargets, {
            opacity: { from: 0 },
            y: { from: narrowViewport ? 14 : 22 },
            delay: stagger(narrowViewport ? 36 : 52),
            duration: narrowViewport ? 520 : 680,
            ease: "out(4)"
          });
        }
      }

      const reveal = (element: HTMLElement, distance = 22) => {
        if (observed.has(element)) return;
        observed.add(element);
        animate(element, {
          opacity: { from: 0.72 },
          y: { from: narrowViewport ? Math.min(distance, 14) : distance },
          duration: narrowViewport ? 500 : 660,
          ease: "out(4)"
        });
      };

      const revealGroup = (element: HTMLElement) => {
        if (observed.has(element)) return;
        observed.add(element);
        const targets = childrenOf(element);
        if (!targets.length) return;
        animate(targets, {
          opacity: { from: 0 },
          y: { from: narrowViewport ? 12 : 20 },
          scale: { from: 0.992 },
          delay: stagger(narrowViewport ? 28 : 46),
          duration: narrowViewport ? 470 : 620,
          ease: "out(4)"
        });
      };

      const intersectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          if (element.matches(GROUP_SELECTOR)) revealGroup(element);
          else reveal(element);
          intersectionObserver.unobserve(element);
        });
      }, { rootMargin: "0px 0px -12%", threshold: 0.08 });

      rootElement.querySelectorAll<HTMLElement>(SECTION_SELECTOR).forEach(element => intersectionObserver.observe(element));
      rootElement.querySelectorAll<HTMLElement>(GROUP_SELECTOR).forEach(element => intersectionObserver.observe(element));

      const menuLayer = rootElement.querySelector<HTMLElement>(".menu-layer");
      if (menuLayer) {
        const menuObserver = new MutationObserver(() => {
          if (menuLayer.dataset.open !== "true") return;
          const heading = menuLayer.querySelector<HTMLElement>(".menu-heading");
          const links = Array.from(menuLayer.querySelectorAll<HTMLElement>(".mobile-nav-primary a"));
          const utility = menuLayer.querySelector<HTMLElement>(".menu-utility-row");
          const timeline = createTimeline({ defaults: { ease: "out(5)" } });
          if (heading) timeline.add(heading, { opacity: { from: 0 }, y: { from: -8 }, duration: 300 }, 0);
          if (links.length) timeline.add(links, {
            opacity: { from: 0 },
            x: { from: narrowViewport ? -12 : -22 },
            y: { from: narrowViewport ? 10 : 18 },
            delay: stagger(narrowViewport ? 42 : 58),
            duration: narrowViewport ? 470 : 620
          }, 40);
          if (utility) timeline.add(utility, { opacity: { from: 0 }, y: { from: 12 }, duration: 420 }, 180);
        });
        menuObserver.observe(menuLayer, { attributes: true, attributeFilter: ["data-open"] });
        observers.push(menuObserver);
      }

      const searchLayer = document.querySelector<HTMLElement>(".search-command-layer");
      if (searchLayer) {
        const animateSearchResults = () => {
          const results = Array.from(searchLayer.querySelectorAll<HTMLElement>(".search-command-result"));
          if (!results.length) return;
          animate(results, {
            opacity: { from: 0 },
            x: { from: 12 },
            delay: stagger(32),
            duration: 360,
            ease: "out(4)"
          });
        };

        const searchObserver = new MutationObserver(mutations => {
          const opened = mutations.some(mutation => mutation.type === "attributes") && searchLayer.dataset.open === "true";
          if (opened) {
            const dialog = searchLayer.querySelector<HTMLElement>(".search-command-dialog");
            const heading = searchLayer.querySelector<HTMLElement>(".search-command-heading");
            const input = searchLayer.querySelector<HTMLElement>(".search-command-input-wrap");
            const timeline = createTimeline({ defaults: { ease: "out(5)" } });
            if (dialog) timeline.add(dialog, { opacity: { from: 0 }, y: { from: -18 }, scale: { from: 0.985 }, duration: 480 }, 0);
            if (heading) timeline.add(heading, { opacity: { from: 0 }, y: { from: -8 }, duration: 320 }, 70);
            if (input) timeline.add(input, { opacity: { from: 0 }, y: { from: 10 }, duration: 360 }, 120);
            timeline.call(animateSearchResults, 170);
          }
          if (mutations.some(mutation => mutation.type === "childList")) animateSearchResults();
        });
        searchObserver.observe(searchLayer, { attributes: true, attributeFilter: ["data-open"], childList: true, subtree: true });
        observers.push(searchObserver);
      }

      const divisionScene = rootElement.querySelector<HTMLElement>(".division-discovery");
      if (divisionScene) {
        const divisionObserver = new MutationObserver(() => {
          const targets = Array.from(divisionScene.querySelectorAll<HTMLElement>(
            ".division-stage-index > *, .division-stage-object > *, .division-stage-copy > *"
          ));
          if (!targets.length) return;
          animate(targets, {
            opacity: { from: 0.25 },
            x: { from: 8 },
            delay: stagger(24),
            duration: 360,
            ease: "out(4)"
          });
        });
        divisionObserver.observe(divisionScene, { attributes: true, attributeFilter: ["data-active-index"] });
        observers.push(divisionObserver);
      }

      const macroScene = rootElement.querySelector<HTMLElement>(".macro-inspection-scene");
      if (macroScene) {
        const macroObserver = new MutationObserver(() => {
          const readout = Array.from(macroScene.querySelectorAll<HTMLElement>(".inspection-readout > *"));
          animate(readout, {
            opacity: { from: 0.35 },
            x: { from: 10 },
            delay: stagger(28),
            duration: 360,
            ease: "out(4)"
          });
        });
        macroObserver.observe(macroScene, { attributes: true, attributeFilter: ["data-active-region"] });
        observers.push(macroObserver);
      }

      const evolutionScene = rootElement.querySelector<HTMLElement>(".evolution-experience");
      if (evolutionScene) {
        const evolutionObserver = new MutationObserver(() => {
          const activeLayer = evolutionScene.querySelector<HTMLElement>(".evolution-layer[data-active='true']");
          const activeIndex = Array.from(evolutionScene.querySelectorAll<HTMLElement>(".evolution-stage-index > *"));
          if (activeLayer) animate(activeLayer, {
            opacity: { from: 0.2 },
            scale: { from: 0.97 },
            rotate: { from: -0.6 },
            duration: 540,
            ease: "out(5)"
          });
          if (activeIndex.length) animate(activeIndex, {
            opacity: { from: 0.25 },
            y: { from: 8 },
            delay: stagger(35),
            duration: 360
          });
        });
        evolutionObserver.observe(evolutionScene, { attributes: true, attributeFilter: ["data-active-chapter"] });
        observers.push(evolutionObserver);
      }

      rootElement.dataset.motionState = "ready";

      return () => {
        intersectionObserver.disconnect();
        observers.forEach(observer => observer.disconnect());
      };
    });

    return () => {
      scope.revert();
      delete rootElement.dataset.motionState;
      delete rootElement.dataset.motionRoute;
      delete document.documentElement.dataset.animeMotion;
    };
  }, [pathname]);

  return <div ref={root} className="motion-shell">{children}</div>;
}
