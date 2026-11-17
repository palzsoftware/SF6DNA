import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Major-tournament results added 2026-11-17 as PENDING archive candidates.
// Each item was re-checked against its source page; unverified research stays out.
const rows = JSON.parse(readFileSync(new URL('../src/data/player-research/team-bindings.json', import.meta.url), 'utf8'));
const TITLE = '主要大会の個人成績';
const VERIFIED_SOURCES = new Set([
  'https://www.shacknews.com/article/144229/evo-japan-2025-results-winners-top-8',
  'https://evo.gg/news/evo-2025-street-fighter-6-recap/',
  'https://www.shacknews.com/article/148960/evo-japan-2026-winners-top-8',
  'https://saiganak.com/event/capcomcup-12-sfl-world-championship-2025-result/amp/',
  'https://esports.gg/news/fgc/ufa-2025-details-results',
  'https://www.inside-games.jp/release/prtimes/20260818/302058.html',
]);
const items = rows.flatMap(row => row.display.sections.filter(s => s.title === TITLE).map(s => ({ row, items: s.items })));

test('15 source-checked results for 12 SFL2026 players, all still PENDING', () => {
  const flat = items.flatMap(x => x.items);
  assert.equal(flat.length, 15);
  assert.equal(items.length, 12);
  assert.ok(items.every(x => x.row.publicationApproval === 'PENDING'));
  assert.equal(new Set(flat.map(i => i.researchId)).size, 15);
});

test('every result cites a re-checked source page and a check date', () => {
  for (const { row, items: list } of items) {
    for (const item of list) {
      assert.ok(VERIFIED_SOURCES.has(item.sourceUrl), `${row.playerSlug}: ${item.sourceUrl}`);
      assert.equal(item.sourceCheckedOn, '2026-11-17');
      assert.match(item.text, /^(EVO Japan 2025|EVO 2025|EVO Japan 2026|CAPCOM CUP 12|UFA 2025|CEO 2026): (優勝|[1-8]位|同率[57]位)$/);
    }
  }
});

test('unverified or self-contradicting research (UFA 2026, World Warrior, EVO France, EVO 2026) is not added', () => {
  const text = JSON.stringify(items);
  // C_2026-10: the EVO 2026 article text and its embedded Evo post disagree on Dogura (re-checked 2026-11-17).
  assert.doesNotMatch(text, /UFA 2026|World Warrior|EVO France|EVO 2026|B_WW-|C_2026-(0[4-9]|10)/);
});

test('no duplicate result per player and no character claims', () => {
  for (const { row, items: list } of items) {
    assert.equal(new Set(list.map(i => i.text)).size, list.length, row.playerSlug);
    assert.ok(list.every(i => !('characters' in i)));
  }
});
