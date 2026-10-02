import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
const require = createRequire(import.meta.url);
function load(file) {
  const result = { exports: {} };
  const js = ts.transpileModule(readFileSync(new URL(`../src/${file}`, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  new Function('module', 'exports', 'require', js)(result, result.exports, name => {
    if (name.endsWith('.css')) return { default: new Proxy({}, { get: (_, key) => key }), __esModule: true };
    if (name.startsWith('@/lib/')) return load(`lib/${name.slice(6)}.ts`);
    return require(name);
  });
  return result.exports;
}
const { CharacterGamePlan, CharacterRangeGuide } = load('components/character-game-guide.tsx');
const { getCharacterDetailV21Profile } = load('lib/character-detail-v21.ts');
const { adaptCharacterDetailV2Profile } = load('lib/character-detail-v2-profile-adapter.ts');
const { normalizePublicCopy } = load('lib/public-copy.ts');
const escaped = text => renderToStaticMarkup(React.createElement('span', null, normalizePublicCopy(text))).replace(/^<span>|<\/span>$/g, '');
for (const slug of ['jp', 'ryu', 'luke', 'ken', 'zangief']) {
  test(`${slug}: original strategy stays intact, closed by default, with no invented recommendations`, () => {
    const profile = getCharacterDetailV21Profile(slug) ?? adaptCharacterDetailV2Profile({ character: {
      slug, name: slug, shortDescription: '既存の特徴', rangeLabel: '既存の距離', archetypeLabel: '既存のタイプ', difficulty: 3,
      strengthsSummary: '既存の強み', weaknessesSummary: '既存の注意点',
    } }).profile;
    const before = structuredClone(profile);
    const plan = renderToStaticMarkup(React.createElement(CharacterGamePlan, { steps: profile.gameplan }));
    const ranges = renderToStaticMarkup(React.createElement(CharacterRangeGuide, { ranges: profile.ranges }));
    assert.equal((plan.match(/<details/g) ?? []).length, profile.gameplan.length);
    assert.doesNotMatch(plan, /<details[^>]*\bopen\b|手順 \d/);
    for (const step of profile.gameplan) for (const field of ['title', 'body', 'caution']) assert.ok(plan.includes(escaped(step[field])));
    for (const row of profile.ranges) for (const field of ['range', 'actions', 'purpose', 'caution']) assert.ok(ranges.includes(escaped(row[field])));
    assert.equal((ranges.match(/<article/g) ?? []).length, profile.ranges.length);
    if (!profile.gameplan.length) assert.match(plan, /まだ掲載していません/);
    if (!profile.ranges.length) assert.match(ranges, /まだ掲載していません/);
    assert.deepEqual(profile, before);
  });
}
test('long Japanese text and markup-like input remain complete and escaped in native disclosure', () => {
  const title = '長い日本語の見出し'.repeat(30);
  const body = '<script>alert("fixture")</script>';
  const html = renderToStaticMarkup(React.createElement(CharacterGamePlan, { steps: [{ label: 'raw', title, body, caution: '注意原文' }] }));
  assert.ok(html.includes(title)); assert.ok(html.includes(escaped(body)));
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /<summary>[\s\S]+<\/summary><div/);
});
