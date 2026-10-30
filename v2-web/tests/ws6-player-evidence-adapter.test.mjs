import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, realpathSync } from 'node:fs';
import { isAbsolute, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSfl48EvidenceBundle as build } from '../src/lib/ws6-player-evidence-adapter.mjs';

// Real-world evidence is private. The public checkout never contains its five JSON files.
const PRIVATE_NAMES = new Set([
  'SFL48_PLAYER_IDENTITY_MATRIX', 'PLAYER_PROFILE_CONFIRMED_DELTA',
  'CHARACTER_USAGE_DELTA', 'TOURNAMENT_RESULT_EVIDENCE', 'PLAYER_SOCIAL_LINKS',
]);
const projectRoot = realpathSync(fileURLToPath(new URL('../', import.meta.url)));
const requestedPrivateDir = process.env.SF6DNA_PRIVATE_WS6_FIXTURE_DIR;
let privateRoot = null;
if (requestedPrivateDir) {
  if (!isAbsolute(requestedPrivateDir)) throw new Error('PRIVATE_WS6_FIXTURE_DIR_MUST_BE_ABSOLUTE');
  privateRoot = realpathSync(resolve(requestedPrivateDir));
  if (privateRoot === projectRoot || privateRoot.startsWith(projectRoot + sep)) {
    throw new Error('PRIVATE_WS6_FIXTURE_DIR_INSIDE_PUBLIC_CHECKOUT');
  }
}
const fixtureTest = privateRoot ? test : test.skip;
const read = name => {
  if (!privateRoot || !PRIVATE_NAMES.has(name)) throw new Error('PRIVATE_WS6_FIXTURE_NOT_CONFIGURED');
  return JSON.parse(readFileSync(join(privateRoot, name + '.json'), 'utf8'));
};
const fixture = () => ({ identity: read('SFL48_PLAYER_IDENTITY_MATRIX'), profiles: read('PLAYER_PROFILE_CONFIRMED_DELTA'), characters: read('CHARACTER_USAGE_DELTA'), results: read('TOURNAMENT_RESULT_EVIDENCE'), socials: read('PLAYER_SOCIAL_LINKS') });
const NOW = Date.parse('2026-10-14T07:18:40Z');
fixtureTest('full saved SFL48 bundle preserves 21 UUIDs, 24 null IDs and 3 holds', () => {
 const out = build(fixture(), NOW);
 assert.equal(out.records.length,45); assert.equal(out.records.filter(r=>r.playerId).length,21);
 assert.equal(out.summary.identityHolds,3); assert.equal(out.publicationReady,false);
 assert.equal(out.records.some(r=>['MenaRD','2BASSA','Jr.'].includes(r.displayName)),false);
});
fixtureTest('event usage never becomes Main, team roster never becomes primary team, no videos',()=>{
 const o=build(fixture(),NOW);assert.ok(o.summary.tournamentCharacterFacts>0);
 for(const r of o.records){assert.equal(r.currentMain,null);assert.equal(r.currentSub,null);assert.equal(r.primaryTeamName,null);assert.deepEqual(r.profileIntake.recommendedVideos,[]);for(const f of r.profileIntake.characters){assert.equal(f.state,'HISTORICAL');assert.equal(f.verified,false);}}
});
fixtureTest('duplicate roster cannot silently overwrite another player',()=>{let x=fixture();x.identity.rows[1].roster_key=x.identity.rows[0].roster_key;assert.throws(()=>build(x,NOW),/DUPLICATE/);});
fixtureTest('misjoined profile UUID is rejected',()=>{let x=fixture();x.profiles.candidates[0].player_id_candidate='foreign';assert.throws(()=>build(x,NOW),/MISMATCH/);});
fixtureTest('inventing UUID for a new candidate is rejected',()=>{let x=fixture();x.identity.rows[0].player_id_candidate='00000000-0000-0000-0000-000000000000';assert.throws(()=>build(x,NOW),/NEW_UUID/);});
fixtureTest('foreign player social never joins by partial name',()=>{let x=fixture();x.socials.push({...x.socials[0],player:'unknown'});assert.throws(()=>build(x,NOW),/SOCIAL_IDENTITY/);});
fixtureTest('unsafe URLs and unresolved sources are held, not included',()=>{let x=fixture();const n=build(x,NOW).summary.socialCandidates;let r=x.socials.find(s=>s.player==='りゅうきち');r.url='javascript:alert(1)';assert.equal(build(x,NOW).summary.socialCandidates,n-1);r.url='https://x.com/ryukichi1214';r.source_reference_resolved=false;assert.equal(build(x,NOW).summary.socialCandidates,n-1);});
fixtureTest('future or impossible event dates cannot enter profile facts',()=>{let x=fixture();const n=build(x,NOW).summary.tournamentCharacterFacts;x.characters.previous_tournament_usage[0].date='2026-02-30';assert.equal(build(x,NOW).summary.tournamentCharacterFacts,n-1);x.characters.previous_tournament_usage[0].date='2099-01-01';assert.equal(build(x,NOW).summary.tournamentCharacterFacts,n-1);});
fixtureTest('repeat evidence is deduplicated and input stays unchanged',()=>{let x=fixture();x.characters.previous_tournament_usage.push(x.characters.previous_tournament_usage[0]);const before=JSON.stringify(x);assert.equal(build(x,NOW).summary.tournamentCharacterFacts,build(fixture(),NOW).summary.tournamentCharacterFacts);assert.equal(JSON.stringify(x),before);});
fixtureTest('team result and ranking ordinal never become official points',()=>{let o=build(fixture(),NOW);assert.equal(o.summary.tournamentCandidates,4);for(let r of o.records)for(let t of r.tournamentCandidates){assert.equal(t.cptPoints,null);assert.equal(t.sflIndividualPoints,null);assert.equal(t.verified,false);assert.notEqual(t.event,'CPT 2026 WORLD WARRIOR Japan #2');}});


