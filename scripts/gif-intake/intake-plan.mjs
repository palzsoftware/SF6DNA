#!/usr/bin/env node
// 全キャラ共通: ChatGPTが作ったGIFのManifest(統合パッケージ)を読み、「どのGIFをローカルQAに接続できるか」を判定する。
// 読み取り専用(リポジトリのファイルは変更しない)。新しい仕組みではなく、既存の検証(validate-move-aliases.mjs の parseName、
// 公開用データ、既存MP4マニフェスト、目視QA台帳)を1本につなぐだけの薄い処理。
//
// 使い方:
//   node scripts/gif-intake/intake-plan.mjs --character <slug> --package <a.json[,b.json]>
//        [--aliases <別名対応表.json[,..]>] [--visual-qa <目視QA.json>] [--out <plan.json>]
//
// 判定結果(status)は4種類:
//   CONNECT_READY   : 技ID確認済み + 強度の裏付けあり + 目視QA済み → ローカルQAデータへ追加してよい
//   NEEDS_VISUAL_QA : 技ID・強度は問題ないが、目視QAがまだ → 目視後に追加
//   MP4_PRIORITY    : 既存の承認済みMP4がある技。GIFは上乗せしない(MP4優先)
//   HOLD            : 理由コード付きで保留(制作工程全体は止めない。他の素材は進める)
// 「承認」ではない。公開・承認Registryには一切触れない。
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseName } from "./validate-move-aliases.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DATA_DIR = path.join(ROOT, "v2-web/src/data");
const readJson = (f) => JSON.parse(readFileSync(f, "utf8").replace(/^﻿/, ""));

/** パッケージの技状態の語が「確認済み」か。NOT_VERIFIED / CANDIDATE_NOT_VERIFIED / 未記載は確認済みではない。 */
export const isVerifiedWord = (v) => typeof v === "string" && /^(VERIFIED|CONFIRMED)$/.test(v);

