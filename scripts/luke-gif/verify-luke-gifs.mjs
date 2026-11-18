#!/usr/bin/env node
// ルーク技カード用GIFの 検査 → 分類 → 技ID/slug照合 → (任意)接続用マニフェスト生成。
//
// 作業は3段階に分かれていて、段階ごとに別々に実行する(同時指定は拒否する)。
//   段階1 (既定)     : 読み取りだけ。リポジトリのファイルは一切変更しない。レポートと目視確認用画像を作る。
//   段階2 --write-lock: 検査に合格したGIFのSHA256を luke-gif-lock.json に固定する。
//                      (レポートを人が確認したあとに実行。GIFのコピーやマニフェスト変更はしない)
//   (人の作業)        : 映像を目視確認し、承認する技を luke-gif-approvals.json に書く。
//   段階3 --apply    : 「承認済み」かつ「ロック一致」かつ接続可能(CONNECTABLE)なGIFだけを public/ へ反映する。
//                      未承認のGIFは public/ にもマニフェストにも入れない(=公開状態に近づけない)。
//   --sheets         : ffmpegがあれば、目視確認用の3コマ画像を作る
//
// 終了コード: 0=接続候補すべて合格 / 1=レポートは作成したが問題あり / 2=実行不能(入力が読めない等)
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { inspectGif, sha256Hex } from './gif-inspect.mjs';
import { validateMotionMediaManifest } from '../validate-motion-media.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MANIFEST_REL = 'v2-web/src/data/SF6DNA_VER1_LUKE_GIF_MANIFEST_20261116.json';
const GIF_PUBLIC_DIR_REL = 'v2-web/public/media/moves/luke/gif';
const EXPECTED_SIZE = { width: 480, height: 270 }; // 台帳記載の出力サイズ

export const readJson = (file) => JSON.parse(readFileSync(file, 'utf8').replace(/^\uFEFF/, '')); // BOM付きUTF-8も許容

/** 検索フォルダ配下から、ファイル名(日本語可)が完全一致するものを探す。 */
export function buildFileIndex(searchDirs) {
  const index = new Map();
  const walk = (dir, depth) => {
    if (depth > 6) return;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full, depth + 1);
      else if (entry.isFile() && /\.gif$/i.test(entry.name) && !index.has(entry.name)) index.set(entry.name, full);
    }
  };
  for (const dir of searchDirs) walk(dir, 0);
  return index;
}

