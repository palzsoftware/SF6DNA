#!/usr/bin/env node
// GIF統合パイプライン(キャラ別・読み取り中心)。「GIF統合作業を進めてください」の標準工程を1コマンドで回す。
//
//   node scripts/gif-intake/run-gif-pipeline.mjs --characters luke,jp,manon [--views qa,unified] [--port 3107]
//        [--skip-browser] [--full] [--restore-next-env] [--out <dir>]
//
// 工程(キャラごとに結果を表で出す。失敗があれば終了コード1):
//   1. 素材とManifestの照合  : ローカルQA用データ(JSON)・GIF実体のSHA-256・公開用データの技ID/slug・既存MP4との重複・gitignore/public外
//   2. ローカルQA表示データの生成: 既存データの再生成が必要な場合は build-local-qa-data.mjs を使う(素材の場所が要るため、ここでは「ある/ない」を確認し手順を表示)
//   3. Playwright(Chromium)でGIF表示・再生確認(開発サーバーが無ければ自動で起動・停止する)
//   4. 関連テスト(local-qa-gif.test.mjs ほか。--full で全テスト)
//   5. 保護対象11ファイルの差分SHA-256確認
//   6. next-env.d.ts の自動変更の検出(--restore-next-env は「実行前に変更が無かった」場合のみ、その1ファイルだけ元に戻す)
//
// 安全: Commit/Push/DB/Deploy は一切しない。本番にはアクセスしない。未承認のGIFを承認扱いにしない。
import { spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { verifyGifPlayback } from "./verify-gif-playback.mjs";
import { verifyGifVariants } from "./verify-gif-variants.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const WEB = path.join(ROOT, "v2-web");
const arg = (k, d = null) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : d; };
const flag = (k) => process.argv.includes(`--${k}`);

const characters = (arg("characters", "luke,jp,manon")).split(",").filter(Boolean);
const views = (arg("views", "qa,unified")).split(",");
const port = Number(arg("port", "3107"));
const base = `http://127.0.0.1:${port}`;
const outDir = arg("out", path.join(os.tmpdir(), "sf6dna-gif-pipeline-out"));
mkdirSync(outDir, { recursive: true });

// 保護対象の未コミット11ファイル(変更・追加の状態を含む差分のSHA-256が固定されていること)
const PROTECTED = [
  "scripts/luke-gif/Get-LukeGifs.ps1", "scripts/luke-gif/gif-inspect.mjs", "scripts/luke-gif/luke-gif-approvals.json",
  "scripts/luke-gif/luke-gif-mapping.json", "scripts/luke-gif/verify-luke-gifs.mjs",
  "v2-web/src/components/diagnosis-history-tool.tsx", "v2-web/src/data/SF6DNA_VER1_LUKE_GIF_MANIFEST_20261116.json",
  "v2-web/src/lib/daily-training.ts", "v2-web/src/lib/preview-motion-media-pilot.ts",
  "v2-web/tests/daily-training.test.mjs", "v2-web/tests/luke-gif-pipeline.test.mjs",
];
const PROTECTED_SHA = arg("expect-sha", "14c6047b216322a02330b06f9253c80e0e11d835c34677ae6c83c31cfe1182a0");

