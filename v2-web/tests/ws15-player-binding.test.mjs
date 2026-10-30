import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

function load(file, overrides = {}) {
  const cjsModule = { exports: {} };
  const code = ts.transpileModule(readFileSync(new URL(`../src/lib/${file}.ts`, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  new Function('module', 'exports', 'require', code)(cjsModule, cjsModule.exports, name => overrides[name]);
  return cjsModule.exports;
}
const contract = load('player-profile-contract', { '@/lib/safe-external-url': load('safe-external-url') });
const { bindPlayerProfileIntake: bind } = load('player-profile-binding', { '@/lib/player-profile-contract': contract });
const now = Date.parse('2026-10-14T07:53:31Z');
const player = {
  id: '082e5e11-4622-4df7-9123-969e2812584a', slug: 'sako', displayName: '検証用選手',
  teamName: '既存掲載チーム', aliases: [], characters: [], imageUrl: null,
  tournamentResults: [], status: 'published', sources: [], xUrl: null,
};
const fact = { label: '検証用の確認済み情報', state: 'CURRENT', sourceUrl: 'https://example.com/source', sourceDate: '2026-10-13', verified: true };
const receipt = intake => ({ playerId: player.id, playerSlug: player.slug, profileIntake: intake });

test('exact UUID and slug are required, without name/alias/QA identity guessing', () => {
  for (const change of [{ playerId: 'another-id' }, { playerSlug: 'another-slug' }]) {
    assert.equal(bind(player, [{ ...receipt({ teams: [fact] }), ...change }], now), player);
  }
  const qa = { ...player, id: 'QA:sako' };
  assert.equal(bind(qa, [{ playerId: qa.id, playerSlug: qa.slug, profileIntake: { teams: [fact] } }], now), qa);
  assert.equal(bind(player, [], now), player);
});
test('duplicate or conflicting identity receipts cannot choose the first record', () => {
  const approved = receipt({ teams: [fact] });
  assert.equal(bind(player, [approved, approved], now), player);
  assert.equal(bind(player, [approved, { ...approved, playerSlug: 'different' }], now), player);
});
test('approved optional facts bind without changing base identity, SNS, roles or publication', () => {
  const incoming = receipt({ teams: [fact], devices: [{ ...fact, category: 'Leverless' }] });
  const before = JSON.stringify([player, incoming]);
  const result = bind(player, [incoming], now);
  assert.deepEqual(result.profileIntake.teams, [fact]);
  assert.equal(result.profileIntake.devices.length, 1);
  assert.equal(result.characters, player.characters);
  assert.equal(result.teamName, player.teamName);
  assert.equal(result.xUrl, player.xUrl);
  assert.equal(result.status, 'published');
  assert.equal(JSON.stringify([player, incoming]), before);
});
test('draft, missing-date, future and stale current sections stay hidden independently', () => {
  const incoming = receipt({ teams: [{ ...fact, verified: false }], characters: [{ ...fact, sourceDate: null }],
    devices: [{ ...fact, sourceDate: '2027-01-01', category: 'Pad' }],
    strengths: [{ ...fact, sourceDate: '2024-01-01', kind: 'SOURCE_SUPPORTED_SUMMARY' }] });
  assert.equal(bind(player, [incoming], now), player);
  incoming.profileIntake.referencePoints = [{ ...fact, kind: 'FIRST_PERSON_STATEMENT' }];
  const result = bind(player, [incoming], now);
  for (const key of ['teams', 'characters', 'devices', 'strengths']) assert.deepEqual(result.profileIntake[key], []);
  assert.equal(result.profileIntake.referencePoints.length, 1);
});
test('historical insight remains historical and inference is omitted', () => {
  const historical = { ...fact, sourceDate: '2024-01-01', state: 'HISTORICAL', kind: 'SOURCE_SUPPORTED_SUMMARY' };
  const result = bind(player, [receipt({ strengths: [historical, { ...fact, kind: 'INFERENCE_DRAFT' }] })], now);
  assert.deepEqual(result.profileIntake.strengths, [historical]);
});
test('recommended videos require exact CONFIRMED boolean and published status', () => {
  const video = { ...fact, title: '検証動画', recommendationReason: '検証理由', published: true };
  for (const relationConfirmed of [undefined, false, 'true', 1]) {
    assert.equal(bind(player, [receipt({ recommendedVideos: [{ ...video, relationConfirmed }] })], now), player);
  }
  const confirmed = { ...video, relationConfirmed: true };
  assert.deepEqual(bind(player, [receipt({ recommendedVideos: [confirmed] })], now).profileIntake.recommendedVideos, [confirmed]);
  assert.equal(bind(player, [receipt({ recommendedVideos: [{ ...confirmed, published: false }] })], now), player);
});
test('unsafe source links and malformed intake fragments cannot erase player or valid sections', () => {
  const result = bind(player, [receipt({ teams: null, devices: [null],
    strengths: [{ ...fact, sourceUrl: 'javascript:alert(1)', kind: 'SOURCE_SUPPORTED_SUMMARY' }],
    recommendedVideos: [{ ...fact, published: true, relationConfirmed: true }],
    referencePoints: [{ ...fact, kind: 'SOURCE_SUPPORTED_SUMMARY' }] })], now);
  assert.equal(result.id, player.id);
  assert.equal(result.profileIntake.referencePoints.length, 1);
  assert.deepEqual(result.profileIntake.recommendedVideos, []);
});
test('existing intake remains intact, duplicate exact rows are idempotent and inputs are unmodified', () => {
  const existing = { ...player, profileIntake: { teams: [{ ...fact, label: '既存チーム記録' }] } };
  const incoming = receipt({ teams: [fact, fact] });
  const before = JSON.stringify([existing, incoming]);
  const result = bind(existing, [incoming], now);
  assert.equal(result.profileIntake.teams.length, 2);
  assert.deepEqual(bind(result, [incoming], now), result);
  assert.equal(JSON.stringify([existing, incoming]), before);
});