/** 1ファイルずつ検査して、状態(status)と理由(reasons)を付ける。純粋関数(ファイル読み込みは findFile 経由)。 */
export function classifyFiles({ mapping, fixtureMoves, findFile, lock }) {
  const idBySlug = new Map(fixtureMoves.map((m) => [m.slug, m.id]));
  const mp4Kept = new Set(mapping.mp4MaintainedSlugs);
  const results = [];

  for (const entry of mapping.files) {
    const res = {
      title: entry.driveTitle, role: entry.role, slug: entry.slug, moveId: entry.slug ? idBySlug.get(entry.slug) ?? null : null,
      expectedSize: entry.expectedSize, path: null, size: null, sha256: null,
      width: null, height: null, frames: null, durationMs: null, loopCount: null,
      status: null, reasons: [], warnings: [], note: entry.note,
    };
    const found = findFile(entry.driveTitle);
    if (found) {
      const buf = readFileSync(found);
      const info = inspectGif(buf);
      Object.assign(res, { path: found, size: buf.length, sha256: sha256Hex(buf), width: info.width, height: info.height, frames: info.frames, durationMs: info.durationMs, loopCount: info.loopCount });
      res.gifErrors = info.errors;
    }
    results.push(res);
  }

  // 同じ中身のGIFが別の技に使われていないか(旧版・誤切り出しの検出)
  const bySha = new Map();
  for (const r of results) if (r.sha256) bySha.set(r.sha256, [...(bySha.get(r.sha256) ?? []), r]);

  for (const r of results) {
    if (r.role === 'no_move_match') { r.status = 'NO_MOVE_MATCH'; continue; }
    if (r.role === 'alt_version') { r.status = 'NOT_USED_ALT_VERSION'; continue; }
    if (r.role === 'suspected_old') {
      r.status = 'EXCLUDED_SUSPECTED_OLD';
      const same = (bySha.get(r.sha256) ?? []).filter((o) => o !== r);
      if (same.length) r.reasons.push(`SAME_CONTENT_AS: ${same.map((o) => o.title).join(', ')}`);
      continue;
    }
    if (r.role === 'unconfirmed_mapping') { r.status = 'HOLD_UNCONFIRMED_MAPPING'; continue; }

    // ここからが接続候補(role=candidate)の検査
    if (!r.moveId) r.reasons.push(`SLUG_NOT_IN_FIXTURE: ${r.slug}`);
    if (!r.path) r.reasons.push('MISSING: file not found');
    else {
      if (r.size !== r.expectedSize) r.reasons.push(`SIZE_MISMATCH: expected ${r.expectedSize}, actual ${r.size}`);
      if (r.gifErrors.length) r.reasons.push(...r.gifErrors);
      else {
        if (r.frames < 2) r.reasons.push('SINGLE_FRAME: not animated');
        if (r.loopCount === null) r.reasons.push('NO_LOOP: no NETSCAPE loop extension (plays once)');
        if (r.width !== EXPECTED_SIZE.width || r.height !== EXPECTED_SIZE.height) r.warnings.push(`UNEXPECTED_SIZE: ${r.width}x${r.height}`);
        if (r.durationMs < 300 || r.durationMs > 8000) r.warnings.push(`UNUSUAL_DURATION: ${r.durationMs}ms`);
      }
      const locked = lock?.files?.[r.title];
      if (locked && locked.sha256 !== r.sha256) r.reasons.push(`SHA_MISMATCH_LOCK: locked ${locked.sha256.slice(0, 12)}, actual ${r.sha256.slice(0, 12)}`);
      const same = (bySha.get(r.sha256) ?? []).filter((o) => o !== r);
      if (same.length) r.reasons.push(`DUPLICATE_CONTENT: identical to ${same.map((o) => o.title).join(', ')}`);
    }
    if (r.reasons.length) r.status = 'BLOCKED';
    else r.status = mp4Kept.has(r.slug) ? 'GIF_AVAILABLE_MP4_KEPT' : 'CONNECTABLE';
  }
  return results;
}

/** 接続用マニフェストを作る。承認済みslug以外は approved_for_preview にしない(=表示されない)。 */
export function buildGifManifest({ connectable, fixtureMoves, approvedSlugs }) {
  const order = new Map(fixtureMoves.map((m, i) => [m.slug, i]));
  const typeBySlug = new Map(fixtureMoves.map((m) => [m.slug, m.moveType]));
  const sorted = [...connectable].sort((a, b) => order.get(a.slug) - order.get(b.slug));
  const approved = new Set(approvedSlugs);
  return {
    manifest_version: '1.0',
    character_slug: 'luke',
    source_owner: 'user_capture',
    captured_patch: '2026.08.03',
    capture_date: '2026-11-13',
    source_files: sorted.map((r) => ({ category: 'gif_delivery', filename: r.title, sha256: r.sha256 })),
    clips: sorted.map((r) => ({
      move_id: r.moveId,
      move_slug: r.slug,
      category: typeBySlug.get(r.slug),
      variant: 'default',
      media_url: `/media/moves/luke/gif/${r.slug}.gif`,
      media_type: 'gif',
      poster_url: null,
      verification_status: approved.has(r.slug) ? 'approved_for_preview' : 'capture_received',
      loop_start_ms: 0,
      loop_end_ms: r.durationMs,
      duration_ms: r.durationMs,
      width: r.width,
      height: r.height,
      fps: Math.round((r.frames / (r.durationMs / 1000)) * 100) / 100,
      filesize_bytes: r.size,
      source_file: r.title,
      cut_review_status: approved.has(r.slug) ? 'CUT_REVIEW_PASS' : 'CUT_REVIEW_PENDING',
      mapping_evidence: `Drive GIF台帳(SF6DNA_LUKE_GIF_MANIFEST_20261113.md)の技名と、リリース用50技データの slug/ID が一致。映像の目視確認: ${approved.has(r.slug) ? '承認済み' : '未実施'}`,
    })),
  };
}