const results = []; // {step, character, ok, detail}
const record = (step, character, ok, detail) => { results.push({ step, character, ok, detail }); console.log(`${ok ? "PASS" : "FAIL"}  [${character}] ${step}: ${detail}`); };
const git = (...a) => spawnSync("git", ["-C", ROOT, ...a], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
const sha256 = (b) => createHash("sha256").update(b).digest("hex");
const readJson = (f) => JSON.parse(readFileSync(f, "utf8").replace(/^﻿/, ""));

// ---- 事前状態の記録(next-env.d.ts / 保護対象) ----
const nextEnvPath = path.join(WEB, "next-env.d.ts");
const nextEnvBefore = readFileSync(nextEnvPath, "utf8");
const nextEnvWasClean = git("diff", "--quiet", "--", "v2-web/next-env.d.ts").status === 0;
const protectedSha = () => sha256(Buffer.from(git("diff", "HEAD", "--", ...PROTECTED).stdout));
const protectedBefore = protectedSha();

// ---- 1. 素材とManifestの照合(キャラ別) ----
function checkMaterials(slug) {
  const dataFile = path.join(WEB, `src/data/gif-intake/local-qa/SF6DNA_LOCAL_QA_GIF_${slug.toUpperCase()}_20261116.json`);
  if (!existsSync(dataFile)) { record("素材照合", slug, false, `ローカルQA用データが無い: ${path.relative(ROOT, dataFile)}`); return null; }
  const doc = readJson(dataFile);
  const fixture = readJson(path.join(WEB, "src/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json")).characters[slug];
  const problems = [];
  if (doc.localQaOnly !== true || doc.approval !== "NOT_APPROVED") problems.push("localQaOnly/NOT_APPROVED でない");
  const byId = new Map(fixture.moves.map((m) => [m.id, m]));
  const seen = new Set();
  let filesOk = 0;
  for (const e of doc.entries) {
    const m = byId.get(e.moveId);
    if (!m || m.slug !== e.moveSlug) problems.push(`技ID/slug不一致 ${e.moveSlug}`);
    if (m?.media) problems.push(`公開用データに既にmediaあり(MP4優先) ${e.moveSlug}`);
    if (seen.has(e.moveId) || seen.has(e.sha256)) problems.push(`重複 ${e.moveSlug}`); seen.add(e.moveId); seen.add(e.sha256);
    const gif = path.join(WEB, ".sf6dna-local-qa-gif", slug, e.fileName);
    if (!existsSync(gif)) problems.push(`GIF実体が無い ${e.fileName}(build-local-qa-data.mjs で再生成)`);
    else if (sha256(readFileSync(gif)) !== e.sha256) problems.push(`SHA-256不一致 ${e.fileName}`);
    else filesOk++;
    if (existsSync(path.join(WEB, "public", "media", "moves", slug, "gif", e.fileName))) problems.push(`public配下に同名GIF ${e.fileName}`);
  }
  const ignored = git("check-ignore", "-q", `v2-web/.sf6dna-local-qa-gif/${slug}/x.gif`).status === 0;
  if (!ignored) problems.push(".sf6dna-local-qa-gif がgitignoreされていない");
  record("素材照合", slug, problems.length === 0, problems.length ? problems.join(" / ") : `データ${doc.entries.length}本・GIF実体SHA一致${filesOk}本・MP4/公開media重複なし・gitignore済み`);
  return doc;
}

// 承認済み(approved_for_preview)MP4のclip数。QA対応表(local-qa-gif-sources.ts)のMANIFEST名から取得。対応表に無ければ null(検査しない)
async function approvedMp4Count(slug) {
  const src = readFileSync(path.join(WEB, "src/lib/local-qa-gif-sources.ts"), "utf8");
  const m = src.match(new RegExp(`\\b${slug}: async \\(\\) => \\(await import\\("@/data/([^"]+\\.json)"\\)\\)`));
  if (!m) return null;
  return readJson(path.join(WEB, "src/data", m[1])).clips.filter((c) => c.verification_status === "approved_for_preview").length;
}

// ---- 3. 開発サーバー(必要なら起動) ----
const ping = (p, host) => new Promise((resolve) => {
  const req = http.get({ host: "127.0.0.1", port, path: p, headers: host ? { host } : {} }, (res) => { res.resume(); resolve(res.statusCode); });
  req.on("error", () => resolve(0)); req.setTimeout(5000, () => { req.destroy(); resolve(0); });
});
let server = null;
async function ensureServer() {
  if ((await ping("/internal/gif-qa/luke")) === 200) return false; // 既に起動済み
  server = spawn("npx", ["next", "dev", "-p", String(port)], { cwd: WEB, env: { ...process.env, SF6DNA_WS5_TXT_PREVIEW: "1" }, stdio: "ignore", detached: true });
  for (let i = 0; i < 60; i++) { await new Promise((r) => setTimeout(r, 1000)); if ((await ping("/internal/gif-qa/luke")) === 200) return true; }
  throw new Error("開発サーバーが起動しませんでした");
}

try {
  const docs = {};
  for (const c of characters) docs[c] = checkMaterials(c);

  // ---- 3. ブラウザ検証 ----
  if (!flag("skip-browser")) {
    const started = await ensureServer();
    // 入口判定: 外部ホスト名(Host偽装)では 404 になること
    const spoof = await ping("/internal/gif-qa/luke", "sf6dna.example.com");
    record("入口判定", "-", spoof === 404, `外部Host相当のアクセスは ${spoof}(404が期待値)${started ? " / 開発サーバーを自動起動" : ""}`);
    for (const c of characters) {
      if (!docs[c]) continue;
      for (const v of views) {
        // 通常ページ部品の確認(unified)では、承認済みMP4のclip数と画面上の<video>数が一致することも見る(MP4優先の維持)
        const expectedMp4 = v === "unified" ? await approvedMp4Count(c) : null;
        const r = await verifyGifPlayback({ character: c, base, view: v, expected: docs[c].entries.length, outDir, expectedMp4 });
        record(`ブラウザ表示(${v})`, c, r.pass, `GIF ${r.loaded}/${r.expected}本表示・動作確認${r.moving}本${r.movingUnmeasured ? `(未計測${r.movingUnmeasured})` : ""}・配信エラー${r.bad.length}・noindex=${r.noindex}・MP4動画${r.mp4Videos}本${r.mp4Videos === expectedMp4 ? "(承認済みclip数と一致)" : ""}が同居`);
      }
    }
  }

  // ---- 3b. 派生パターンの切り替え表示(派生データがあるキャラだけ) ----
  if (!flag("skip-browser")) {
    for (const c of characters) {
      const vf = path.join(WEB, "src/data/gif-intake/local-qa", `SF6DNA_LOCAL_QA_GIF_${c.toUpperCase()}_VARIANTS_20261116.json`);
      if (!existsSync(vf)) continue;
      const expectedGroups = JSON.parse(readFileSync(vf, "utf8")).groups.length;
      const r = await verifyGifVariants({ character: c, base: base.replace("127.0.0.1", "localhost"), outDir, expectedGroups });
      record("ブラウザ表示(variants)", c, r.pass, `技${r.groups}件・タブ${r.tabs}個・切替成功${r.switched}・GIF表示${r.loaded}・動作確認${r.moving}・1枚だけ表示${r.onlyOneVisible}/${r.groups}・配信エラー${r.bad.length}・noindex=${r.noindex}`);
    }
  }

  // ---- 4. 関連テスト ----
  const testArgs = flag("full") ? ["--test", "tests/*.test.mjs"] : ["--test", "tests/local-qa-gif.test.mjs", "tests/local-qa-gif-variants.test.mjs", "tests/luke-normals-origin.test.mjs", "tests/gif-intake-multi.test.mjs", "tests/luke-ledger.test.mjs", "tests/move-aliases-batch2.test.mjs", "tests/gif-intake-plan.test.mjs"];
  const t = spawnSync(process.execPath, testArgs, { cwd: WEB, encoding: "utf8", maxBuffer: 256 * 1024 * 1024, shell: false });
  const line = (k) => (t.stdout.match(new RegExp(`^# ${k} (\\d+)`, "m")) ?? [])[1] ?? "?";
  record(flag("full") ? "全テスト" : "関連テスト", "-", t.status === 0, `pass ${line("pass")} / fail ${line("fail")} / skipped ${line("skipped")}(既存の13 SKIPは新規エラーではない)`);
} finally {
  if (server) { try { process.kill(-server.pid); } catch { /* 既に終了 */ } }
}

// ---- 5. 保護対象11ファイル ----
const after = protectedSha();
record("保護対象11ファイル", "-", after === PROTECTED_SHA && after === protectedBefore, `差分SHA-256 ${after.slice(0, 12)}…(期待 ${PROTECTED_SHA.slice(0, 12)}…)`);

// ---- 6. next-env.d.ts ----
const nextEnvAfter = readFileSync(nextEnvPath, "utf8");
const changed = nextEnvAfter !== nextEnvBefore;
let nextEnvNote = changed ? "next dev/build により自動変更あり(実行前と差分あり)" : "変更なし";
if (changed) {
  const onlyDevPath = nextEnvAfter.replace(/\.next\/dev\/types/g, ".next/types") === nextEnvBefore;
  nextEnvNote += onlyDevPath ? "・内容は .next/ → .next/dev/ のパス差のみ(Next.jsの既知の自動生成)" : "・既知パターン以外の差分(要確認)";
  if (flag("restore-next-env") && nextEnvWasClean && onlyDevPath) { writeFileSync(nextEnvPath, nextEnvBefore); nextEnvNote += "→実行前の内容に戻しました(実行前は未変更だったため)"; }
  else nextEnvNote += "→自動では戻していません";
}
record("next-env.d.ts", "-", true, nextEnvNote);

const failed = results.filter((r) => !r.ok);
writeFileSync(path.join(outDir, "pipeline-result.json"), JSON.stringify({ characters, views, results }, null, 2));
console.log(`\n結果: ${results.length - failed.length}/${results.length} PASS${failed.length ? ` / FAIL ${failed.length}` : ""}  (詳細 ${path.relative(ROOT, outDir)}/pipeline-result.json)`);
process.exit(failed.length ? 1 : 0);
