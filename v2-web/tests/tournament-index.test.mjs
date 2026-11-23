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

function loadTournaments(result, calls = []) {
  return load('../src/lib/public-tournaments.ts', {
    '@/lib/supabase/server': { getSupabaseServerClient: () => fakeClient(result, calls) },
  });
}

test('tournament index is visible only in development and preview', () => {
  const t = loadTournaments({ data: [], error: null });
  assert.equal(t.isTournamentIndexVisible('development'), true);
  assert.equal(t.isTournamentIndexVisible('preview'), true);
  assert.equal(t.isTournamentIndexVisible('production'), false);
  assert.equal(t.isTournamentIndexVisible(undefined), false);
  assert.equal(t.isTournamentIndexVisible(''), false);
});

test('rows are validated, de-duplicated and sorted newest first with undated last', () => {
  const t = loadTournaments({ data: [], error: null });
  const items = t.normalizeTournamentRows([
    { id: '1', slug: 'old-cup', name: 'Old Cup', start_date: '2024-05-01', end_date: null, region: '  日本 ', series_name: '' },
    { id: '2', slug: 'new-cup', name: 'New Cup', start_date: '2026-03-01', end_date: '2026-03-02', region: null, series_name: 'Series' },
    { id: '3', slug: 'undated', name: 'Undated', start_date: null },
    { id: '4', slug: 'bad-date', name: 'Bad Date', start_date: '2026/01/01' },
    { id: '5', slug: 'new-cup', name: '重複', start_date: '2027-01-01' },
    { id: '6', slug: 'bad/slug', name: '不正', start_date: '2026-01-01' },
    { id: '7', slug: 'x#y', name: '不正2', start_date: '2026-01-01' },
    { id: '8', slug: 'no-name', name: '  ', start_date: '2026-01-01' },
    { id: '', slug: 'no-id', name: 'No Id', start_date: '2026-01-01' },
    null,
    'string-row',
  ]);
  assert.deepEqual(items.map(item => item.slug), ['new-cup', 'old-cup', 'bad-date', 'undated']);
  const old = items.find(item => item.slug === 'old-cup');
  assert.equal(old.region, '日本');
  assert.equal(old.seriesName, null);
  assert.equal(items.find(item => item.slug === 'bad-date').startDate, null);
  assert.deepEqual(t.normalizeTournamentRows(null), []);
});

test('period formatting covers single day, same year, cross year and unknown', () => {
  const t = loadTournaments({ data: [], error: null });
  assert.equal(t.formatTournamentPeriod(null, '2026-03-02'), null);
  assert.equal(t.formatTournamentPeriod('2026-03-01', null), '2026年3月1日');
  assert.equal(t.formatTournamentPeriod('2026-03-01', '2026-03-01'), '2026年3月1日');
  assert.equal(t.formatTournamentPeriod('2026-03-01', '2026-03-02'), '2026年3月1日〜3月2日');
  assert.equal(t.formatTournamentPeriod('2025-12-31', '2026-01-02'), '2025年12月31日〜2026年1月2日');
  assert.equal(t.formatTournamentPeriod('2026-03-05', '2026-03-01'), '2026年3月5日');
});

test('list reads only published tournaments and separates failure from empty', async () => {
  const saved = { url: process.env.NEXT_PUBLIC_SUPABASE_URL, key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY };
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.invalid';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
  const originalError = console.error;
  console.error = () => {};
  try {
    const calls = [];
    const ok = await loadTournaments({ data: [{ id: '1', slug: 'cup', name: 'Cup', start_date: '2026-01-01' }], error: null }, calls).listPublishedTournaments();
    assert.equal(ok.ok, true);
    assert.equal(ok.items.length, 1);
    assert.deepEqual(calls, [
      ['from', 'tournaments'],
      ['select', 'id, slug, name, series_name, start_date, end_date, region'],
      ['eq', 'status', 'published'],
      ['order', 'start_date', { ascending: false, nullsFirst: false }],
      ['limit', 500],
    ]);
    assert.deepEqual(await loadTournaments({ data: [], error: null }).listPublishedTournaments(), { ok: true, items: [] });
    assert.deepEqual(await loadTournaments({ data: null, error: { message: 'boom' } }).listPublishedTournaments(), { ok: false, items: [] });
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    assert.deepEqual(await loadTournaments({ data: [], error: null }).listPublishedTournaments(), { ok: false, items: [] });
  } finally {
    console.error = originalError;
    if (saved.url === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL; else process.env.NEXT_PUBLIC_SUPABASE_URL = saved.url;
    if (saved.key === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; else process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = saved.key;
  }
});

test('index page is gated, noindex, and links only to existing detail pages', () => {
  const page = read('../src/app/tournaments/page.tsx');
  assert.match(page, /if \(!isTournamentIndexVisible\(process\.env\.VERCEL_ENV \?\? process\.env\.NODE_ENV\)\) notFound\(\);/);
  assert.match(page, /publicPageMetadata\("\/tournaments", \{[\s\S]*?\}, false\)/);
  assert.match(page, /href=\{`\/tournaments\/\$\{encodeURIComponent\(item\.slug\)\}`\}/);
  assert.match(page, /掲載中の大会はまだありません/);
  assert.match(page, /大会一覧を表示できません/);
  const sitemap = read('../src/app/sitemap.ts');
  assert.doesNotMatch(sitemap, /"\/tournaments"/, 'Preview-only index stays out of the sitemap');
});