/** 承認ファイルの形式と中身を確認する。承認できるのは「検査合格(CONNECTABLE)」の技だけ。 */
export function validateApprovals(approvals, connectableSlugs) {
  const errors = [];
  const list = approvals?.approvedSlugs;
  if (!Array.isArray(list)) return ['APPROVALS_INVALID: approvedSlugs が配列ではありません'];
  const seen = new Set();
  for (const slug of list) {
    if (typeof slug !== 'string') { errors.push(`APPROVALS_INVALID: 文字列ではない値があります: ${JSON.stringify(slug)}`); continue; }
    if (seen.has(slug)) errors.push(`APPROVALS_INVALID: 重複しています: ${slug}`);
    seen.add(slug);
    if (!connectableSlugs.has(slug)) errors.push(`APPROVALS_NOT_CONNECTABLE: ${slug} は接続可能(検査合格・MP4なし・HOLDでない)ではありません`);
  }
  return errors;
}

/**
 * ロックに今回の結果を足す。すでに別のSHAで固定されているファイルは上書きしない(衝突として返す)。
 * 戻り値: { files, conflicts[] }
 */
export function mergeLock(lock, results) {
  const files = { ...(lock?.files ?? {}) };
  const conflicts = [];
  for (const r of results.filter((x) => x.status === 'CONNECTABLE' || x.status === 'GIF_AVAILABLE_MP4_KEPT')) {
    const prev = files[r.title];
    if (prev && prev.sha256 !== r.sha256) { conflicts.push(`LOCK_CONFLICT: ${r.title} は別の内容で固定済みです(固定 ${prev.sha256.slice(0, 12)} / 今回 ${r.sha256.slice(0, 12)})`); continue; }
    files[r.title] = { sha256: r.sha256, size: r.size };
  }
  return { files, conflicts };
}

/** 一時ファイルに書いてから置き換える(書き込み途中で止まっても、元のファイルが半端な状態にならない)。 */
function writeFileAtomic(file, text, fsOps) {
  const tmp = `${file}.tmp`;
  try { fsOps.writeFileSync(tmp, text, 'utf8'); fsOps.renameSync(tmp, file); }
  catch (e) { try { if (existsSync(tmp)) unlinkSync(tmp); } catch { /* 後始末の失敗は無視 */ } throw e; }
}

/**
 * 段階3: 承認済みGIFだけをリポジトリへ反映する。
 * 順序: 事前確認(何も書かない) → 作業用フォルダ(stageDir)で試作 → マニフェスト検証 → 本番へ反映。
 * 本番への反映中に失敗したら、この実行で作ったファイルを取り消して元に戻す。
 * 戻り値: { ok, errors[], installed[] }   fsOps はテストで失敗を再現するための差し替え口。
 */
