import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/sf6-command-tokens.ts", import.meta.url), "utf8");
const mod = { exports: {} };
new Function("module", "exports", ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText)(mod, mod.exports);
const { tokenizeSf6Command, sf6CommandSearchTerms } = mod.exports;
const visible = value => tokenizeSf6Command(value).filter(token => !/^\s+$/.test(token.raw) && token.kind !== "separator").map(token => token.display);

test("Ingrid SA2-style double reverse-quarter-circle never exposes raw numpad", () => {
  for (const raw of ["214214P", "214214 + P"]) {
    const out = visible(raw);
    assert.ok(out.includes("↓↙← ×2"), raw);
    assert.ok(out.includes("P"), raw);
    assert.doesNotMatch(sf6CommandSearchTerms(raw)[1] ?? "", /214214/);
  }
});

test("representative motion families render as arrows or readable motion labels", () => {
  const cases = {
    "236LP": ["↓↘→", "弱P"],
    "623HP": ["→↓↘", "強P"],
    "236236P": ["↓↘→ ×2", "P"],
    "[4]6P": ["←溜め→", "P"],
    "[2]8K": ["↓溜め↑", "K"],
    "360P": ["1回転", "P"],
    "720K": ["2回転", "K"],
  };
  for (const [raw, expected] of Object.entries(cases)) for (const token of expected) assert.ok(visible(raw).includes(token), `${raw}: ${token}`);
});

test("Classic strengths, Modern buttons, drive and SA are explicit semantic tokens", () => {
  const cases = { LP: "弱P", MP: "中P", HP: "強P", LK: "弱K", MK: "中K", HK: "強K", SP: "SP", ASSIST: "Assist", Assist: "Assist", DI: "DI", DR: "DR", CDR: "CDR", SA: "SA", SA1: "SA1", SA2: "SA2", SA3: "SA3", CA: "CA", OD: "OD" };
  for (const [raw, expected] of Object.entries(cases)) assert.deepEqual(visible(raw), [expected], raw);
});

test("generic P/K remain generic and unknown numeric notation becomes pending instead of guessed", () => {
  assert.deepEqual(visible("P"), ["P"]);
  assert.deepEqual(visible("K"), ["K"]);
  assert.deepEqual(visible("123P"), ["入力確認中", "P"]);
});

test("ordinary Latin prose is not silently converted into control tokens", () => {
  for (const raw of ["Spin", "ASSISTANT", "DIRECTION", "SPARK"]) assert.ok(tokenizeSf6Command(raw).every(token => token.kind === "text"), raw);
});

test("component uses SF6DNA semantic token roles with accessible labels and no raw-source attribute", () => {
  const component = readFileSync(new URL("../src/components/sf6-command-input.tsx", import.meta.url), "utf8");
  const css = readFileSync(new URL("../src/components/sf6-command-input.module.css", import.meta.url), "utf8");
  assert.match(component, /data-token-kind=\{token\.kind\}/);
  assert.match(component, /role="img" aria-label=\{tokens\.map/);
  assert.match(component, /data-token-kind=\{token\.kind\} aria-hidden="true"/);
  assert.doesNotMatch(component, /aria-label=\{token\.label\}/);
  assert.doesNotMatch(component, /data-raw|title=\{.*raw/);
  for (const kind of ["direction", "motion", "button", "system", "super"]) assert.match(css, new RegExp(`data-token-kind="${kind}"`));
});

test("character card passes raw command string into semantic renderer so unknown numeric grammar can fall back", () => {
  const pilot = readFileSync(new URL("../src/components/character-detail-pilot.tsx", import.meta.url), "utf8");
  assert.match(pilot, /return \{ scheme, input: input \?\? "" \};/);
  assert.doesNotMatch(pilot, /input:\s*input\s*\?\s*formatMoveCommand\(/);
  assert.match(pilot, /<Sf6CommandInput value=\{label\.input\} \/>/);
});
