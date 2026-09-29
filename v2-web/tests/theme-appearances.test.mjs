import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const layout = read("src/app/layout.tsx");
const css = read("src/app/theme.css");
const selector = read("src/components/theme-selector.tsx");
const inline = layout.match(/const themeInit = `([^`]+)`;/)?.[1];

function initial(appearance, mode, systemLight = false) {
  const root = { dataset: {} };
  runInNewContext(inline, {
    localStorage: { getItem: (key) => key === "sf6dna-theme" ? appearance : mode },
    matchMedia: () => ({ matches: systemLight }),
    document: { documentElement: root },
  });
  return root.dataset;
}

function ratio(a, b) {
  const expand = (hex) => hex.length === 4 ? `#${[...hex.slice(1)].map((c) => c + c).join("")}` : hex;
  const luminance = (hex) => {
    hex = expand(hex);
    const v = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
    const [r, g, blue] = v.map((x) => x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4);
    return 0.2126 * r + 0.7152 * g + 0.0722 * blue;
  };
  const [low, high] = [luminance(a), luminance(b)].sort((x, y) => x - y);
  return (high + 0.05) / (low + 0.05);
}

test("appearance and color mode initialize independently before paint", () => {
  for (const appearance of ["standard", "fighter", "cute-pink", "monochrome"]) {
    for (const mode of ["light", "dark"]) {
      const value = initial(appearance, mode);
      assert.equal(value.appearance, appearance);
      assert.equal(value.theme, mode);
      assert.equal(value.resolvedColorMode, mode);
    }
    assert.equal(initial(appearance, "system", true).theme, "light");
    assert.equal(initial(appearance, "system", false).theme, "dark");
  }
  assert.equal(initial("invalid", "invalid").appearance, "standard");
  assert.equal(initial("invalid", "invalid").theme, "dark");
});

test("all six new palettes meet 4.5:1 for body, muted text, and primary action", () => {
  for (const appearance of ["fighter", "cute-pink", "monochrome"]) {
    for (const mode of ["light", "dark"]) {
      const block = css.match(new RegExp(`:root\\[data-appearance="${appearance}"\\]\\[data-theme="${mode}"\\] \\{([^}]+)\\}`))?.[1];
      assert.ok(block, `${appearance}/${mode} exists`);
      const get = (name) => block.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{3}(?:[0-9a-f]{3})?)`))?.[1];
      for (const [fg, bg] of [["text", "bg"], ["text-muted", "surface"], ["accent-contrast", "accent"]]) {
        assert.ok(ratio(get(fg), get(bg)) >= 4.5, `${appearance}/${mode} ${fg}/${bg}`);
      }
    }
  }
});

test("appearance selector is keyboard accessible, local, and presentation only", () => {
  assert.match(selector, /localStorage\.setItem\(appearanceKey, next\)/);
  assert.match(selector, /<details className="appearance-selector">/);
  assert.match(selector, /type="radio" name="appearance-theme"/);
  assert.match(css, /\.appearance-selector input:focus-visible/);
  assert.doesNotMatch(selector, /fetch\(|supabase|router\.|location\.href/);
  const flags = read("src/lib/release-features.ts");
  for (const flag of ["aiCoach", "training", "publicStrategyContent"]) assert.match(flags, new RegExp(`${flag}: false`));
});