export function applyConnection({ results, approvals, lock, fixtureMoves, repoRoot, stageDir, fsOps = { copyFileSync, renameSync, writeFileSync } }) {
  const fail = (errors) => ({ ok: false, errors, installed: [] });
  const connectable = results.filter((r) => r.status === 'CONNECTABLE');
  const errors = validateApprovals(approvals, new Set(connectable.map((r) => r.slug)));
  if (!errors.length && approvals.approvedSlugs.length === 0) errors.push('APPROVALS_EMPTY: approvedSlugs が空です。映像を目視確認して、承認する技を luke-gif-approvals.json に書いてください');
  if (errors.length) return fail(errors);

  const approved = new Set(approvals.approvedSlugs);
  const targets = connectable.filter((r) => approved.has(r.slug));
  if (!lock) return fail(['LOCK_MISSING: SHA256ロックがありません。先に --write-lock を実行してください(GIFのコピーはしません)']);
  for (const r of targets) if (lock.files?.[r.title]?.sha256 !== r.sha256) errors.push(`LOCK_MISMATCH: ${r.title} はロック未登録、または内容が変わっています`);
  if (errors.length) return fail(errors);

  const destDir = path.join(repoRoot, GIF_PUBLIC_DIR_REL);
  const manifestPath = path.join(repoRoot, MANIFEST_REL);
  const targetSlugs = new Set(targets.map((r) => r.slug));

  // --- 事前確認(ここまでは何も書かない) ---
  // 書き込み先に「今回の反映対象ではないファイル」があれば、予期しない変更として止める。
  if (existsSync(destDir)) {
    for (const name of readdirSync(destDir)) {
      const slug = name.replace(/\.gif$/i, '');
      if (!/\.gif$/i.test(name) || !targetSlugs.has(slug)) errors.push(`UNEXPECTED_FILE: 書き込み先に想定外のファイルがあります: ${path.join(destDir, name)}`);
    }
  }
  for (const r of targets) {
    const dest = path.join(destDir, `${r.slug}.gif`);
    if (existsSync(dest) && sha256Hex(readFileSync(dest)) !== r.sha256) errors.push(`DEST_DIFFERENT: 既存の別内容ファイルを上書きしません: ${dest}`);
  }
  // 既存マニフェストは「空」か「今回の対象の一部と一致するもの」だけ許可する(手編集・承認の取り消しは自動で消さない)。
  if (existsSync(manifestPath)) {
    let old;
    try { old = readJson(manifestPath); } catch (e) { errors.push(`MANIFEST_UNREADABLE: ${e.message}`); }
    if (old) {
      if (old.character_slug !== 'luke') errors.push('MANIFEST_UNEXPECTED: character_slug が luke ではありません');
      const shaByTitle = new Map(targets.map((r) => [r.title, r.sha256]));
      for (const c of old.clips ?? []) {
        if (!targetSlugs.has(c.move_slug)) errors.push(`MANIFEST_UNEXPECTED: 既存の接続 ${c.move_slug} は今回の承認に含まれていません(取り消しは手動で行ってください)`);
        const oldSha = (old.source_files ?? []).find((s) => s.filename === c.source_file)?.sha256;
        if (shaByTitle.has(c.source_file) && oldSha !== shaByTitle.get(c.source_file)) errors.push(`MANIFEST_UNEXPECTED: ${c.move_slug} の既存SHA256が今回と異なります`);
      }
    }
  }
  if (errors.length) return fail(errors);

  // --- 試作と検証(stageDir だけに書く。リポジトリは変更しない) ---
  const manifest = buildGifManifest({ connectable: targets, fixtureMoves, approvedSlugs: [...approved] });
  const stagePublic = path.join(stageDir, 'public');
  const stageGifDir = path.join(stagePublic, 'media/moves/luke/gif');
  mkdirSync(stageGifDir, { recursive: true });
  for (const r of targets) {
    const staged = path.join(stageGifDir, `${r.slug}.gif`);
    copyFileSync(r.path, staged);
    if (sha256Hex(readFileSync(staged)) !== r.sha256) errors.push(`STAGE_SHA_MISMATCH: ${r.title}(読み込み後に内容が変わりました)`);
  }
  errors.push(...validateMotionMediaManifest(manifest, { publicRoot: stagePublic }).errors.map((e) => `MANIFEST_INVALID: ${e}`));
  if (errors.length) return fail(errors);

  // --- 本番へ反映(失敗したら、この実行で作ったものを取り消す) ---
  const created = [];
  const oldManifestText = existsSync(manifestPath) ? readFileSync(manifestPath, 'utf8') : null;
  try {
    mkdirSync(destDir, { recursive: true });
    for (const r of targets) {
      const dest = path.join(destDir, `${r.slug}.gif`);
      if (existsSync(dest)) continue; // 同一内容(事前確認済み)なので何もしない
      const tmp = `${dest}.tmp`;
      created.push(tmp);
      fsOps.copyFileSync(path.join(stageGifDir, `${r.slug}.gif`), tmp);
      fsOps.renameSync(tmp, dest);
      created.pop(); created.push(dest);
    }
    writeFileAtomic(manifestPath, JSON.stringify(manifest, null, 2) + '\n', fsOps);
    for (const r of targets) {
      if (sha256Hex(readFileSync(path.join(destDir, `${r.slug}.gif`))) !== r.sha256) throw new Error(`反映後の内容が一致しません: ${r.slug}`);
    }
  } catch (e) {
    for (const f of created) { try { if (existsSync(f)) unlinkSync(f); } catch { /* 取り消し失敗はログに出すため下で通知 */ } }
    try { if (oldManifestText !== null) writeFileSync(manifestPath, oldManifestText, 'utf8'); } catch { /* 同上 */ }
    return fail([`APPLY_FAILED_ROLLED_BACK: ${e.message}(この実行で作成したGIFを取り消し、マニフェストを元に戻しました)`]);
  }
  return { ok: true, errors: [], installed: targets.map((r) => r.slug) };
}

