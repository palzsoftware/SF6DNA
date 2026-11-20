import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";
import { isOfficialTxtPreviewRequest, isWs5LocalCardRequest } from "../src/lib/official-txt-character-page-connection.mjs";

const require = createRequire(import.meta.url);
const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

test("official TXT Preview gate admits access-protected Vercel Preview only", () => {
  assert.equal(isOfficialTxtPreviewRequest({ vercel: "1", vercelEnv: "preview" }), true);
  assert.equal(isOfficialTxtPreviewRequest({ vercel: "1", vercelEnv: "production" }), false);
  assert.equal(isOfficialTxtPreviewRequest({ vercelEnv: "preview" }), false);
  assert.equal(isOfficialTxtPreviewRequest({}), false);
  // The local review gate is unchanged and still refuses Vercel.
  assert.equal(isWs5LocalCardRequest({ nodeEnv: "development", enabled: "1", vercel: "1", vercelEnv: "preview", host: "localhost:3000" }), false);
});

test("page keeps local-only review data and motion media behind the local gate", () => {
  const page = read("src/app/characters/[slug]/page.tsx");
  assert.match(page, /const officialTxtPreview = !review && admission\.vercel === "1" && admission\.vercelEnv === "preview";/);
  assert.match(page, /mediaRegistry: review \? /);
  assert.match(page, /const strategyMoveLinks = review \? /);
  assert.match(page, /const arjun = review && character\.slug === "arjun"/);
  assert.doesNotMatch(page, /officialTxtPreview[^;\n]*getWs5ReviewedStrategyCards/);
  const unified = read("src/components/character-unified-page.tsx");
  assert.match(unified, /const officialTxtPreviewValues = process\.env\.VERCEL === "1" && process\.env\.VERCEL_ENV === "preview";/);
  const list = read("src/app/characters/page.tsx");
  assert.match(list, /if \(process\.env\.VERCEL !== "1" \|\| process\.env\.VERCEL_ENV !== "preview"\) return characters;/);
});

test("English fragments in frame values are shown in Japanese without changing numbers", () => {
  const m = { exports: {} };
  const src = read("src/lib/character-unified-contract.ts");
  const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  new Function("module", "exports", "require", js)(m, m.exports, (name) => (name.startsWith("@/") || name.startsWith(".")) ? {} : require(name));
  const ja = m.exports.japaneseFrameText;
  const cases = [["3 (landing)", "着地後3"], ["LAND(35)", "着地後35"], ["3 Landing", "着地後3"], ["21-until landing", "21-着地まで"],
    ["48 total", "全体48"], ["51/49 total", "全体51/49"], ["KD +33", "ダウン +33"], ["KD Juggle +43", "ダウン（追撃可） +43"],
    ["3,D", "3,ダウン"], ["D / D / D", "ダウン / ダウン / ダウン"], ["variable", "変動"], ["14 (16 on whiff)", "14 （空振り時16）"],
    ["17 fastest", "最速17"], ["far: 98 / middle: 68 / near: 103", "遠: 98 / 中: 68 / 近: 103"], ["-1", "-1"], ["4-6", "4-6"]];
  for (const [input, expected] of cases) assert.equal(ja(input), expected, input);
});
