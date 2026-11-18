// Read-only move data quality audit (characters / move cards).
// Compares the DB-derived release fixture with the WS5 official TXT canonical snapshot.
// It never writes source data, never infers frame values and grants no publication rights.
// Usage: node scripts/audit-move-data-quality.mjs [report.json] [report.md]
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const DATA = new URL('../src/data/', import.meta.url);
export const SOURCES = {
  fixture: 'ALL_CHARACTER_RELEASE_FIXTURE_20261004.json',
  canonical: 'SF6DNA_WS5_OFFICIAL_TXT_CANONICAL_20261026.json',
  candidates: 'SF6DNA_WS5_DEVICE_PREVIEW_BUNDLES_R3_CANDIDATE_20261024.json',
  names: 'SF6DNA_WS5_LOCAL_CHARACTER_NAMES_20261026.json',
};
// WS5 snapshot keys that differ from the app/DB character slug.
export const WS5_SLUG_ALIASES = Object.freeze({ deejay: 'dee-jay' });
export const FRAME_FIELDS = Object.freeze({ startup: 'startup_frame', active: 'active_frame', recovery: 'recovery_frame',
  onHit: 'hit_frame', onBlock: 'block_frame', damage: 'damage' });
const STANDARD_NA = /^(?:-|—|－|N\/A)$/;
// Placeholders seen in the TXT that the canonical connector does not treat as official N/A.
const NON_STANDARD_NA = /^(?:ー|―|‐)$/;

const str = value => value === null || value === undefined ? '' : String(value);
export function isBlank(value) { return str(value).trim() === ''; }

/** Notation-only normalization: width, spacing, leading "+", "※" markers and landing wording. */
export function normalizeFrameValue(value) {
  let s = str(value).normalize('NFKC').replace(/[−–]/g, '-').replace(/until\s*landing/gi, '着地まで')
    .replace(/\s+/g, '').replace(/※/g, '');
  s = s.replace(/^\+(?=\d)/, '');
  const landing = s.match(/^(?:着地後(\d+)|(\d+)\(landing\))$/i);
  if (landing) return `landing:${landing[1] ?? landing[2]}`;
  return s;
}
export function normalizeName(value) { return str(value).normalize('NFKC').replace(/\s+/g, ''); }

function rangeLength(value) {
  const ranges = normalizeFrameValue(value).split(',');
  let total = 0;
  for (const range of ranges) {
    const match = range.match(/^(\d+)-(\d+)$/) ?? range.match(/^(\d+)$/);
    if (!match) return null;
    const start = Number(match[1]), end = Number(match[2] ?? match[1]);
    if (end < start) return null;
    total += end - start + 1;
  }
  return total;
}

/** Classifies a fixture (DB) vs official TXT frame value pair. Never decides which is correct. */
export function classifyFrameDiff(field, fixtureValue, txtValue) {
  const fixtureBlank = isBlank(fixtureValue), txtBlank = isBlank(txtValue);
  if (fixtureBlank && txtBlank) return 'BOTH_BLANK';
  if (txtBlank) return 'TXT_BLANK_DB_HAS_VALUE';
  if (fixtureBlank) return 'DB_MISSING_TXT_HAS_VALUE';
  const a = normalizeFrameValue(fixtureValue), b = normalizeFrameValue(txtValue);
  if (a === b) return str(fixtureValue) === str(txtValue) ? 'SAME' : 'FORMAT_ONLY';
  // DB text ending in an ellipsis (truncation or an intentional "varies" marker) whose visible part equals the official value.
  const truncated = a.match(/^(.*?)(?:\.{3}|…)$/);
  if (truncated && truncated[1] === b) return 'DB_TRAILING_ELLIPSIS';
  // DB value = <overall range> immediately followed by the official multi-part value.
  if (a.length > b.length && a.endsWith(b) && /^\d+-\d+$/.test(a.slice(0, a.length - b.length))) return 'DB_CONCATENATED_ENVELOPE';
  if (field === 'active' && /^\d+$/.test(a) && rangeLength(txtValue) === Number(a)) return 'ACTIVE_DURATION_VS_RANGE';
  if (field === 'active' && /^\d+-\d+$/.test(a) && b.includes(',')) {
    const numbers = b.split(/[,-]/).map(Number);
    const [start, end] = a.split('-').map(Number);
    if (numbers.every(Number.isFinite) && Math.min(...numbers) === start && Math.max(...numbers) === end) return 'ACTIVE_ENVELOPE_VS_MULTI_HIT';
  }
  if (b === 'D' && /^(?:KD|D|ダウン)/i.test(a)) return 'KNOCKDOWN_NOTATION';
  return 'VALUE_CONFLICT';
}