function renderMarkdown({ results, mapping, meta }) {
  const by = (s) => results.filter((r) => r.status === s);
  const kb = (n) => (n == null ? '-' : `${(n / 1048576).toFixed(2)}MB`);
  const L = [];
  L.push('# ルークGIF 取得・検査レポート', '', `- 実行日時: ${meta.at}`, `- 基準SHA(マッピング作成時): ${mapping.baseSha}`, `- 検索フォルダ: ${meta.searchDirs.join(' / ')}`, '');
  L.push('## 件数', '', '| 状態 | 件数 | 意味 |', '|---|---:|---|');
  const meaning = {
    CONNECTABLE: '検査合格。接続できる(目視確認は別途)',
    GIF_AVAILABLE_MP4_KEPT: '検査合格。ただし既存MP4を維持するため接続しない',
    BLOCKED: '接続候補だが検査で不合格(理由は下記)',
    HOLD_UNCONFIRMED_MAPPING: '技との対応が不明。映像確認までHOLD',
    EXCLUDED_SUSPECTED_OLD: '旧版の疑い。使用しない',
    NOT_USED_ALT_VERSION: '同じ技の別版。使用しない',
    NO_MOVE_MATCH: '50技に対応する技が無い',
  };
  for (const [s, m] of Object.entries(meaning)) L.push(`| ${s} | ${by(s).length} | ${m} |`);
  L.push(`| (対応するGIFが無い技) | ${mapping.holdNoAssetSlugs.length} | HOLD継続 |`, '');
  const table = (rows) => ['| slug | ファイル | サイズ | フレーム | 寸法 | 長さ | SHA256(先頭12) |', '|---|---|---:|---:|---|---:|---|',
    ...rows.map((r) => `| ${r.slug ?? '-'} | ${r.title} | ${kb(r.size)} | ${r.frames ?? '-'} | ${r.width ?? '-'}x${r.height ?? '-'} | ${r.durationMs ?? '-'}ms | ${r.sha256 ? r.sha256.slice(0, 12) : '-'} |`)];
  L.push('## 接続できるGIF(CONNECTABLE)', '', ...table(by('CONNECTABLE')), '');
  const blocked = by('BLOCKED');
  L.push('## 不合格(BLOCKED)', '');
  if (!blocked.length) L.push('なし', '');
  for (const r of blocked) L.push(`- **${r.title}** (${r.slug}): ${r.reasons.join(' / ')}`);
  L.push('', '## 警告(接続は妨げない)', '');
  const warned = results.filter((r) => r.warnings.length);
  if (!warned.length) L.push('なし');
  for (const r of warned) L.push(`- ${r.title}: ${r.warnings.join(' / ')}`);
  L.push('', '## HOLD', '');
  for (const r of by('HOLD_UNCONFIRMED_MAPPING')) L.push(`- ${r.title} → ${r.slug}(暫定): ${r.note}`);
  for (const r of by('EXCLUDED_SUSPECTED_OLD')) L.push(`- ${r.title}: ${r.note}${r.reasons.length ? ` [${r.reasons.join('; ')}]` : ''}`);
  L.push('', '### 対応するGIFが無い技', '', ...mapping.holdNoAssetSlugs.map((s) => `- ${s}`));
  L.push('', '## 既存MP4を維持する技でGIFも見つかったもの', '', ...table(by('GIF_AVAILABLE_MP4_KEPT')), '');
  L.push('## 次の手順(段階ごとに別々に実行します)', '',
    '1. `sheets/` の画像を見て、技名と映像が一致するか確認する(攻撃動作が途中で切れていないか、別の技でないか)。',
    '2. `-WriteLock` を付けて再実行: 合格したGIFのSHA256を固定する(ここではGIFのコピーもマニフェスト変更もしない)。',
    '3. 目視確認で問題なかった技のslugだけを、`scripts/luke-gif/luke-gif-approvals.json` の `approvedSlugs` に書く。',
    '4. `-Apply` を付けて再実行: 承認済みのGIFだけを反映する。未承認のGIFは反映されず、公開状態にもならない。');
  return L.join('\n') + '\n';
}

