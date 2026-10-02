import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
import * as React from 'react';
import { resolveTitle } from 'next/dist/lib/metadata/resolvers/resolve-title.js';

const require = createRequire(import.meta.url);
function load(file, overrides) {
  const compiled = { exports: {} };
  const js = ts.transpileModule(readFileSync(new URL(`../src/${file}`, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  new Function('module', 'exports', 'require', js)(compiled, compiled.exports, name => {
    if (name in overrides) return overrides[name];
    if (name === '@/components/visual-icon') return load('components/visual-icon.tsx', {});
    if (name === 'react/jsx-runtime' || name === 'react') return require(name);
    return {};
  });
  return compiled.exports;
}
const routes = ['[section]', 'combos', 'matchups', 'training'];
const flags = { publicStrategyContent: true, training: true };
const overrides = {
  '@/lib/release-features': { releaseFeatures: flags },
  '@/lib/characters': { getCharacterBySlug: async slug => slug === 'missing' ? null : { name: 'リュウ' } },
  '@/types/character': { CHARACTER_SECTION_KEYS: ['overview', 'moves', 'combos', 'setups', 'sequences', 'matchups', 'training', 'players', 'videos'] },
};

test('character child metadata resolves through Next title template with exactly one brand suffix', async () => {
  const root = readFileSync(new URL('../src/app/layout.tsx', import.meta.url), 'utf8');
  const template = root.match(/template:\s*"([^"]+)"/)[1];
  for (const route of routes) {
    const page = load(`app/characters/[slug]/${route}/page.tsx`, overrides);
    const metadata = await page.generateMetadata({ params: Promise.resolve({ slug: 'ryu', section: 'players' }) });
    const title = resolveTitle(metadata.title, template).absolute;
    assert.ok(title.startsWith('リュウ '));
    assert.equal(title.split('SF6DNA').length - 1, 1, route);
    assert.ok(title.endsWith(' | SF6DNA'));
    assert.deepEqual(await page.generateMetadata({ params: Promise.resolve({ slug: 'missing', section: 'players' }) }), {});
  }
});

test('held character routes keep metadata gates closed', async () => {
  const closed = { ...overrides, '@/lib/release-features': { releaseFeatures: { publicStrategyContent: false, training: false } } };
  for (const route of ['combos','matchups','training']) {
    assert.deepEqual(await load(`app/characters/[slug]/${route}/page.tsx`, closed).generateMetadata({ params: Promise.resolve({ slug: 'ryu' }) }), {});
  }
});

test('favorite action exposes character and changing action while preserving storage handler', () => {
  const slots = []; let cursor = 0; let effect;
  const react = { ...React, useMemo: f => f(), useEffect: f => { effect = f; }, useState: initial => {
    const i = cursor++; if (!(i in slots)) slots[i] = initial;
    return [slots[i], next => { slots[i] = typeof next === 'function' ? next(slots[i]) : next; }];
  } };
  const writes = [];
  const { MyCharacterManager } = load('components/my-character-manager.tsx', {
    react, 'next/link': { __esModule: true, default: 'a' },
    '@/lib/local-user-tools': { getCharacterStatuses: () => ({}), getFavoriteCharacterSlugs: () => [], setFavoriteCharacter: (...args) => writes.push(args) },
  });
  const props = { characters: [{ id: 'ryu', slug: 'ryu', name: 'リュウ' }] };
  const render = () => { cursor = 0; return MyCharacterManager(props); };
  const find = tree => {
    if (Array.isArray(tree)) return tree.map(find).find(Boolean);
    if (!React.isValidElement(tree)) return null;
    return tree.type === 'button' ? tree : find(tree.props.children);
  };
  const previous = globalThis.window;
  globalThis.window = { requestAnimationFrame: f => { f(); return 1; }, cancelAnimationFrame() {} };
  try {
    render(); effect();
    let button = find(render()); assert.equal(button.props['aria-label'], 'リュウをお気に入りに追加'); assert.equal(button.props['aria-pressed'], false);
    button.props.onClick(); button = find(render());
    assert.equal(button.props['aria-label'], 'リュウをお気に入りから削除'); assert.equal(button.props['aria-pressed'], true);
    button.props.onClick(); assert.deepEqual(writes, [['ryu',true],['ryu',false]]);
  } finally { globalThis.window = previous; }
});

test('Home return journey describes the character-only favorites destination', async () => {
  const { default: HomePage } = load('app/page.tsx', {
    '@/lib/characters': { listCharacters: async () => [] },
    '@/lib/home-hero': { pickRandomHeroCharacters: () => [] },
    'next/link': { __esModule: true, default: 'a' },
  });
  const tree = await HomePage();
  const links = [];
  const text = value => Array.isArray(value) ? value.map(text).join('') : React.isValidElement(value) ? text(value.props.children) : typeof value === 'string' ? value : '';
  const visit = value => {
    if (Array.isArray(value)) return value.forEach(visit);
    if (!React.isValidElement(value)) return;
    if (value.props.href) links.push(value);
    visit(value.props.children);
  };
  visit(tree);
  for (const route of ['/diagnosis','/me/training','/characters','/search','/favorites','/my-characters','/diagnosis/history','/changelog']) {
    assert.ok(links.some(link => link.props.href === route), route);
  }
  const favorite = links.find(link => link.props.href === '/favorites');
  assert.match(text(favorite), /保存したキャラ/);
  assert.doesNotMatch(text(favorite), /動画/);
});
