#!/usr/bin/env node
// ローカルQA専用データの生成(読み取り+新規ファイル作成のみ)。
//   入力 : luke-visual-qa-*.json(目視QAで CONFIRMED かつ localConnectionCandidate の技)
//          接続候補マニフェスト(media_url / 寸法)
//   出力 : v2-web/src/data/gif-intake/local-qa/SF6DNA_LOCAL_QA_GIF_<CHAR>_*.json
//          v2-web/.sf6dna-local-qa-gif/<char>/<file>.gif (gitignore済み・public外 → 本番に載らない)
// 注意: 出力は「承認」ではない。approval は常に NOT_APPROVED、localQaOnly は常に true。
// 使い方:
//   Luke  : node build-local-qa-data.mjs --character luke --visual-qa <json> --gif-dir <GIFのあるdir>
//   受入計画で絞る: 上のどちらにも --plan <intake-plan.mjsの出力JSON> を足すと CONNECT_READY のみ対象
//   JP等  : node build-local-qa-data.mjs --character jp --visual-qa <json> --blob-map <ファイル名→実体パスのJSON>
//           (--blob-map 指定時は、素材台帳(asset-inventory)の諸元を使い、保存名は <技slug>.gif にする)
import { readFileSync, writeFileSync, copyFileSync, mkdirSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const arg = (k) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : null; };
const character = arg("character"), visualQa = arg("visual-qa"), gifDir = arg("gif-dir"), blobMapFile = arg("blob-map");
if (!character || !visualQa || (!gifDir && !blobMapFile)) { console.error("--character --visual-qa と、--gif-dir または --blob-map が必要です"); process.exit(2); }
const readJson = (f) => JSON.parse(readFileSync(f, "utf8").replace(/^﻿/, ""));
const blobMap = blobMapFile ? readJson(blobMapFile) : null;
// 候補マニフェストは --gif-dir 方式でだけ必要。--blob-map 方式(素材台帳ベース)では不要なので、無くても動くようにする
const candidatePath = path.join(ROOT, `v2-web/src/data/gif-intake/SF6DNA_VER1_${character.toUpperCase()}_GIF_MANIFEST_CANDIDATE_20261116.json`);
const candidate = !blobMap || existsSync(candidatePath) ? readJson(candidatePath) : { clips: [] };
const clipBySlug = new Map(candidate.clips.map((c) => [c.move_slug, c]));
// 素材台帳: 既定は luke/manon/jp 用。新しいキャラは --inventory <asset-inventory-xxx.json>(records[]: character,file,assetStatus,sha256,width,height,durationMs)を指定する
// カンマ区切りで複数指定可(基本の台帳 + 追加分の台帳)
const inventoryFile = arg("inventory") ?? path.join(ROOT, "scripts/gif-intake/asset-inventory-luke-manon-jp-20261116.json");
const inventory = blobMap ? new Map(inventoryFile.split(",").flatMap((f) => readJson(path.isAbsolute(f) ? f : path.join(ROOT, f)).records).filter((r) => r.character === character).map((r) => [r.file, r])) : null;
// 受領パッケージ(ChatGPT作成の統合Manifest)で mapping_status=HOLD の素材は、技IDの候補があっても表示候補から外す(任意指定)
const holdPackage = arg("hold-package");
const heldFiles = new Set(holdPackage ? readJson(holdPackage).records.filter((r) => r.mapping_status === "HOLD").map((r) => r.asset_filename) : []);
// 受入計画(intake-plan.mjs の出力)を指定した場合は、status=CONNECT_READY のGIFだけを対象にする(HOLD・MP4優先・目視待ちは入れない)
const planFile = arg("plan");
const planReady = planFile ? new Set(planFile.split(",").flatMap((f) => readJson(f).rows).filter((r) => r.status === "CONNECT_READY").map((r) => r.file)) : null;
const entries = visualQa.split(",").flatMap((f) => readJson(f).entries).filter((e) => e.result === "CONFIRMED" && e.localConnectionCandidate === true && !heldFiles.has(e.file) && (!planReady || planReady.has(e.file)));
if (heldFiles.size) console.log(`パッケージHOLD ${heldFiles.size} 本を除外対象に指定`);
const outDir = path.join(ROOT, "v2-web/.sf6dna-local-qa-gif", character);
mkdirSync(outDir, { recursive: true });
const out = entries.map((e) => {
  if (blobMap) { // 台帳ベース: 素材実体は blob-map から読み、保存名は技slug
    const inv = inventory.get(e.file), src = blobMap[e.file];
    if (!inv || inv.assetStatus !== "ASSET_VERIFIED" || !src) throw new Error(`素材が検証済みでない/取得できない: ${e.file}`);
    const fileName = `${e.moveSlug}.gif`;
    const bytes = readFileSync(src);
    if (createHash("sha256").update(bytes).digest("hex") !== inv.sha256) throw new Error(`SHA-256不一致: ${e.file}`);
    writeFileSync(path.join(outDir, fileName), bytes);
    return { moveId: e.moveId, moveSlug: e.moveSlug, fileName, sha256: inv.sha256, bytes: bytes.length, width: inv.width, height: inv.height,
      durationMs: inv.durationMs, sourceFile: e.file, visualQa: e.result, observation: e.observation, unconfirmed: e.unconfirmed };
  }
  const clip = clipBySlug.get(e.moveSlug);
  if (!clip) throw new Error(`候補マニフェストに無い: ${e.moveSlug}`);
  const fileName = path.basename(clip.media_url);
  const bytes = readFileSync(path.join(gifDir, fileName));
  writeFileSync(path.join(outDir, fileName), bytes); // 実体のコピー(元は変更しない)
  return { moveId: e.moveId, moveSlug: e.moveSlug, fileName, sha256: createHash("sha256").update(bytes).digest("hex"),
    bytes: bytes.length, width: clip.width, height: clip.height, durationMs: clip.duration_ms, sourceFile: clip.source_file,
    visualQa: e.result, observation: e.observation, unconfirmed: e.unconfirmed };
});
const doc = { schemaVersion: 1, characterSlug: character, localQaOnly: true, approval: "NOT_APPROVED",
  note: "ローカルQA専用。公開承認ではない。表示は開発環境のlocalhost限定の隔離ルートのみ。", entries: out };
const file = path.join(ROOT, `v2-web/src/data/gif-intake/local-qa/SF6DNA_LOCAL_QA_GIF_${character.toUpperCase()}_20261116.json`);
writeFileSync(file, JSON.stringify(doc, null, 2) + "\n");
console.log(`${out.length} entries -> ${path.relative(ROOT, file)}`);
