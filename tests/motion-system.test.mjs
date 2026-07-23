import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const packageManifest = JSON.parse(readFileSync("package.json", "utf8"));
const motionShell = readFileSync("src/components/motion-shell.tsx", "utf8");
const motionCss = readFileSync("src/app/v2-sector9b-motion.css", "utf8");

test("Anime.js is pinned to the approved motion-engine version", () => {
  assert.equal(packageManifest.dependencies.animejs, "4.5.0");
});

test("motion is scoped, route-aware, and reverted during cleanup", () => {
  assert.match(motionShell, /createScope/);
  assert.match(motionShell, /usePathname/);
  assert.match(motionShell, /scope\.revert\(\)/);
  assert.match(motionShell, /IntersectionObserver/);
  assert.match(motionShell, /MutationObserver/);
});

test("reduced motion bypasses Anime.js timelines and exposes static content", () => {
  assert.match(motionShell, /prefers-reduced-motion: reduce/);
  assert.match(motionShell, /if \(reducedMotion\)/);
  assert.match(motionCss, /data-anime-motion="reduced"/);
  assert.match(motionCss, /opacity:1!important/);
  assert.match(motionCss, /transform:none!important/);
});

test("the foundational phase keeps special effects out of the architecture", () => {
  assert.doesNotMatch(motionShell, /particle|webgl|canvas|cursor-trail|magnetic/i);
});
