import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const files = [
  "src/app/page.tsx", "src/app/auth/page.tsx", "src/app/search/page.tsx", "src/app/players/page.tsx",
  "src/app/videos/page.tsx", "src/app/faq/page.tsx", "src/app/feedback/page.tsx", "src/app/contact/page.tsx",
  "src/app/about/page.tsx", "src/app/sources/page.tsx", "src/components/logout-button.tsx",
  "src/components/video-library.tsx", "src/components/diagnosis-runner.tsx",
];
const sources = await Promise.all(files.map((file) => readFile(new URL(`../${file}`, import.meta.url), "utf8")));
const publicCopy = sources.join("\n");

test("reviewed public copy does not contain known stale or internal phrases", () => {
  for (const phrase of [
    "ブラウザー", "公開metadata", "relationの公開", "metadata待ち", "用Evidence", "Traitデータ",
    "公開情報を検索", "プレイアブル31キャラクターを収録", "診断・図鑑・練習メニューがひとつになった",
  ]) assert.doesNotMatch(publicCopy, new RegExp(phrase));
});

test("reviewed routes use concrete destination labels", () => {
  assert.match(publicCopy, /SF6の情報を探す/);
  assert.match(publicCopy, /お問い合わせページへ/);
  assert.match(publicCopy, /攻略・対戦・大会などの動画を探せます/);
});
