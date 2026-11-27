import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
// A displayed card carries id "youtube:<id>"; raw data rows carry youtubeId.
const yid = x => x.youtubeId ?? String(x.id).replace(/^youtube:/, "");
import { approvedRowKeys, expectedApproval, preApproval, readyIds, holdIds, excludedIds, laterRowKeys } from "./helpers/approved-videos-v47.mjs";

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
const registeredModule = realModule("lib/registered-youtube-videos.ts");
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

test("ボンちゃん・かずのこ: 相互リンクで確認したYouTube/Twitchを採用し、既存確認済みのXは維持", () => {
  const sns = slug => supplements.find(s => s.playerSlug === slug).facts.find(f => f.field === "sns")?.value ?? [];
  assert.deepEqual(sns("bonchan").map(l => l.url), ["https://x.com/katitagaribon", "https://www.youtube.com/@progamerbonchan5855", "https://www.twitch.tv/bonchan0311"]);
  assert.deepEqual(sns("kazunoko").map(l => l.url), ["https://x.com/kazunoko0215", "https://www.youtube.com/@KazunokoChannel", "https://www.twitch.tv/kazunokon"]);
});

test("第7節の4選手: 公式クリップが主リンク、フル配信は時刻なしの補助リンクで1試合1カード", () => {
  for (const [slug, clip] of [["jr", "e-V2iILIsUQ"], ["yas", "e-V2iILIsUQ"], ["wabiichi", "86lnoMqGvIs"], ["kawano", "86lnoMqGvIs"]]) {
    const player = { id: bindings.find(b => b.playerSlug === slug && b.environment === ENV.development).playerId, slug };
    const items = bindingModule.boundPlayerVideoRecommendations(player, ENV.development, videos, bindings);
    const html = renderToStaticMarkup(videoModule.PlayerRecommendedVideos({ playerSlug: slug, items, draftPreview: true }));
    assert.equal((html.match(new RegExp(`data-recommendation-key="${slug}-${clip}"`, "g")) ?? []).length, 1, slug);
    assert.doesNotMatch(html, new RegExp(`data-recommendation-key="${slug}-${FULL}"`), slug);
    assert.equal((html.match(/data-same-match-full-stream="BDKiKN1KD0s"/g) ?? []).length, 1, slug);
    assert.doesNotMatch(html, /&amp;t=/, slug);
    assert.match(videos.find(v => v.key === `${slug}-${clip}`).matchEvidence.chapterNote, /概要欄の章/);
  }
});

test("マリーザの2025年公式対戦は年を明記し、食い違うDivision・未確認の使用時刻を表示しない", () => {
  // The two reviewed 2025 rows from before V51 (later approved additions are checked against their own list).
  const rows = characterVideos.filter(v => v.characterSlug === "marisa" && v.category === "対戦" && !laterRowKeys.has(v.key));
  assert.equal(rows.length, 2);
  const g = characterModule.characterRegisteredVideoGroups("marisa", ENV.development, true);
  const html = renderToStaticMarkup(characterModule.CharacterRegisteredVideos({ characterSlug: "marisa", environment: ENV.development, preview: true }));
  for (const r of rows) {
    assert.ok(g.match.some(c => c.id === `youtube:${r.youtubeId}`));
    assert.match(r.origin, /2025年の過去大会/);
    assert.doesNotMatch(r.title, /Division|第\d+節/);
  }
  assert.match(html, /2025年の過去大会/);
  // The two adopted 2025 cards: no conflicting Division text and no unconfirmed time offset.
  for (const r of rows) {
    const card = html.split(`data-registered-video="${r.youtubeId}"`)[1].split("</article>")[0];
    assert.doesNotMatch(card, /Division|&amp;t=/, r.youtubeId);
  }
});

