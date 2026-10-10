import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import path from "node:path";

const require = createRequire(import.meta.url);
function load(file) {
  const mod = { exports: {} };
  const js = ts.transpileModule(readFileSync(new URL(`../src/${file}`, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  new Function("module", "exports", "require", js)(mod, mod.exports, name => {
    if (name.endsWith(".css")) return { default: {} };
    if (name === "next/link" || name === "next/image") return { __esModule: true, default: props => require("react").createElement(name === "next/link" ? "a" : "img", props) };
    if (name === "@/lib/device-preview") return { appendDevicePreviewToken: path => path };
    if (name === "@/lib/release-features") return { releaseFeatures: { publicStrategyContent: false } };
    if (name.startsWith("@/lib/")) return load(`lib/${name.slice(6)}.ts`);
    if (name.startsWith("@/components/")) return load(`components/${name.slice(13)}.tsx`);
    if (name.startsWith("@/data/")) return { __esModule: true, default: JSON.parse(readFileSync(new URL(`../src/data/${name.slice(7)}`, import.meta.url), "utf8")) };
    if (name.startsWith(".")) {
      const base = path.posix.join(path.posix.dirname(file), name);
      return load(base + (existsSync(new URL(`../src/${base}.tsx`, import.meta.url)) ? ".tsx" : ".ts"));
    }
    return require(name);
  });
  return mod.exports;
}
const data = load("lib/luke-sample-cards.ts");
const { LukeSampleCards } = load("components/luke-sample-cards.tsx");
const render = (environment, slug = "luke", requested = "luke") => renderToStaticMarkup(require("react").createElement(LukeSampleCards, { environment, slug, requested }));

test("sample intake fails closed outside explicit preview/development Luke query", () => {
  for (const env of [undefined, "production", "test", "unknown"]) assert.equal(render(env), "");
  for (const slug of ["ryu", "alex", "jp"]) assert.equal(render("preview", slug), "");
  for (const query of ["", "true", ["luke"]]) assert.equal(render("preview", "luke", query), "");
  assert.equal(data.isLukeSampleRequest("luke", undefined, "preview"), false);
});

test("explicit QA route renders exactly two sample cards with readable input and loop videos", () => {
  for (const env of ["preview", "development"]) {
    const html = render(env);
    assert.equal((html.match(/<article\b/g) ?? []).length, 2);
    assert.equal((html.match(/<video\b/g) ?? []).length, 2);
    assert.equal((html.match(/loop=""/g) ?? []).length, 2);
    for (const text of ["ノーズブレイカー", "しゃがみ中K始動", "Classic", "Modern", "実機確認待ち", "参考映像", "レシピとの対応"]) assert.ok(html.includes(text), text);
    assert.doesNotMatch(html, /お気に入り|練習する|個別ページを見る/);
  }
});

test("unknown damage, meter, frame and Modern input are not synthesized", () => {
  for (const key of ["damage", "drive", "sa", "difficulty"]) assert.equal(data.lukeComboSample[key], null);
  for (const key of ["modern", "frame", "damage"]) assert.equal(data.lukeMoveSample[key], null);
  assert.equal(data.lukeComboSample.verificationStatus, "review_required");
  assert.doesNotMatch(render("preview"), /ダメージ<\/small><strong>0|ドライブ 0|SA 0/);
});

test("move identity and Classic input agree with existing fixture and reviewed media evidence", () => {
  const fixture = JSON.parse(readFileSync(new URL("../src/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json", import.meta.url), "utf8"));
  const move = fixture.characters.luke.moves.find(m => m.id === data.lukeMoveSample.id);
  const manifest = JSON.parse(readFileSync(new URL("../src/data/SF6DNA_VER1_LUKE_MEDIA_MANIFEST_20260924.json", import.meta.url), "utf8"));
  const clip = manifest.clips.find(m => m.move_id === move.id);
  assert.equal(move.name, data.lukeMoveSample.name);
  assert.equal(move.commands.find(c => c.scheme === "classic").commandText, data.lukeMoveSample.classic);
  assert.equal(clip.media_url, data.lukeMoveSample.media.mediaUrl);
  assert.equal(clip.verification_status, "approved_for_preview");
  assert.equal(clip.cut_review_status, "CUT_REVIEW_PASS");
});

test("sample assets exist; ambiguous GIF segmentation is not connected", () => {
  for (const url of [data.lukeMoveSample.media.mediaUrl, data.lukeMoveSample.media.posterUrl, data.lukeComboSample.media.url, data.lukeComboSample.media.posterUrl]) assert.ok(existsSync(new URL(`../public${url}`, import.meta.url)), url);
  assert.doesNotMatch(render("preview"), /crouching_mp_candidate|standing_mp_candidate/);
  assert.match(data.lukeComboSample.media.caption, /対応.*実機確認待ち/);
});

test("route attachment preserves public strategy and publication registry boundaries", () => {
  const route = readFileSync(new URL("../src/app/characters/[slug]/page.tsx", import.meta.url), "utf8");
  assert.match(route, /<LukeSampleCards slug=\{character\.slug\} requested=\{query\.sample\} environment=\{process\.env\.VERCEL_ENV\}/);
  const component = readFileSync(new URL("../src/components/luke-sample-cards.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(component, /supabase|fetch\(|published|verified"/);
});
