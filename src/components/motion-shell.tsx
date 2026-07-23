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
      const animated = new WeakSet<Element>();
      const mutationObservers: MutationObserver[] = [];

      const headerTargets = Array.from(rootElement.querySelectorAll<HTMLElement>(
        ".site-header .brand, .site-header .desktop-nav a, .site-header .header-actions > *"
      ));
      if (headerTargets.length) {
        animate(headerTargets, {
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
        const heroObjectParts = rootElement.querySelectorAll<HTMLElement>(".hero-object .instrument-visual > *");
        const heroMarkers = rootElement.querySelectorAll<HTMLElement>(".hero-marker");
        const heroStatement = rootElement.querySelectorAll<HTMLElement>(".hero-statement > p");
        const heroSearchParts = rootElement.querySelectorAll<HTMLElement>(".hero-search > *");
        const heroScrollParts = rootElement.querySelectorAll<HTMLElement>(".hero-scroll-note > *");

        if (heroIndex.length) heroTimeline.add(heroIndex, {
          opacity: { from: 0 }, y: { from: -10 }, delay: stagger(35), duration: 440
        }, 20);
        if (heroWords.length) heroTimeline.add(heroWords, {
          opacity: { from: 0 },
          x: { from: narrowViewport ? -18 : -34 },
          y: { from: narrowViewport ? 16 : 28 },
          delay: stagger(narrowViewport ? 70 : 95),
          duration: narrowViewport ? 650 : 820
        }, 80);
        if (heroObjectParts.length) heroTimeline.add(heroObjectParts, {
          opacity: { from: 0 },
          x: { from: narrowViewport ? 12 : 30 },
          y: { from: narrowViewport ? 18 : 28 },
          scale: { from: narrowViewport ? 0.99 : 0.975 },
          delay: stagger(45),
          duration: narrowViewport ? 690 : 880
        }, 170);
        if (heroMarkers.length && !coarsePointer) heroTimeline.add(heroMarkers, {
          opacity: { from: 0 }, scale: { from: 0.94 }, delay: stagger(60), duration: 480
        }, 430);
        if (heroStatement.length) heroTimeline.add(heroStatement, {
          opacity: { from: 0 }, y: { from: 14 }, delay: stagger(45), duration: 480
        }, 360);
        if (heroSearchParts.length) heroTimeline.add(heroSearchParts, {
          opacity: { from: 0 }, y: { from: 15 }, delay: stagger(40), duration: 540
        }, 430);
        if (heroScrollParts.length && !narrowViewport) heroTimeline.add(heroScrollParts, {
          opacity: { from: 0 }, y: { from: 8 }, delay: stagger(35), duration: 420
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
            y: { from: narrowViewport ? 14 : 22 },
            delay: stagger(narrowViewport ? 36 : 52),
            duration: narrowViewport ? 520 : 680,
            ease: "out(4)"
          });
        }
      }

      const reveal = (element: HTMLElement, distance = 22) => {
        if (animated.has(element)) return;
        animated.add(element);
        animate(element, {
          y: { from: narrowViewport ? Math.min(distance, 14) : distance },
          duration: narrowViewport ? 500 : 660,
          ease: "out(4)"
        });
      };

      const revealGroup = (element: HTMLElement) => {
        if (animated.has(element)) return;
        animated.add(element);
        const targets = childrenOf(element);
        if (!targets.length) return;
        animate(targets, {
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
        const observer = new MutationObserver(() => {
          if (menuLayer.dataset.open !== "true") return;
          const heading = menuLayer.querySelector<HTMLElement>(".menu-heading");
          const links = Array.from(menuLayer.querySelectorAll<HTMLElement>(".mobile-nav-primary a"));
          const utility = menuLayer.querySelector<HTMLElement>(".menu-utility-row");
          const timeline = createTimeline({ defaults: { ease: "out(5)" } });
          if (heading) timeline.add(heading, { y: { from: -8 }, duration: 300 }, 0);
          if (links.length) timeline.add(links, {
            x: { from: narrowViewport ? -12 : -22 },
            y: { from: narrowViewport ? 10 : 18 },
            delay: stagger(narrowViewport ? 42 : 58),
            duration: narrowViewport ? 470 : 620
          }, 40);
          if (utility) timeline.add(utility, { y: { from: 12 }, duration: 420 }, 180);
        });
        observer.observe(menuLayer, { attributes: true, attributeFilter: ["data-open"] });
        mutationObservers.push(observer);
      }

      const searchLayer = rootElement.querySelector<HTMLElement>(".search-command-layer");
      if (searchLayer) {
        const animateSearchResults = () => {
          const results = Array.from(searchLayer.querySelectorAll<HTMLElement>(".search-command-result"));
          if (!results.length) return;
          animate(results, {
            x: { from: 12 },
            delay: stagger(32),
            duration: 360,
            ease: "out(4)"
          });
        };

        const observer = new MutationObserver(mutations => {
          const opened = mutations.some(mutation => mutation.type === "attributes") && searchLayer.dataset.open === "true";
          if (opened) {
            const dialog = searchLayer.querySelector<HTMLElement>(".search-command-dialog");
            const heading = searchLayer.querySelector<HTMLElement>(".search-command-heading");
            const input = searchLayer.querySelector<HTMLElement>(".search-command-input-wrap");
            const timeline = createTimeline({ defaults: { ease: "out(5)" } });
            if (dialog) timeline.add(dialog, { y: { from: -18 }, scale: { from: 0.985 }, duration: 480 }, 0);
            if (heading) timeline.add(heading, { y: { from: -8 }, duration: 320 }, 70);
            if (input) timeline.add(input, { y: { from: 10 }, duration: 360 }, 120);
            timeline.call(animateSearchResults, 170);
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
      delete document.documentElement.dataset.animeMotion;
    };
  }, [pathname]);

  return <div ref={root} className="motion-shell">{children}</div>;
}
