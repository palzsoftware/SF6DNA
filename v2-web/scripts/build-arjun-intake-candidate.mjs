// Builds an Arjun registration candidate (sf6dna/arjun-official-intake/1) from the WS5 official TXT.
// Every field stays UNCONFIRMED with no reviewer, so the existing intake gate admits nothing until review.
// No DB IDs are created (canonicalMoveId = null); slugs are proposals for owner review.
// Usage: node scripts/build-arjun-intake-candidate.mjs [intake.json] [preview-mapping.csv]
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const CANONICAL = new URL('../src/data/SF6DNA_WS5_OFFICIAL_TXT_CANONICAL_20261026.json', import.meta.url);
// Existing RC Preview move names (src/lib/pre-release-character.ts), in display order.
export const ARJUN_PREVIEW_MOVES = Object.freeze(['大義の巨腕', '厳酷な岩肩', '息吹の円筒', '神気の巨巌', '鬼気迫る尋問',
  '不撓の警衛', '破壊の蛮声', '忘却の一鎚', '秩序の鬼神']);
// Derived moves listed by the TXT under a different name than their starter.
const DERIVED_FAMILY = Object.freeze({ '追撃': '大義の巨腕', '過剰な正義': '厳酷な岩肩', '息吹の震撼': '息吹の円筒', '倫理の崩壊': '不撓の警衛' });
const POSITION = { 5: 'standing', 2: 'crouching', 8: 'jumping' };
const FRAME = { startup: 'startup_frame', active: 'active_frame', recovery: 'recovery_frame', onHit: 'hit_frame', onBlock: 'block_frame', damage: 'damage' };

const blank = value => value === null || value === undefined || String(value).trim() === '';
const field = value => ({ value: blank(value) ? null : String(value).trim(), status: 'UNCONFIRMED', evidence: [], reviewedBy: null, reviewedAt: null });

/** Registration scope decision per official TXT row (DB conventions: no common system rows, no split projectile rows). */
export function arjunRowScope(raw) {
  const webId = Number(raw.webId);
  if (webId >= 600) return 'EXCLUDE_COMMON_SYSTEM';
  if (raw.skill.includes('(飛び道具)')) return 'EXCLUDE_PROJECTILE_SPLIT_ROW';
  return 'REGISTER_CANDIDATE';
}
export function arjunCategory(raw) {
  const webId = Number(raw.webId);
  if (webId >= 500) return 'throw';
  if (webId >= 400) return 'super';
  if (webId >= 300) return 'special';
  if (webId >= 200) return 'unique'; // includes target combos (intake schema has no target_combo category)
  return 'normal';
}
/** Slug proposal: positional normals follow the existing "<char>-standing-lp" convention, others use the web ID. */
export function arjunSlugProposal(raw) {
  const label = String(raw.name ?? '').replace(/[()]/g, '');
  const normal = label.match(/^([258])([LMH][PK])$/);
  if (Number(raw.webId) < 200 && normal) return `arjun-${POSITION[normal[1]]}-${normal[2].toLowerCase()}`;
  return `arjun-capcom-web-${raw.webId}`;
}
/** Splits a leading "（…）" situation prefix from a TXT command into its condition. */
export function splitCondition(command) {
  if (blank(command)) return { command: null, condition: null };
  const text = String(command).trim();
  const match = text.match(/^（([^）]+)）\s*(.*)$/);
  return match && match[2].trim() ? { command: match[2].trim(), condition: match[1] } : { command: text, condition: null };
}
export function previewFamily(skill) {
  const name = String(skill).replace(/^(?:SA\d|CA)\s+/, '');
  const derived = Object.entries(DERIVED_FAMILY).find(([key]) => name.includes(key));
  if (derived) return { family: derived[1], relation: 'DERIVED' };
  const direct = ARJUN_PREVIEW_MOVES.find(move => name.includes(move));
  if (direct) return { family: direct, relation: 'VARIANT' };
  // SA2 differs only by one kanji (鎚 U+939A in Preview, 槌 U+69CC in TXT): linked for review, flagged.
  if (name.includes('忘却の一槌')) return { family: '忘却の一鎚', relation: 'VARIANT_KANJI_CONFLICT' };
  return { family: null, relation: 'NOT_IN_PREVIEW' };
}

