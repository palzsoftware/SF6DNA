import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

// SFL2026 team archive rows keep template slugs and record post-migration
// identities in identityVariants. These tests check that the runtime resolver
// honours only same-environment, same-UUID variants and never bypasses PENDING.
const DEV = 'vvsknbmlfvvnrmgtyhbf';
const PROD = 'wnuxaxbrpudyypzdbdho';
const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const json = path => JSON.parse(read(path));
const teamBindings = json('../src/data/player-research/team-bindings.json');

function loadSource(path, imports) {
  const js = ts.transpileModule(read(path), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const mod = { exports: {} };
  new Function('module', 'exports', 'require', js)(mod, mod.exports, name => {
    assert.ok(name in imports, `unexpected dependency ${name}`);
    return imports[name];
  });
  return mod.exports;
}
const esm = value => ({ __esModule: true, default: value });
const archive = loadSource('../src/lib/player-archive-display.ts', {});
const supplements = loadSource('../src/components/player-detail-supplements.tsx', {
  'react/jsx-runtime': { jsx: () => null, jsxs: () => null, Fragment: 'fragment' },
  '../lib/player-archive-display': archive,
  '../data/player-research/team-bindings.json': esm(teamBindings),
  './player-research-sections': { PlayerResearchSections: () => null },
  './player-recommended-videos': { PlayerRecommendedVideos: () => null },
  '../lib/player-video-binding': { boundPlayerVideoRecommendations: () => [] },
  '../data/player-research/records.json': esm([]),
  '../data/player-research/videos.json': esm([]),
  '../data/player-research/video-bindings.json': esm([]),
  '../data/player-research/research-bindings.json': esm({}),
  // 2026-11-19: ローカル確認スイッチ。本テストは公開ゲートを検証するため常に無効(false)で読み込む
  '../lib/player-local-preview': { playerLocalPreviewEnabled: () => false },
});
const { resolveTeamBindingIdentities, attachPlayerTeamResults } = supplements;
const player = (id, slug) => ({ id, slug, displayName: slug, aliases: [], characters: [], sources: [], tournamentResults: [] });
const approve = rows => rows.map(row => ({ ...row, publicationApproval: 'APPROVED' }));

test('all 48 SFL2026 team rows resolve to unique Development UUID+slug identities', () => {
  // 2026-11-19: SFL2026の48行に限定して検証する(ユーザー提供の11名の行は note で区別し、別テストで検証)
  const resolved = resolveTeamBindingIdentities(teamBindings.filter(r => !String(r.note ?? '').startsWith('メイン・サブは2026-11-18')), DEV);
  assert.equal(resolved.length, 48);
  // 除外したのはユーザー提供11名の行だけで、仮slug・identityVariantsを持つ行は除外されていないこと
  const excluded = teamBindings.filter(r => r.environment === DEV && String(r.note ?? '').startsWith('メイン・サブは2026-11-18'));
  assert.ok(excluded.every(r => !r.identityVariants && !/^sfl2026-\d+$/.test(r.playerSlug)));
  assert.equal(teamBindings.filter(r => r.environment === DEV).length, 48 + excluded.length);
  assert.equal(new Set(resolved.map(r => r.playerId)).size, 48);
  assert.equal(new Set(resolved.map(r => r.playerSlug)).size, 48);
  assert.ok(resolved.every(r => r.display.slug === r.playerSlug));
  assert.ok(resolved.every(r => !/^sfl2026-\d+$/.test(r.playerSlug)), 'template slugs must not reach Development matching');
  const ryukichi = resolved.find(r => r.playerId === 'b3f67376-cb75-4b44-8b2d-ef50058a1b98');
  assert.equal(ryukichi.playerSlug, 'ryukichi');
});

test('PENDING rows stay hidden even when the identity now matches', () => {
  const detail = player('b3f67376-cb75-4b44-8b2d-ef50058a1b98', 'ryukichi');
  assert.equal(attachPlayerTeamResults(detail, DEV).archiveDisplay, undefined);
});

test('an approved row attaches only for the migrated slug in the same environment', () => {
  const rows = approve(teamBindings);
  const migrated = attachPlayerTeamResults(player('b3f67376-cb75-4b44-8b2d-ef50058a1b98', 'ryukichi'), DEV, rows);
  assert.equal(migrated.archiveDisplay?.slug, 'ryukichi');
  assert.equal(attachPlayerTeamResults(player('b3f67376-cb75-4b44-8b2d-ef50058a1b98', 'sfl2026-01'), DEV, rows).archiveDisplay, undefined);
  assert.equal(attachPlayerTeamResults(player('b3f67376-cb75-4b44-8b2d-ef50058a1b98', 'ryukichi'), PROD, rows).archiveDisplay, undefined);
  assert.equal(attachPlayerTeamResults(player('b3f67376-cb75-4b44-8b2d-ef50058a1b98', 'ryukichi'), 'unknown', rows).archiveDisplay, undefined);
  // Rows whose slug never migrated keep exact matching.
  assert.equal(attachPlayerTeamResults(player('24f7c815-946f-49f0-aede-7b8f42fdfebb', 'tokido'), DEV, rows).archiveDisplay?.slug, 'tokido');
});

test('a variant for another UUID or environment cannot rebind a row', () => {
  const base = teamBindings.find(r => r.playerSlug === 'tokido');
  const forged = [{ ...base, publicationApproval: 'APPROVED', identityVariants: [
    { environment: 'development', playerId: '00000000-0000-4000-8000-000000000000', playerSlug: 'forged' },
    { environment: 'production', playerId: base.playerId, playerSlug: 'prod-only' },
  ] }];
  const [resolved] = resolveTeamBindingIdentities(forged, DEV);
  assert.equal(resolved.playerSlug, 'tokido');
  assert.equal(attachPlayerTeamResults(player('00000000-0000-4000-8000-000000000000', 'forged'), DEV, forged).archiveDisplay, undefined);
});

test('team archive candidates contain no blank display items', () => {
  const blanks = teamBindings.flatMap(r => r.display.sections.flatMap(s => s.items)).filter(i => !String(i.text).trim());
  assert.deepEqual(blanks, []);
});

test('card connection: every one of the 48 attaches a non-blank archive once approved (Development identity)', () => {
  const rows = approve(teamBindings);
  const resolved = resolveTeamBindingIdentities(teamBindings, DEV);
  const connected = resolved.filter(r => {
    const out = attachPlayerTeamResults(player(r.playerId, r.playerSlug), DEV, rows).archiveDisplay;
    return out?.slug === r.playerSlug && out.sections.some(s => s.items.some(i => String(i.text).trim()));
  });
  assert.equal(connected.length, 48);
  // Still PENDING in the shipped data: nothing attaches for any of them.
  assert.equal(resolved.filter(r => attachPlayerTeamResults(player(r.playerId, r.playerSlug), DEV).archiveDisplay).length, 0);
});
