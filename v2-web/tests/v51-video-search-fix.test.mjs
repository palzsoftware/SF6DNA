import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";
import { readyIds } from "./helpers/approved-videos-v47.mjs";

// V51: guide-mode fix for registered 解説 cards + V50 content tags. Registered character rows may carry reviewed contentCategories / durationSeconds.
// Existing rows (no new fields) must project exactly as before; new fields only add tags and a length.
const require = createRequire(import.meta.url);
function realModule(file) {
  const result = { exports: {} };
  const script = ts.transpileModule(readFileSync(new URL(`../src/${file}`, import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, resolveJsonModule: true, esModuleInterop: true } }).outputText;
  const dir = file.slice(0, file.lastIndexOf("/") + 1);
  new Function("module", "exports", "require", script)(result, result.exports, name => {
    if (name.endsWith(".css")) return { default: {} };
    if (name.endsWith(".json")) {
      const path = name.startsWith("@/") ? `../src/${name.slice(2)}` : new URL(name, new URL(`../src/${dir}`, import.meta.url)).href;
      return { __esModule: true, default: JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8")) };
    }
    const local = name.startsWith("@/") ? name.slice(2) : name.startsWith(".") ? new URL(name, `file:///${dir}`).pathname.slice(1) : null;
    if (local) return realModule(local + (existsSync(new URL(`../src/${local}.tsx`, import.meta.url)) ? ".tsx" : ".ts"));
    return require(name);
  });
  return result.exports;
}
const reg = realModule("lib/registered-youtube-videos.ts");
const lib = realModule("lib/video-library.ts");
const PROD = "wnuxaxbrpudyypzdbdho";
const empty = () => ({ query: "", events: new Set(), players: new Set(), characters: new Set(), controls: new Set(), categories: new Set(), levels: new Set(), languages: new Set(), modes: new Set(), preference: new Set(), learningTopics: new Set(), targetRanks: new Set() });
const row = (id, extra = {}) => ({ key: `t-${id}`, characterSlug: "ryu", youtubeId: id, title: `リュウ ${id}`, channelName: "test", sourceDate: "2026-01-01", category: "解説", origin: "test", playerSlug: null, caution: null, publicationApproval: "APPROVED", ...extra });

test("existing approved data projects as before: one category, no length", () => {
  const cards = reg.registeredYouTubeVideos(PROD, false);
  assert.deepEqual(new Set(cards.map(c => c.id.replace(/^youtube:/, ""))), readyIds); // the approved list, not a fixed number
  // Rows without the V50 fields keep the previous projection; tagged rows only add tags after the card type.
  const rows = JSON.parse(readFileSync(new URL("../src/data/character-videos/registered.json", import.meta.url), "utf8"));
  const tagged = new Set(rows.filter(r => r.contentCategories || r.durationSeconds).map(r => `youtube:${r.youtubeId}`));
  for (const c of cards) {
    assert.equal(c.categories[0], c.videoType);
    if (!tagged.has(c.id)) { assert.deepEqual(c.categories, [c.videoType]); assert.equal(c.durationSeconds, null); }
  }
  assert.equal(new Set(cards.map(c => c.id)).size, cards.length);
});

test("contentCategories add known tags after the card type; unknown tags are ignored", () => {
  const [c] = reg.registeredYouTubeVideos(PROD, false, { players: [], bindings: [], characters: [row("aaaaaaaaaaa", { contentCategories: ["combo", "setplay", "bogus", "explainer"], durationSeconds: 600 })] });
  assert.deepEqual(c.categories, ["explainer", "combo", "setplay"]);
  assert.equal(c.videoType, "explainer");
  assert.equal(c.durationSeconds, 600);
});

test("invalid durations stay null; rows without tags keep the existing category", () => {
  for (const d of [0, -1, 1.5, "600", null, 10 ** 7]) {
    const [c] = reg.registeredYouTubeVideos(PROD, false, { players: [], bindings: [], characters: [row("bbbbbbbbbbb", { durationSeconds: d })] });
    assert.equal(c.durationSeconds, null); assert.deepEqual(c.categories, ["explainer"]);
  }
});

test("PENDING rows with tags are still not public", () => {
  assert.equal(reg.registeredYouTubeVideos(PROD, false, { players: [], bindings: [], characters: [row("ccccccccccc", { publicationApproval: "PENDING", contentCategories: ["combo"] })] }).length, 0);
});

test("filter by combo / patch / system and sort by length", () => {
  const cards = reg.registeredYouTubeVideos(PROD, false, { players: [], bindings: [], characters: [
    row("ddddddddddd", { contentCategories: ["combo"], durationSeconds: 300 }),
    row("eeeeeeeeeee", { contentCategories: ["patch"], durationSeconds: 100 }),
    row("fffffffffff", { contentCategories: ["system", "combo"], durationSeconds: 200 }),
    row("ggggggggggg", { category: "対戦" })] });
  const by = cat => lib.filterVideos(cards, { ...empty(), categories: new Set([cat]) }, new Set(), new Set()).map(v => v.id).sort();
  assert.deepEqual(by("combo"), ["youtube:ddddddddddd", "youtube:fffffffffff"]);
  assert.deepEqual(by("patch"), ["youtube:eeeeeeeeeee"]);
  assert.deepEqual(by("system"), ["youtube:fffffffffff"]);
  assert.deepEqual(by("match"), ["youtube:ggggggggggg"]);
  assert.deepEqual(lib.sortVideos(cards, "shortest", new Set(), new Set()).map(v => v.durationSeconds), [100, 200, 300, null]);
  assert.equal(lib.VIDEO_CATEGORY_LABELS.patch, "Patch解説");
  assert.equal(lib.VIDEO_CATEGORY_LABELS.system, "システム解説");
});

test("two rows of one video (two characters) give one card with merged tags", () => {
  const cards = reg.registeredYouTubeVideos(PROD, false, { players: [], bindings: [], characters: [
    row("hhhhhhhhhhh", { contentCategories: ["counter"], durationSeconds: 400 }),
    row("hhhhhhhhhhh", { key: "t-h2", characterSlug: "ken", contentCategories: ["combo"], durationSeconds: 400 })] });
  assert.equal(cards.length, 1); assert.deepEqual(cards[0].categories, ["explainer", "combo", "counter"]); assert.equal(cards[0].characterSlugs.length, 2);
});

test("解説/対戦 mode: registered explainer cards are 解説; match cards unchanged; ranked replays keep their previous behaviour", () => {
  const cards = reg.registeredYouTubeVideos(PROD, false);
  const mode = m => lib.filterVideos(cards, { ...empty(), modes: new Set([m]) }, new Set(), new Set()).map(v => v.id);
  const byType = t => cards.filter(c => c.videoType === t).map(c => c.id);
  assert.ok(byType("explainer").length > 0);
  assert.deepEqual(mode("guide").sort(), byType("explainer").sort());
  assert.deepEqual(mode("match").sort(), byType("match").sort());
  for (const id of byType("ranked_replay")) { assert.ok(!mode("guide").includes(id)); assert.ok(!mode("match").includes(id)); }
  assert.equal(lib.filterVideos(cards, empty(), new Set(), new Set()).length, cards.length);
});

test("multiple conditions: character + content tag + mode", () => {
  const cards = reg.registeredYouTubeVideos(PROD, false, { players: [], bindings: [], characters: [
    row("iiiiiiiiiii", { contentCategories: ["combo"] }), row("jjjjjjjjjjj", { characterSlug: "ken", contentCategories: ["combo"] }),
    row("kkkkkkkkkkk", { category: "対戦", contentCategories: ["combo"] })] });
  const ryu = cards.find(c => c.id === "youtube:iiiiiiiiiii").entityRefs.characters[0].id;
  const res = lib.filterVideos(cards, { ...empty(), characters: new Set([ryu]), categories: new Set(["combo"]), modes: new Set(["guide"]) }, new Set(), new Set());
  assert.deepEqual(res.map(v => v.id), ["youtube:iiiiiiiiiii"]);
});