export function loadArjunRows() {
  const canonical = JSON.parse(readFileSync(CANONICAL, 'utf8'));
  return Object.entries(canonical).filter(([, record]) => record.characterSlug === 'arjun')
    .map(([key, record]) => ({ key, raw: record.raw })).sort((a, b) => Number(a.raw.webId) - Number(b.raw.webId));
}

export function buildArjunIntakeCandidate(rows = loadArjunRows()) {
  const moves = [], mapping = [];
  for (const { key, raw } of rows) {
    const scope = arjunRowScope(raw), family = previewFamily(raw.skill);
    const slug = scope === 'REGISTER_CANDIDATE' ? arjunSlugProposal(raw) : null;
    mapping.push({ sourceRecordKey: key, webId: raw.webId, name: raw.skill, officialType: raw.type, scope,
      slugProposal: slug, category: scope === 'REGISTER_CANDIDATE' ? arjunCategory(raw) : null,
      previewFamily: family.family, previewRelation: family.relation });
    if (scope !== 'REGISTER_CANDIDATE') continue;
    const classic = splitCondition(raw.command), modern = splitCondition(raw.command_modern);
    moves.push({ localKey: slug, canonicalMoveId: null, canonicalIdentityVerified: false, category: arjunCategory(raw),
      variantKey: `web-${raw.webId}`, parentLocalKey: null,
      name: field(raw.skill), classic: field(classic.command), modern: field(modern.command),
      classicCondition: field(classic.condition), modernCondition: field(modern.condition),
      ...Object.fromEntries(Object.entries(FRAME).map(([name, rawKey]) => [name, field(raw[rawKey])])),
      notes: field([...(raw.note ?? []), ...(raw.combo_correct ?? [])].join(' / ')) });
  }
  return { intake: { schema: 'sf6dna/arjun-official-intake/1', characterSlug: 'arjun', patch: { label: null, verified: false },
    captures: [], moves, coverage: [] }, mapping };
}

// ---- Round 3: full 77-row ledger, review flags, excluded-row display plan, card draft, media ID table ----
const PREVIEW_ID = key => `sf6dna-preview:arjun:${encodeURIComponent(key)}`;
const PREVIEW_SLUG = key => `txt-arjun-${String(key).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`;
const NA_TEXT = /^(?:-|—|－|ー|―|N\/A)$/;
// Split projectile rows (damage only) are shown on the cards of the moves that fire them.
export const PROJECTILE_PARENTS = Object.freeze({ 316: [313, 314, 315], 321: [318, 319, 320], 325: [322, 323, 324], 329: [326, 327, 328] });

