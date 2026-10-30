import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const loaded = { exports: {} };
const code = ts.transpileModule(readFileSync(new URL('../src/lib/player-directory-navigation.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
new Function('module', 'exports', 'require', code)(loaded, loaded.exports, () => { throw new Error('Unexpected runtime dependency'); });
const { readPlayerDirectoryState: read, playerDirectoryHref: href, playerDetailHref: detail, safePlayerDirectoryReturn: back } = loaded.exports;
const empty = { query: '', teams: [], categories: [], characters: [] };

test('directory URL round trip retains Unicode query and OR groups without mutation', () => {
  const state = { query: 'ときど & ＪＰ', teams: ['REJECT', 'ZETA DIVISION Geekly'], categories: ['pro', 'competitive'], characters: ['jp', 'ken'] };
  const before = JSON.stringify(state);
  const url = href(state);
  assert.deepEqual(read(new URLSearchParams(url.split('?')[1])), state);
  assert.equal(JSON.stringify(state), before);
});
test('detail return URL retains filters and encodes the route segment', () => {
  const state = { ...empty, query: 'sako', teams: ['KADOKAWA FAV gaming'] };
  const url = new URL(detail('name/with?reserved', state), 'https://example.com');
  assert.equal(url.pathname, '/players/name%2Fwith%3Freserved');
  assert.equal(back(url.searchParams.get('returnTo')), href(state));
});
test('clear state produces the plain directory and detail URLs', () => {
  assert.equal(href(empty), '/players');
  assert.equal(detail('tokido', empty), '/players/tokido');
  assert.deepEqual(read(new URLSearchParams()), empty);
});
test('return links reject external, executable, malformed, fragment and other-app paths', () => {
  for (const value of [null, undefined, ['foo'], 'https://example.com/players', '//example.com/players', 'javascript:alert(1)', '/players-evil', '/players/../account', '/players#evil', '/players?x=\\evil', '/players?x=\nfoo', '/videos?playerId=x', ' /players', '/players?' + 'a'.repeat(32768)]) {
    assert.equal(back(value), '/players', String(value));
  }
});
test('nested return keys and unrelated parameters are not propagated', () => {
  assert.equal(back('/players?q=JP&returnTo=https%3A%2F%2Fevil.example&token=private'), '/players?q=JP');
  assert.equal(back('/players?returnTo=%2Fplayers%3FreturnTo%3D%2Faccount'), '/players');
});
test('untrusted URL input is bounded and duplicate values are removed', () => {
  const params = new URLSearchParams({ q: 'Q'.repeat(1024) });
  for (let i = 0; i < 60; i++) params.append('team', `team-${i}`);
  params.append('type', 'pro'); params.append('type', 'pro');
  params.append('character', 'x'.repeat(129));
  const state = read(params);
  assert.equal(state.query.length, 256); assert.equal(state.teams.length, 48);
  assert.deepEqual(state.categories, ['pro']); assert.deepEqual(state.characters, []);
  assert.equal(href(state), back(href(state)));
});
test('encoded controls are excluded and unknown valid filters remain a zero-result choice', () => {
  const state = read(new URLSearchParams('q=%00hidden&team=Unknown&character=jp%0A&type=pro'));
  assert.deepEqual(state, { ...empty, teams: ['Unknown'], categories: ['pro'] });
});
test('literal query punctuation cannot escape into another query parameter', () => {
  const query = 'JP?team=evil&returnTo=//evil.example#end';
  const url = href({ ...empty, query });
  const params = new URLSearchParams(url.split('?')[1]);
  assert.equal(params.get('q'), query); assert.equal(params.size, 1);
  assert.equal(back(url), url);
});