test("ヤスミンの候補2本は保留のため未登録", () => {
  for (const id of ["U_NF2QbJnTY", "dxig3iBlxXk"]) {
    assert.ok(!characterVideos.some(v => v.youtubeId === id));
    assert.ok(!videos.some(v => v.youtubeId === id));
  }
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
  const rows = videos.filter(v => v.matchEvidence && (v.youtubeId === FULL || v.sameMatchFullStream?.youtubeId === FULL));
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

test("キャラ動画: 公式ガイドは29本・29キャラ。承認状態は承認済みリスト(V47)と一致し、それ以外はPENDING", () => {
  assert.equal(characters.length, 32);
  const official = characterVideos.filter(v => v.origin === "公式キャラクターガイド");
  assert.equal(new Set(official.map(v => v.youtubeId)).size, 29);
  assert.equal(new Set(official.map(v => v.characterSlug)).size, 29);
  for (const v of characterVideos) { assert.equal(v.publicationApproval, expectedApproval(v.key)); assert.ok(characters.includes(v.characterSlug), v.key); }
});

test("現在の公開設定: 表示されるのは承認済み動画だけ。承認前データなら従来どおり何も出ない。補足は出ない", () => {
  const ids = rows => new Set(rows.map(yid));
  const preSource = { players: preApproval(videos), characters: preApproval(characterVideos) };
  for (const env of Object.values(ENV)) {
    const shown = registeredModule.registeredYouTubeVideos(env, false);
    const shownIds = ids(shown);
    assert.equal(shownIds.size, shown.length, `${env}: duplicate cards`);
    for (const id of shownIds) assert.ok(readyIds.has(id), `${env}: ${id} is not in the approved list`);
    for (const id of [...holdIds, ...excludedIds]) assert.ok(!shownIds.has(id), `${env}: HOLD/EXCLUDED ${id} must not be shown`);
    // Original non-public contract is kept for the same data before approval.
    assert.equal(registeredModule.registeredYouTubeVideos(env, false, preSource).length, 0, `${env}: pre-approval data`);
    for (const slug of characters) {
      const g = characterModule.characterRegisteredVideoGroups(slug, env, false);
      for (const c of [...g.guide, ...g.match]) assert.ok(readyIds.has(yid(c)), `${slug}/${env}: ${yid(c)}`);
    }
  }
  // Production shows every approved card; development differs only by the Arjun character rows that the development DB does not know (B projection: 691 / 687).
  assert.deepEqual([...ids(registeredModule.registeredYouTubeVideos(ENV.production, false))].sort(), [...readyIds].sort());
  // Development = production minus cards whose only characters are unknown to the development DB (Arjun rows).
  const devMissing = new Set(Object.entries(read("../src/data/character-videos/character-ids.json").characters).filter(([, c]) => c.developmentMissing).map(([s]) => s));
  const prodCards = registeredModule.registeredYouTubeVideos(ENV.production, false);
  const devOnlyMissing = prodCards.filter(c => c.playerSlugs.length === 0 && c.characterSlugs.length > 0 && c.characterSlugs.every(s => devMissing.has(s)));
  assert.equal(registeredModule.registeredYouTubeVideos(ENV.development, false).length, prodCards.length - devOnlyMissing.length);
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
    // Same projection the Player図鑑 関連動画 section uses, with approved copies in memory.
    const projected = registeredModule.registeredYouTubeVideos(ref, false, { players: approved(videos), characters: approved(characterVideos) });
    const videoShown = list => list.filter(p => projected.some(v => v.entityRefs.players.some(r => r.id === p.id)));
    out[env] = {
      idInEnvironment: withId.length, gateVisiblePages: gateVisible.length, gateVisibleSlugs: gateVisible.map(p => p.slug),
      isolatedProfiles: profileShown(withId).length, isolatedVideos: videoShown(withId).length,
      gateVisibleWithProfileIfApproved: profileShown(gateVisible).length, gateVisibleWithVideosIfApproved: videoShown(gateVisible).length,
      noVideoData: withId.filter(p => !videoShown([p]).length).map(p => p.slug),
    };
  }
  const projectedProd = registeredModule.registeredYouTubeVideos(ENV.production, false, { players: approved(videos), characters: approved(characterVideos) });
  const groups = characters.map(slug => ({ slug, ...characterModule.characterRegisteredVideoGroups(slug, ENV.production, false, [], projectedProd) }));
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

// ---- 3-screen shared projection (registered-youtube-videos.ts) ----
const approvedAll = rows => rows.map(r => ({ ...r, publicationApproval: "APPROVED" }));
const projectedDev = () => registeredModule.registeredYouTubeVideos(ENV.development, false, { players: approvedAll(videos), characters: approvedAll(characterVideos) });

test("3画面共通: YouTube IDごとに1枚、サムネイル・再生リンクはYouTube", () => {
  const list = projectedDev();
  assert.equal(new Set(list.map(v => v.id)).size, list.length);
  for (const v of list) {
    const id = v.id.replace("youtube:", "");
    assert.match(id, /^[A-Za-z0-9_-]{11}$/);
    assert.ok(v.url.startsWith(`https://www.youtube.com/watch?v=${id}`), v.id);
    assert.equal(v.thumbnailUrl, `https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
    assert.equal(v.detailHref, null);
    for (const s of v.supportingLinks) assert.match(s.url, /^https:\/\/www\.youtube\.com\/watch\?v=/);
    assert.doesNotMatch(JSON.stringify(v), /twitch\.tv/);
  }
});

test("同じ試合: クリップが主リンク、フル配信は補助リンク。全試合がクリップで覆われたフル配信は単独カードにしない", () => {
  const list = projectedDev();
  assert.ok(!list.some(v => v.id === `youtube:${FULL}`), `full stream listed separately: ${JSON.stringify(list.find(v => v.id === `youtube:${FULL}`)?.playerSlugs)}`);
  for (const clip of ["e-V2iILIsUQ", "86lnoMqGvIs", "awpc0ZUw9yQ", "tN5gStQ8EhM"]) {
    const v = list.find(x => x.id === `youtube:${clip}`);
    assert.ok(v, clip);
    assert.deepEqual(v.supportingLinks.map(s => s.url), [`https://www.youtube.com/watch?v=${FULL}`]);
    assert.equal(v.playerSlugs.length, 2, clip);
  }
  // Chapter times only: no time-offset link. Offsets appear only where the start was confirmed in the video.
  const confirmedFull = new Set(videos.filter(r => r.sameMatchFullStream?.startSeconds > 0).map(r => `${r.sameMatchFullStream.youtubeId}&t=${r.sameMatchFullStream.startSeconds}s`));
  for (const v of list) for (const s of v.supportingLinks) if (/&t=/.test(s.url)) assert.ok(confirmedFull.has(s.url.split("v=")[1]), s.url);
  assert.ok(!list.some(v => v.supportingLinks.some(s => s.url.includes(`${FULL}&t=`))));
  const offsets = list.filter(v => /&t=/.test(v.url)).map(v => v.id.replace("youtube:", ""));
  for (const id of offsets) assert.ok(videos.some(r => r.youtubeId === id && r.startSeconds > 0 && !/概要欄/.test(r.evidenceBasis ?? "")), id);
});

test("ランクマ／リプレイ: 種別を分け、投稿チャンネルと出演選手を区別", () => {
  const ranked = projectedDev().filter(v => v.registeredCategory === "ranked_replay");
  assert.ok(ranked.length >= 1);
  const shuto = ranked.find(v => v.id === "youtube:hzweo7_uwps");
  assert.equal(shuto.videoType, "ranked_replay");
  assert.equal(shuto.channelName, "しゅーとチャンネル / Shuto");
  assert.deepEqual(shuto.playerSlugs, ["shuto"]);
  assert.deepEqual(shuto.players.length, 1);
});

test("キャラ・選手の紐づけは現行ID（キャラUUID・環境別の選手ID）だけ", () => {
  const ids = read("../src/data/character-videos/character-ids.json").characters;
  const charIds = new Set(Object.values(ids).map(c => c.id));
  const playerIds = new Set(bindings.filter(b => b.environment === ENV.development).map(b => b.playerId));
  for (const v of projectedDev()) {
    for (const c of v.entityRefs.characters) assert.ok(charIds.has(c.id), c.id);
    for (const p of v.entityRefs.players) assert.ok(playerIds.has(p.id), p.id);
  }
  assert.ok(!projectedDev().some(v => v.characterSlugs.includes("arjun")));
});

test("Player図鑑: フル配信のカードには本人の試合のキャラ・選手だけを出す（同じ配信内の別試合と区別）", () => {
  const tokido = bindings.find(b => b.playerSlug === "tokido" && b.environment === ENV.development).playerId;
  const list = registeredModule.registeredYouTubeVideos(ENV.development, false, { players: approvedAll(videos), onlyPlayerId: tokido });
  assert.ok(list.length > 0);
  for (const v of list) {
    assert.deepEqual(v.playerSlugs, ["tokido"], v.id);
    assert.ok(!v.players.includes("YAS"), v.id);
  }
});

test("V1〜V3: リプレイの確認時刻（1:00など）は開始時刻に使わず、Year表記は未検証の版情報として扱う", () => {
  const checked = videos.filter(v => v.matchEvidence?.identifiedAt && v.matchEvidence.startTimeConfirmed === false);
  assert.ok(checked.length > 0);
  for (const v of checked) assert.ok(!(v.startSeconds > 0), v.key);
  const list = projectedDev();
  for (const v of checked) {
    const card = list.find(x => x.id === `youtube:${v.youtubeId}`);
    if (card) assert.doesNotMatch(card.url, /&t=/, v.key);
  }
  const versioned = [...videos, ...characterVideos].filter(v => v.versionNote || /出典の版情報/.test(v.caution ?? ""));
  assert.ok(versioned.length > 0);
  for (const v of videos.filter(x => x.versionNote)) assert.equal(v.patchVerified, false, v.key);
});

test("通常設定: 未承認の動画はどの画面のデータにも入らない", () => {
  const preSource = { players: preApproval(videos), characters: preApproval(characterVideos) };
  for (const env of Object.values(ENV)) {
    assert.equal(registeredModule.registeredYouTubeVideos(env, false, preSource).length, 0);
    for (const v of registeredModule.registeredYouTubeVideos(env, false)) assert.ok(readyIds.has(yid(v)), yid(v));
  }
  assert.equal(registeredModule.registeredYouTubeVideos("unknownref", true).length, 0);
});

test("承認値の検査: 承認済み行のキー一覧が承認リストと完全一致し、不正な承認値・HOLD・EXCLUDEDは表示されない", () => {
  const approvedKeys = [...videos, ...characterVideos].filter(r => r.publicationApproval === "APPROVED").map(r => r.key).sort();
  assert.deepEqual(approvedKeys, [...approvedRowKeys].sort());
  for (const r of [...videos, ...characterVideos]) assert.ok(["APPROVED", "PENDING"].includes(r.publicationApproval), r.key);
  // Anything that is not exactly APPROVED never becomes a card.
  for (const bad of ["approved", "Approved", "TRUE", "true", "YES", "", null, undefined, 1]) {
    const source = { players: videos.map(v => ({ ...v, publicationApproval: bad })), characters: characterVideos.map(v => ({ ...v, publicationApproval: bad })) };
    for (const env of Object.values(ENV)) assert.equal(registeredModule.registeredYouTubeVideos(env, false, source).length, 0, String(bad));
  }
  // HOLD / EXCLUDED video ids have no APPROVED row anywhere in the data.
  for (const r of [...videos, ...characterVideos]) if (holdIds.has(r.youtubeId) || excludedIds.has(r.youtubeId)) assert.equal(r.publicationApproval, "PENDING", r.key);
});

test("アルジュン: 開発DBは別ID(draft)。developmentMissingが有効な間は開発に出ず、解除時だけ環境別IDを使う（公開境界は変えない）", () => {
  const ids = read("../src/data/character-videos/character-ids.json").characters;
  assert.equal(ids.arjun.developmentMissing, true); // the development row is still draft: nothing is shown there
  assert.equal(ids.arjun.id, "d8d0fac8-c6af-485f-89b6-b3593ff1d38c");
  assert.equal(ids.arjun.developmentId, "d886366d-8ef0-417a-a524-8cae980697b5");
  for (const [slug, c] of Object.entries(ids)) if (slug !== "arjun") assert.equal(c.developmentId, undefined, slug); // every other id is identical in both environments
  const arjun = characterVideos.filter(v => v.characterSlug === "arjun");
  const shownIds = env => registeredModule.registeredYouTubeVideos(env, false).flatMap(v => v.entityRefs.characters.map(c => c.id));
  assert.ok(arjun.length > 0);
  assert.ok(!shownIds(ENV.development).includes(ids.arjun.developmentId) && !shownIds(ENV.development).includes(ids.arjun.id));
  assert.ok(shownIds(ENV.production).includes(ids.arjun.id));
});
