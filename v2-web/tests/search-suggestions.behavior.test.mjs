import assert from "node:assert/strict";
import test from "node:test";
import { suggestSearchTerms } from "../src/lib/search-suggestions.ts";
import { readFileSync } from "node:fs";

const candidates = [
  { label: "リュウ", value: "リュウ", type: "キャラクター", aliases: ["Ryu", "りゅう"] },
  { label: "JP", value: "JP", type: "キャラクター", aliases: ["ジェイピー", "じぇいぴー"] },
  { label: "ときど", value: "ときど", type: "プレイヤー", aliases: ["Tokido"] },
  { label: "公式ガイド", value: "official_guide", type: "カテゴリ", aliases: ["official guide"] },
];

test("Ryu and JP kana variants produce clickable candidates without replacing the query", () => {
  assert.equal(suggestSearchTerms("りゅう", candidates)[0]?.value, "リュウ");
  assert.equal(suggestSearchTerms("ジェイピー", candidates)[0]?.value, "JP");
  assert.equal(suggestSearchTerms("じぇいぴー", candidates)[0]?.value, "JP");
});

test("case, width, player handles and category aliases normalize safely", () => {
  assert.equal(suggestSearchTerms("ｒｙｕ", candidates)[0]?.value, "リュウ");
  assert.equal(suggestSearchTerms("TOKIDO", candidates)[0]?.value, "ときど");
  assert.equal(suggestSearchTerms("official-guide", candidates)[0]?.value, "official_guide");
});

test("exact labels, one-character queries and unrelated words are suppressed", () => {
  assert.deepEqual(suggestSearchTerms("リュウ", candidates), []);
  assert.deepEqual(suggestSearchTerms("J", candidates), []);
  assert.deepEqual(suggestSearchTerms("今日", candidates), []);
});

test("search page distinguishes typo suggestions from related candidates", () => {
  const page = readFileSync(new URL("../src/app/search/page.tsx", import.meta.url), "utf8");
  assert.match(page, /suggestion\.matchedBy === "typo"/);
  assert.match(page, /\? "もしかして"/);
  assert.match(page, /: "関連候補"/);
  assert.match(page, /<strong>\{suggestionHeading\}<\/strong>/);
});