/** ChatGPTのパッケージはキャラ・時期でキー名が少しずつ違うので、共通の形(正規化レコード)にそろえる。 */
export function normalizePackageRecords(pkgOrList) {
  const out = [];
  const seen = new Set(); // 同じGIF(ファイル名+SHA-256)が複数のパッケージに載っていても1件にまとめる
  const visit = (r) => {
    const file = r.asset_filename ?? r.gif ?? r.filename ?? r.file ?? null;
    const sha256 = r.asset_sha256 ?? r.gif_sha256 ?? r.sha256 ?? r.qa?.sha256 ?? null; // qa:{sha256,...} と入れ子で書くパッケージもある
    if (!file || !/\.gif$/i.test(String(file))) return; // 元動画(.mp4)など、GIF以外の記載は受入対象にしない
    const key = `${file}|${sha256}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({
      file, sha256,
      technicalQa: r.technical_qa ?? r.technical_QA ?? r.qa?.technical_qa ?? null,
      mappingStatus: r.mapping_status ?? r.move_id_status ?? r.verification ?? r.visual_semantic_QA ?? null,
      claimedMoveId: [r.confirmed_move_id, r.formal_move_id].find((v) => typeof v === "string" && v.length > 8 && !/^CLAUDE|^NOT|^UNCONFIRMED/i.test(v)) ?? null,
      strengthStatus: r.confirmed_strength ?? r.strength_status ?? r.move_strength ?? null, // 強度の確認状態(キー名はパッケージごとに違う)
      publicationStatus: r.publication_status ?? null,
      retrieval: r.asset_retrieval ?? null, // 取得できなかった素材の記録(例: SIZE_LIMIT=コネクタの10MB上限)。素材が無いこととは区別する
    });
  };
  // 上位の配列(records 等)と、その1段下の配列を走査する。ファイル名キーを持つオブジェクトだけ拾う。
  const walk = (v, depth) => {
    if (Array.isArray(v)) { for (const x of v) if (x && typeof x === "object" && !Array.isArray(x)) visit(x); }
    else if (v && typeof v === "object" && depth < 2) for (const x of Object.values(v)) walk(x, depth + 1);
  };
  for (const pkg of Array.isArray(pkgOrList) ? pkgOrList : [pkgOrList]) walk(pkg, 0);
  return out;
}

/** 別名対応表・素材台帳の行を共通の形 {sha256, moveId, status} にそろえる(列名の違いを吸収)。 */
export function normalizeAliasRows(rows) {
  return rows.map((r) => ({ sha256: r.sha256 ?? r.asset_sha256 ?? null, moveId: r.moveId ?? r.move_id ?? null, status: r.status ?? r.static_status ?? null }))
    .filter((r) => r.sha256 && r.moveId);
}

/** 既存MP4(承認済み)の技ID集合(キャラ指定)。 */
export function loadMp4MoveIdsFor(character, dataDir = DATA_DIR) {
  const ids = new Set();
  for (const f of readdirSync(dataDir)) {
    if (!/^SF6DNA_VER1_.*_MEDIA_MANIFEST_.*\.json$/.test(f)) continue;
    const m = readJson(path.join(dataDir, f));
    if (m.character_slug !== character) continue;
    for (const c of m.clips ?? []) if (c.verification_status === "approved_for_preview") ids.add(c.move_id);
  }
  return ids;
}

/**
 * @param character      キャラslug
 * @param records        normalizePackageRecords() の結果
 * @param aliases        任意: 別名対応表の行 [{sha256, moveId, status}](技ID確認の自前証拠)
 * @param fixture        公開用データ全体(ALL_CHARACTER_RELEASE_FIXTURE)
 * @param mp4MoveIds     そのキャラの既存MP4技ID集合
 * @param visualQaByFile 任意: Map<ファイル名, {result, localConnectionCandidate}>
 */
export function planIntake({ character, records, aliases = [], fixture, mp4MoveIds = new Set(), visualQaByFile = new Map() }) {
  const own = fixture.characters[character];
  if (!own) throw new Error(`公開用データに無いキャラ: ${character}`);
  const movesById = new Map(own.moves.map((m) => [m.id, m]));
  const ownerOf = (id) => Object.entries(fixture.characters).find(([, v]) => v.moves.some((m) => m.id === id))?.[0] ?? null;
  const aliasBySha = new Map(normalizeAliasRows(aliases).filter((a) => a.status === "MATCHED_STATIC" || a.status === "NEEDS_STRENGTH_EVIDENCE").map((a) => [a.sha256, a]));
  const seenSha = new Map(), seenMove = new Map();
  const rows = records.map((r) => {
    const reasons = [], warnings = [];
    if (r.retrieval && r.retrieval !== "OK") reasons.push("ASSET_NOT_RETRIEVED");
    else if (!r.sha256) reasons.push("SHA_MISSING");
    if (r.technicalQa && r.technicalQa !== "PASS") reasons.push("TECHNICAL_QA_NOT_PASS");
    if (r.publicationStatus && r.publicationStatus !== "NOT_APPROVED") warnings.push("PUBLICATION_FLAG_IGNORED"); // 承認扱いにしない
    if (r.mappingStatus && /HOLD/i.test(r.mappingStatus)) reasons.push("MAPPING_HOLD");

    // 技ID: 自前の別名対応表(技名・コマンド照合済み)を優先。パッケージの主張だけの場合は「主張」として扱う。
    //   根拠の強さ: 別名対応表 > 目視QA台帳(CONFIRMED) > パッケージの主張
    const alias = r.sha256 ? aliasBySha.get(r.sha256) : null;
    const vq = visualQaByFile.get(r.file);
    const vqId = vq?.result === "CONFIRMED" && vq.moveId ? vq.moveId : null;
    let moveId = alias?.moveId ?? vqId ?? r.claimedMoveId ?? null;
    const idSource = alias ? "ALIAS_TABLE" : vqId ? "VISUAL_QA" : r.claimedMoveId ? "PACKAGE_CLAIM" : null;
    if (idSource !== "PACKAGE_CLAIM" && r.claimedMoveId && moveId !== r.claimedMoveId) { reasons.push("ID_CONFLICT"); moveId = null; }
    let move = null;
    if (!moveId) { if (!reasons.includes("ID_CONFLICT")) reasons.push("NO_MOVE_ID"); }
    else {
      move = movesById.get(moveId) ?? null;
      if (!move) reasons.push(ownerOf(moveId) ? "CROSS_CHARACTER_MOVE_ID" : "MOVE_ID_NOT_IN_FIXTURE");
    }

    // 強度(弱/中/強)がある技は、強度が「確認済み」でないと接続しない。撮影順や見た目だけでは確認済みにしない。
    if (move && alias?.status === "NEEDS_STRENGTH_EVIDENCE") reasons.push("STRENGTH_NOT_VERIFIED"); // 技IDは名前で分かるが、強度の証拠が無い(別名表側で明示)
    else if (move) {
      const p = parseName(move.name);
      const strengthBearing = ["弱", "中", "強"].some((t) => p.tags.has(t));
      // 弱/中/強の技は、パッケージが強度を VERIFIED/CONFIRMED と明記したものだけ通す。
      // 未記載・NOT_VERIFIED・CANDIDATE_NOT_VERIFIED は全てHOLD(ファイル名の区分・撮影順・見た目だけでは強度の確認にならない)
      if (strengthBearing && !isVerifiedWord(r.strengthStatus)) reasons.push("STRENGTH_NOT_VERIFIED");
    }

    if (r.sha256) { if (seenSha.has(r.sha256)) reasons.push("DUPLICATE_CONTENT"); else seenSha.set(r.sha256, r.file); }
    if (move && !reasons.length) { if (seenMove.has(move.id)) reasons.push("DUPLICATE_MOVE"); else seenMove.set(move.id, r.file); }

    let status;
    if (reasons.length) status = "HOLD";
    else if (mp4MoveIds.has(move.id)) status = "MP4_PRIORITY";
    else {
      const q = visualQaByFile.get(r.file);
      status = q?.result === "CONFIRMED" && q.localConnectionCandidate === true ? "CONNECT_READY" : "NEEDS_VISUAL_QA";
    }
    return { file: r.file, sha256: r.sha256, moveId: move?.id ?? null, moveSlug: move?.slug ?? null, idSource, status, reasons, warnings };
  });
  const summary = {};
  for (const x of rows) summary[x.status] = (summary[x.status] ?? 0) + 1;
  const holdReasons = {};
  for (const x of rows) for (const why of x.reasons) holdReasons[why] = (holdReasons[why] ?? 0) + 1;
  return { character, total: rows.length, summary, holdReasons, rows };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const arg = (k) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : null; };
  const character = arg("character"), pkgs = arg("package");
  if (!character || !pkgs) { console.error("--character と --package が必要です"); process.exit(2); }
  const records = normalizePackageRecords(pkgs.split(",").map((f) => readJson(f)));
  // 別名対応表(rows)・素材台帳(rows)のどちらでも読める
  const aliases = (arg("aliases") ?? "").split(",").filter(Boolean).flatMap((f) => readJson(f).rows ?? []);
  const vq = arg("visual-qa");
  const visualQaByFile = new Map(vq ? readJson(vq).entries.map((e) => [e.file, e]) : []);
  const fixture = readJson(path.join(DATA_DIR, "ALL_CHARACTER_RELEASE_FIXTURE_20261004.json"));
  const plan = planIntake({ character, records, aliases, fixture, mp4MoveIds: loadMp4MoveIdsFor(character), visualQaByFile });
  if (arg("out")) writeFileSync(arg("out"), JSON.stringify(plan, null, 1) + "\n");
  console.log(JSON.stringify({ character: plan.character, total: plan.total, summary: plan.summary, holdReasons: plan.holdReasons }, null, 1));
}
