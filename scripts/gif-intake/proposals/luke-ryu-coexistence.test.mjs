// ルークのローカルQA接続(connectLocalQaGifToBundle)と、リュウの既存GIF接続(connectRyuQaMotion)が併存できることの検証。
// Ryuブランチを基準にした隔離コピーで実行する。実ページ(Supabase必須)の代わりに、ページが呼ぶ2関数を同じ順序で合成する。
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const json = (p) => JSON.parse(read(p));
// TypeScriptをその場で変換して読み込む(Ryuの既存テストと同じ方法)。importは名前ごとに差し替える
function load(path, imports) {
  const loaded = { exports: {} };
  const source = ts.transpileModule(read(path), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  new Function("require", "module", "exports", source)((name) => { assert.ok(name in imports, `未登録import: ${name}`); return imports[name]; }, loaded, loaded.exports);
  return loaded.exports;
}

const ryuManifest = json("src/data/ryu-qa-gifs.json");
const ryuFixtureSrc = read("src/lib/ryu-move-review-fixture.ts");
const ryuMoves = JSON.parse(ryuFixtureSrc.slice(ryuFixtureSrc.indexOf("= [") + 2).trim().replace(/;$/, ""));
const ryu = load("src/lib/ryu-qa-motion.ts", { "@/data/ryu-qa-gifs.json": { default: ryuManifest }, "@/lib/ryu-move-review-fixture": { ryuMoveReviewFixture: ryuMoves } });

const lukeDoc = json("src/data/gif-intake/local-qa/SF6DNA_LOCAL_QA_GIF_LUKE_20261116.json");
const lukeMp4Manifest = json("src/data/SF6DNA_VER1_LUKE_MEDIA_MANIFEST_20260924.json");
const mp4Ids = new Set(lukeMp4Manifest.clips.filter((c) => c.verification_status === "approved_for_preview").map((c) => c.move_id));
const fixture = json("src/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json").characters;

// official-txt の入口判定は実物をそのまま使う(ESM .mjs なので動的に読み込む)
const { isWs5LocalCardRequest } = await import("../src/lib/official-txt-character-page-connection.mjs");
const gate = load("src/lib/local-qa-gif.ts", { "./official-txt-character-page-connection.mjs": { isWs5LocalCardRequest } });
const sources = { loadLocalQaGifDoc: async (slug) => (slug === "luke" ? lukeDoc : null), loadMp4MoveIdsFor: async (slug) => (slug === "luke" ? mp4Ids : new Set()) };
const page = load("src/lib/local-qa-gif-page.ts", { "@/lib/local-qa-gif": gate, "@/lib/local-qa-gif-sources": sources });

const withEnv = async (env, fn) => {
  const keys = ["NODE_ENV", "VERCEL", "VERCEL_ENV", "SF6DNA_WS5_TXT_PREVIEW", "VERCEL_URL", "SF6DNA_RYU_MEDIA_PREVIEW"];
  const saved = Object.fromEntries(keys.map((k) => [k, process.env[k]]));
  for (const k of keys) delete process.env[k];
  Object.assign(process.env, env);
  try { return await fn(); } finally { for (const k of keys) { if (saved[k] === undefined) delete process.env[k]; else process.env[k] = saved[k]; } }
};
const LOCAL = { NODE_ENV: "development", SF6DNA_WS5_TXT_PREVIEW: "1" };
const lukeMoves = () => fixture.luke.moves.map((m) => ({ ...m }));
// ページと同じ合成: Ryu接続 → ローカルQA接続
const compose = async (slug, moves, { host, token = null }) => {
  const ryuConnected = { moves: ryu.connectRyuQaMotion(slug, moves, host, token) };
  return page.connectLocalQaGifToBundle({ characterSlug: slug, bundle: ryuConnected, host });
};

test("ルーク(ローカル): 12本がQA用GIFとして接続され、既存mediaのある技は変更されない(MP4優先)", async () => {
  await withEnv(LOCAL, async () => {
    const before = lukeMoves();
    // 実ページでは承認済みMP4の技には media が付く。ここでは承認済みclipを持つ技へ代表のMP4 mediaを付けて再現する
    const mp4Moves = before.map((m) => (mp4Ids.has(m.id) ? { ...m, media: { id: `mp4-${m.id}`, moveId: m.id, mediaType: "video", mediaUrl: "/x.mp4", status: "approved" } } : m));
    const out = await compose("luke", mp4Moves, { host: "localhost:3000" });
    const gifs = out.moves.filter((m) => m.media?.mediaType === "gif");
    assert.equal(gifs.length, lukeDoc.entries.length); // 12
    assert.equal(gifs.length, 12);
    for (const m of gifs) {
      assert.match(m.media.mediaUrl, /^\/internal\/gif-qa\/luke\/media\/[a-z0-9-]+\.gif$/);
      assert.equal(m.media.status, "local_qa_not_approved");
      assert.ok(!mp4Ids.has(m.id), `MP4のある技にGIFが付いた: ${m.slug}`);
    }
    for (const m of mp4Moves.filter((x) => x.media)) assert.deepEqual(out.moves.find((o) => o.id === m.id).media, m.media, `MP4が変更された: ${m.slug}`);
    // GIFが付いたのはmediaの無かった技だけ。他の項目は変更しない
    for (const o of out.moves) { const b = mp4Moves.find((x) => x.id === o.id); const { media: _a, ...ra } = o; const { media: _b, ...rb } = b; assert.deepEqual(ra, rb); }
    assert.deepEqual(before, lukeMoves()); // 入力は破壊しない
  });
});

test("リュウ(Previewの正規条件): 既存の57本GIF接続はそのまま。ローカルQA接続は何も変えない", async () => {
  const env = { VERCEL: "1", VERCEL_ENV: "preview", SF6DNA_RYU_MEDIA_PREVIEW: "1", VERCEL_URL: "x.vercel.app" };
  await withEnv(env, async () => {
    const token = "test-only-valid-preview-token-0123456789";
    const solo = ryu.connectRyuQaMotion("ryu", ryuMoves.map((m) => ({ ...m })), "x.vercel.app", token);
    const out = await compose("ryu", ryuMoves.map((m) => ({ ...m })), { host: "x.vercel.app", token });
    assert.equal(solo.filter((m) => m.media?.mediaType === "gif").length, 57);
    assert.deepEqual(out.moves, solo); // 併用してもRyuの結果と完全に同じ
  });
});

test("リュウ(ローカル条件でも): QA用データが無いキャラは何も変わらず、Ryu接続が先に付けたmediaは保持される", async () => {
  await withEnv({ ...LOCAL }, async () => {
    const out = await compose("ryu", ryuMoves.map((m) => ({ ...m, media: { id: "keep", moveId: m.id, mediaType: "gif", mediaUrl: "/keep.gif", status: "draft" } })), { host: "localhost:3000" });
    assert.ok(out.moves.every((m) => m.media.id === "keep"));
  });
});

test("本番/Preview/外部ホストでは、ルークの技にQA用GIFは一切付かない", async () => {
  const cases = [
    { env: { ...LOCAL, VERCEL_ENV: "production" }, host: "localhost:3000" },
    { env: { NODE_ENV: "production", VERCEL: "1", VERCEL_ENV: "production", SF6DNA_WS5_TXT_PREVIEW: "1" }, host: "sf6dna.example.com" },
    { env: { NODE_ENV: "production", VERCEL: "1", VERCEL_ENV: "preview", SF6DNA_WS5_TXT_PREVIEW: "1" }, host: "x.vercel.app" },
    { env: LOCAL, host: "sf6dna.example.com" },
    { env: LOCAL, host: "localhost.evil.com" },
    { env: { NODE_ENV: "development" }, host: "localhost:3000" }, // フラグ無し
  ];
  for (const c of cases) {
    await withEnv(c.env, async () => {
      const input = { moves: lukeMoves() };
      const out = await page.connectLocalQaGifToBundle({ characterSlug: "luke", bundle: input, host: c.host });
      assert.equal(out, input, JSON.stringify(c)); // 同一オブジェクトをそのまま返す(何もしない)
      assert.ok(out.moves.every((m) => m.media?.status !== "local_qa_not_approved"));
    });
  }
});

test("ページは Ryu接続 → ローカルQA接続 の順で合成している", () => {
  const src = read("src/app/characters/[slug]/page.tsx");
  assert.ok(src.indexOf("connectRyuQaMotion(character.slug") < src.indexOf("connectLocalQaGifToBundle({"));
  assert.match(src, /bundle: ryuConnectedBundle/);
});