// Synthetic tests always run. They do not embed names, UUIDs or other unpublished evidence.
function createSyntheticBundle() {
  const identity = { rows: [] }, profiles = { candidates: [] };
  for (let n = 1; n <= 48; n++) {
    const rosterKey = 'SFL2026-' + String(n).padStart(2, '0');
    const player = 'SyntheticPlayer' + String(n).padStart(2, '0');
    const team = 'SyntheticTeam' + String(Math.floor((n - 1) / 4) + 1).padStart(2, '0');
    identity.rows.push({ roster_key: rosterKey, player, status: 'CONFIRMED_NEW_CANDIDATE', player_id_candidate: null });
    profiles.candidates.push({ roster_key: rosterKey, identity_status: 'CONFIRMED_NEW_CANDIDATE',
      player_id_candidate: null, player_detail_candidate: { displayName: player },
      league_roster_affiliation: team, league_season: 2026 });
  }
  return { identity, profiles, characters: { previous_tournament_usage: [] }, socials: [], results: {} };
}
test('synthetic 48-player intake has no publication permission', () => {
  const result = build(createSyntheticBundle(), NOW);
  assert.equal(result.records.length, 48);
  assert.equal(result.summary.publishedFacts, 0);
  assert.equal(result.publicationReady, false);
  assert.equal(result.writeAllowed, false);
  for (const player of result.records) {
    assert.equal(player.publicationReady, false);
    assert.equal(player.writeAllowed, false);
    assert.equal(player.currentMain, null);
    assert.equal(player.currentSub, null);
  }
});
test('synthetic duplicate identity rejects input without partial write', () => {
  const input = createSyntheticBundle();
  input.identity.rows[1].roster_key = input.identity.rows[0].roster_key;
  assert.throws(() => build(input, NOW), /DUPLICATE/);
});
test('synthetic source-free profile does not invent Social or Event relations', () => {
  const input = createSyntheticBundle();
  input.socials.push({ player: 'SyntheticPlayer01', platform: 'X', url: 'javascript:alert(1)',
    source: 'https://example.invalid', source_reference_resolved: true });
  const result = build(input, NOW);
  assert.equal(result.summary.socialCandidates, 0);
  assert.equal(result.summary.tournamentCandidates, 0);
  assert.equal(result.summary.tournamentCharacterFacts, 0);
  assert.ok(result.records.every(p => p.profileIntake.recommendedVideos.length === 0));
});
