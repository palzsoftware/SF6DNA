import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const base = read("src/app/globals.css");
const shell = read("src/app/product-refresh.css");
const mobile = read("src/app/mobile-refresh.css");
const flags = read("src/lib/release-features.ts");

test("shared controls use stable semantic tokens without changing the dark default", () => {
  assert.match(base, /color-scheme:\s*dark/);
  assert.match(base, /--focus-ring:\s*var\(--accent\)/);
  assert.match(base, /focus-visible \{ outline: 3px solid var\(--focus-ring\)/);
  assert.match(shell, /--shell-header-bg:\s*rgba\(9, 13, 18, \.82\)/);
  assert.match(shell, /background:\s*var\(--shell-header-bg\)/);
  assert.match(mobile, /background:\s*var\(--shell-mobile-bg\)/);
});

test("theme foundation preserves the release visibility boundary", () => {
  for (const flag of ["aiCoach", "training", "publicStrategyContent"]) {
    assert.match(flags, new RegExp(`${flag}: false`));
  }
});