/** Button family of the final button group of a command: "P", "K", "PK" or null. */
export function buttonClass(command) {
  const text = str(command).normalize('NFKC');
  if (!text.trim()) return null;
  // "A or B" alternatives: union of both families.
  const alternatives = text.split(/\sor\s/i);
  if (alternatives.length > 1) {
    const classes = new Set(alternatives.map(buttonClass).filter(Boolean).flatMap(value => [...value]));
    return classes.size === 2 ? 'PK' : classes.size === 1 ? [...classes][0] : null;
  }
  // Follow-ups ("236K~PP", "HP>HK"): only the last step's button is comparable.
  const step = text.split(/[~>]/).at(-1);
  const tail = step.includes('+') ? step.slice(step.lastIndexOf('+') + 1) : step;
  const punch = /[LMH]P|(?<![A-Z])P+(?![A-Z])/.test(tail), kick = /[LMH]K|(?<![A-Z])K+(?![A-Z])/.test(tail);
  return punch && kick ? 'PK' : punch ? 'P' : kick ? 'K' : null;
}
/** Button family encoded in the internal TXT label, e.g. "(SA2_214214K)". */
export function labelButtonClass(label) {
  const match = str(label).replace(/[()]/g, '').match(/_\d+(PP|KK|P|K)$/);
  return match ? match[1][0] : null;
}

function loadJson(name) { return JSON.parse(readFileSync(new URL(name, DATA), 'utf8')); }
export function loadSources() {
  return { fixture: loadJson(SOURCES.fixture), canonical: loadJson(SOURCES.canonical),
    candidates: loadJson(SOURCES.candidates), names: loadJson(SOURCES.names) };
}

function txtGaps(rows) {
  const gaps = { classicMissing: [], modernMissing: [], modernOfficialNotListed: 0, nonStandardNa: [],
    frameBlank: Object.fromEntries(Object.keys(FRAME_FIELDS).map(key => [key, 0])) };
  for (const { key, raw } of rows) {
    if (isBlank(raw.command)) gaps.classicMissing.push({ key, name: raw.skill });
    if (raw.command_modern === null) gaps.modernOfficialNotListed++;
    else if (isBlank(raw.command_modern)) gaps.modernMissing.push({ key, name: raw.skill });
    for (const [field, rawKey] of Object.entries(FRAME_FIELDS)) {
      const value = raw[rawKey];
      if (isBlank(value)) gaps.frameBlank[field]++;
      else if (NON_STANDARD_NA.test(str(value).trim())) gaps.nonStandardNa.push({ key, name: raw.skill, field, value });
    }
  }
  return gaps;
}

