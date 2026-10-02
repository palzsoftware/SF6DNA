import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pageSource = await readFile(new URL("../src/app/page.tsx", import.meta.url), "utf8");
const cssSource = await readFile(new URL("../src/app/product-refresh.css", import.meta.url), "utf8");

test("Home uses natural hero copy and selects three characters from the public pool", () => {
  assert.match(pageSource, /次の対戦で、/);
  assert.match(pageSource, /何を試そう？/);
  assert.match(pageSource, /課題を整理して、今日やることを決める/);
  assert.match(pageSource, /pickRandomHeroCharacters\(characters\)/);
  assert.doesNotMatch(pageSource, /\["ryu", "jp", "mai"\]/);
});

test("Home search and character count describe their public scope", () => {
  assert.match(pageSource, /キャラクター・プレイヤー・動画を検索/);
  assert.match(pageSource, /\$\{characters\.length\}キャラクターの情報/);
  assert.match(pageSource, /サイト内を検索/);
  assert.doesNotMatch(pageSource, />1か所</);
});

test("Home sections prioritize daily training and compact return navigation", () => {
  assert.match(pageSource, /home-purpose-card/);
  assert.match(pageSource, /今日やること/);
  assert.match(pageSource, /続きから/);
  assert.match(pageSource, /最近の更新/);
  assert.match(pageSource, /home-public-nav/);
  assert.match(pageSource, /daily-card__icon-slot/);
  assert.match(cssSource, /prefers-reduced-motion: reduce/);
  assert.match(cssSource, /@media \(max-width: 560px\)/);
});
