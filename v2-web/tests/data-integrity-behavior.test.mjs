import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

// These are unit tests of real functions with in-memory storage. They do not
// certify browser persistence, authentication, Supabase, or publication state.
function load(path, globals = {}, imports = {}) {
  const compiled = { exports: {} };
  const source = readFileSync(new URL(`../src/lib/${path}.ts`, import.meta.url), 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(output, { module: compiled, exports: compiled.exports, Set, Map, URL,
    require(name) {
      if (!(name in imports)) throw new Error(`Unstubbed import: ${name}`);
      return imports[name];
    }, ...globals });
  return compiled.exports;
}

const intent = load('video-intent');
const library = load('video-library', {}, { '@/lib/video-intent': intent });
const video = (id, overrides = {}) => ({ id, slug: id, title: id, platform: 'youtube',
  videoType: 'guide', publishedAt: null, description: null, url: 'https://youtu.be/abcdefghi',
  thumbnailUrl: null, channelName: null, durationSeconds: null, language: null,
  controlTypes: [], events: [], characters: [], players: [], categories: ['guide'],
  level: 'unknown', viewCount: null, viewCountCheckedAt: null, ...overrides });
const filters = (overrides = {}) => ({ query: '', events: new Set(), players: new Set(),
  characters: new Set(), controls: new Set(), categories: new Set(), levels: new Set(),
  languages: new Set(), modes: new Set(), preference: new Set(), ...overrides });
const ids = (rows) => Array.from(rows, row => row.id);

test('video filters use OR within a group and AND across groups', () => {
  const rows = [video('a', { characters: ['JP'], categories: ['guide'] }),
    video('b', { characters: ['リュウ'], categories: ['combo'] }),
    video('c', { characters: ['ケン'], categories: ['guide'] }),
    video('d', { characters: ['JP'], categories: ['match'] })];
  assert.deepEqual(ids(library.filterVideos(rows, filters({
    characters: new Set(['JP', 'リュウ']), categories: new Set(['guide', 'combo']),
  }), new Set(), new Set())), ['a', 'b']);
});

test('video no-result and empty inventories remain empty without broadening intent', () => {
  assert.deepEqual(ids(library.filterVideos([], filters(), new Set(), new Set())), []);
  assert.deepEqual(ids(library.filterVideos([video('a')], filters({ query: '存在しない検索語' }), new Set(), new Set())), []);
});

test('unknown metadata never satisfies selected language, control or level', () => {
  const rows = [video('unknown'), video('known', {
    language: 'ja', controlTypes: ['classic'], level: 'beginner',
  })];
  assert.deepEqual(ids(library.filterVideos(rows, filters({ languages: new Set(['ja']),
    controls: new Set(['classic']), levels: new Set(['beginner']),
  }), new Set(), new Set())), ['known']);
});

test('favorite and watched preferences remain independent and combine with character filters', () => {
  const rows = [video('a', { characters: ['JP'] }), video('b', { characters: ['リュウ'] }),
    video('c', { characters: ['JP'] })];
  assert.deepEqual(ids(library.filterVideos(rows, filters({ characters: new Set(['JP']),
    preference: new Set(['favorite', 'unwatched']),
  }), new Set(['a']), new Set(['a', 'b']))), ['a', 'c']);
});

test('video favorites survive module reload, deduplicate and toggle off', () => {
  const stored = new Map();
  const window = { localStorage: { getItem: key => stored.get(key) ?? null,
    setItem: (key, value) => stored.set(key, value) } };
  const first = load('video-preferences', { window });
  assert.equal(first.toggleVideoPreference(first.VIDEO_FAVORITES_KEY, 'video-a'), true);
  const reloaded = load('video-preferences', { window });
  assert.deepEqual(Array.from(reloaded.readVideoPreference(first.VIDEO_FAVORITES_KEY)), ['video-a']);
  assert.equal(reloaded.toggleVideoPreference(first.VIDEO_FAVORITES_KEY, 'video-a'), false);
  assert.deepEqual(JSON.parse(stored.get(first.VIDEO_FAVORITES_KEY)), []);
  assert.equal(stored.has(first.VIDEO_WATCHED_KEY), false);
});

test('video preference reads tolerate malformed values, blocked storage and SSR', () => {
  for (const value of ['broken-json', '{}', '["a", "a", 4, null]']) {
    const preferences = load('video-preferences', { window: { localStorage: { getItem: () => value } } });
    assert.deepEqual(Array.from(preferences.readVideoPreference('fixture')), value.startsWith('[') ? ['a'] : []);
  }
  const blocked = load('video-preferences', { window: { localStorage: { getItem() { throw new Error('blocked'); } } } });
  assert.equal(blocked.readVideoPreference('fixture').size, 0);
  assert.equal(load('video-preferences').readVideoPreference('fixture').size, 0);
});
