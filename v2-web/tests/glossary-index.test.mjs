import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
function load(path, imports = {}) {
  const js = ts.transpileModule(read(path), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const mod = { exports: {} };
  new Function('module', 'exports', 'require', 'process', js)(mod, mod.exports, name => {
    assert.ok(name in imports, `unexpected dependency ${name}`);
    return imports[name];
  }, process);
  return mod.exports;
}

function fakeClient(result, calls) {
  const query = {
    select(columns) { calls.push(['select', columns]); return query; },
    eq(column, value) { calls.push(['eq', column, value]); return query; },
    order(column, options) { calls.push(['order', column, options]); return query; },
    limit(count) { calls.push(['limit', count]); return Promise.resolve(result); },
  };
  return { from(table) { calls.push(['from', table]); return query; } };
}

function loadGlossary(result, calls = []) {
  return load('../src/lib/public-glossary.ts', {
    '@/lib/supabase/server': { getSupabaseServerClient: () => fakeClient(result, calls) },
  });
}

test('glossary index is visible only in development and preview', () => {
  const glossary = loadGlossary({ data: [], error: null });
  assert.equal(glossary.isGlossaryIndexVisible('development'), true);
  assert.equal(glossary.isGlossaryIndexVisible('preview'), true);
  assert.equal(glossary.isGlossaryIndexVisible('production'), false);
  assert.equal(glossary.isGlossaryIndexVisible(undefined), false);
  assert.equal(glossary.isGlossaryIndexVisible(''), false);
});

test('rows are validated, de-duplicated and sorted by term', () => {
  const glossary = loadGlossary({ data: [], error: null });
  const items = glossary.normalizeGlossaryRows([
    { id: '2', slug: 'punish', term: '確定反撃', short_definition: '  ガード後に確定する反撃  ' },
    { id: '1', slug: 'drive-rush', term: 'ドライブラッシュ', short_definition: '' },
    { id: '3', slug: 'punish', term: '重複', short_definition: null },
    { id: '4', slug: 'bad/slug', term: '不正', short_definition: null },
    { id: '5', slug: 'x?y', term: '不正2', short_definition: null },
    { id: '6', slug: '', term: '空slug', short_definition: null },
    { id: '7', slug: 'no-term', term: '  ', short_definition: null },
    null,
    'string-row',
  ]);
  assert.deepEqual(items.map(item => item.slug), ['punish', 'drive-rush'].sort((a, b) => {
    const terms = { punish: '確定反撃', 'drive-rush': 'ドライブラッシュ' };
    return terms[a].localeCompare(terms[b], 'ja');
  }));
  const punish = items.find(item => item.slug === 'punish');
  assert.equal(punish.term, '確定反撃');
  assert.equal(punish.shortDefinition, 'ガード後に確定する反撃');
  assert.equal(items.find(item => item.slug === 'drive-rush').shortDefinition, null);
  assert.deepEqual(glossary.normalizeGlossaryRows(null), []);
});

test('list reads only published glossary rows and separates failure from empty', async () => {
  const saved = { url: process.env.NEXT_PUBLIC_SUPABASE_URL, key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY };
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.invalid';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
  const originalError = console.error;
  console.error = () => {};
  try {
    const calls = [];
    const ok = await loadGlossary({ data: [{ id: '1', slug: 'jump', term: 'ジャンプ', short_definition: null }], error: null }, calls).listPublishedGlossary();
    assert.equal(ok.ok, true);
    assert.equal(ok.items.length, 1);
    assert.deepEqual(calls, [
      ['from', 'glossary'],
      ['select', 'id, slug, term, short_definition'],
      ['eq', 'status', 'published'],
      ['order', 'term', { ascending: true }],
      ['limit', 500],
    ]);

    const empty = await loadGlossary({ data: [], error: null }).listPublishedGlossary();
    assert.deepEqual(empty, { ok: true, items: [] });

    const failed = await loadGlossary({ data: null, error: { message: 'boom' } }).listPublishedGlossary();
    assert.deepEqual(failed, { ok: false, items: [] });

    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    const unconfigured = await loadGlossary({ data: [], error: null }).listPublishedGlossary();
    assert.deepEqual(unconfigured, { ok: false, items: [] });
  } finally {
    console.error = originalError;
    if (saved.url === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL; else process.env.NEXT_PUBLIC_SUPABASE_URL = saved.url;
    if (saved.key === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; else process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = saved.key;
  }
});

test('index page is gated, noindex, and links only to existing detail pages', () => {
  const page = read('../src/app/glossary/page.tsx');
  assert.match(page, /if \(!isGlossaryIndexVisible\(process\.env\.VERCEL_ENV \?\? process\.env\.NODE_ENV\)\) notFound\(\);/);
  assert.match(page, /publicPageMetadata\("\/glossary", \{[\s\S]*?\}, false\)/);
  assert.match(page, /href=\{`\/glossary\/\$\{encodeURIComponent\(item\.slug\)\}`\}/);
  assert.match(page, /掲載中の用語はまだありません/);
  assert.match(page, /用語集を表示できません/);
  const sitemap = read('../src/app/sitemap.ts');
  assert.doesNotMatch(sitemap, /"\/glossary"/, 'Preview-only index stays out of the sitemap');
});
