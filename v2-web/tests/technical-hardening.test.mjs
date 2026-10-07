import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const require = createRequire(import.meta.url);
function load(path, client) {
  const testModule = { exports: {} };
  const js = ts.transpileModule(readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  new Function('module', 'exports', 'require', js)(testModule, testModule.exports, name =>
    name === '@/lib/supabase/server' ? { getSupabaseServerClient: () => client } : name.startsWith("@/lib/") ? load(name.slice(2) + ".ts", client) : require(name));
  return testModule.exports;
}
const valid = { entity_type: 'player', entity_id: 'p', source_id: 's', title: '公式', url: 'https://example.com/', source_type: 'official' };

test('source RPC transport failure degrades locally and does not log its secret payload', async () => {
  const original = console.error;
  const logs = [];
  console.error = (...args) => logs.push(args.join(' '));
  try {
    const { getPublicEntitySources } = load('lib/public-source-links.ts', { rpc: async () => { throw new Error('SECRET'); } });
    assert.deepEqual(await getPublicEntitySources(['player'], ['p']), []);
    assert.equal(logs.length, 1);
    assert.doesNotMatch(logs.join(' '), /SECRET/);
  } finally { console.error = original; }
});

test('source RPC malformed response cannot crash rendering or coerce null into public content', async () => {
  for (const data of [{ unexpected: true }, [null, 42, {}, { ...valid, title: 9 }, valid]]) {
    const { getPublicEntitySources } = load('lib/public-source-links.ts', { rpc: async (name, args) => {
      assert.equal(name, 'get_public_entity_sources');
      assert.deepEqual(args, { target_entity_types: ['player'], target_entity_ids: ['p'] });
      return { data, error: null };
    } });
    const rows = await getPublicEntitySources(['player'], ['p']);
    assert.equal(rows.length, Array.isArray(data) ? 1 : 0);
    if (rows.length) assert.equal(rows[0].title, '公式');
  }
});

test('sitemap isolates a rejected group while retaining published filters and valid URLs', async () => {
  const names = ['NEXT_PUBLIC_SITE_URL', 'NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'VERCEL_ENV'];
  const saved = Object.fromEntries(names.map(name => [name, process.env[name]]));
  const queries = [];
  const client = { from(table) {
    const filters = [];
    const query = { select(column) { assert.equal(column, 'slug'); return this; }, eq(key, value) { filters.push([key, value]); return this; },
      then(resolve, reject) {
        queries.push({ table, filters });
        return (table === 'players' ? Promise.reject(new Error('SECRET')) : Promise.resolve({
          data: [null, {}, { slug: 'ryu' }, { slug: 'ryu' }, { slug: 'a?b#c' }], error: null,
        })).then(resolve, reject);
      } };
    return query;
  } };
  const original = console.error;
  const logs = [];
  console.error = (...args) => logs.push(args.join(' '));
  try {
    Object.assign(process.env, { NEXT_PUBLIC_SITE_URL: 'https://example.com', NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test', VERCEL_ENV: 'production' });
    const sitemap = load('app/sitemap.ts', client).default;
    const rows = await sitemap();
    assert.ok(rows.some(row => row.url === 'https://example.com/'));
    assert.ok(rows.some(row => row.url === 'https://example.com/characters/ryu'));
    assert.ok(!rows.some(row => row.url.startsWith('https://example.com/players/')));
    assert.equal(rows.filter(row => row.url === 'https://example.com/characters/ryu').length, 1);
    assert.ok(rows.some(row => row.url.endsWith('/a%3Fb%23c')));
    assert.equal(queries.length, 4);
    for (const query of queries) assert.ok(query.filters.some(([key, value]) => key === 'status' && value === 'published'));
    assert.ok(queries.find(q => q.table === 'characters').filters.some(([key, value]) => key === 'is_playable' && value === true));
    assert.doesNotMatch(logs.join(' '), /SECRET/);
    process.env.VERCEL_ENV = 'preview';
    assert.deepEqual(await sitemap(), []);
    assert.equal(queries.length, 4, 'Preview must not request sitemap data');
  } finally {
    console.error = original;
    for (const name of names) if (saved[name] === undefined) delete process.env[name]; else process.env[name] = saved[name];
  }
});

test('root-layout fallback is self-contained, accessible, resettable and never renders the error', () => {
  const GlobalError = load('app/global-error.tsx').default;
  let retried = false;
  const tree = GlobalError({ error: new Error('SECRET'), retry: () => { retried = true; } });
  const html = renderToStaticMarkup(tree);
  assert.match(html, /<html lang="ja"/);
  assert.match(html, /<main/);
  assert.match(html, /<title>画面を表示できませんでした \| SF6DNA<\/title>/);
  assert.match(html, /name="robots" content="noindex"/);
  assert.match(html, /role="alert"/);
  assert.match(html, /href="\/"/);
  assert.doesNotMatch(html, /SECRET/);
  function findButton(element) {
    if (!React.isValidElement(element)) return null;
    if (element.type === 'button') return element;
    return React.Children.toArray(element.props.children).map(findButton).find(Boolean) ?? null;
  }
  findButton(tree).props.onClick();
  assert.equal(retried, true);
});
