import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
import { resolveTitle } from 'next/dist/lib/metadata/resolvers/resolve-title.js';

const require = createRequire(import.meta.url);
function load(file, overrides) {
  const compiled = { exports: {} };
  const js = ts.transpileModule(readFileSync(new URL(`../src/${file}`, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  new Function('module', 'exports', 'require', js)(compiled, compiled.exports, name => {
    if (name in overrides) return overrides[name];
    if (name === '@/lib/public-page-metadata') return load('lib/public-page-metadata.ts', {});
    if (name === 'react/jsx-runtime' || name === 'react') return require(name);
    return {};
  });
  return compiled.exports;
}
const template = readFileSync(new URL('../src/app/layout.tsx', import.meta.url), 'utf8').match(/template:\s*"([^"]+)"/)[1];

function glossaryOverrides(rows, calls) {
  const client = {
    from(table) { assert.equal(table, 'glossary'); const filters = {}; const q = {
      select() { return q; }, eq(k, v) { filters[k] = v; return q; },
      async maybeSingle() { calls.push({ ...filters }); const row = rows.find(r => r.slug === filters.slug && filters.status === 'published'); return { data: row ?? null, error: null }; },
    }; return q; },
  };
  return {
    'next/navigation': { notFound: () => { throw new Error('NEXT_NOT_FOUND'); } },
    '@/lib/supabase/server': { getSupabaseServerClient: () => client },
  };
}

test('character consultation page exposes title metadata through the shared helper', () => {
  const page = load('app/diagnosis/character-consultation/page.tsx', {});
  assert.equal(resolveTitle(page.metadata.title, template).absolute, 'キャラ別お悩み診断 | SF6DNA');
  assert.equal(page.metadata.openGraph.title, 'キャラ別お悩み診断');
  assert.ok(page.metadata.openGraph.description, 'inherits the existing root description');
  assert.equal(page.metadata.robots, undefined);
});

test('glossary detail metadata uses published term and short definition; missing term is noindex', async () => {
  const saved = [process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY];
  Object.assign(process.env, { NEXT_PUBLIC_SUPABASE_URL: 'https://fixture.supabase.co', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'fixture' });
  try {
    const calls = [];
    const page = load('app/glossary/[slug]/page.tsx', glossaryOverrides([{ slug: 'fixture-term', term: 'テスト用語', short_definition: 'テスト用の短い説明', definition: null }], calls));
    const found = await page.generateMetadata({ params: Promise.resolve({ slug: 'fixture-term' }) });
    assert.equal(resolveTitle(found.title, template).absolute, 'テスト用語 | SF6DNA');
    assert.equal(found.description, 'テスト用の短い説明');
    assert.equal(found.openGraph.description, 'テスト用の短い説明');
    assert.equal(found.robots, undefined);
    assert.equal(calls[0].status, 'published', 'only published rows are read');

    const missing = await page.generateMetadata({ params: Promise.resolve({ slug: 'nope' }) });
    assert.equal(missing.robots.index, false);
    await assert.rejects(page.default({ params: Promise.resolve({ slug: 'nope' }) }), /NEXT_NOT_FOUND/);
  } finally {
    ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'].forEach((name, i) => saved[i] === undefined ? delete process.env[name] : process.env[name] = saved[i]);
  }
});

test('glossary detail without Supabase env stays not-found and noindex without querying', async () => {
  const saved = [process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY];
  delete process.env.NEXT_PUBLIC_SUPABASE_URL; delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  try {
    const calls = [];
    const page = load('app/glossary/[slug]/page.tsx', glossaryOverrides([], calls));
    assert.equal((await page.generateMetadata({ params: Promise.resolve({ slug: 'x' }) })).robots.index, false);
    await assert.rejects(page.default({ params: Promise.resolve({ slug: 'x' }) }), /NEXT_NOT_FOUND/);
    assert.equal(calls.length, 0);
  } finally {
    ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'].forEach((name, i) => saved[i] === undefined ? delete process.env[name] : process.env[name] = saved[i]);
  }
});