/** Review flags; descriptive only (no value is inferred or changed). */
export function arjunReviewFlags(raw) {
  const flags = [], value = key => raw[key] === null || raw[key] === undefined ? '' : String(raw[key]).trim();
  if (blank(raw.command)) flags.push('CLASSIC_NOT_LISTED');
  if (raw.command_modern === null) flags.push('MODERN_OFFICIAL_NOT_LISTED');
  if (/^（[^）]*自動派生）$/.test(value('command'))) flags.push('AUTO_DERIVED_NO_INPUT');
  const blanks = Object.entries(FRAME).filter(([, key]) => blank(raw[key])).map(([name]) => name);
  if (blanks.length === Object.keys(FRAME).length - 1 && blank(raw.startup_frame)) flags.push('FRAMES_ALL_BLANK');
  else if (blanks.length) flags.push('FRAME_BLANK:' + blanks.join('+'));
  if (Object.values(FRAME).some(key => /^(?:ー|―)$/.test(value(key)))) flags.push('NONSTANDARD_NA_MARK');
  if (Object.values(FRAME).some(key => /※/.test(value(key)))) flags.push('FOOTNOTE_MARK');
  if (value('damage') === '0' && Number(raw.webId) < 600) flags.push('DAMAGE_ZERO');
  if (Number(raw.webId) >= 500 && Number(raw.webId) < 600 || /尋問/.test(raw.skill)) flags.push('GRAB_BLOCK_VALUE_NOT_APPLICABLE_CANDIDATE');
  if (/忘却の一槌/.test(raw.skill)) flags.push('NAME_KANJI_CONFLICT_WITH_PREVIEW');
  if (/,/.test(value('active_frame'))) flags.push('MULTI_SEGMENT_ACTIVE');
  return flags;
}
export function excludedDisplayPlan(raw) {
  const scope = arjunRowScope(raw);
  if (scope === 'EXCLUDE_COMMON_SYSTEM') return { plan: 'SHOW_AS_LOCAL_SYSTEM_CARD', note: '他キャラと同じく共通システム行としてローカル候補カード表示（必殺技グループ）。DB登録対象外' };
  if (scope === 'EXCLUDE_PROJECTILE_SPLIT_ROW') return { plan: 'ATTACH_TO_PARENT_CARDS', note: '単独カードにせず、発射元の技カードの補足（飛び道具ダメージ）として表示',
    parents: PROJECTILE_PARENTS[raw.webId].map(id => `arjun:web:${id}`) };
  return { plan: 'REGISTER_AS_MOVE_CARD', note: '' };
}

/** Rows that only add a Modern input to another row with the same technical name and identical frames. */
export function modernInputMerges(rows) {
  const frames = raw => Object.values(FRAME).map(key => String(raw[key] ?? '').trim()).join('|');
  const merges = new Map();
  for (const { key, raw } of rows) {
    if (!blank(raw.command) || blank(raw.command_modern) || !raw.name) continue;
    const target = rows.find(other => other.key !== key && other.raw.name === raw.name && !blank(other.raw.command) &&
      other.raw.command_modern === null && frames(other.raw) === frames(raw));
    if (target) merges.set(key, target.key);
  }
  return merges;
}

export function buildArjunLedger(rows = loadArjunRows()) {
  const merges = modernInputMerges(rows);
  const previewIndex = new Map(ARJUN_PREVIEW_MOVES.map((name, index) => [name, `arjun-official-${index + 1}`]));
  return rows.map(({ key, raw }) => {
    const family = previewFamily(raw.skill), scope = arjunRowScope(raw);
    const mergeInto = merges.get(key) ?? null;
    const display = mergeInto ? { plan: 'MERGE_AS_MODERN_INPUT_OF', note: `${mergeInto} のModern入力として表示（同一技名・同一フレーム）。単独カードにしない`, parents: [mergeInto] } : excludedDisplayPlan(raw);
    return { sourceRecordKey: key, webId: raw.webId, officialType: raw.type, technicalName: raw.name ?? null, name: raw.skill,
      scope, category: scope === 'REGISTER_CANDIDATE' ? arjunCategory(raw) : null,
      proposedDbSlug: scope === 'REGISTER_CANDIDATE' ? arjunSlugProposal(raw) : null, formalMoveId: null,
      previewMoveId: PREVIEW_ID(key), previewMoveSlug: PREVIEW_SLUG(key),
      rcPreviewMoveId: family.family ? previewIndex.get(family.family) ?? null : null, previewFamily: family.family, previewRelation: family.relation,
      displayPlan: display.plan, displayNote: display.note, attachToSourceRecordKeys: display.parents ?? [],
      classic: raw.command ?? null, modern: raw.command_modern ?? null,
      ...Object.fromEntries(Object.entries(FRAME).map(([name, rawKey]) => [name, raw[rawKey] ?? null])),
      notes: raw.note ?? [], comboCorrect: raw.combo_correct ?? [], cancel: raw.web_cancel ?? null, attribute: raw.attribute ?? null,
      registrationRecommendation: mergeInto ? 'MERGE_INTO_EXISTING_CANDIDATE' : scope === 'REGISTER_CANDIDATE' ? 'REGISTER' : 'DO_NOT_REGISTER',
      reviewFlags: arjunReviewFlags(raw), patchVerified: false, publicationApproved: false };
  });
}

