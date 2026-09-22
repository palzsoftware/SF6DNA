import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pageSource = await readFile(new URL("../src/app/page.tsx", import.meta.url), "utf8");
const cssSource = await readFile(new URL("../src/app/product-refresh.css", import.meta.url), "utf8");

test("Home uses natural hero copy and selects three characters from the public pool", () => {
  assert.match(pageSource, /あなたのSF6を、/);
  assert.match(pageSource, /次のレベルへ/);
  assert.match(pageSource, /診断で課題を見つけ、キャラクター情報を調べ/);
  assert.match(pageSource, /pickRandomHeroCharacters\(characters\)/);
  assert.doesNotMatch(pageSource, /\["ryu", "jp", "mai"\]/);
});

test("Home search and metrics describe their public scope", () => {
  assert.match(pageSource, /キャラクター・プレイヤー・動画を検索/);
  assert.match(pageSource, /<strong>キャラクター<\/strong>/);
  assert.match(pageSource, /\{characters\.length\}キャラを掲載/);
  assert.match(pageSource, /横断検索/);
  assert.doesNotMatch(pageSource, />1か所</);
});

test("Home sections use distinct purpose, core and compact navigation structures", () => {
  assert.match(pageSource, /home-purpose-card/);
  assert.match(pageSource, /home-core-card--featured/);
  assert.match(pageSource, /home-public-nav/);
  assert.match(pageSource, /daily-card__icon-slot/);
  assert.match(cssSource, /prefers-reduced-motion: reduce/);
  assert.match(cssSource, /@media \(max-width: 560px\)/);
});
