// Sub-classifies VALUE_CONFLICT rows from audit-move-data-quality.mjs. Read-only; never picks a winner.
// Usage: node scripts/classify-frame-value-conflicts.mjs [out.csv]
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { auditAll, loadSources, normalizeFrameValue, FRAME_FIELDS } from './audit-move-data-quality.mjs';

const nums = text => (String(text).match(/-?\d+/g) ?? []).map(Number);
const segmentLengths = text => normalizeFrameValue(text).split(',').map(part => {
  const match = part.match(/^(\d+)(?:-(\d+))?$/); return match ? Number(match[2] ?? match[1]) - Number(match[1]) + 1 : NaN; });

/** Ordered rules: notation explanations first, then structural suspicions, then real numeric conflicts. */
export function subclassifyConflict(row, conflictFieldsOnMove = 1) {
  const db = normalizeFrameValue(row.db), txt = normalizeFrameValue(row.txt);
  const landing = txt.match(/^(\d+)\+着地後(\d+)$/);
  if (landing && Number(landing[1]) + Number(landing[2]) === Number(db)) return 'NOTATION_TOTAL_EQUALS_SPLIT';
  if (/^\d+\+0$/.test(txt) && txt.startsWith(db + '+')) return 'NOTATION_PLUS_ZERO';
  if (db.startsWith(txt) && /^(?:\.{3}|…|\()/.test(db.slice(txt.length))) return 'DB_ANNOTATED_PREFIX_MATCH';
  if (db === '0') return 'DB_ZERO_PLACEHOLDER';
  if (/^variable$/i.test(db)) return 'DB_VARIABLE_PLACEHOLDER';
  if (/--|\d\.\d/.test(txt)) return 'TXT_MALFORMED_SUSPECTED';
  const range = value => value.replace(/\.{3}|…|～|~/g, '~').replace(/~\+/, '~');
  if (/~/.test(range(db)) && range(db) === range(txt)) return 'NOTATION_RANGE';
  if (row.field === 'active' && /^\d+(?:,\d+)+$|^\d+$/.test(db) && db.split(',').map(Number).join() === segmentLengths(row.txt).join()) return 'ACTIVE_DURATIONS_VS_RANGES';
  if (txt === '' || txt === '※' || /^※\d*$/.test(txt) && !/^\d/.test(db)) return 'TXT_FOOTNOTE_ONLY';
  if (/[/]/.test(db) && /[LMH]\d/.test(db)) return 'DB_PER_STRENGTH_LIST';
  if (/[,;]/.test(db) && !/[,;]/.test(txt) && nums(db).includes(nums(txt)[0])) return 'DB_MULTI_STEP_ROW';
  if (conflictFieldsOnMove >= 3) return /[,;]/.test(db) ? 'ROW_GRANULARITY_MISMATCH' : 'SUSPECTED_MAPPING_ERROR';
  if (row.field === 'active' && /着地まで/.test(db + txt)) return 'ACTIVE_LANDING_SEGMENTS';
  if (row.field === 'active') return 'ACTIVE_RANGE_CONFLICT';
  return 'NUMERIC_CONFLICT';
}
export const PRIORITY = { SUSPECTED_MAPPING_ERROR: 'P0', ROW_GRANULARITY_MISMATCH: 'P0', NUMERIC_CONFLICT: 'P1',
  DB_VARIABLE_PLACEHOLDER: 'P2', TXT_MALFORMED_SUSPECTED: 'P2', NOTATION_RANGE: 'P3', ACTIVE_DURATIONS_VS_RANGES: 'P3', ACTIVE_RANGE_CONFLICT: 'P1', DB_MULTI_STEP_ROW: 'P2',
  DB_ZERO_PLACEHOLDER: 'P2', ACTIVE_LANDING_SEGMENTS: 'P2', DB_PER_STRENGTH_LIST: 'P3', DB_ANNOTATED_PREFIX_MATCH: 'P3',
  TXT_FOOTNOTE_ONLY: 'P3', NOTATION_TOTAL_EQUALS_SPLIT: 'P3', NOTATION_PLUS_ZERO: 'P3' };

/** Official TXT rows (same character) whose six frame values all equal the DB move's values. */
export function matchingTxtRows(sources, ws5Slug, dbFrame) {
  const target = Object.keys(FRAME_FIELDS).map(field => normalizeFrameValue(dbFrame?.[field]));
  return Object.entries(sources.canonical).filter(([, record]) => record.characterSlug === ws5Slug &&
    Object.values(FRAME_FIELDS).every((rawKey, index) => normalizeFrameValue(record.raw[rawKey]) === target[index]))
    .map(([key, record]) => `${key} ${record.raw.skill}`);
}

export function classifyAll(sources = loadSources(), report = auditAll(sources)) {
  const rows = [];
  for (const character of report.characters) {
    const conflicts = character.frameDiffs.filter(row => row.kind === 'VALUE_CONFLICT');
    const perMove = new Map();
    for (const row of conflicts) perMove.set(row.moveId, (perMove.get(row.moveId) ?? 0) + 1);
    for (const row of conflicts) {
      const subclass = subclassifyConflict(row, perMove.get(row.moveId));
      let dbValuesMatchTxtRows = '';
      if (subclass === 'SUSPECTED_MAPPING_ERROR') {
        const dbMove = sources.fixture.characters[character.appSlug]?.moves.find(move => move.id === row.moveId);
        dbValuesMatchTxtRows = matchingTxtRows(sources, character.ws5Slug, dbMove?.frame).join(' | ');
      }
      rows.push({ priority: PRIORITY[subclass], subclass, character: character.appSlug, ...row,
        conflictFieldsOnMove: perMove.get(row.moveId), dbValuesMatchTxtRows });
    }
  }
  return rows.sort((a, b) => a.priority.localeCompare(b.priority) || a.character.localeCompare(b.character) || a.slug.localeCompare(b.slug));
}

const cell = value => { const text = value === null || value === undefined ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text; };
export function toCsv(rows) {
  const columns = ['priority', 'subclass', 'character', 'slug', 'name', 'field', 'db', 'txt', 'conflictFieldsOnMove', 'dbValuesMatchTxtRows', 'moveId', 'sourceRecordKey'];
  return [columns.join(','), ...rows.map(row => columns.map(column => cell(row[column])).join(','))].join('\n') + '\n';
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const rows = classifyAll(), [out] = process.argv.slice(2);
  if (out) writeFileSync(out, toCsv(rows), 'utf8'); else process.stdout.write(toCsv(rows));
}
