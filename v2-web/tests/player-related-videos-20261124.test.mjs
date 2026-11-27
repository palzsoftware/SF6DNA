import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import { approvedRowKeys, expectedApproval, preApproval, readyIds, holdIds, excludedIds } from "./helpers/approved-videos-v47.mjs";

const require = createRequire(import.meta.url);
const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
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

const DEV = "vvsknbmlfvvnrmgtyhbf", PROD = "wnuxaxbrpudyypzdbdho";
const videos = read("../src/data/player-research/videos.json");
const bindings = read("../src/data/player-research/video-bindings.json");
const added = videos.filter(v => v.identityBinding?.includes("SF6DNA_PLAYER_RELATED_VIDEO_REGISTRATION_LIST_20261124"));
const { PlayerRecommendedVideos } = realModule("components/player-recommended-videos.tsx");
const { boundPlayerVideoRecommendations } = realModule("lib/player-video-binding.ts");
const React = require("react");
const render = (slug, items) => renderToStaticMarkup(React.createElement(PlayerRecommendedVideos, { playerSlug: slug, items, draftPreview: true }));

const recheck = videos.filter(v => v.identityBinding?.includes("SF6DNA_PLAYER_RELATED_VIDEO_HOLD_RECHECK_ADD_20261124"));

test("registration list: 39 rows added as pending (Psycho production-only), Brayan_Job held", () => {
  assert.equal(added.length, 39);
  for (const v of added.filter(v => v.key !== "psycho-olyYbGuRgOM")) {
    assert.equal(v.publicationApproval, expectedApproval(v.key));
    assert.equal(v.relationConfirmed, true);
    assert.ok(v.characterLinks?.length === 1, v.key);
    assert.ok(bindings.some(b => b.environment === DEV && b.recommendationKey === v.key), `${v.key}: dev binding`);
    assert.ok(bindings.some(b => b.environment === PROD && b.recommendationKey === v.key), `${v.key}: prod binding`);
  }
  // Psycho: existing production UUID (legacy public); no development row, so no development binding.
  const psycho = bindings.filter(b => b.recommendationKey === "psycho-olyYbGuRgOM");
  assert.deepEqual(psycho, [{ environment: PROD, playerId: "7c8377fa-29eb-4015-bf1d-f76a03569725", playerSlug: "psycho", recommendationKey: "psycho-olyYbGuRgOM" }]);
  // Brayan_Job: production draft (not public) -> held, not added.
  assert.ok(!videos.some(v => v.key.startsWith("brayan-job-")));
});

test("PV0198 uses the corrected start (second game 5:24) and Yanai's Vega match is bound to Yanai", () => {
  const dj = videos.find(v => v.key === "fuudo-ksZcWQN3GDI");
  assert.equal(dj.startSeconds, 324);
  assert.match(dj.evidenceBasis, /5:45 \/ 9:05/);
  assert.match(render("fuudo", [dj]), /watch\?v=ksZcWQN3GDI&amp;t=324s/);
  const yanai = videos.find(v => v.key === "yanai-5d7MoGK8wbo");
  assert.deepEqual(yanai.characterLinks, [{ slug: "m-bison", name: "ベガ" }]);
  const devId = bindings.find(b => b.environment === DEV && b.recommendationKey === yanai.key).playerId;
  assert.ok(boundPlayerVideoRecommendations({ id: devId, slug: "yanai" }, DEV, videos, bindings).some(v => v.key === "yanai-5d7MoGK8wbo"));
});

