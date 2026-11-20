// コンボ検索の絞り込み・並び替え（src/lib/combo-search.ts）の検査。
// 既存の検索（q/difficulty/resource）を変えないこと、未記載の値を推測で埋めないことを確認する。
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

function loadLib(file) {
  const m = { exports: {} };
  const code = ts.transpileModule(readFileSync(new URL(`../src/lib/${file}.ts`, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  new Function('module', 'exports', 'require', code)(m, m.exports, () => ({}));
  return m.exports;
}
const cs = loadLib('combo-search');
const cards = JSON.parse(readFileSync(new URL('../src/lib/strategy-research-cards-20261118.json', import.meta.url), 'utf8'));
const asSource = (c) => ({ name: c.title, purpose: c.description, command: c.commandRaw, startCondition: c.condition, position: c.position,
  controlLabel: c.controlLabel, damage: c.reportedStats?.damage ?? null, drive: c.reportedStats?.drive ?? null, sa: c.reportedStats?.sa ?? null });

test('始動技の正規化: 姿勢の表記ゆれをそろえ、PC/CHを外す', () => {
  assert.equal(cs.normalizeStarter('屈中K'), '2中K');
  assert.equal(cs.normalizeStarter('しゃがみ 中K'), '2中K');
  assert.equal(cs.normalizeStarter('立ち強P PC'), '5強P');
  assert.equal(cs.normalizeStarter('J強P'), 'J強P');
  assert.equal(cs.normalizeStarter('ドライブインパクト'), 'ドライブインパクト');
  assert.equal(cs.normalizeStarter(''), null);
  assert.equal(cs.starterLabel('2中K'), 'しゃがみ中K');
  assert.equal(cs.starterLabel('J強P'), 'ジャンプ強P');
  assert.equal(cs.readStarter({ command: '2中K→CDR→5強P' }), '2中K');
  assert.equal(cs.readStarter({ starter: '屈弱P', command: '5中P→…' }), '2弱P'); // starter欄を優先
});

test('画面位置・PC/CH・操作タイプは書かれている時だけ判定し、無ければ unknown', () => {
  assert.equal(cs.readPosition({ position: '画面端' }), 'corner');
  assert.equal(cs.readPosition({ position: 'center' }), 'center');
  assert.equal(cs.readPosition({ position: '未確認' }), 'unknown');
  assert.equal(cs.readPosition({ startCondition: '画面端限定' }), 'corner');
  assert.equal(cs.readHit({ command: '5強P PC→強昇龍拳' }), 'pc');
  assert.equal(cs.readHit({ startCondition: 'パニカン時' }), 'pc');
  assert.equal(cs.readHit({ command: '6中P CH→2弱P' }), 'ch');
  assert.equal(cs.readHit({ command: 'CHARGE→PCX' }), 'unknown'); // 英単語の一部には一致しない
  assert.equal(cs.readHit({ command: '2中P→中グラディウス' }), 'unknown');
  assert.equal(cs.readControl({ controlLabel: 'クラシック（資料表記）' }), 'classic');
  assert.equal(cs.readControl({ name: 'モダン用' }), 'modern');
  assert.equal(cs.readControl({ name: 'クラシック・モダン共通' }), 'unknown'); // 両方書かれていれば決めない
  assert.equal(cs.readControl({ name: '基本' }), 'unknown');
});

test('パラメータ検証: 知らない値は既定値に戻す', () => {
  assert.deepEqual(cs.parseComboSearchParams({}), cs.DEFAULT_COMBO_SEARCH);
  const p = cs.parseComboSearchParams({ starter: '屈中K', position: 'corner', hit: 'pc', drive: '3+', sa: '9', sort: 'xxx', control: ['modern'] });
  assert.equal(p.starter, '2中K'); assert.equal(p.position, 'corner'); assert.equal(p.hit, 'pc');
  assert.equal(p.drive, '3+'); assert.equal(p.sa, 'all'); assert.equal(p.sort, 'default'); assert.equal(p.control, 'modern');
  assert.deepEqual(cs.comboSearchQuery(cs.DEFAULT_COMBO_SEARCH), []);
  assert.deepEqual(cs.comboSearchQuery(p), [['starter', '2中K'], ['position', 'corner'], ['hit', 'pc'], ['control', 'modern'], ['drive', '3+']]);
});

test('数値の絞り込み: 未記載(null)は推測で含めず、その条件の時だけ除外する', () => {
  const f = (o) => ({ starter: null, position: 'unknown', hit: 'unknown', control: 'unknown', drive: null, sa: null, damage: null, ...o });
  const P = (o) => ({ ...cs.DEFAULT_COMBO_SEARCH, ...o });
  assert.equal(cs.matchesComboSearch(f({}), P({})), true);
  assert.equal(cs.matchesComboSearch(f({ drive: null }), P({ drive: '0' })), false);
  assert.equal(cs.matchesComboSearch(f({ drive: 0 }), P({ drive: '0' })), true);
  assert.equal(cs.matchesComboSearch(f({ drive: 3 }), P({ drive: '3+' })), true);
  assert.equal(cs.matchesComboSearch(f({ drive: 4 }), P({ drive: '3+' })), true);
  assert.equal(cs.matchesComboSearch(f({ drive: 2 }), P({ drive: '3+' })), false);
  assert.equal(cs.matchesComboSearch(f({ sa: 3 }), P({ sa: '3' })), true);
  assert.equal(cs.matchesComboSearch(f({ hit: 'pc' }), P({ hit: 'none' })), false);
  assert.equal(cs.matchesComboSearch(f({ hit: 'unknown' }), P({ hit: 'none' })), true);
});

test('ダメージ順: 未記載は常に末尾、同値は元の順序を保つ', () => {
  const rows = [{ id: 'a', damage: null }, { id: 'b', damage: 2000 }, { id: 'c', damage: 3000 }, { id: 'd', damage: 2000 }];
  const facetsOf = (r) => ({ damage: r.damage });
  assert.deepEqual(cs.sortComboResults(rows, facetsOf, 'damage-desc').map((r) => r.id), ['c', 'b', 'd', 'a']);
  assert.deepEqual(cs.sortComboResults(rows, facetsOf, 'damage-asc').map((r) => r.id), ['b', 'd', 'c', 'a']);
  assert.deepEqual(cs.sortComboResults(rows, facetsOf, 'default').map((r) => r.id), ['a', 'b', 'c', 'd']);
});

test('互換性: 実データ384件で、追加条件なしなら全件・元の順序のまま', () => {
  const combos = cards.filter((c) => c.category === 'combo');
  assert.ok(combos.length > 0);
  const p = cs.parseComboSearchParams({});
  const rows = combos.map((c) => ({ c, f: cs.comboFacets(asSource(c)) }));
  const out = cs.sortComboResults(rows.filter((r) => cs.matchesComboSearch(r.f, p)), (r) => r.f, p.sort);
  assert.equal(out.length, combos.length);
  assert.deepEqual(out.map((r) => r.c.id), combos.map((c) => c.id));
});

test('実データ: 値を書き換えず、記載の無い数値は null のまま', () => {
  for (const c of cards) {
    const f = cs.comboFacets(asSource(c));
    assert.equal(f.damage, c.reportedStats?.damage ?? null);
    assert.equal(f.drive, c.reportedStats?.drive ?? null);
    assert.equal(f.sa, c.reportedStats?.sa ?? null);
    if (c.position === '未確認' && !/画面端|画面中央/.test(`${c.condition} ${c.title} ${c.description}`)) assert.equal(f.position, 'unknown');
  }
});

test('既存の検索ファイルは変更されていない（q/difficulty/resource の判定は combo-resource のまま）', () => {
  const explorer = readFileSync(new URL('../src/components/combo-explorer.tsx', import.meta.url), 'utf8');
  assert.match(explorer, /matchesResource\(meta, selectedResource\)/);
  assert.match(explorer, /difficultyBand\(meta\.difficulty\) !== selectedDifficulty/);
  assert.match(explorer, /matchesComboSearch\(facets, extra\)/);
});
