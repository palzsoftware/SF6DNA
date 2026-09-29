import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const layout = read("src/app/layout.tsx");
const css = read("src/app/theme.css");
const selector = read("src/components/theme-selector.tsx");
const inline = layout.match(/const themeInit = `([^`]+)`;/)?.[1];

function firstPaint(stored, light = false, unavailable = false) {
  const root = { dataset: {} };
  runInNewContext(inline, {
    localStorage: { getItem: () => { if (unavailable) throw new Error("blocked"); return stored; } },
    matchMedia: () => ({ matches: light }),
    document: { documentElement: root },
  });
  return root.dataset;
}

test("first paint respects saved mode, system preference, and safe dark fallback", () => {
  assert.ok(inline);
  assert.equal(firstPaint(null, true).theme, "dark");
  assert.equal(firstPaint("light").theme, "light");
  assert.equal(firstPaint("dark", true).theme, "dark");
  assert.equal(firstPaint("system", true).theme, "light");
  assert.equal(firstPaint("system", true).colorMode, "system");
  assert.equal(firstPaint("system", false).theme, "dark");
  assert.equal(firstPaint("invalid", true).theme, "dark");
  assert.equal(firstPaint("light", true, true).theme, "dark");
});

test("mode switch persists locally and only system mode follows OS changes", () => {
  assert.match(selector, /localStorage\.setItem\(storageKey, next\)/);
  assert.match(selector, /if \(currentMode\(\) === "system"\) applyMode\("system"\)/);
  assert.match(selector, /type ColorMode = "system" \| "light" \| "dark"/);
  assert.match(selector, /type="radio" name="color-mode"/);
  assert.match(css, /input:focus-visible \+ span/);
});

test("light palette has readable text and explicit component surfaces", () => {
  assert.match(css, /:root\[data-theme="light"\] \{[\s\S]*?color-scheme: light;/);
  for (const token of ["bg", "surface", "surface-hover", "border", "text", "text-muted", "accent", "accent-contrast", "focus-ring", "error", "success", "input-bg"]) {
    assert.match(css, new RegExp(`--${token}:`));
  }
  assert.match(css, /\.site-header \{ background: var\(--shell-header-bg\)/);
  assert.match(css, /\.home-hero,.*\.character-hero/);
});

test("theme remains presentation only with release gates unchanged", () => {
  const flags = read("src/lib/release-features.ts");
  for (const flag of ["aiCoach", "training", "publicStrategyContent"]) {
    assert.match(flags, new RegExp(`${flag}: false`));
  }
  assert.doesNotMatch(selector, /fetch\(|supabase|document\.cookie/);
});
