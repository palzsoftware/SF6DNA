import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/components/character-detail-pilot.module.css", import.meta.url), "utf8");

function rule(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`))?.[1] ?? "";
}

test("overview facts use a readable two-column desktop grid without a scroll container", () => {
  const quickFacts = rule(".quickFacts");
  assert.match(quickFacts, /grid-template-columns:\s*repeat\(2,minmax\(0,1fr\)\)/);
  assert.doesNotMatch(quickFacts, /overflow-x|grid-auto-flow|grid-auto-columns|scroll-snap/);
});

test("overview stacks at tablet width and facts wrap at mobile width", () => {
  assert.ok(css.includes("@media (max-width: 1080px) { .overview { grid-template-columns: 1fr; }"));
  assert.ok(css.includes("@media (max-width: 420px) { .pilot"));
  assert.match(css, /@media \(max-width: 420px\)[\s\S]*?\.quickFacts \{ grid-template-columns: 1fr;/);
});

test("hero title and fact cards use relaxed readability contracts", () => {
  assert.match(rule(".overviewLead h2"), /font-size:\s*clamp\(1\.5rem,2\.45vw,2\.3rem\)/);
  assert.match(rule(".overviewLead h2"), /line-height:\s*1\.48/);
  assert.match(rule(".overviewLead h2"), /text-wrap:\s*balance/);
  assert.match(rule(".quickFacts > div"), /padding:\s*18px/);
  assert.match(rule(".quickFacts dd"), /line-height:\s*1\.72/);
});

test("375px keeps the hero stacked and renders summary facts in one column", () => {
  assert.match(css, /@media \(max-width: 420px\)[\s\S]*?\.quickFacts \{ grid-template-columns: 1fr;/);
  assert.doesNotMatch(rule(".quickFacts"), /minmax\(150px|overflow-x|grid-auto-flow/);
});

test("768px stacks the hero while retaining the readable two-column summary", () => {
  assert.ok(css.includes("@media (max-width: 1080px) { .overview { grid-template-columns: 1fr; }"));
  assert.match(rule(".quickFacts"), /grid-template-columns:\s*repeat\(2,minmax\(0,1fr\)\)/);
});

test("1366px and 1920px use the bounded desktop hero and two-column summary", () => {
  assert.match(rule(".overview"), /grid-template-columns:\s*minmax\(0,1\.25fr\) minmax\(380px,\.75fr\)/);
  assert.match(rule(".overview"), /gap:\s*clamp\(32px,5vw,72px\)/);
  assert.match(rule(".overviewLead h2"), /max-width:\s*22ch/);
});

test("overview fact children and long values can shrink and wrap", () => {
  assert.match(rule(".quickFacts > div"), /min-width:\s*0/);
  assert.match(rule(".quickFacts dd"), /min-width:\s*0/);
  assert.match(rule(".quickFacts dd"), /overflow-wrap:\s*anywhere/);
});
