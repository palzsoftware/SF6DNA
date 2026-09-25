import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/coach-query-terms.ts", import.meta.url), "utf8");
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } }).outputText;
const { planCoachSearch, isTopicResultMatch } = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);

test("natural questions extract issue terms without including the whole sentence", () => {
  assert.deepEqual(planCoachSearch("JPで対空が苦手です。どう練習すれば？").terms, ["対空"]);
  assert.deepEqual(planCoachSearch("ＪＰでＤＩ返しができない").terms, ["ドライブインパクト", "DI"]);
  assert.deepEqual(planCoachSearch("画面端から逃げられない").terms, ["画面端"]);
  assert.deepEqual(planCoachSearch("サガットの弾に近づけない").terms, ["飛び道具", "弾", "近づけ"]);
  assert.deepEqual(planCoachSearch("負けた理由が分からない").terms, ["負け"]);
});

test("DI matches a standalone acronym, not Edition or player names", () => {
  assert.deepEqual(planCoachSearch("Editionで練習").topics, []);
  assert.equal(isTopicResultMatch("2026 Edition Guide", null, "DI"), false);
  assert.equal(isTopicResultMatch("DI対策", null, "DI"), true);
});

test("unknown query retains ordinary lookup and empty query yields no search terms", () => {
  assert.deepEqual(planCoachSearch("JP").terms, ["jp"]);
  assert.deepEqual(planCoachSearch("").terms, [""]);
});

test("route keeps hold when only unverified profile or video candidates exist", () => {
  const route = readFileSync(new URL("../src/app/api/coach/retrieve/route.ts", import.meta.url), "utf8");
  assert.match(route, /planCoachSearch\(retrievalQuery\)/);
  assert.match(route, /item.kind === "VERIFIED_GAME_FACT"/);
  assert.match(route, /!ready/);
});
