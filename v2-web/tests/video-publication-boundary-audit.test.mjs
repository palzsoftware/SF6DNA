import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';

// Video audit 2026-11-17: a DB row with status=published is visible in /videos,
// but learning metadata and Player relations need their own approval. These
// tests lock that separation without querying or changing any database.
const require = createRequire(import.meta.url);
const { renderToStaticMarkup } = require('react-dom/server');
const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const json = path => JSON.parse(read(path));
const DEV_URL = 'https://vvsknbmlfvvnrmgtyhbf.supabase.co';
const PROD_URL = 'https://wnuxaxbrpudyypzdbdho.supabase.co';
const DEV = 'vvsknbmlfvvnrmgtyhbf';
const PROD = 'wnuxaxbrpudyypzdbdho';

function load(path, imports = {}) {
  const js = ts.transpileModule(read(path), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const mod = { exports: {} };
  new Function('module', 'exports', 'require', js)(mod, mod.exports, name => {
    if (name === 'react/jsx-runtime') return require('react/jsx-runtime');
    assert.ok(name in imports, `unexpected dependency ${name}`);
    return imports[name];
  });
  return mod.exports;
}

const registered = load('../src/lib/video-learning-registered.ts', { 'server-only': {} });
const registrySource = read('../src/lib/video-learning-registered.ts');
const devRecords = JSON.parse(registrySource.slice(registrySource.indexOf('= [') + 2, registrySource.indexOf('];') + 1));
const { boundPlayerVideoRecommendations } = load('../src/lib/player-video-binding.ts');
const { PlayerRecommendedVideos } = load('../src/components/player-recommended-videos.tsx');
const videos = json('../src/data/player-research/videos.json');
const bindings = json('../src/data/player-research/video-bindings.json');
const ytId = url => new URL(url).searchParams.get('v');

test('Development learning registry: 14 unique rows bound to exact YouTube URLs', () => {
  assert.equal(devRecords.length, 14);
  assert.equal(new Set(devRecords.map(r => r.videoId)).size, 14);
  assert.equal(new Set(devRecords.map(r => ytId(r.expectedUrl))).size, 14);
  for (const r of devRecords) {
    assert.equal(r.expectedUrl, r.evidenceUrl, r.videoId);
    assert.match(ytId(r.expectedUrl), /^[A-Za-z0-9_-]{11}$/, r.videoId);
    assert.ok(r.expectedTitle.trim(), r.videoId);
  }
});

test('learning metadata attaches only on the Development host and only to supplied published rows', () => {
  const record = devRecords.find(r => ytId(r.expectedUrl) === 'ELqbxdcNeeE');
  const row = { id: record.videoId, url: record.expectedUrl, title: record.expectedTitle };
  assert.deepEqual(registered.getRegisteredVideoLearning([row], DEV_URL).map(r => r.videoId), [record.videoId]);
  for (const host of [PROD_URL, 'https://vvsknbmlfvvnrmgtyhbf.supabase.co.evil.example', 'http://vvsknbmlfvvnrmgtyhbf.supabase.co', `${DEV_URL}/?x=1`, '', undefined]) {
    assert.deepEqual(registered.getRegisteredVideoLearning([row], host), [], String(host));
  }
  // The loader only supplies published rows, so draft IDs never arrive here.
  assert.deepEqual(registered.getRegisteredVideoLearning([], DEV_URL), []);
});

test('a changed URL (including YouTube ID letter case) or title drops the annotation', () => {
  const record = devRecords.find(r => ytId(r.expectedUrl) === 'YzLw5vcfvlU');
  assert.ok(record, 'registry keeps the uppercase-U ID recorded on 2026-10-30');
  const exact = { id: record.videoId, url: record.expectedUrl, title: record.expectedTitle };
  assert.equal(registered.getRegisteredVideoLearning([exact], DEV_URL).length, 1);
  assert.deepEqual(registered.getRegisteredVideoLearning([{ ...exact, url: exact.url.replace('vlU', 'vlu') }], DEV_URL), []);
  assert.deepEqual(registered.getRegisteredVideoLearning([{ ...exact, title: `${exact.title} ` }], DEV_URL), []);
});

test('Player video binding candidates resolve to existing videos with matching slugs', () => {
  // 2026-11-19: 動画56件の統合で 8件 → 増加。件数ではなく全件の整合を確認する
  assert.ok(bindings.length >= 8);
  // 2026-11-19 以前の8件は、環境・ID・動画キーとも1件も欠けずに残っていること
  const ORIGINAL_8 = [["wnuxaxbrpudyypzdbdho", "830621f4-38aa-49e3-a320-31621e983fb5", "blaz-Z9xK6zsfQ6o"], ["wnuxaxbrpudyypzdbdho", "15778fa3-31cb-4567-851f-5d443cd2e0ac", "chris-wong-_DbJcZXq-qo"], ["wnuxaxbrpudyypzdbdho", "0a8aacc8-3feb-42c4-88e5-3dd5d3a9efe6", "dogura-uWenGJimPRE"], ["vvsknbmlfvvnrmgtyhbf", "b1d6c5b4-9157-455a-84b5-6b5c2ecb80ee", "kakeru-Z9xK6zsfQ6o"], ["vvsknbmlfvvnrmgtyhbf", "830621f4-38aa-49e3-a320-31621e983fb5", "blaz-Z9xK6zsfQ6o"], ["vvsknbmlfvvnrmgtyhbf", "3fd5264b-4ab4-4dc6-9efe-1bea209c4573", "uma-_DbJcZXq-qo"], ["vvsknbmlfvvnrmgtyhbf", "15778fa3-31cb-4567-851f-5d443cd2e0ac", "chris-wong-_DbJcZXq-qo"], ["vvsknbmlfvvnrmgtyhbf", "0a8aacc8-3feb-42c4-88e5-3dd5d3a9efe6", "dogura-uWenGJimPRE"]];
  const now = new Set(bindings.map(b => `${b.environment}:${b.playerId}:${b.recommendationKey}`));
  for (const [e, i, k] of ORIGINAL_8) assert.ok(now.has(`${e}:${i}:${k}`), k);
  const keys = new Map(videos.map(v => [v.key, v]));
  for (const b of bindings) {
    assert.ok([DEV, PROD].includes(b.environment), b.recommendationKey);
    const video = keys.get(b.recommendationKey);
    assert.ok(video, b.recommendationKey);
    assert.equal(video.playerSlug, b.playerSlug);
  }
  assert.equal(new Set(bindings.map(b => `${b.environment}:${b.playerId}:${b.recommendationKey}`)).size, bindings.length);
});

test('binding requires same environment, UUID and slug', () => {
  const dogura = { id: '0a8aacc8-3feb-42c4-88e5-3dd5d3a9efe6', slug: 'dogura' };
  // 2026-11-19: どぐらの動画が追加されたため、元の動画を含み、すべてどぐらの動画であることを確認する
  const doguraKeys = boundPlayerVideoRecommendations(dogura, DEV, videos, bindings).map(v => v.key);
  assert.ok(doguraKeys.includes('dogura-uWenGJimPRE'));
  assert.ok(doguraKeys.every(k => k.startsWith('dogura-')));
  // 関数の結果が、データ上の接続(同じ環境・同じID・同じslug)と過不足なく一致すること
  const expected = [...new Set(bindings.filter(b => b.environment === DEV && b.playerId === dogura.id && b.playerSlug === dogura.slug).map(b => b.recommendationKey))]
    .filter(k => videos.some(v => v.key === k && v.playerSlug === dogura.slug));
  assert.deepEqual([...doguraKeys].sort(), expected.sort());
  assert.deepEqual(boundPlayerVideoRecommendations(dogura, 'unknown', videos, bindings), []);
  assert.deepEqual(boundPlayerVideoRecommendations({ ...dogura, slug: 'other' }, DEV, videos, bindings), []);
  assert.deepEqual(boundPlayerVideoRecommendations({ ...dogura, id: '00000000-0000-4000-8000-000000000000' }, DEV, videos, bindings), []);
  // kakeru has no Production identity, so nothing binds there.
  assert.deepEqual(boundPlayerVideoRecommendations({ id: 'b1d6c5b4-9157-455a-84b5-6b5c2ecb80ee', slug: 'kakeru' }, PROD, videos, bindings), []);
});

test('PENDING recommendations render nothing; an approved copy renders one YouTube card', () => {
  const items = videos.filter(v => v.playerSlug === 'dogura');
  assert.ok(items.every(v => v.publicationApproval === 'PENDING'));
  assert.equal(renderToStaticMarkup(PlayerRecommendedVideos({ playerSlug: 'dogura', items })), '');
  const approved = items.map(v => ({ ...v, publicationApproval: 'APPROVED' }));
  const html = renderToStaticMarkup(PlayerRecommendedVideos({ playerSlug: 'dogura', items: approved }));
  assert.match(html, /https:\/\/www\.youtube\.com\/watch\?v=uWenGJimPRE/);
  assert.equal(renderToStaticMarkup(PlayerRecommendedVideos({ playerSlug: 'dogura', items: approved.map(v => ({ ...v, youtubeId: 'bad"id' })) })), '');
});
