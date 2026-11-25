import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

// 2026-11-25 SFL48 profile supplements, Division F 第7節 match evidence and character 解説/対戦 videos.
// Every row stays PENDING. "Isolated" checks render approved copies in memory only.
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

const supplements = read("../src/data/player-research/profile-supplements.json");
const videos = read("../src/data/player-research/videos.json");
const bindings = read("../src/data/player-research/video-bindings.json");
const characterVideos = read("../src/data/character-videos/registered.json");
// Product slugs (dee-jay, mai, ...) as used by the reviewed characterLinks; must cover all 32 characters.
const characters = [...new Set(videos.flatMap(v => (v.characterLinks ?? []).map(c => c.slug)))].sort();
const ENV = { production: "wnuxaxbrpudyypzdbdho", development: "vvsknbmlfvvnrmgtyhbf" };
const supplementModule = realModule("components/player-profile-supplement.tsx");
const videoModule = realModule("components/player-recommended-videos.tsx");
const bindingModule = realModule("lib/player-video-binding.ts");
const characterModule = realModule("components/character-registered-videos.tsx");
const gate = realModule("lib/player-publication-gate.ts");
const FULL = "BDKiKN1KD0s";

test("プロフィール補足: 48名・全件PENDING・環境別IDあり・出典URLと確認日つき", () => {
  assert.equal(supplements.length, 48);
  assert.equal(new Set(supplements.map(s => s.playerSlug)).size, 48);
  for (const s of supplements) {
    assert.equal(s.publicationApproval, "PENDING");
    assert.ok(s.identities.length >= 1, s.playerSlug);
    for (const f of s.facts) { assert.match(f.sourceUrl, /^https:\/\//); assert.equal(f.checkedOn, "2026-11-25"); }
  }
});

test("未成年(ひなお・takepi)の生年月日は載せない", () => {
  for (const slug of ["hinao", "takepi"]) assert.ok(!supplements.find(s => s.playerSlug === slug).facts.some(f => f.field === "birthDate"), slug);
});

test("Wikiのプレイスタイル本文は転載せず、公式Q&Aは本人コメントとして表示", () => {
  for (const s of supplements) assert.ok(!s.facts.some(f => f.field === "playstyle"), s.playerSlug);
  const row = supplements.find(s => s.playerSlug === "bonchan");
  const html = renderToStaticMarkup(supplementModule.PlayerProfileSupplementSection({ row, draftPreview: true }));
  assert.match(html, /本人コメント:「無敵技のヒット率！」/);
  assert.doesNotMatch(html, /ウメハラの弟子/);
});

test("ボンちゃん・かずのこ: 入れ替わり疑いのYouTube/Twitchは保留、既存確認済みのXは維持", () => {
  const sns = slug => supplements.find(s => s.playerSlug === slug).facts.find(f => f.field === "sns")?.value ?? [];
  assert.deepEqual(sns("bonchan").map(l => l.url), ["https://x.com/katitagaribon"]);
  assert.deepEqual(sns("kazunoko").map(l => l.url), ["https://x.com/kazunoko0215"]);
});

test("デバイス機種は機種まで確認済みの行だけ。候補止まりは種類のみ", () => {
  for (const s of supplements) {
    const d = s.facts.find(f => f.field === "device");
    if (!d) continue;
    assert.doesNotMatch(d.value, /機種候補/);
    if (d.deviceModel) assert.match(d.basis, /機種は二次まとめ/);
  }
});

test("開幕前の公式登録キャラは現在のメイン・サブとは別項目", () => {
  for (const s of supplements) {
    const reg = s.facts.find(f => f.field === "sflRegisteredCharacters");
    if (reg) assert.match(reg.basis, /現在のメイン・サブとは別/);
  }
});

test("第7節: 映像確認時刻は試合特定の根拠で、開始時刻にしない。キャラ根拠を区別", () => {
  const rows = videos.filter(v => v.matchEvidence);
  const full = rows.filter(v => v.youtubeId === FULL);
  assert.equal(full.length, 18);
  for (const v of rows) {
    assert.ok(v.startSeconds === undefined || v.startSeconds === 0, v.key);
    if (v.sameMatchFullStream) assert.equal(v.sameMatchFullStream.startSeconds, null, v.key);
    assert.ok(["video_confirmed", "official_clip_title"].includes(v.matchEvidence.characterBasis));
  }
  const matchOf = basis => new Set(full.filter(v => v.matchEvidence.characterBasis === basis).map(v => v.matchEvidence.chapterTime));
  assert.equal(matchOf("video_confirmed").size, 3);
  assert.equal(matchOf("official_clip_title").size, 6);
});

test("同じ試合は1カード: クリップが主リンク、フル配信は時刻指定なしの補助リンク", () => {
  const player = { id: bindings.find(b => b.playerSlug === "otani" && b.environment === ENV.development).playerId, slug: "otani" };
  const items = bindingModule.boundPlayerVideoRecommendations(player, ENV.development, videos, bindings);
  const html = renderToStaticMarkup(videoModule.PlayerRecommendedVideos({ playerSlug: "otani", items, draftPreview: true }));
  assert.equal((html.match(/data-recommendation-key="otani-BDKiKN1KD0s"/g) ?? []).length, 0);
  assert.match(html, /data-same-match-full-stream="BDKiKN1KD0s"/);
  assert.doesNotMatch(html, /BDKiKN1KD0s&amp;t=/);
});

test("新規バインディングは既存の環境別IDと一致し、キーは重複しない", () => {
  const keys = new Set(videos.map(v => v.key));
  assert.equal(keys.size, videos.length);
  for (const b of bindings) assert.ok(keys.has(b.recommendationKey), b.recommendationKey);
  const idBy = new Map();
  for (const b of bindings) {
    const k = `${b.environment}:${b.playerSlug}`;
    assert.equal(idBy.get(k) ?? b.playerId, b.playerId, k);
    idBy.set(k, b.playerId);
  }
});

test("キャラ動画: 公式ガイドは29本・29キャラ。全件PENDING", () => {
  assert.equal(characters.length, 32);
  const official = characterVideos.filter(v => v.origin === "公式キャラクターガイド");
  assert.equal(new Set(official.map(v => v.youtubeId)).size, 29);
  assert.equal(new Set(official.map(v => v.characterSlug)).size, 29);
  for (const v of characterVideos) { assert.equal(v.publicationApproval, "PENDING"); assert.ok(characters.includes(v.characterSlug), v.key); }
});

test("現在の公開設定ではキャラ動画も選手補足も出ない", () => {
  for (const slug of characters) {
    const g = characterModule.characterRegisteredVideoGroups(slug, false);
    assert.equal(g.guide.length + g.match.length, 0, slug);
  }
  const row = supplements[0];
  const player = { id: row.identities[0].playerId, slug: row.playerSlug };
  assert.equal(supplementModule.boundProfileSupplement(player, row.identities[0].environment, supplements, false), null);
});

// Counts for the report. Gate and data stay unchanged; approved copies exist only in memory here.
export function sfl48Counts() {
  const approved = rows => rows.map(r => ({ ...r, publicationApproval: "APPROVED" }));
  const out = {};
  for (const [env, ref] of Object.entries(ENV)) {
    const gateKeys = gate.publicPlayerIdentityKeys(env);
    const players = supplements.map(s => ({ slug: s.playerSlug, id: s.identities.find(i => i.environment === ref)?.playerId }));
    const withId = players.filter(p => p.id);
    const gateVisible = withId.filter(p => gateKeys.has(`${p.id}:${p.slug}`) || gateKeys.has(`${p.slug}:${p.id}`) || [...gateKeys].some(k => k.includes(p.id) && k.includes(p.slug)));
    const profileShown = list => list.filter(p => supplementModule.boundProfileSupplement({ id: p.id, slug: p.slug }, ref, approved(supplements), false));
    const videoShown = list => list.filter(p => {
      const items = approved(bindingModule.boundPlayerVideoRecommendations({ id: p.id, slug: p.slug }, ref, videos, bindings));
      return renderToStaticMarkup(videoModule.PlayerRecommendedVideos({ playerSlug: p.slug, items }) ?? "").includes("video-card");
    });
    out[env] = {
      idInEnvironment: withId.length, gateVisiblePages: gateVisible.length, gateVisibleSlugs: gateVisible.map(p => p.slug),
      isolatedProfiles: profileShown(withId).length, isolatedVideos: videoShown(withId).length,
      gateVisibleWithProfileIfApproved: profileShown(gateVisible).length, gateVisibleWithVideosIfApproved: videoShown(gateVisible).length,
      noVideoData: withId.filter(p => !videoShown([p]).length).map(p => p.slug),
    };
  }
  const approvedMatches = approved(videos);
  const approvedGuides = approved(characterVideos);
  const groups = characters.map(slug => ({ slug, ...characterModule.characterRegisteredVideoGroups(slug, false, approvedGuides, approvedMatches) }));
  out.characters = {
    guide: groups.filter(g => g.guide.length).length, match: groups.filter(g => g.match.length).length,
    noGuide: groups.filter(g => !g.guide.length).map(g => g.slug), noMatch: groups.filter(g => !g.match.length).map(g => g.slug),
  };
  return out;
}

test("隔離環境(承認済みコピー)での表示件数", t => {
  const c = sfl48Counts();
  t.diagnostic(JSON.stringify(c));
  assert.equal(c.production.isolatedProfiles, c.production.idInEnvironment);
  assert.equal(c.development.isolatedProfiles, c.development.idInEnvironment);
  assert.ok(c.characters.guide >= 29);
});