/** Existing move-card (DevicePreviewBundle) draft. IDs/slugs are the local preview ones already bound in the media registry. */
export function buildArjunCardDraft(rows = loadArjunRows()) {
  const bySource = new Map(rows.map(row => [row.key, row.raw]));
  const merges = modernInputMerges(rows), mergedInto = new Map([...merges].map(([from, to]) => [to, from]));
  const moves = [];
  for (const { key, raw } of rows) {
    const scope = arjunRowScope(raw);
    if (scope === 'EXCLUDE_PROJECTILE_SPLIT_ROW' || merges.has(key)) continue;
    const modernSource = mergedInto.has(key) ? bySource.get(mergedInto.get(key)) : raw;
    const id = PREVIEW_ID(key), classic = splitCondition(raw.command), modern = splitCondition(modernSource.command_modern);
    const commands = [['classic', classic], ['modern', modern]].filter(([, row]) => row.command)
      .map(([scheme, row], sortOrder) => ({ moveId: id, scheme, commandText: row.command, numericNotation: null, buttonNotation: null, conditionText: row.condition, sortOrder }));
    const frame = { verificationStatus: 'candidate_only' }, frameFieldStatus = {};
    for (const [name, rawKey] of Object.entries(FRAME)) {
      const text = blank(raw[rawKey]) ? null : String(raw[rawKey]).trim();
      frame[name] = text;
      frameFieldStatus[name] = text === null ? 'PENDING' : NA_TEXT.test(text) ? 'OFFICIAL_NA' : 'LOCAL_OFFICIAL_TXT_CANONICAL';
    }
    const supplementary = Object.entries(PROJECTILE_PARENTS).filter(([, parents]) => parents.includes(Number(raw.webId)))
      .map(([child]) => ({ sourceRecordKey: `arjun:web:${child}`, name: bySource.get(`arjun:web:${child}`)?.skill ?? null, damage: bySource.get(`arjun:web:${child}`)?.damage ?? null }));
    moves.push({ id, slug: PREVIEW_SLUG(key), name: raw.skill,
      moveType: scope === 'EXCLUDE_COMMON_SYSTEM' ? 'system' : ({ super: 'super', throw: 'throw', special: 'special', unique: 'unique', normal: 'normal' })[arjunCategory(raw)],
      usageSummary: null, releaseFixture: false, status: 'draft', frame, frameFieldStatus, commands, media: null,
      ws5ModernInputState: modernSource.command_modern === null ? 'OFFICIAL_NOT_LISTED' : 'PENDING',
      modernInputSourceRecordKey: mergedInto.get(key) ?? (raw.command_modern === null ? null : key),
      registrationScope: scope, proposedDbSlug: scope === 'REGISTER_CANDIDATE' ? arjunSlugProposal(raw) : null,
      sourceRecordKey: key, officialSupplementaryRows: supplementary });
  }
  return { guideSections: [], moves, combos: [], setups: [], sequences: [], matchups: [], training: [] };
}