test("same match: the clip card carries the full stream and the separate full-stream card is not shown twice", () => {
  const clip = videos.find(v => v.key === "hikaru-aki-RbqPkG7nhDs");
  const full = videos.find(v => v.key === "hikaru-aki-BDKiKN1KD0s");
  const html = render("hikaru-aki", [full, clip]);
  assert.equal((html.match(/data-recommendation-key=/g) ?? []).length, 1);
  assert.ok(html.includes('data-recommendation-key="hikaru-aki-RbqPkG7nhDs"'));
  assert.ok(html.includes('data-same-match-full-stream="BDKiKN1KD0s"'));
  // Unverified chapter time: link without &t= and the note says it is unverified.
  assert.ok(html.includes('href="https://www.youtube.com/watch?v=BDKiKN1KD0s"'));
  assert.match(html, /概要欄の章 1:51:33・未照合/);
  // Verified offset (Bonchan 4:07:13) is linked with &t=.
  const bonchan = videos.find(v => v.key === "bonchan-DqjHS5TY0R4");
  assert.match(render("bonchan", [bonchan]), /watch\?v=eNlppthzST4&amp;t=14833s/);
  // A different player's full stream card is unaffected.
  assert.equal((render("hikaru-aki", [full]).match(/data-recommendation-key=/g) ?? []).length, 1);
});

test("start time: whole-clip matches show 0:00, ranked/stream videos have no start time", () => {
  const html = render("sako", [videos.find(v => v.key === "sako-VGTYgIwiWsQ")]);
  assert.match(html, /開始時刻: 0:00/);
  assert.ok(html.includes('href="https://www.youtube.com/watch?v=VGTYgIwiWsQ"'));
  const ranked = videos.find(v => v.key === "shuto-BynjaSjROVk");
  assert.equal(ranked.startSeconds, undefined);
  assert.ok(!render("shuto", [ranked]).includes("開始時刻"));
});

test("ranked/stream videos are labelled 配信・ランクマ, never 本人解説 (Shuto PV0661)", () => {
  for (const key of ["shuto-BynjaSjROVk", "daigo-4JsHd99qpHg", "pugera-jxPX3bfOuac", "hikaru-aki-7QRxYPh5cMQ"]) {
    const v = videos.find(x => x.key === key);
    assert.equal(v.kind, "配信・ランクマ", key);
    const html = render(v.playerSlug, [v]);
    assert.ok(html.includes("<span>配信・ランクマ</span>") && !html.includes("本人解説"), key);
  }
});

test("recheck rows: Yanai section 2 and Raoyamu x3 are added once, merged with the same-match full stream", () => {
  assert.deepEqual(recheck.map(v => v.key).sort(), ["raoyamu--suTn3EOvUU", "raoyamu-3bdPWvARRjw", "raoyamu-PBWnKVqGBuQ", "yanai-T0t7mal-kYA"]);
  const yanai = recheck.find(v => v.key === "yanai-T0t7mal-kYA");
  assert.match(yanai.evidenceBasis, /確度中/);
  assert.match(yanai.evidenceBasis, /動画タイトル「ヤナイ（ベガ\/C\/HOME）」/);
  for (const v of recheck) {
    assert.equal(v.publicationApproval, expectedApproval(v.key));
    for (const env of [DEV, PROD]) assert.equal(bindings.filter(b => b.environment === env && b.recommendationKey === v.key).length, 1, `${v.key} ${env}`);
  }
  // Whole player list: one card per match (the section full stream folds into the clip card).
  const yanaiDev = bindings.find(b => b.environment === DEV && b.playerSlug === "yanai").playerId;
  const items = boundPlayerVideoRecommendations({ id: yanaiDev, slug: "yanai" }, DEV, videos, bindings);
  const html = render("yanai", items);
  for (const [clip, full] of [["T0t7mal-kYA", "4-TyAmHuxGY"], ["5d7MoGK8wbo", "IffWcLB_XMo"]]) {
    assert.ok(html.includes(`data-recommendation-key="yanai-${clip}"`));
    assert.ok(!html.includes(`data-recommendation-key="yanai-${full}"`), full);
    assert.ok(html.includes(`data-same-match-full-stream="${full}"`));
  }
  const keys = [...html.matchAll(/data-recommendation-key="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(keys).size, keys.length);
});