export function auditCharacter(ws5Slug, sources) {
  const appSlug = WS5_SLUG_ALIASES[ws5Slug] ?? ws5Slug;
  const candidate = sources.candidates[ws5Slug];
  const fixture = sources.fixture.characters[appSlug] ?? null;
  const rows = Object.entries(sources.canonical).filter(([, record]) => record.characterSlug === ws5Slug)
    .map(([key, record]) => ({ key, raw: record.raw, record }));
  const identityStates = {};
  for (const identity of Object.values(candidate?.identityByMoveId ?? {}))
    identityStates[identity.identityState] = (identityStates[identity.identityState] ?? 0) + 1;

  const fixtureById = new Map((fixture?.moves ?? []).map(move => [move.id, move]));
  const mappedFixtureIds = new Set();
  const frameDiffs = [], nameDiffs = [], buttonConflicts = [], commandButtonDiffs = [];
  for (const move of candidate?.bundle?.moves ?? []) {
    const identity = candidate.identityByMoveId[move.id];
    const raw = sources.canonical[identity?.sourceRecordKey]?.raw;
    const dbMove = fixtureById.get(move.id);
    if (!raw || !dbMove) continue;
    mappedFixtureIds.add(dbMove.id);
    for (const [field, rawKey] of Object.entries(FRAME_FIELDS)) {
      const kind = classifyFrameDiff(field, dbMove.frame?.[field], raw[rawKey]);
      if (!['SAME', 'BOTH_BLANK'].includes(kind)) frameDiffs.push({ kind, field, moveId: dbMove.id, slug: dbMove.slug,
        name: dbMove.name, sourceRecordKey: identity.sourceRecordKey, db: str(dbMove.frame?.[field]), txt: str(raw[rawKey]) });
    }
    if (dbMove.name !== raw.skill) nameDiffs.push({ kind: normalizeName(dbMove.name) === normalizeName(raw.skill) ? 'FORMAT_ONLY' : 'NAME_CONFLICT',
      moveId: dbMove.id, slug: dbMove.slug, db: dbMove.name, txt: raw.skill, sourceRecordKey: identity.sourceRecordKey });
    const dbClassic = (dbMove.commands ?? []).find(row => row.scheme === 'classic');
    const dbButton = buttonClass(dbClassic?.numericNotation ?? dbClassic?.commandText);
    const txtButton = buttonClass(raw.command);
    if (dbButton && txtButton && dbButton !== 'PK' && txtButton !== 'PK' && dbButton !== txtButton)
      commandButtonDiffs.push({ moveId: dbMove.id, slug: dbMove.slug, name: dbMove.name, db: dbClassic.commandText,
        txt: raw.command, txtLabel: raw.name, sourceRecordKey: identity.sourceRecordKey });
  }
  for (const { key, raw } of rows) {
    const label = labelButtonClass(raw.name), command = buttonClass(raw.command);
    if (label && command && command !== 'PK' && label !== command)
      buttonConflicts.push({ sourceRecordKey: key, name: raw.skill, label: raw.name, command: raw.command });
  }
  const fixtureMoves = fixture?.moves ?? [];
  const fixtureGaps = {
    classicCommandMissing: fixtureMoves.filter(move => !(move.commands ?? []).some(row => row.scheme === 'classic' &&
      [row.commandText, row.numericNotation].some(value => !isBlank(value)))).map(move => move.slug),
    modernCommandMissing: fixtureMoves.filter(move => !(move.commands ?? []).some(row => String(row.scheme).startsWith('modern'))).length,
    frameBlank: Object.fromEntries(Object.keys(FRAME_FIELDS).map(field => [field,
      fixtureMoves.filter(move => isBlank(move.frame?.[field])).length])),
  };
  const count = list => list.reduce((acc, row) => ({ ...acc, [row.kind]: (acc[row.kind] ?? 0) + 1 }), {});
  return {
    ws5Slug, appSlug, name: sources.names[ws5Slug] ?? appSlug,
    slugAliasApplied: appSlug !== ws5Slug,
    ws5CandidateReachableByAppSlug: Boolean(sources.candidates[appSlug]),
    txtRows: rows.length, ws5BundleRows: candidate?.bundle?.moves?.length ?? 0,
    fixtureMoves: fixture ? fixtureMoves.length : null,
    mappedToExistingId: mappedFixtureIds.size,
    txtRowsWithoutExistingId: (candidate?.bundle?.moves?.length ?? 0) - mappedFixtureIds.size,
    fixtureMovesWithoutTxtMapping: fixture ? fixtureMoves.length - mappedFixtureIds.size : null,
    identityStates, releaseEligible: Boolean(candidate?.releaseEligible),
    txtGaps: txtGaps(rows), fixtureGaps,
    frameDiffSummary: count(frameDiffs), nameDiffSummary: count(nameDiffs),
    frameDiffs, nameDiffs, buttonConflicts, commandButtonDiffs,
  };
}

