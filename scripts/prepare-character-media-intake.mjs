import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(root, 'v2-web/package.json'));
const ts = require('typescript');
const module = { exports: {} };
new Function('module', 'exports', ts.transpileModule(readFileSync(path.join(root, 'v2-web/src/lib/move-command-format.ts'), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText)(module, module.exports);
export const { formatMoveCommand } = module.exports;
export const existingWork = new Set(['ryu', 'jp', 'luke', 'jamie', 'manon', 'marisa', 'yasmine', 'ingrid', 'alex']);
export const reportedRecorded = new Set(['c-viper', 'sagat', 'elena', 'mai', 'terry', 'm-bison', 'akuma', 'ed']);
export const requiredCategories = new Set(['normal', 'unique', 'target_combo', 'special', 'throw', 'super']);
export function recordingQueue(inventory) {
  return inventory.characters.filter(c => c.status === 'published' && c.isPlayable && !existingWork.has(c.slug) && !reportedRecorded.has(c.slug)).sort((a, b) => b.displayOrder - a.displayOrder);
}
export function templates(inventory) {
  const characters = new Map(inventory.characters.map(c => [c.id, c]));
  const ids = new Set();
  return inventory.moves.filter(m => m.status !== 'archived' && requiredCategories.has(m.category) && !existingWork.has(m.characterSlug)).map(m => {
    const character = characters.get(m.characterId);
    if (!character || character.slug !== m.characterSlug || ids.has(m.id)) throw new Error(`Invalid character/duplicate move: ${m.id}`);
    ids.add(m.id);
    const classic = m.commands.filter(c => c.scheme === 'classic').sort((a, b) => a.order - b.order)[0];
    const modern = m.commands.filter(c => c.scheme === 'modern').sort((a, b) => a.order - b.order)[0];
    const raw = classic?.text || classic?.numeric || classic?.buttons || '';
    return { Character: character.name, Character_slug: character.slug, Move_ID: m.id, Slug: m.slug, Name: m.name, Category: m.category,
      Command: formatMoveCommand(raw), Raw_command: raw, Numeric_notation: classic?.numeric || '', Modern_command: modern?.text || modern?.numeric || '',
      Variant: m.strength || '', Condition: classic?.condition || '', DB_order: m.order,
      Command_status: /(?:\d+[PLMKH]|\b(?:LP|MP|HP|LK|MK|HK)\b)/.test(formatMoveCommand(raw)) ? 'REVIEW_ONLY_UNSUPPORTED_GRAMMAR' : raw ? 'FORMAT_RESOLVED_IDENTITY_UNREVIEWED' : 'MISSING_COMMAND',
      Current_frame_rows: JSON.stringify(m.frames.filter(f => f.toPatch === null && inventory.patches.some(p => p.isCurrent && p.id === f.fromPatch))),
      Evidence_relations: JSON.stringify(m.evidence),
      Source_file: '', Start: '', End: '', Game_label: '', Visual_review: '', Mapping_evidence: '', Media_status: 'UNRESOLVED', HOLD_reason: 'INPUT_PENDING',
      Identity_status: 'DB_WORKING_INVENTORY_REQUIRES_CAPTURE_EVIDENCE' };
  });
}
export function validateCandidate(row, move) {
  const errors = [];
  if (row.Character_slug !== move.characterSlug || row.Move_ID !== move.id || row.Slug !== move.slug || row.Category !== move.category) errors.push('identity mismatch');
  if (row.Media_status === 'CONFIRMED') {
    if (!row.Source_file || !row.Game_label || !row.Visual_review || row.Visual_review !== 'PASS') errors.push('capture and visual evidence required');
    if (!Number.isFinite(Number(row.Start)) || row.Start === '' || !Number.isFinite(Number(row.End)) || Number(row.End) <= Number(row.Start)) errors.push('invalid interval');
    if (row.Mapping_evidence === 'ORDER_ONLY') errors.push('order-only mapping forbidden');
  }
  return errors;
}
export function youtubeId(value) {
  try {
    const u = new URL(value);
    if (u.protocol !== 'https:') return null;
    const host = u.hostname.toLowerCase();
    let id;
    if (host === 'youtu.be') id = u.pathname.slice(1);
    else if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(host)) id = u.pathname === '/watch' ? u.searchParams.get('v') : /^\/(?:shorts|live|embed)\/([^/]+)$/.exec(u.pathname)?.[1];
    return /^[A-Za-z0-9_-]{11}$/.test(id ?? '') ? id : null;
  } catch { return null; }
}
export function csv(rows) {
  if (!rows.length) return '';
  const fields = Object.keys(rows[0]);
  const quote = v => `"${String(v ?? '').replaceAll('"', '""')}"`;
  return [fields.map(quote).join(','), ...rows.map(row => fields.map(k => quote(row[k])).join(','))].join('\n') + '\n';
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const inventory = JSON.parse(readFileSync(path.join(root, 'scripts/data/remaining-character-intake-20261004.json'), 'utf8'));
  const rows = templates(inventory);
  writeFileSync(path.join(root, 'scripts/data/CHARACTER_MEDIA_MAPPING_TEMPLATE_20261004.csv'), csv(rows));
  console.log(JSON.stringify({ characters: new Set(rows.map(r => r.Character_slug)).size, moves: rows.length, queue: recordingQueue(inventory).map(c => c.slug), autoConfirmed: 0 }));
}
