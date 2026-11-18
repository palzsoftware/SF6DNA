// Regenerates WS5 preview candidates under the product slug for characters whose WS5 key differs
// (currently deejay -> dee-jay). The original R3 snapshot and canonical TXT stay unchanged.
// Existing IDs are linked only through the reviewed crosswalk rule in src/lib/ws5-slug-alias.mjs.
// Usage: node scripts/build-ws5-alias-candidates.mjs [--check]
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { WS5_TO_APP_SLUG, rescopeWs5Candidate } from '../src/lib/ws5-slug-alias.mjs';

const DATA = new URL('../src/data/', import.meta.url);
export const OUTPUT = 'SF6DNA_WS5_APP_SLUG_PREVIEW_BUNDLES_R3_REGEN_20261117.json';
const read = name => JSON.parse(readFileSync(new URL(name, DATA), 'utf8'));

export function buildAliasCandidates() {
  const r3 = read('SF6DNA_WS5_DEVICE_PREVIEW_BUNDLES_R3_CANDIDATE_20261024.json');
  const records = read('SF6DNA_WS5_OFFICIAL_TXT_CANONICAL_20261026.json');
  const fixture = read('ALL_CHARACTER_RELEASE_FIXTURE_20261004.json');
  const output = {};
  for (const [ws5Slug, appSlug] of Object.entries(WS5_TO_APP_SLUG).sort()) {
    const existingMoves = fixture.characters[appSlug]?.moves;
    if (!r3[ws5Slug] || !existingMoves) throw new Error(`missing source for ${ws5Slug} -> ${appSlug}`);
    const { candidate } = rescopeWs5Candidate({ candidate: r3[ws5Slug], records, appSlug, existingMoves });
    output[appSlug] = candidate;
  }
  return output;
}
export const serialize = value => JSON.stringify(value, null, 1) + '\n';

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const text = serialize(buildAliasCandidates()), target = new URL(OUTPUT, DATA);
  if (process.argv.includes('--check')) {
    if (readFileSync(target, 'utf8') !== text) { console.error(`${OUTPUT} is stale`); process.exit(1); }
    console.log(`${OUTPUT} is up to date`);
  } else { writeFileSync(target, text, 'utf8'); console.log(`wrote ${OUTPUT}`); }
}
