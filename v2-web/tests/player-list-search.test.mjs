import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("player directory supports normalized partial search and clear", () => {
  const source = read("src/components/player-directory.tsx");
  assert.match(source, /normalize\("NFKC"\)/);
  assert.match(source, /toLocaleLowerCase\("ja"\)/);
  assert.match(source, /includes\(needle\)/);
  assert.match(source, /setQuery\(""\)/);
});

test("player search covers aliases, team, characters, and region", () => {
  const component = read("src/components/player-directory.tsx");
  const loader = read("src/lib/players.ts");
  for (const marker of ["player.aliases", "player.teamName", "player.region", "player.countryCode", "character.characterName", "character.characterSlug"]) assert.match(component, new RegExp(marker.replaceAll(".", "\\.")));
  assert.match(loader, /player_aliases/);
  assert.match(loader, /region/);
});

test("player directory has result count, zero-result state, and accessible input", () => {
  const source = read("src/components/player-directory.tsx");
  for (const marker of ["aria-live=\"polite\"", "条件に一致するプレイヤーはいません", "検索をクリア", "htmlFor=\"player-search\""]) assert.match(source, new RegExp(marker));
});

test("player directory V2 combines category and character groups with AND", () => {
  const source = read("src/components/player-directory.tsx");
  assert.match(source, /playerMatchesFilters/);
  assert.match(source, /categoryMatch && characterMatch/);
  assert.match(source, /type="checkbox"/);
  assert.match(source, /選択中のフィルター/);
  assert.match(source, /setCategories\(\[\]\)/);
  assert.match(source, /setCharacters\(\[\]\)/);
});

test("player directory exposes a source-dated unknown rank state", () => {
  const source = read("src/components/player-directory.tsx");
  assert.match(source, />ランク</);
  assert.match(source, /確認日つきデータの連携後に利用できます/);
  assert.doesNotMatch(source, /current_rank\s*=/);
});

test("player search retains responsive 375px-safe layout", () => {
  const css = read("src/app/players/players.module.css");
  assert.match(css, /grid-template-columns: minmax\(0, 1fr\)/);
  assert.match(css, /max-width: 420px/);
  assert.match(css, /\.searchRow \{ grid-template-columns: 1fr; \}/);
  assert.doesNotMatch(css, /overflow-x:\s*hidden/);
});

test("public player copy avoids tournament claims when no result is published", () => {
  const source = read("src/lib/player-presentation.ts");
  assert.match(source, /公開プロフィールでリュウとの関係を確認できる/);
  assert.doesNotMatch(source, /大会データで使用実績を確認できる/);
  for (const phrase of ["参照候補。", "参照する競技プレイヤー。"] ) assert.doesNotMatch(source, new RegExp(`return .*${phrase}`));
});