/** ID table for the GIF/media owner: joins the existing media-key registry rows by sourceRecordKey (read-only). */
export function buildArjunMediaIdTable(ledger, mediaRegistry) {
  const byKey = new Map(mediaRegistry.filter(row => row.characterSlug === 'arjun').map(row => [row.sourceRecordKey, row]));
  return ledger.map(row => { const media = byKey.get(row.sourceRecordKey);
    return { sourceRecordKey: row.sourceRecordKey, webId: row.webId, name: row.name, scope: row.scope, displayPlan: row.displayPlan,
      currentPreviewMoveId: row.previewMoveId, currentPreviewMoveSlug: row.previewMoveSlug,
      registryMoveId: media?.currentMoveId ?? null, registryMoveSlug: media?.moveSlug ?? null, mediaKey: media?.mediaKey ?? null,
      registryConsistent: Boolean(media && media.currentMoveId === row.previewMoveId && media.moveSlug === row.previewMoveSlug),
      proposedDbSlug: row.proposedDbSlug, formalMoveId: null, rcPreviewMoveId: row.rcPreviewMoveId,
      attachToSourceRecordKeys: row.attachToSourceRecordKeys.join('|') }; });
}
export function rowsToCsv(rows, columns) {
  return [columns.join(','), ...rows.map(row => columns.map(column => csvCell(Array.isArray(row[column]) ? row[column].join('|') : row[column])).join(','))].join('\n') + '\n';
}

const csvCell = value => { const text = value === null || value === undefined ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text; };
export function mappingCsv(mapping) {
  const columns = ['sourceRecordKey', 'webId', 'name', 'officialType', 'scope', 'category', 'slugProposal', 'previewFamily', 'previewRelation'];
  return [columns.join(','), ...mapping.map(row => columns.map(column => csvCell(row[column])).join(','))].join('\n') + '\n';
}

export const CARD_DRAFT_DATA = 'SF6DNA_ARJUN_CARD_DRAFT_20261117.json';
export const serializeCardDraft = () => JSON.stringify(buildArjunCardDraft(), null, 1) + '\n';
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1] && process.argv[2] === '--card-data') {
  // node scripts/build-arjun-intake-candidate.mjs --card-data [--check]
  const target = new URL(`../src/data/${CARD_DRAFT_DATA}`, import.meta.url), text = serializeCardDraft();
  if (process.argv.includes('--check')) { if (readFileSync(target, 'utf8') !== text) { console.error(`${CARD_DRAFT_DATA} is stale`); process.exit(1); } console.log(`${CARD_DRAFT_DATA} is up to date`); }
  else { writeFileSync(target, text, 'utf8'); console.log(`wrote ${CARD_DRAFT_DATA}`); }
  process.exit(0);
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1] && process.argv[2] === '--round3') {
  // node scripts/build-arjun-intake-candidate.mjs --round3 <outDir>
  const outDir = process.argv[3]; if (!outDir) throw new Error('outDir required');
  const ledger = buildArjunLedger();
  const registry = JSON.parse(readFileSync(new URL('../src/data/SF6DNA_WS5_MEDIA_KEY_REGISTRY_20261026.json', import.meta.url), 'utf8'));
  writeFileSync(`${outDir}/ARJUN_77_MANAGEMENT_LEDGER.json`, JSON.stringify(ledger, null, 1) + '\n', 'utf8');
  writeFileSync(`${outDir}/ARJUN_77_REVIEW_FLAGS.csv`, rowsToCsv(ledger, ['sourceRecordKey', 'webId', 'name', 'officialType', 'scope', 'registrationRecommendation', 'category', 'proposedDbSlug', 'displayPlan', 'attachToSourceRecordKeys', 'reviewFlags']), 'utf8');
  writeFileSync(`${outDir}/ARJUN_CARD_DRAFT_BUNDLE.json`, JSON.stringify(buildArjunCardDraft(), null, 1) + '\n', 'utf8');
  const table = buildArjunMediaIdTable(ledger, registry);
  writeFileSync(`${outDir}/ARJUN_MOVE_ID_TABLE_FOR_MEDIA.csv`, rowsToCsv(table, Object.keys(table[0])), 'utf8');
  process.exit(0);
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { intake, mapping } = buildArjunIntakeCandidate();
  const [intakePath, mappingPath] = process.argv.slice(2);
  if (intakePath) writeFileSync(intakePath, JSON.stringify(intake, null, 2) + '\n', 'utf8');
  if (mappingPath) writeFileSync(mappingPath, mappingCsv(mapping), 'utf8');
  if (!intakePath && !mappingPath) process.stdout.write(mappingCsv(mapping));
}
