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
    if (name.startsWith("@/data/")) return { __esModule: true, default: JSON.parse(readFileSync(new URL(`../src/data/${name.slice(7)}`, import.meta.url), "utf8")) };
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
    if (name === "@/components/sf6-command-input") return realModule("components/sf6-command-input.tsx");
    if (name === "@/lib/sf6-command-tokens") return realModule("lib/sf6-command-tokens.ts");
    if (name === "@/components/accessible-command") return realModule("components/accessible-command.tsx");
    if (name === "@/components/move-motion-media") return realModule("components/move-motion-media.tsx");
    if (name === "@/components/character-game-guide") return realModule("components/character-game-guide.tsx");
    if (name === "@/components/character-quick-start") return realModule("components/character-quick-start.tsx");
    if (name === "@/components/character-move-explorer") return realModule("components/character-move-explorer.tsx");
    if (name.endsWith(".css")) return { default: {} };
    if (name === "@/components/combo-input-recipe") return { ComboInputRecipe: ({ recipe }) => require("react").createElement("span", { "data-original-input": recipe }, recipe) };
    if (name === "next/link") return { default: props => require("react").createElement("a", props), __esModule: true };
    if (name === "@/lib/device-preview") return { isDevicePreviewRequest: () => false, appendDevicePreviewToken: path => path };
    if (name === "@/lib/move-media-presentation") return realModule("lib/move-media-presentation.ts");
    if (name === "@/lib/move-command-format") return realModule("lib/move-command-format.ts");
    if (name === "@/lib/public-copy") return { normalizePublicCopy: (value) => value, isInternalMoveNote: () => false };
    if (name === "@/lib/release-features") return { releaseFeatures: { publicStrategyContent: false } };
    if (name === "@/lib/character-learning-structure") return { CHARACTER_VIDEO_GROUP_ORDER: [] };
    if (name === "@/lib/character-video-references") return realModule("lib/character-video-references.ts");
    return {};
  },
});
function render(frame, preRelease = true, extraMoves = []) {
  return renderToStaticMarkup(require("react").createElement(compiled.exports.CharacterDetailPilot, {
    characterName: "リュウ", characterSlug: "ryu", previewToken: null, preRelease,
    players: [], videos: [], sources: [], profile: { tagline: "特徴", winPath: "距離", firstLesson: "最初の練習", strength: "強み", weakness: "注意点", gameplan: [], ranges: [] },
    bundle: { combos: [], setups: [], sequences: [], moves: [{ id: "test-move", slug: "test-move", name: "試験用の技", moveType: "special", status: "draft", usageSummary: null, frame, commands: [{ scheme: "classic", commandText: "236P", conditionText: null }] }, ...extraMoves] },
  }));
}

test("move cards render supplied active, recovery and hit values without interpreting them", () => {
  const html = render({ startup: "4", active: "4-6", recovery: "7", onHit: "+4", onBlock: "-1", damage: 300, verificationStatus: "reviewed" });
  assert.doesNotMatch(html, /<dl[^>]*role=/, "frame descriptions retain native dt/dd semantics");
  for (const value of ["持続", "4-6", "硬直", "ヒット時", "+4"]) assert.ok(html.includes(value));
  assert.ok(html.replace(/<[^>]*>/g, "").replace(/\s+/g, "").includes("↓↘→P"));
});

test("old frame payloads omit absent optional statistics rather than invent values", () => {
  const html = render({ startup: "4", onBlock: "-1", damage: 300, verificationStatus: "reviewed" });
  for (const value of ["持続", "硬直"]) assert.ok(!html.includes(value));
  assert.ok(html.includes("動作映像は未掲載"));
  assert.match(html, /ヒット時<\/dt><dd>確認中<\/dd>/);
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
  assert.ok(html.replace(/<[^>]*>/g, "").replace(/\s+/g, "").includes("↓↘→P"));
  assert.match(html, /確認済みのコンボはまだありません/);
});


