// 38本(JP22 + 別表記16)の映像QA台帳を作る。読み取り専用: 既存データ・素材は変更しない。
// 使い方: node --experimental-strip-types --no-warnings scripts/gif-intake/build-qa-ledger.mjs
// 台帳は「確認の段取り表」であり、公開承認ではない。approval は常に NOT_APPROVED(人手の承認でのみ変更)。
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadMp4MoveIds } from "./validate-gif-intake.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const read = (p) => JSON.parse(readFileSync(root + p, "utf8"));

export const QA_COLUMNS = ["character", "asset_id", "filename", "move_id", "official_name", "strength", "command", "source_location",
  "asset_sha256", "asset_status", "gif_loadable", "static_status", "visual_status", "issue", "approval", "existing_mp4", "display_eligible", "recording_order", "recording_note"];

/** 素材検査・対応表・目視記録から台帳行を組み立てる(純関数。テストから呼べる)。 */
export function buildQaRows({ jpAliases, batch2Aliases, assets, observations, mp4Ids, recording = { segments: [] } }) {
  // 素材ファイル名 → 録画順序の区間(ユーザー提供の根拠情報)。技ID・承認の確定には使わない
  const segByFile = new Map();
  for (const sg of recording.segments) for (const f of sg.existingGifs) segByFile.set(f, [...(segByFile.get(f) ?? []), sg]);
  const assetByFile = new Map(assets.map((a) => [a.file, a]));
  const obsByFile = new Map(observations.map((o) => [o.file, o]));
  const rows = [];
  const add = (character, a, jpStyle) => {
    const asset = assetByFile.get(a.sourceFile);
    const obs = obsByFile.get(a.sourceFile);
    const issues = [];
    if (!asset || !asset.sha256) issues.push("素材実体を取得できていない");
    if (a.status === "NEEDS_VISUAL_QA") issues.push(...(jpStyle ? [a.visualQaNote] : a.visualQaNotes));
    if (!jpStyle) issues.push(...a.mismatches);
    if (a.holdReasons?.length) issues.push(...a.holdReasons);
    if (obs) issues.push("未確認: " + obs.unconfirmed.join(" / "));
    rows.push({
      character, asset_id: `${character}:${a.sourceFile.replace(/\.gif$/, "")}`, filename: a.sourceFile, move_id: a.moveId,
      official_name: a.officialName, strength: a.strength, command: a.officialCommand,
      source_location: asset?.sourceLocation ?? null, asset_sha256: asset?.sha256 ?? null,
      asset_status: asset?.sha256 ? "ASSET_VERIFIED" : "ASSET_UNAVAILABLE", gif_loadable: Boolean(asset?.gifLoadable),
      static_status: a.status, visual_status: obs ? obs.status : "VISUAL_NOT_RUN",
      issue: issues.filter(Boolean).join(" | "), approval: "NOT_APPROVED",
      existing_mp4: mp4Ids.has(a.moveId), display_eligible: false, // 承認されるまで表示対象にしない
      recording_order: (segByFile.get(a.sourceFile) ?? []).map((g) => `${g.seq}${g.label}`).join(" + "),
      recording_note: (segByFile.get(a.sourceFile) ?? []).map((g) => `${g.label}: ${g.overlap}`).join(" | "),
    });
  };
  for (const a of jpAliases) add("jp", a, true);
  for (const a of batch2Aliases) add(a.character, a, false);
  return rows;
}

export function toCsv(rows) {
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [QA_COLUMNS.join(","), ...rows.map((r) => QA_COLUMNS.map((c) => esc(r[c])).join(","))].join("\n") + "\n";
}

async function loadTs(rel, name) {
  return (await import(pathToFileURL(root + rel).href))[name];
}

export async function loadQaInputs() {
  return {
    jpAliases: await loadTs("v2-web/src/data/gif-intake/jp-move-aliases.ts", "JP_MOVE_ALIASES"),
    batch2Aliases: await loadTs("v2-web/src/data/gif-intake/move-aliases-batch2.ts", "MOVE_ALIASES_BATCH2"),
    assets: read("scripts/gif-intake/asset-inspection-38-20261116.json").assets,
    observations: read("scripts/gif-intake/visual-observations-20261116.json").observations,
    mp4Ids: loadMp4MoveIds(),
    recording: read("scripts/gif-intake/jp-recording-order-20261116.json"),
  };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const inputs = await loadQaInputs();
  const rows = buildQaRows(inputs);
  // 台帳の38本に対応するGIFが無い録画区間(不足候補)
  const gaps = [...inputs.recording.segments, ...inputs.recording.cancelSegments].filter((g) => g.existingGifs.length === 0).map((g) => ({ label: g.label, overlap: g.overlap, production: g.production }));
  writeFileSync(root + "scripts/gif-intake/qa-ledger-38-20261116.json", JSON.stringify({ generated: "2026-11-16", count: rows.length, columns: QA_COLUMNS, rows, recordingOrderGaps: gaps }, null, 1));
  writeFileSync(root + "scripts/gif-intake/qa-ledger-38-20261116.csv", toCsv(rows));
  const c = (f) => rows.filter(f).length;
  console.log(JSON.stringify({ total: rows.length, verified: c((r) => r.asset_status === "ASSET_VERIFIED"), unavailable: c((r) => r.asset_status === "ASSET_UNAVAILABLE"),
    sampled: c((r) => r.visual_status === "VISUAL_SAMPLED"), notRun: c((r) => r.visual_status === "VISUAL_NOT_RUN"), pass: c((r) => r.visual_status === "VISUAL_PASS") }));
}