function makeSheets(results, outDir, log) {
  const probe = spawnSync('ffmpeg', ['-version'], { encoding: 'utf8' });
  if (probe.error || probe.status !== 0) { log('WARN ffmpeg が見つからないため目視確認用の画像は作りません'); return 0; }
  const dir = path.join(outDir, 'sheets');
  mkdirSync(dir, { recursive: true });
  let made = 0;
  for (const r of results) {
    if (!r.path || !r.frames || r.frames < 3 || !['CONNECTABLE', 'GIF_AVAILABLE_MP4_KEPT', 'BLOCKED', 'HOLD_UNCONFIRMED_MAPPING', 'EXCLUDED_SUSPECTED_OLD'].includes(r.status)) continue;
    const f = [Math.floor(r.frames * 0.15), Math.floor(r.frames * 0.5), Math.floor(r.frames * 0.85)];
    const out = path.join(dir, `${r.status}__${r.slug ?? 'none'}__${r.title.replace(/\.gif$/i, '')}.png`);
    const p = spawnSync('ffmpeg', ['-v', 'error', '-y', '-i', r.path, '-vf', `select='eq(n,${f[0]})+eq(n,${f[1]})+eq(n,${f[2]})',scale=320:-1,tile=3x1`, '-frames:v', '1', '-vsync', '0', out], { encoding: 'utf8' });
    if (p.status === 0) made += 1; else log(`WARN sheet failed: ${r.title}: ${(p.stderr || '').trim().slice(0, 200)}`);
  }
  return made;
}

function parseArgs(argv) {
  const a = { searchDirs: [], repoRoot: path.resolve(HERE, '../..'), out: null, dataDir: HERE, sheets: false, writeLock: false, apply: false };
  for (let i = 0; i < argv.length; i += 1) {
    const v = argv[i];
    if (v === '--search-dir') a.searchDirs.push(path.resolve(argv[++i]));
    else if (v === '--repo-root') a.repoRoot = path.resolve(argv[++i]);
    else if (v === '--out') a.out = path.resolve(argv[++i]);
    else if (v === '--data-dir') a.dataDir = path.resolve(argv[++i]); // mapping/approvals/lock の置き場(テスト用)
    else if (v === '--sheets') a.sheets = true;
    else if (v === '--write-lock') a.writeLock = true;
    else if (v === '--apply') a.apply = true;
    else throw new Error(`Unknown argument: ${v}`);
  }
  if (a.writeLock && a.apply) throw new Error('--write-lock と --apply は同時に指定できません(ロック作成→目視承認→反映を段階ごとに実行してください)');
  return a;
}

