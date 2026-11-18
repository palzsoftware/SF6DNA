#!/usr/bin/env node
// 全キャラ共通GIF取り込みの「データ検証」。読み取り専用(リポジトリのファイルは変更しない)。
// 接続候補マニフェスト(v2-web/src/data/gif-intake/*.json)を、公開用データと突き合わせる。
//   - 技ID/slug/キャラが公開用データ(ALL_CHARACTER_RELEASE_FIXTURE)に実在するか
//   - 技IDやGIF実体(SHA256)の重複がないか
//   - 未承認クリップが approved_for_preview になっていないか
//   - 既存MP4(承認済み)の技にGIFが重なっていないか
// 終了コード: 0=問題なし / 1=問題あり
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateMotionMediaManifest } from "../validate-motion-media.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const DATA_DIR = path.join(ROOT, "v2-web/src/data");
export const INTAKE_DIR = path.join(DATA_DIR, "gif-intake");
const readJson = (file) => JSON.parse(readFileSync(file, "utf8").replace(/^﻿/, ""));

export function loadIntakeManifests(dir = INTAKE_DIR) {
  return readdirSync(dir).filter((f) => /_GIF_MANIFEST_.*\.json$/.test(f)).sort().map((f) => ({ file: f, manifest: readJson(path.join(dir, f)) }));
}

/** 既存MP4(承認済み)の move_id 集合。MP4があるとGIFは上乗せしない。 */
export function loadMp4MoveIds(dataDir = DATA_DIR) {
  const ids = new Set();
  for (const f of readdirSync(dataDir)) {
    if (!/^SF6DNA_VER1_.*_MEDIA_MANIFEST_.*\.json$/.test(f)) continue;
    for (const c of readJson(path.join(dataDir, f)).clips ?? []) if (c.verification_status === "approved_for_preview") ids.add(c.move_id);
  }
  return ids;
}

export function validateGifIntake({ manifests, fixture, mp4MoveIds, publicRoot = null }) {
  const errors = [];
  const warnings = [];
  const movesById = new Map();
  for (const [ch, c] of Object.entries(fixture.characters)) for (const m of c.moves) movesById.set(m.id, { ch, m });
  const seenMove = new Map();
  const seenSha = new Map();
  let clipCount = 0;

  for (const { file, manifest } of manifests) {
    // 形式チェック(既存の検証を再利用)。GIF実体は未承認のうちは公開フォルダに無いので、承認済みがある時だけ実体を要求する。
    const hasApproved = manifest.clips.some((c) => c.verification_status === "approved_for_preview");
    const base = validateMotionMediaManifest(manifest, { publicRoot: publicRoot ?? path.join(ROOT, "v2-web/public"), checkFiles: hasApproved });
    errors.push(...base.errors.map((e) => `${file}: ${e}`));
    const shaByName = new Map((manifest.source_files ?? []).map((s) => [s.filename, s.sha256]));

    for (const clip of manifest.clips) {
      clipCount += 1;
      const tag = `${file}:${clip.move_slug}`;
      const hit = movesById.get(clip.move_id);
      if (!hit) { errors.push(`${tag}: UNKNOWN_MOVE_ID (HOLD対象: 技IDが公開用データに無い)`); continue; }
      if (hit.m.slug !== clip.move_slug) errors.push(`${tag}: SLUG_MISMATCH fixture=${hit.m.slug}`);
      if (hit.ch !== manifest.character_slug) errors.push(`${tag}: CHARACTER_MISMATCH fixture=${hit.ch}`);
      if (seenMove.has(clip.move_id)) errors.push(`${tag}: DUPLICATE_MOVE also in ${seenMove.get(clip.move_id)}`);
      seenMove.set(clip.move_id, tag);
      const sha = shaByName.get(clip.source_file);
      if (!sha) errors.push(`${tag}: NO_SHA256 for ${clip.source_file}`);
      else if (seenSha.has(sha)) errors.push(`${tag}: DUPLICATE_CONTENT identical to ${seenSha.get(sha)}`);
      else seenSha.set(sha, tag);
      if (clip.media_type !== "gif") errors.push(`${tag}: NOT_GIF`);
      if (mp4MoveIds.has(clip.move_id)) warnings.push(`${tag}: MP4_EXISTS (表示ではMP4が優先され、GIFは出ない)`);
      if (clip.verification_status === "approved_for_preview" && clip.cut_review_status !== "CUT_REVIEW_PASS") errors.push(`${tag}: APPROVED_WITHOUT_REVIEW`);
    }
  }
  return { errors, warnings, stats: { manifests: manifests.length, clips: clipCount } };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const fixture = readJson(path.join(DATA_DIR, "ALL_CHARACTER_RELEASE_FIXTURE_20261004.json"));
  const r = validateGifIntake({ manifests: loadIntakeManifests(), fixture, mp4MoveIds: loadMp4MoveIds() });
  console.log(JSON.stringify(r, null, 1));
  process.exit(r.errors.length ? 1 : 0);
}
