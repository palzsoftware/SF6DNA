import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/components/character-detail-pilot.module.css", import.meta.url), "utf8");

function rule(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`))?.[1] ?? "";
}

test("overview facts use an intrinsic four-column desktop grid without a scroll container", () => {
  const quickFacts = rule(".quickFacts");
  assert.match(quickFacts, /grid-template-columns:\s*repeat\(4,minmax\(0,1fr\)\)/);
  assert.doesNotMatch(quickFacts, /overflow-x|grid-auto-flow|grid-auto-columns|scroll-snap/);
});

test("overview facts wrap at tablet and mobile widths", () => {
  assert.ok(css.includes("@media (max-width: 1080px) { .quickFacts { grid-template-columns: repeat(2,minmax(0,1fr)); }"));
  assert.ok(css.includes("@media (max-width: 420px) { .pilot"));
  assert.ok(css.includes(".quickFacts { grid-template-columns: 1fr; }"));
});

test("overview fact children and long values can shrink and wrap", () => {
  assert.match(rule(".quickFacts > div"), /min-width:\s*0/);
  assert.match(rule(".quickFacts dd"), /min-width:\s*0/);
  assert.match(rule(".quickFacts dd"), /overflow-wrap:\s*anywhere/);
});