test("all 31 character datasets retain every required category ID, including target combos without media", () => {
  const slugs = [...readFileSync(new URL("../src/lib/character-detail-route.ts", import.meta.url), "utf8").matchAll(/^  "([a-z-]+)",/gm)].map(match => match[1]);
  assert.equal(slugs.length, 31);
  for (const slug of slugs) {
    const moves = ["normal", "unique", "target_combo", "special", "throw", "super"].flatMap(moveType => Array.from({ length: 12 }, (_, index) => ({
      id: `${slug}-${moveType}-${index}`, slug: `${slug}-${moveType}-${index}`, name: `長い日本語の技名 ${index}`, moveType, status: "draft", usageSummary: null,
      commands: [{ scheme: "classic", commandText: "236236PP", conditionText: null }], frame: { startup: "4", onHit: "+2", onBlock: "-3", damage: 0, verificationStatus: null },
    })));
    const html = render({ startup: "4" }, false, moves);
    for (const move of moves) assert.ok(html.includes(`data-move-id="${move.id}"`), move.id);
    for (const label of ["通常技", "特殊技", "必殺技", "投げ", "SA"]) assert.ok(html.includes(label), `${slug}: ${label}`);
    assert.ok(!html.includes("ターゲットコンボ"));
    assert.match(html, /ダメージ<\/dt><dd>0<\/dd>/);
  }
});


