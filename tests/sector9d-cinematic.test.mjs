import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const timing = readFileSync("src/lib/evolution-frames.ts", "utf8");
const cinematic = readFileSync("src/components/cinematic-entry.tsx", "utf8");
const sequence = readFileSync("src/components/frame-evolution-scene.tsx", "utf8");
const hero = readFileSync("src/components/hero-experience.tsx", "utf8");
const page = readFileSync("src/app/page.tsx", "utf8");
const styles = readFileSync("src/app/v2-sector9d.css", "utf8");
const prepare = readFileSync("scripts/prepare-cinematic-assets.mjs", "utf8");

const combined = `${timing}\n${cinematic}\n${sequence}\n${hero}\n${page}\n${styles}\n${prepare}`;

test("frame timing uses the analyzed visual boundaries", () => {
  assert.match(timing, /endFrame: 56/);
  assert.match(timing, /startFrame: 57/);
  assert.match(timing, /endFrame: 129/);
  assert.match(timing, /startFrame: 130/);
  assert.match(timing, /endFrame: 197/);
  assert.match(timing, /startFrame: 198/);
  assert.match(timing, /startFrame: 248/);
  assert.match(timing, /endFrame: 260/);
});

test("opening cinematic uses native scroll rather than scroll locking", () => {
  assert.match(cinematic, /addEventListener\("scroll"/);
  assert.match(cinematic, /video/);
  assert.match(cinematic, /SCROLL TO ENTER/);
  assert.doesNotMatch(cinematic, /preventDefault\(\)|overflow\s*=\s*["']hidden|wheel/);
});

test("normal hero uses the THROHI logo instead of the scissors placeholder", () => {
  assert.match(hero, /hero-brand-stage/);
  assert.match(hero, /\/logo\.webp/);
  assert.doesNotMatch(hero, /InstrumentVisual/);
  assert.match(page, /CinematicEntry/);
  assert.match(page, /FrameEvolutionScene/);
  assert.doesNotMatch(page, /ScissorsEvolutionScene/);
});

test("evolution renderer uses one canvas and one sprite image", () => {
  assert.match(sequence, /canvasRef/);
  assert.match(sequence, /drawImage/);
  assert.match(sequence, /spriteCellForFrame/);
  assert.match(sequence, /requestAnimationFrame/);
  assert.match(sequence, /imageRef/);
  assert.doesNotMatch(sequence, /260\s*<img|Array\.from\(\{ length: 260/);
});

test("text chapter state follows the rendered frame", () => {
  assert.match(sequence, /chapterIndexForFrame\(frame\)/);
  assert.match(sequence, /renderedFrame\.current/);
  assert.match(sequence, /setActiveChapter/);
});

test("media perimeter fades without blurring the instrument", () => {
  assert.match(styles, /mask-image:radial-gradient/);
  assert.match(styles, /frame-evolution-feather/);
  assert.match(styles, /cinematic-entry-feather/);
  assert.doesNotMatch(styles, /(?:^|[;{\s])filter:\s*blur\(/m);
});

test("build pipeline reconstructs static media outside the JavaScript bundle", () => {
  assert.match(prepare, /unzipSync/);
  assert.match(prepare, /public.*media.*sector9d/s);
  assert.match(prepare, /intro\.mp4/);
  assert.match(prepare, /evolution-sprite\.webp/);
});

test("Sector 9D retains reduced-motion and avoids prohibited spectacle", () => {
  assert.match(styles, /prefers-reduced-motion:reduce/);
  assert.doesNotMatch(combined, /particle|cursor trail|magnetic|webgl|three\.js|liquid distortion/i);
  assert.doesNotMatch(combined, /spring\(|elastic|bounce/i);
});
