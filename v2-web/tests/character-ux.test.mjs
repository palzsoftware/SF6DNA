import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const nodeRequire = createRequire(import.meta.url);
function load(file, overrides = {}) {
  const testModule = { exports: {} };
  const js = ts.transpileModule(readFileSync(new URL(`../src/${file}`, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  new Function('module', 'exports', 'require', js)(testModule, testModule.exports, name => {
    if (name in overrides) return overrides[name];
    if (name === '@/components/practice-history') return load('components/practice-history.tsx', overrides);
    if (name === '@/components/mini-illustration') return load('components/mini-illustration.tsx', overrides);
    if (name === '@/components/visual-icon') return load('components/visual-icon.tsx', {});
    if (name.endsWith('.module.css')) return { default: new Proxy({}, { get: (_, key) => key }), __esModule: true };
    if (name.endsWith('.css')) return {};
    if (name.startsWith('@/lib/')) return load(`lib/${name.slice(6)}.ts`, overrides);
    return nodeRequire(name);
  });
  return testModule.exports;
}
const { matchesMoveSearch } = load('lib/character-move-filter.ts');
const groups = [
  { type: 'normal', label: '通常技', items: [{ id: 'n', name: '立ち弱P', commands: ['5LP'], content: React.createElement('article', null, '5LP 原文') }] },
  { type: 'special', label: '必殺技', items: [{ id: 's', name: '波動拳', commands: ['236HP', 'SP'], content: React.createElement('article', null, '236HP 原文') }] },
];
const props = { groups, groupClassName: 'group', listClassName: 'list' };

// Execute the actual handlers with deterministic state; no browser, network or DB.
function mount(file, exported, props, extra = {}) {
  const slots = []; let cursor = 0;
  const react = { ...React, useId: () => 'fixture-id', useMemo: factory => factory(), useEffect: () => {},
    useState: initial => { const index = cursor++; if (!(index in slots)) slots[index] = typeof initial === 'function' ? initial() : initial;
      return [slots[index], next => { slots[index] = typeof next === 'function' ? next(slots[index]) : next; }]; },
  };
  const Component = load(file, { ...extra, react });
  let tree;
  function render() { cursor = 0; tree = Component[exported](props); return nodes(); }
  function nodes() {
    const result = [];
    function visit(value) {
      if (Array.isArray(value)) return value.forEach(visit);
      if (!React.isValidElement(value)) return;
      if (typeof value.type === 'function') return visit(value.type(value.props));
      result.push(value); visit(value.props.children);
    }
    visit(tree); return result;
  }
  render(); return { render, nodes };
}
function text(node) {
  if (Array.isArray(node)) return node.map(text).join('');
  if (React.isValidElement(node)) return text(node.props.children);
  return typeof node === 'string' || typeof node === 'number' ? String(node) : '';
}

test('move search normalizes width/case and combines name/input terms without mutating source', () => {
  const move = { name: '波動拳', commands: ['236HP', 'SP'] }; const before = structuredClone(move);
  assert.ok(matchesMoveSearch(move, '波動 ２３６ｈｐ'));
  assert.ok(matchesMoveSearch(move, '  SP  '));
  assert.ok(matchesMoveSearch(move, ''));
  assert.equal(matchesMoveSearch(move, '未登録の技'), false);
  assert.equal(matchesMoveSearch(move, '波動 623'), false);
  assert.deepEqual(move, before);
});

test('move explorer searches, combines category, shows no results, then restores all original cards', () => {
  const app = mount('components/character-move-explorer.tsx', 'CharacterMoveExplorer', props);
  assert.equal(app.nodes().filter(n => n.type === 'article').length, 2);
  app.nodes().find(n => n.type === 'input').props.onChange({ target: { value: '236hp' } });
  app.render(); assert.equal(app.nodes().filter(n => n.type === 'article').length, 1);
  assert.ok(app.nodes().filter(n => n.type === 'details').every(n => n.props.open));
  app.nodes().find(n => n.type === 'button' && text(n) === '通常技').props.onClick();
  app.render(); assert.equal(app.nodes().filter(n => n.type === 'article').length, 0);
  assert.ok(app.nodes().some(n => text(n).includes('該当する技がありません')));
  app.nodes().find(n => n.type === 'button' && text(n) === '絞り込みを解除').props.onClick();
  app.render(); assert.equal(app.nodes().filter(n => n.type === 'article').length, 2);
  assert.equal(app.nodes().find(n => n.type === 'input').props.value, '');
  assert.equal(app.nodes().find(n => n.type === 'button' && text(n) === 'すべて').props['aria-pressed'], true);
});

test('SSR explorer has labelled search, pressed category, preserved raw content and no controls for pre-release shell', () => {
  const { CharacterMoveExplorer } = load('components/character-move-explorer.tsx');
  const html = renderToStaticMarkup(React.createElement(CharacterMoveExplorer, props));
  assert.match(html, /label for="[^"]+">技名・コマンドを検索/);
  assert.match(html, /aria-pressed="true">すべて/);
  assert.match(html, /5LP 原文/); assert.match(html, /236HP 原文/);
  const shell = renderToStaticMarkup(React.createElement(CharacterMoveExplorer, { ...props, enabled: false }));
  assert.doesNotMatch(shell, /type="search"|技のカテゴリ/); assert.match(shell, /236HP 原文/);
});

test('quick start links to five existing sections and the public Daily15 route, without inventing strategy', () => {
  const { CharacterQuickStart } = load('components/character-quick-start.tsx');
  const html = renderToStaticMarkup(React.createElement(CharacterQuickStart));
  assert.deepEqual([...html.matchAll(/href="#([^"]+)"/g)].map(m => m[1]), ['pilot-overview','pilot-moves','pilot-first-lesson','related-players','related-videos']);
  assert.match(html, /href="\/me\/training"/);
  assert.match(html, /今日の15分練習を決める/);
  assert.doesNotMatch(html, /おすすめコンボ|まず覚える技/);
});

test('fresh Home and mobile dock retain intended return routes', async () => {
  const link = { default: props => React.createElement('a', props), __esModule: true };
  const imports = { 'next/link': link, 'next/image': { default: 'img', __esModule: true },
    '@/lib/characters': { listCharacters: async () => [] }, '@/lib/home-hero': { pickRandomHeroCharacters: () => [] },
    '@/components/theme-selector': { ThemeSelector: () => null, AppearanceSelector: () => null },
    '@/components/mobile-dock': load('components/mobile-dock.tsx', { 'next/link': link, 'next/navigation': { usePathname: () => '/' } }),
  };
  const Home = load('app/page.tsx', imports).default;
  const home = renderToStaticMarkup(await Home());
  for (const route of ['/me/training','/diagnosis','/characters','/search','/favorites','/my-characters','/diagnosis/history','/changelog']) assert.ok(home.includes(`href="${route}"`), route);
  assert.match(home, /最近の更新/);
  const hero = home.slice(home.indexOf('class="home-hero"'), home.indexOf('class="daily-section"'));
  assert.ok(hero.indexOf('href="/me/training"') < hero.indexOf('href="/diagnosis"'));
  assert.match(home, /aria-label="5分の練習を3つ、合計15分"/);
  assert.equal([...home.matchAll(/<b>05<\/b>/g)].length, 3);
  assert.ok(home.indexOf('id="browse-title"') < home.indexOf('id="updates-title"'));
  const Layout = load('app/layout.tsx', imports).default;
  const layout = renderToStaticMarkup(React.createElement(Layout, null, 'fixture'));
  const dock = layout.slice(layout.indexOf('mobile-dock'));
  assert.deepEqual([...dock.matchAll(/href="([^"]+)"/g)].map(m => m[1]), ['/','/me/training','/favorites','/diagnosis/history','/my-characters']);
});

test('Video filter handlers open/close, count conditions, clear, search and sort actual results', () => {
  const base = { title: 'JP guide', description: '', events: [], players: ['翔'], characters: ['jp'], controlTypes: [], categories: ['guide'], levels: [], languages: [], videoType: 'guide', tags: [], publishedAt: '2026-09-30', viewCount: null, durationSeconds: null };
  const videos = [{ ...base, id: 'a' }, { ...base, id: 'b', title: 'Ryu match', players: ['ウメハラ'], characters: ['ryu'], publishedAt: '2026-10-01' }];
  const app = mount('components/video-library.tsx', 'VideoLibrary', { videos }, {
    '@/components/video-card': { VideoCard: props => React.createElement('article', { 'data-id': props.video.id }, props.video.title) },
    '@/lib/event-media': { formatVideoPublishedDate: value => value },
    '@/lib/video-preferences': { readVideoPreference: () => new Set(), VIDEO_FAVORITES_KEY: 'favorites', VIDEO_WATCHED_KEY: 'watched' },
  });
  const toggle = () => app.nodes().find(n => n.type === 'button' && n.props['aria-controls']);
  assert.equal(toggle().props['aria-expanded'], false); toggle().props.onClick(); app.render(); assert.equal(toggle().props['aria-expanded'], true);
  toggle().props.onClick(); app.render(); assert.equal(toggle().props['aria-expanded'], false);
  const player = app.nodes().find(n => n.type === 'label' && text(n) === '翔');
  player.props.children[0].props.onChange(); app.render(); assert.match(text(toggle()), /（1）/);
  assert.equal(app.nodes().filter(n => n.type === 'article').length, 1);
  app.nodes().find(n => n.type === 'button' && text(n) === 'すべて解除').props.onClick(); app.render(); assert.equal(app.nodes().filter(n => n.type === 'article').length, 2);
  app.nodes().find(n => n.type === 'input' && n.props.placeholder).props.onChange({ target: { value: 'JP' } }); app.render(); assert.equal(app.nodes().filter(n => n.type === 'article').length, 1);
  app.nodes().find(n => n.type === 'button' && text(n) === '条件をクリア').props.onClick(); app.render();
  app.nodes().find(n => n.type === 'select').props.onChange({ target: { value: 'newest' } }); app.render();
  assert.deepEqual(app.nodes().filter(n => n.type === 'article').map(n => n.props['data-id']), ['b','a']);
  assert.ok(app.nodes().some(n => text(n).includes('2件中 2件を表示')));
});


test('mobile return dock identifies exact current routes without diagnosis-prefix confusion', () => {
  const link = { default: props => React.createElement('a', props), __esModule: true };
  const routes = ['/', '/me/training', '/favorites', '/diagnosis/history', '/my-characters'];
  const global = ['/characters', '/diagnosis', '/search', '/players', '/videos'];
  assert.equal(routes.filter(route => global.includes(route)).length, 0);
  for (const pathname of [...routes, '/diagnosis/improvement-check', '/characters/jp']) {
    const { MobileDock } = load('components/mobile-dock.tsx', { 'next/link': link, 'next/navigation': { usePathname: () => pathname } });
    const html = renderToStaticMarkup(React.createElement(MobileDock));
    const active = [...html.matchAll(/<a[^>]*aria-current="page"[^>]*>/g)];
    assert.equal(active.length, routes.includes(pathname) ? 1 : 0, pathname);
    if (active.length) assert.ok(active[0][0].includes(`href="${pathname}"`));
    assert.deepEqual([...html.matchAll(/href="([^"]+)"/g)].map(m => m[1]), routes);
  }
});

test('visual symbols stay decorative and retain readable navigation labels', () => {
 const { VisualIcon, destinationIcon } = load('components/visual-icon.tsx');
 for (const [href, kind] of [['/search','search'], ['/videos','video'], ['/favorites','saved'], ['/diagnosis/history','history']]) {
  assert.equal(destinationIcon(href), kind);
  const html = renderToStaticMarkup(React.createElement('a', { href }, React.createElement(VisualIcon, { kind }), '目的地'));
  assert.ok(html.includes('aria-hidden="true"'));
  assert.ok(html.includes('focusable="false"'));
  assert.ok(html.includes('目的地'));
 }
});
