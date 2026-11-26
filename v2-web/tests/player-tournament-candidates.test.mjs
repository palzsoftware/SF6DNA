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
// 2026-11-26 追加: Capcom公式(CPT)順位ページ2件を当日再確認した個人成績(V29)。11/17分の件数契約とは分けて検証する。
const V29_CHECKED = '2026-11-26';
const V29_SOURCES = new Set([
  'https://sf.esports.capcom.com/cpt/news/230816_evo.html',
  'https://sf.esports.capcom.com/cpt/news/240314_cpt2024.html',
]);
const V29_TEXT = /^(EVO 2023|CAPCOM CUP X): (優勝|[1-8]位|同率[57]位)$/;
// 2026-11-19: 同じ内容を Production の実IDにも接続したため、11/17 の検証は Development 行で行う(Production行は同一内容であることを別途確認)
const items = rows.filter(row => row.environment === 'vvsknbmlfvvnrmgtyhbf').flatMap(row => row.display.sections.filter(s => s.title === TITLE).map(s => ({ row, items: s.items.filter(i => i.sourceCheckedOn === '2026-11-17') })).filter(x => x.items.length));

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

// 2026-11-19 追加: 環境を問わず、この見出しの全行が11/17検証済みの出典・形式・PENDINGであること(本番接続分も同じ条件)
test('every environment row under the major-tournament title uses verified sources and stays PENDING', () => {
  const all = rows.flatMap(row => row.display.sections.filter(s => s.title === TITLE).map(s => ({ row, items: s.items })));
  assert.ok(all.length >= items.length);
  for (const { row, items: list } of all) {
    assert.equal(row.publicationApproval, 'PENDING');
    for (const item of list) {
      if (item.sourceCheckedOn === V29_CHECKED) {
        assert.ok(V29_SOURCES.has(item.sourceUrl), `${row.environment}:${row.playerSlug}: ${item.sourceUrl}`);
        assert.match(item.text, V29_TEXT);
        continue;
      }
      assert.ok(VERIFIED_SOURCES.has(item.sourceUrl), `${row.environment}:${row.playerSlug}: ${item.sourceUrl}`);
      assert.match(item.text, /^(EVO Japan 2025|EVO 2025|EVO Japan 2026|CAPCOM CUP 12|UFA 2025|CEO 2026): (優勝|[1-8]位|同率[57]位)$/);
    }
  }
});

// V29: 公式順位ページの記載と一致すること(順位表の再確認 2026-11-26)。チーム成績ではなく個人順位のみ。
test('V29 CPT official results: 11 results, unique researchId, ranks match the official pages', () => {
  const expected = {
    'EVO 2023': { angrybird: '優勝', menard: '2位', punk: '3位', tokido: '4位', kakeru: '同率5位', haitani: '同率5位', fujimura: '同率7位' },
    'CAPCOM CUP X': { gachikun: '3位', nl: '4位', leshar: '5位', kawano: '同率7位' },
  };
  const found = new Map();
  const ids = new Set();
  for (const row of rows) {
    for (const sec of row.display.sections.filter(s => s.title === TITLE)) {
      for (const item of sec.items.filter(i => i.sourceCheckedOn === V29_CHECKED)) {
        const [event, rank] = item.text.split(': ');
        assert.equal(expected[event]?.[row.playerSlug], rank, `${row.environment}:${row.playerSlug}:${item.text}`);
        assert.ok(!ids.has(`${row.environment}:${item.researchId}`));
        ids.add(`${row.environment}:${item.researchId}`);
        assert.equal(row.publicationApproval, 'PENDING');
        found.set(`${event}/${row.playerSlug}`, true);
      }
    }
  }
  assert.equal(found.size, 11);
});