function main() {
  const lines = [];
  const log = (m) => { lines.push(m); console.log(m); };
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
    if (!args.out) throw new Error('--out is required');
    if (!args.searchDirs.length) throw new Error('--search-dir is required (at least one)');
    for (const d of args.searchDirs) if (!existsSync(d) || !statSync(d).isDirectory()) throw new Error(`search dir not found: ${d}`);
    mkdirSync(args.out, { recursive: true });
  } catch (e) { console.error(`FATAL ${e.message}`); process.exit(2); }

  let mapping, fixtureMoves, mp4Manifest, lock = null, approvals;
  try {
    mapping = readJson(path.join(args.dataDir, 'luke-gif-mapping.json'));
    approvals = readJson(path.join(args.dataDir, 'luke-gif-approvals.json'));
    fixtureMoves = readJson(path.join(args.repoRoot, 'v2-web/src/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json')).characters.luke.moves;
    mp4Manifest = readJson(path.join(args.repoRoot, 'v2-web/src/data/SF6DNA_VER1_LUKE_MEDIA_MANIFEST_20260924.json'));
    const lockPath = path.join(args.dataDir, 'luke-gif-lock.json');
    if (existsSync(lockPath)) lock = readJson(lockPath);
  } catch (e) { console.error(`FATAL 入力ファイルを読めません: ${e.message}`); process.exit(2); }

  const mp4Slugs = mp4Manifest.clips.map((c) => c.move_slug).sort();
  if (JSON.stringify(mp4Slugs) !== JSON.stringify([...mapping.mp4MaintainedSlugs].sort())) {
    console.error('FATAL 既存MP4接続の技がマッピングと一致しません(マッピングの更新が必要)'); process.exit(2);
  }
  if (fixtureMoves.length !== 50) { console.error(`FATAL ルークの技データが50件ではありません: ${fixtureMoves.length}`); process.exit(2); }

  const index = buildFileIndex(args.searchDirs);
  log(`検索フォルダ: ${args.searchDirs.join(' | ')} / GIF ${index.size} 本を検出`);
  const results = classifyFiles({ mapping, fixtureMoves, findFile: (t) => index.get(t) ?? null, lock });

  const counts = {};
  for (const r of results) counts[r.status] = (counts[r.status] ?? 0) + 1;
  log(`分類: ${JSON.stringify(counts)}`);
  const blocked = results.filter((r) => r.status === 'BLOCKED');
  for (const r of blocked) log(`BLOCKED ${r.title}: ${r.reasons.join(' / ')}`);

  const meta = { at: new Date().toISOString(), searchDirs: args.searchDirs };
  writeFileSync(path.join(args.out, 'luke-gif-report.json'), JSON.stringify({ meta, counts, results: results.map(({ gifErrors, ...r }) => r) }, null, 1) + '\n', 'utf8');
  writeFileSync(path.join(args.out, 'luke-gif-report.md'), renderMarkdown({ results, mapping, meta }), 'utf8');
  if (args.sheets) log(`目視確認用の画像: ${makeSheets(results, args.out, log)} 枚`);

  const lockPath = path.join(args.dataDir, 'luke-gif-lock.json');

  // 段階2: SHA256ロックの作成だけを行う(GIFのコピー・マニフェスト変更はしない)
  if (args.writeLock) {
    if (blocked.length) { log('STOP 不合格のGIFがあるため、ロックは作りません(レポートを確認してください)'); writeLog(); process.exit(1); }
    const merged = mergeLock(lock, results);
    if (merged.conflicts.length) { for (const c of merged.conflicts) log(`ERROR ${c}`); log('STOP 固定済みのSHA256は上書きしません。GIFを意図して差し替えた場合は、luke-gif-lock.json の該当行を人が削除してから再実行してください'); writeLog(); process.exit(1); }
    try { writeFileAtomic(lockPath, JSON.stringify({ schema: 1, files: merged.files }, null, 1) + '\n', { writeFileSync, renameSync }); }
    catch (e) { log(`STOP ロックを書き込めません: ${e.message}`); writeLog(); process.exit(1); }
    log(`ロック作成: ${Object.keys(merged.files).length} 件 → ${lockPath}`);
  }

  // 段階3: 承認済みGIFだけを反映する(ロックは作らない。ロックが無ければ止まる)
  if (args.apply) {
    if (blocked.length) { log('STOP 不合格のGIFがあるため、反映は行いません(レポートを確認してください)'); writeLog(); process.exit(1); }
    let result;
    try { result = applyConnection({ results, approvals, lock, fixtureMoves, repoRoot: args.repoRoot, stageDir: path.join(args.out, 'apply-stage') }); }
    catch (e) { result = { ok: false, errors: [`APPLY_ERROR: ${e.message}`], installed: [] }; }
    if (!result.ok) { for (const e of result.errors) log(`ERROR ${e}`); log('STOP 反映しませんでした(リポジトリは変更されていません。ただし APPLY_FAILED_ROLLED_BACK の場合は取り消し済みです)'); writeLog(); process.exit(1); }
    log(`反映: ${result.installed.length} 件(すべて承認済み → カードに表示される対象): ${result.installed.join(', ')}`);
  }
  writeLog();
  log(`完了。レポート: ${path.join(args.out, 'luke-gif-report.md')}`);
  process.exit(blocked.length ? 1 : 0);

  function writeLog() { writeFileSync(path.join(args.out, 'verify.log'), lines.join('\n') + '\n', 'utf8'); }
}

const isDirect = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirect) main();
