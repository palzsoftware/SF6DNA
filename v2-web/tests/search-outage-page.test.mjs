import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const page=readFileSync(new URL('../src/app/search/page.tsx',import.meta.url),'utf8');
const lib=readFileSync(new URL('../src/lib/search.ts',import.meta.url),'utf8');
// QA 2026-11-19: /search?q=... returned HTTP 500 when the search RPC was unavailable.
test('search outage renders an explicit unavailable state instead of crashing or showing 0 results',()=>{
  assert.match(lib,/throw new Error\("search_service_unavailable"\)/);
  assert.match(page,/searchAcrossContent\(q\)\.catch\(\(\) => \{ searchUnavailable = true;/);
  assert.match(page,/getPublicSearchSuggestionCandidates\(\)\.catch/);
  assert.match(page,/現在、検索サービスに接続できません。時間をおいて再度お試しください。/);
  assert.match(page,/searchUnavailable \? "検索結果を取得できませんでした"/);
});
