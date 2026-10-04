import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// Input is a read-only SQL export. This generator has no database client or credentials.
export function generate(input, routeSource) {
  const slugs = [...routeSource.matchAll(/^  "([a-z-]+)",$/gm)].map(match => match[1]);
  if (slugs.length !== 31 || new Set(slugs).size !== 31) throw Error('Route roster must contain 31 unique characters');
  if (input.patches?.length !== 1) throw Error('Exactly one current DB patch is required');
  const patch = input.patches[0];
  const characters = {}, audit = [], review = [];
  const ids = new Set();
  for (const slug of slugs) {
    const sources = input.characters.filter(character => character.slug === slug);
    if (sources.length !== 1) throw Error('Missing or duplicate character: ' + slug);
    const character = sources[0];
    const count = { character: slug, total: 0, fixture_ready: 0, command_missing: 0, frame_missing: 0, startup_missing: 0, on_hit_missing: 0, on_block_missing: 0, damage_missing: 0, review_required: 0, public_ready: 0 };
    const evidence = [];
    const moves = (character.moves ?? []).map(move => {
      if (ids.has(move.id)) throw Error('Duplicate move identity: ' + move.id);
      ids.add(move.id);
      const commands = (move.commands ?? []).map(command => ({
        moveId: move.id, scheme: command.control_scheme, sortOrder: command.sort_order,
        commandText: command.command_text, numericNotation: command.numeric_notation,
        buttonNotation: command.button_notation, conditionText: command.condition_text,
      })).sort((a,b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      const current = (move.frames ?? []).filter(frame => frame.valid_from_patch_id === patch.id && frame.valid_to_patch_id === null);
      const frame = current.length === 1 ? current[0] : null;
      const reasons = [];
      if (!move.name) reasons.push('NAME_MISSING');
      if (!move.moveType) reasons.push('TYPE_MISSING');
      if (!commands.some(command => command.scheme === 'classic' && (command.commandText || command.numericNotation || command.buttonNotation))) reasons.push('COMMAND_MISSING');
      if (!frame) reasons.push(current.length > 1 ? 'OTHER_HOLD' : move.frames?.length ? 'FRAME_NOT_CURRENT' : 'FRAME_MISSING');
      const evidenceMissing = !move.moveOfficialEvidence || !move.classicCommandOfficialEvidence || !move.frameOfficialEvidence;
      if (evidenceMissing || frame?.verification_status !== 'verified') reasons.push('CANONICAL_REVIEW');
      count.total++;
      if (!reasons.some(reason => reason !== 'CANONICAL_REVIEW')) count.fixture_ready++;
      if (reasons.includes('COMMAND_MISSING')) count.command_missing++;
      if (!frame) count.frame_missing++;
      for (const field of ['startup','on_hit','on_block','damage']) if (frame?.[field] === null || frame?.[field] === undefined || frame?.[field] === '') count[field + '_missing']++;
      if (reasons.length) { count.review_required++; review.push({ character: slug, id: move.id, slug: move.slug, reasons: reasons.join('|') }); }
      if (move.status === 'published' && !evidenceMissing && frame?.verification_status === 'verified') count.public_ready++;
      evidence.push({ id: move.id, strengthVariant: move.strengthVariant, displayOrder: move.displayOrder, frameId: frame?.id ?? null, moveOfficialEvidence: move.moveOfficialEvidence, classicCommandOfficialEvidence: move.classicCommandOfficialEvidence, frameOfficialEvidence: move.frameOfficialEvidence, reviewReasons: reasons });
      return { id: move.id, slug: move.slug, name: move.name, moveType: move.moveType, usageSummary: null, status: move.status, releaseFixture: true,
        frame: frame ? { startup: frame.startup, active: frame.active, recovery: frame.recovery, onHit: frame.on_hit, onBlock: frame.on_block, damage: frame.damage, verificationStatus: frame.verification_status } : null, commands, media: null };
    });
    characters[slug] = { characterId: character.id, moves, audit: evidence };
    audit.push(count);
  }
  return { schemaVersion: 1, scope: 'RC_PREVIEW_ONLY', dbPatch: { id: patch.id, version: patch.version_label }, totals: input.totals, characters, coverage: audit, review };
}

function csv(rows) {
  if (!rows.length) return '';
  const columns = Object.keys(rows[0]);
  return columns.join(',') + '\n' + rows.map(row => columns.map(column => '"' + String(row[column] ?? '').replaceAll('"','""') + '"').join(',')).join('\n') + '\n';
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const input = JSON.parse(readFileSync(process.argv[2], 'utf8'));
  const result = generate(input, readFileSync('v2-web/src/lib/character-detail-route.ts','utf8'));
  mkdirSync('docs/release-20261004-character-fixtures', {recursive:true});
  writeFileSync('v2-web/src/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json', JSON.stringify(result));
  writeFileSync('docs/release-20261004-character-fixtures/CHARACTER_RELEASE_FIXTURE_AUDIT_20261004.csv',csv(result.coverage));
  writeFileSync('docs/release-20261004-character-fixtures/RELEASE_FIXTURE_REVIEW_REQUIRED.csv',csv(result.review));
  console.log(JSON.stringify({characters:Object.keys(result.characters).length, ready:result.coverage.reduce((n,c)=>n+c.fixture_ready,0), review:result.review.length}));
}