test("Alex safe Preview render separates retained64 base from63 cards and one identity hold",()=>{
 const previous=process.env.VERCEL_ENV;process.env.VERCEL_ENV="preview";
 try{
  const snapshot=JSON.parse(readFileSync(new URL("../src/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json",import.meta.url),"utf8"));
  const candidate=realModule("lib/nine-character-integration-candidate.ts").getNineCharacterIntegrationCandidate(snapshot.characters.alex.characterId,"alex");
  assert.deepEqual(candidate.counts,{dataBase:64,publicCandidate:63,held:1});
  const html=renderToStaticMarkup(require("react").createElement(compiled.exports.CharacterDetailPilot,{characterName:"アレックス",characterSlug:"alex",previewToken:null,preRelease:true,players:[],videos:[],sources:[],profile:{tagline:"特徴",winPath:"距離",firstLesson:"最初",strength:"強み",weakness:"注意",gameplan:[],ranges:[]},bundle:candidate.bundle}));
  const rendered=[...html.matchAll(/data-move-id="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(rendered.length,63);assert.deepEqual(new Set(rendered),new Set(candidate.bundle.moves.map(m=>m.id)));
  assert.ok(!rendered.includes("7b009800-5747-4b7d-a2c1-7163f1826d48"));
  assert.equal(candidate.bundle.moves.filter(m=>m.media).length,6);
  for(const m of candidate.bundle.moves.filter(m=>m.media))assert.ok(html.includes(m.media.mediaUrl),m.id);
  assert.match(html,/確認中/);assert.match(html,/動作映像は未掲載/);
 }finally{if(previous===undefined)delete process.env.VERCEL_ENV;else process.env.VERCEL_ENV=previous;}
});

for (const slug of ['c-viper','elena','sagat','lily','juri','dee-jay','jp','alex','ingrid']) test(`${slug} snapshot candidate SSR preserves all safe card IDs, commands and exact frame notation`,()=>{
 const previous=process.env.VERCEL_ENV;process.env.VERCEL_ENV='preview';
 try{
  const snapshot=JSON.parse(readFileSync(new URL('../src/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json',import.meta.url),'utf8'));
  const candidate=realModule('lib/nine-character-integration-candidate.ts').getNineCharacterIntegrationCandidate(snapshot.characters[slug].characterId,slug);
  const html=renderToStaticMarkup(require('react').createElement(compiled.exports.CharacterDetailPilot,{characterName:slug,characterSlug:slug,previewToken:null,preRelease:true,players:[],videos:[],sources:[],profile:{tagline:'特徴',winPath:'距離',firstLesson:'最初',strength:'強み',weakness:'注意',gameplan:[],ranges:[]},bundle:candidate.bundle}));
  const ids=[...html.matchAll(/data-move-id="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,candidate.counts.publicCandidate);assert.deepEqual(new Set(ids),new Set(candidate.bundle.moves.map(m=>m.id)));
  const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#x27;');
  const labels={startup:'発生',onHit:'ヒット時',damage:'ダメージ'};
  for(const m of candidate.bundle.moves){const card=html.slice(html.indexOf(`data-move-id="${m.id}"`)).split('</article>')[0];if(m.commands.some(c=>c.scheme==='classic'))assert.ok(card.includes('クラシック'),m.id);else assert.equal(candidate.evidence[m.id].command_classifications.classic.status,'NOT_APPLICABLE');for(const [k,label] of Object.entries(labels))assert.ok(card.includes(`<dt>${label}</dt><dd>${m.frame[k]===null?(m.frameFieldStatus[k]==='OFFICIAL_NA'?'—':'確認中'):escape(m.frame[k])}</dd>`),`${m.id}:${k}`);if(m.moveType==='throw')assert.ok(!card.includes('<dt>ガード時</dt>'),`${m.id}:throw on-block suppressed`);else assert.ok(card.includes(`<dt>ガード時</dt><dd>${m.frame.onBlock===null?(m.frameFieldStatus.onBlock==='OFFICIAL_NA'?'—':'確認中'):escape(m.frame.onBlock)}</dd>`),`${m.id}:onBlock`);if(!m.media)assert.ok(card.includes('動作映像は未掲載'),m.id);assert.ok(card.includes('公開審査前'),m.id);}
  if(slug==='alex')assert.ok(!ids.includes('7b009800-5747-4b7d-a2c1-7163f1826d48'));
 }finally{if(previous===undefined)delete process.env.VERCEL_ENV;else process.env.VERCEL_ENV=previous;}
});

test('JP dedicated renderer displays accepted snapshot, N/A and fallback without changing its reviewed fixture',()=>{
 const previous=process.env.VERCEL_ENV;process.env.VERCEL_ENV='preview';
 try{
  const snapshot=JSON.parse(readFileSync(new URL('../src/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json',import.meta.url),'utf8'));
  const candidate=realModule('lib/nine-character-integration-candidate.ts').getNineCharacterIntegrationCandidate(snapshot.characters.jp.characterId,'jp');
  const mod={exports:{}};const script=ts.transpileModule(readFileSync(new URL('../src/components/jp-character-detail.tsx',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
  new Function('module','exports','require',script)(mod,mod.exports,name=>{
   if(name==='react/jsx-runtime')return require(name);
   if(name==='@/components/sf6-command-input')return realModule('components/sf6-command-input.tsx');
   if(name==='@/components/accessible-command')return realModule('components/accessible-command.tsx');
   if(name==='next/link')return {default:p=>require('react').createElement('a',p),__esModule:true};
   if(name.endsWith('.css'))return {default:{}};
   if(name==='@/components/character-move-explorer')return realModule('components/character-move-explorer.tsx');
   if(name==='@/components/move-motion-media')return realModule('components/move-motion-media.tsx');
   if(name.startsWith('@/components/'))return new Proxy({},{get:()=>()=>null});
   if(name==='@/lib/device-preview')return {appendDevicePreviewToken:p=>p};
   if(name==='@/lib/release-features')return {releaseFeatures:{publicStrategyContent:false}};
   if(name.startsWith('@/lib/'))return realModule(`lib/${name.slice(6)}.ts`);
   return {};
  });
  const html=renderToStaticMarkup(require('react').createElement(mod.exports.JpCharacterDetail,{character:{slug:'jp',name:'JP',imageUrl:null,sources:[]},previewToken:null,previewActive:false,bundle:candidate.bundle,profile:{tagline:'特徴',winPath:'距離',firstLesson:'最初',strength:'強み',weakness:'注意',gameplan:[],ranges:[]},players:[],videos:[],pilotOverview:true}));
  const ids=[...html.matchAll(/data-move-id="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,59);assert.deepEqual(new Set(ids),new Set(candidate.bundle.moves.map(m=>m.id)));assert.match(html,/公開審査前/);assert.match(html,/動作映像は未掲載/);for(const move of candidate.bundle.moves){const card=html.slice(html.indexOf(`data-move-id="${move.id}"`)).split("</article>")[0];if(move.moveType==="throw")assert.ok(!card.includes("<dt>ガード時</dt>"));else if(move.frameFieldStatus?.onBlock==="OFFICIAL_NA")assert.match(card,/ガード時<\/dt><dd>—<\/dd>/);}
  assert.ok(html.includes("data-token-kind"));assert.match(html,/500 \/ 500/);
 }finally{if(previous===undefined)delete process.env.VERCEL_ENV;else process.env.VERCEL_ENV=previous;}
});