export function auditAll(sources = loadSources()) {
  const characters = Object.keys(sources.candidates).sort().map(slug => auditCharacter(slug, sources));
  const fixtureOnly = Object.keys(sources.fixture.characters)
    .filter(slug => !characters.some(row => row.appSlug === slug)).sort();
  return { schema: 'sf6dna/move-data-quality-audit/1', readOnly: true, publicationGranted: false,
    sources: SOURCES, fixturePatch: sources.fixture.dbPatch?.version ?? null, characterCount: characters.length,
    fixtureOnlyCharacters: fixtureOnly, characters };
}

const fmt = summary => Object.entries(summary).map(([key, value]) => `${key} ${value}`).join(' / ') || '0';
export function toMarkdown(report) {
  const lines = ['# 技データ品質監査（自動生成・読み取り専用）', '',
    `- 比較元: DB由来fixture \`${report.sources.fixture}\`（Patch ${report.fixturePatch}） / 公式TXT \`${report.sources.canonical}\``,
    '- 本レポートはどちらの値が正しいかを判定しません。VALUE_CONFLICT等は公式ページとPatchの照合が必要です。', '',
    '| キャラ | TXT行 | fixture技 | 既存ID対応 | TXT未対応 | TXT空欄(発生/持続/硬直/ヒット/ガード) | Classic欠落 | Modern欠落 | フレーム差分 | 技名差分 | P/K矛盾 |',
    '|---|---:|---:|---:|---:|---|---:|---:|---|---|---:|'];
  for (const c of report.characters) {
    const b = c.txtGaps.frameBlank;
    lines.push(`| ${c.name} (${c.appSlug}) | ${c.txtRows} | ${c.fixtureMoves ?? '-'} | ${c.mappedToExistingId} | ${c.txtRowsWithoutExistingId} | ` +
      `${b.startup}/${b.active}/${b.recovery}/${b.onHit}/${b.onBlock} | ${c.txtGaps.classicMissing.length} | ${c.txtGaps.modernMissing.length} | ` +
      `${fmt(c.frameDiffSummary)} | ${fmt(c.nameDiffSummary)} | ${c.buttonConflicts.length + c.commandButtonDiffs.length} |`);
  }
  lines.push('', '## 要確認（P/Kボタン種別の矛盾）', '');
  for (const c of report.characters) {
    for (const row of c.buttonConflicts) lines.push(`- ${c.name} \`${row.sourceRecordKey}\` ${row.name}: TXTラベル \`${row.label}\` / TXTコマンド \`${row.command}\``);
    for (const row of c.commandButtonDiffs) lines.push(`- ${c.name} \`${row.slug}\` ${row.name}: DB \`${row.db}\` / TXT \`${row.txt}\``);
  }
  lines.push('', '## 要確認（slug・識別子）', '');
  for (const c of report.characters.filter(row => row.slugAliasApplied))
    lines.push(`- WS5キー \`${c.ws5Slug}\` はアプリslug \`${c.appSlug}\` と不一致。WS5候補はアプリslugで参照不可: ${!c.ws5CandidateReachableByAppSlug}`);
  return lines.join('\n') + '\n';
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const report = auditAll();
  const [jsonPath, mdPath] = process.argv.slice(2);
  if (jsonPath) writeFileSync(jsonPath, JSON.stringify(report, null, 2) + '\n', 'utf8');
  if (mdPath) writeFileSync(mdPath, toMarkdown(report), 'utf8');
  if (!jsonPath && !mdPath) process.stdout.write(toMarkdown(report));
}
