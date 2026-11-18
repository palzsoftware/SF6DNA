import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { LocalQaGifDoc } from "@/lib/local-qa-gif";
import type { LocalQaVariantDoc } from "@/lib/local-qa-gif-variants";

// ローカルQA用GIFデータと、キャラ別の「既存MP4マニフェスト」を探す処理(全キャラ共通)。
//
// 【変更点】以前はキャラごとに「ファイル名の対応表」を手で足す必要があり、MP4マニフェストの対応表に
//   載っていないキャラ(jamie/marisa/yasmine/ryu など)ではMP4優先が効かない恐れがあった。
//   今は「ファイル名の規則」で自動的に見つける。新しいキャラを足すときにこのファイルの編集は要らない。
//
// 命名規則(すべて v2-web/src/data 配下):
//   QA用GIFデータ   : gif-intake/local-qa/SF6DNA_LOCAL_QA_GIF_<SLUG大文字>_<日付8桁>.json          (複数あれば日付が新しいもの)
//   派生パターン     : gif-intake/local-qa/SF6DNA_LOCAL_QA_GIF_<SLUG大文字>_VARIANTS_<日付8桁>.json
//   既存MP4マニフェスト: SF6DNA_VER1_*_MEDIA_MANIFEST_*.json のうち character_slug が一致するもの(全部を合算)
//
// QA用データ(JSON)は import せず、入口判定を通った後に実行時に読む。
// こうすると本番ビルドの成果物にQA用データが入らない(要点: import するとバンドルに含まれる)。

/** 技のslug(キャラ名)として安全な形か。パス操作(../ など)を防ぐ。 */
export function isSafeCharacterSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

// process.cwd() は v2-web。turbopackIgnore: ビルド時のファイル追跡にこのパスを拾わせない(本番の成果物に同梱しない)
const dataDir = () => path.join(/* turbopackIgnore: true */ process.cwd(), "src/data");
// 注意: path.join が複数回出てくるので、すべての path.join の第1引数に turbopackIgnore を付ける。
//   1か所でも付け忘れると、ビルド時のファイル追跡(.nft.json)がQA用JSONを「同梱候補」として拾ってしまう(実測済み)。
const qaDir = () => path.join(/* turbopackIgnore: true */ dataDir(), "gif-intake/local-qa");

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** ファイル名の規則に合う中で、日付が最も新しいファイル名を返す(無ければ null)。純粋関数。 */
export function pickLatestQaFile(fileNames: ReadonlyArray<string>, slug: string, kind: "gif" | "variants"): string | null {
  if (!isSafeCharacterSlug(slug)) return null;
  const upper = escapeRegExp(slug.toUpperCase());
  const re = new RegExp(kind === "gif" ? `^SF6DNA_LOCAL_QA_GIF_${upper}_(\\d{8})\\.json$` : `^SF6DNA_LOCAL_QA_GIF_${upper}_VARIANTS_(\\d{8})\\.json$`);
  const hits = fileNames.filter((f) => re.test(f)).sort();
  return hits.length ? hits[hits.length - 1] : null;
}

async function readJsonIfExists<T>(file: string): Promise<T | null> {
  try {
    return JSON.parse((await readFile(file, "utf8")).replace(/^﻿/, "")) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

async function listDir(dir: string): Promise<string[]> {
  try {
    return await readdir(dir);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

/** QA用データがあるキャラのslug一覧(QA用データ=基本のGIFデータのみ。派生パターン専用ファイルは数えない)。 */
export async function listLocalQaGifCharacters(): Promise<string[]> {
  const slugs = new Set<string>();
  for (const f of await listDir(qaDir())) {
    const m = /^SF6DNA_LOCAL_QA_GIF_([A-Z0-9]+(?:-[A-Z0-9]+)*)_(\d{8})\.json$/.exec(f);
    if (m) slugs.add(m[1].toLowerCase());
  }
  return [...slugs].sort();
}

/** 入口判定(isLocalQaGifRequest)を通った後にだけ呼ぶこと。 */
export async function loadLocalQaGifDoc(slug: string): Promise<LocalQaGifDoc | null> {
  const name = pickLatestQaFile(await listDir(qaDir()), slug, "gif");
  return name ? readJsonIfExists<LocalQaGifDoc>(path.join(/* turbopackIgnore: true */ qaDir(), name)) : null;
}

/** 入口判定(isLocalQaGifRequest)を通った後にだけ呼ぶこと。 */
export async function loadLocalQaVariantDoc(slug: string): Promise<LocalQaVariantDoc | null> {
  const name = pickLatestQaFile(await listDir(qaDir()), slug, "variants");
  return name ? readJsonIfExists<LocalQaVariantDoc>(path.join(/* turbopackIgnore: true */ qaDir(), name)) : null;
}

type Mp4Manifest = { character_slug?: string; clips?: ReadonlyArray<{ move_id: string; verification_status: string }> };

/** 既存のMP4(承認済みclip)を持つ技ID。MP4がある技にはGIFを上乗せしない。
 *  マニフェストは character_slug で絞る。読めない/壊れているファイルがあれば例外にして、MP4優先を黙って外さない(安全側)。 */
export async function loadMp4MoveIdsFor(slug: string): Promise<Set<string>> {
  const ids = new Set<string>();
  if (!isSafeCharacterSlug(slug)) return ids;
  for (const f of (await listDir(dataDir())).filter((n) => /^SF6DNA_VER1_.*_MEDIA_MANIFEST_.*\.json$/.test(n)).sort()) {
    const manifest = await readJsonIfExists<Mp4Manifest>(path.join(/* turbopackIgnore: true */ dataDir(), f));
    if (manifest?.character_slug !== slug) continue;
    for (const c of manifest.clips ?? []) if (c.verification_status === "approved_for_preview") ids.add(c.move_id);
  }
  return ids;
}
