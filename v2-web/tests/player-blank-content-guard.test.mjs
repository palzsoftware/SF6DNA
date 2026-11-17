import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';

// Blank archive/research values must not render empty headings or
// source-only bullets on Player detail pages.
const require = createRequire(import.meta.url);
const { renderToStaticMarkup } = require('react-dom/server');
function load(path) {
  const js = ts.transpileModule(readFileSync(new URL(path, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const mod = { exports: {} };
  new Function('module', 'exports', 'require', js)(mod, mod.exports, name => {
    assert.equal(name, 'react/jsx-runtime', `unexpected dependency ${name}`);
    return require(name);
  });
  return mod.exports;
}
const { PlayerArchiveSections } = load('../src/components/player-archive-sections.tsx');
const { PlayerResearchSections } = load('../src/components/player-research-sections.tsx');
const SRC = 'https://sf.esports.capcom.com/sfl2026/player/example/';

test('archive display drops blank items, all-blank sections, blank intro and empty facts heading', () => {
  const html = renderToStaticMarkup(PlayerArchiveSections({ display: {
    slug: 'example', name: 'Example', intro: '   ',
    facts: [{ label: '所属', value: '確認中' }, { label: '地域', value: ' ' }],
    sections: [
      { title: 'チームのリーグ実績', items: [{ text: '', sourceUrl: SRC }, { text: '検証用の実績', sourceUrl: SRC }] },
      { title: '空のセクション', items: [{ text: ' ', sourceUrl: SRC }] },
    ],
  } }));
  assert.doesNotMatch(html, /プレイヤー紹介|基本情報|空のセクション/);
  assert.equal((html.match(/<li>/g) ?? []).length, 1);
  assert.match(html, /<li>検証用の実績 <a href="https:\/\/sf\.esports\.capcom\.com\/sfl2026\/player\/example\/"/);
});

test('archive display keeps existing non-blank output unchanged', () => {
  const html = renderToStaticMarkup(PlayerArchiveSections({ display: {
    slug: 'example', name: 'Example', intro: '紹介文',
    facts: [{ label: '所属', value: 'チーム' }],
    sections: [{ title: '実績', items: [{ text: '実績A', sourceUrl: null }] }],
  } }));
  assert.match(html, /<h2>プレイヤー紹介<\/h2><p>紹介文<\/p>/);
  assert.match(html, /<dt>所属<\/dt><dd>チーム<\/dd>/);
  assert.match(html, /<li>実績A<\/li>/);
});

test('research claims with blank text are not rendered', () => {
  const item = {
    research_id: 'example-1', player_slug: 'example', analysis_category: 'practice', analysis_title: '検証用タイトル',
    observed_behavior: { text: '確認した行動', basis: 'observed_fact' },
    situation: { text: '  ', basis: 'first_person_statement' },
    possible_reason: null, strength_or_purpose: null, practical_lesson: null,
    source_url: 'https://example.com/source', source_title: 'Source', source_date: null, game_patch: null,
    last_reviewed_at: '2026-11-17', verification_status: 'verified', publication_approval: 'APPROVED',
  };
  const html = renderToStaticMarkup(PlayerResearchSections({ playerSlug: 'example', items: [item] }));
  assert.match(html, /確認した行動/);
  assert.doesNotMatch(html, /状況（/);
});
