import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { createRequire } from "node:module";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const require = createRequire(import.meta.url);
function realModule(file) {
  const result = { exports: {} };
  const script = ts.transpileModule(readFileSync(new URL(`../src/${file}`, import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  new Function("module", "exports", "require", script)(result, result.exports, name => {
    if (name.endsWith(".css")) return { default: {} };
    if (name.startsWith("@/lib/")) return realModule(`lib/${name.slice(6)}.ts`);
    return require(name);
  });
  return result.exports;
}
const source = readFileSync(new URL("../src/components/character-detail-pilot.tsx", import.meta.url), "utf8");
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
const compiled = { exports: {} };
vm.runInNewContext(js, {
  module: compiled, exports: compiled.exports,
  require(name) {
    if (name === "react/jsx-runtime") return require(name);
    if (name === "@/components/character-game-guide") return realModule("components/character-game-guide.tsx");
    if (name === "@/components/character-quick-start") return realModule("components/character-quick-start.tsx");
    if (name === "@/components/character-move-explorer") return realModule("components/character-move-explorer.tsx");
    if (name.endsWith(".css")) return { default: {} };
    if (name === "@/components/combo-input-recipe") return { ComboInputRecipe: ({ recipe }) => require("react").createElement("span", { "data-original-input": recipe }, recipe) };
    if (name === "next/link") return { default: props => require("react").createElement("a", props), __esModule: true };
    if (name === "@/lib/device-preview") return { isDevicePreviewRequest: () => false, appendDevicePreviewToken: path => path };
    if (name === "@/lib/public-copy") return { normalizePublicCopy: (value) => value, isInternalMoveNote: () => false };
    if (name === "@/lib/release-features") return { releaseFeatures: { publicStrategyContent: false } };
    if (name === "@/lib/character-learning-structure") return { CHARACTER_VIDEO_GROUP_ORDER: [] };
    if (name === "@/lib/character-video-references") return { characterVideoReferences: () => [] };
    return {};
  },
});
function render(frame, preRelease = true) {
  return renderToStaticMarkup(require("react").createElement(compiled.exports.CharacterDetailPilot, {
    characterName: "リュウ", characterSlug: "ryu", previewToken: null, preRelease,
    players: [], videos: [], sources: [], profile: { tagline: "特徴", winPath: "距離", firstLesson: "最初の練習", strength: "強み", weakness: "注意点", gameplan: [], ranges: [] },
    bundle: { combos: [], setups: [], sequences: [], moves: [{ id: "test-move", slug: "test-move", name: "試験用の技", moveType: "special", status: "draft", usageSummary: null, frame, commands: [{ scheme: "classic", commandText: "236P", conditionText: null }] }] },
  }));
}

test("move cards render supplied active, recovery and hit values without interpreting them", () => {
  const html = render({ startup: "4", active: "4-6", recovery: "7", onHit: "+4", onBlock: "-1", damage: 300, verificationStatus: "reviewed" });
  for (const value of ["持続", "4-6", "硬直", "ヒット時", "+4"]) assert.ok(html.includes(value));
  assert.ok(html.includes('data-original-input="236P"'));
});

test("old frame payloads omit absent optional statistics rather than invent values", () => {
  const html = render({ startup: "4", onBlock: "-1", damage: 300, verificationStatus: "reviewed" });
  for (const value of ["持続", "硬直", "ヒット時"]) assert.ok(!html.includes(value));
  assert.ok(html.includes("動作映像は未掲載"));
});

test("blank optional values remain absent while literal zero and signed advantage survive", () => {
  const html = render({ startup: null, active: "", recovery: "0", onHit: "-2", onBlock: null, damage: 0, verificationStatus: null });
  assert.ok(!html.includes("持続"));
  assert.match(html, /硬直<\/dt><dd>0<\/dd>/);
  assert.match(html, /ヒット時<\/dt><dd>-2<\/dd>/);
});


test("public character quick-start anchors resolve and filtered move content retains original commands", () => {
  const html = render({ startup: "4", onBlock: "-1", damage: 300 }, false);
  for (const id of ["pilot-overview", "pilot-moves", "pilot-first-lesson", "related-players", "related-videos"]) {
    assert.ok(html.includes(`href="#${id}"`)); assert.ok(html.includes(`id="${id}"`));
  }
  assert.match(html, /技名・コマンドを検索/);
  assert.match(html, /data-original-input="236P"/);
  assert.match(html, /確認済みのコンボはまだありません/);
});
