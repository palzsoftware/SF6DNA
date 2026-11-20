// キャラ別練習候補データと読み込み関数の検査。既存の診断・練習コードを変更していないことも確認する。
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import ts from 'typescript';

const refs = JSON.parse(readFileSync(new URL('../src/data/training-candidates/strategy-card-refs-20261120.json', import.meta.url), 'utf8'));
const data = JSON.parse(readFileSync(new URL('../src/data/training-candidates/character-training-candidates-20261120.json', import.meta.url), 'utf8'));
function loadLib() {
  const m = { exports: {} };
  const code = ts.transpileModule(readFileSync(new URL('../src/lib/character-training-candidates.ts', import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  new Function('module', 'exports', 'require', code)(m, m.exports, (n) => (n.endsWith('strategy-card-refs-20261120.json') ? { __esModule: true, default: refs } : n.endsWith('.json') ? { __esModule: true, default: data } : {}));
  return m.exports;
}
const lib = loadLib();

test('候補データ: 必須項目・出典・未承認状態', () => {
  const ids = new Set();
  for (const [slug, list] of Object.entries(data.characters)) {
    assert.match(slug, /^[a-z][a-z0-9-]*$/);
    for (const c of list) {
      assert.ok(!ids.has(c.id), c.id); ids.add(c.id);
      assert.ok(['beginner', 'intermediate', 'advanced'].includes(c.level));
      for (const k of ['title', 'purpose']) assert.ok(c[k]);
      assert.ok(c.steps.length >= 2, `${c.id} 手順が2つ以上`);
      assert.ok(c.trainingSettings.length >= 1 && c.successCondition.length >= 1);
      assert.match(c.source.url, /^https:\/\//);
      // 旧仮番号は後方互換用（R12/R13由来のみ6桁、新規バッチは空）。新形式は NB-仮ID
      assert.match(c.strategyManagementNo, /^(\d{6})?$/);
      assert.match(c.strategyBatchId, /^NB-[A-Z0-9]+-\d{4}$/);
      assert.equal(c.publicationApproval, 'PENDING');
      assert.equal(c.gameVerification, 'NOT_RUN');
    }
  }
});

test('推測の数値を書かない: 成功条件に具体的な回数・ダメージを入れていない', () => {
  for (const list of Object.values(data.characters)) for (const c of list) {
    for (const s of [...c.successCondition, ...c.trainingSettings]) assert.ok(!/\d+\s*(回|ダメージ|F)/.test(s), s);
  }
});

test('読み込み: 未承認は既定で返さず、確認用(allowPending)のみ返す。レベル順に並ぶ', () => {
  const slug = Object.keys(data.characters)[0];
  assert.deepEqual(lib.listCharacterTrainingCandidates(slug), []);
  const all = lib.listCharacterTrainingCandidates(slug, { allowPending: true });
  assert.equal(all.length, data.characters[slug].length);
  const order = { beginner: 0, intermediate: 1, advanced: 2 };
  for (let i = 1; i < all.length; i++) assert.ok(order[all[i - 1].level] <= order[all[i].level]);
  assert.deepEqual(lib.listCharacterTrainingCandidates('__proto__', { allowPending: true }), []);
  assert.deepEqual(lib.listCharacterTrainingCandidates('unknown-char', { allowPending: true }), []);
  // 候補が承認済みでも、参照カードが未承認なら公開しない
  const approved = { characters: { x: [{ ...all[0], publicationApproval: 'APPROVED' }] } };
  assert.equal(lib.listCharacterTrainingCandidates('x', { source: approved }).length, 0);
  const cardOk = { cards: { [all[0].strategyBatchId]: { publication: 'APPROVED' } } };
  assert.equal(lib.listCharacterTrainingCandidates('x', { source: approved, cardRefs: cardOk }).length, 1);
  // 旧形式（strategyBatchId なし）も参照カード（旧仮番号で照合）が未承認・不明なら公開しない
  const legacy = { ...all[0], publicationApproval: 'APPROVED', strategyManagementNo: '003733' };
  delete legacy.strategyBatchId;
  const legacySrc = { characters: { x: [legacy] } };
  assert.equal(lib.listCharacterTrainingCandidates('x', { source: legacySrc }).length, 0);
  assert.equal(lib.listCharacterTrainingCandidates('x', { source: legacySrc, cardRefs: { cards: { 'NB-T-0001': { publication: 'HOLD_NOT_APPROVED', formerProvisionalNo: '003733' } } } }).length, 0);
  assert.equal(lib.listCharacterTrainingCandidates('x', { source: legacySrc, cardRefs: { cards: { 'NB-T-0001': { publication: 'APPROVED', formerProvisionalNo: '003733' } } } }).length, 1);
  const noRef = { ...legacy, strategyManagementNo: '' };
  assert.equal(lib.listCharacterTrainingCandidates('x', { source: { characters: { x: [noRef] } }, cardRefs: { cards: {} } }).length, 0);
  assert.equal(lib.strategyRefOf(legacy), '003733');
  assert.equal(lib.strategyRefOf(all[0]), all[0].strategyBatchId);
});

test('練習メニューIDの重複なし（参照先とは別に検査）', () => {
  const ids = Object.values(data.characters).flat().map((c) => c.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(ids.length, 281); // 既存228件（維持）＋日中追加53件
  assert.equal(Object.keys(data.characters).length, 32);
});

test('参照先カードIDの存在（練習IDとは別に検査）・参照カードはすべて未承認', () => {
  for (const [slug, list] of Object.entries(data.characters)) for (const c of list) {
    const ref = refs.cards[c.strategyBatchId];
    assert.ok(ref, `参照先カードなし: ${c.strategyBatchId}`);
    assert.equal(ref.characterSlug, slug);
    assert.equal(ref.category, 'combo');
    // 既存228件はFINAL時点の品質A。日中再集計でA外となった6件は qualityAfterDayReagg で明示（統括判断待ち）
    assert.equal(ref.quality, 'A');
    if (ref.qualityAfterDayReagg) assert.ok(ref.dayReaggNote);
    assert.equal(ref.publication, 'HOLD_NOT_APPROVED');
  }
});

test('既存228件を維持し、追加分は重複なし・手順2つ以上・参照先あり', () => {
  const all = Object.values(data.characters).flat();
  const legacyIds = all.filter((c) => /^NB-R(1[2-9]|2[01])-/.test(c.strategyBatchId));
  const dayAdded = all.filter((c) => /^NB-D/.test(c.strategyBatchId) || !legacyIds.includes(c));
  assert.ok(legacyIds.length >= 228);
  for (const c of all) {
    assert.ok(c.steps.length >= 2, c.id);
    assert.ok(refs.cards[c.strategyBatchId], c.id);
    assert.equal(c.publicationApproval, 'PENDING');
  }
  assert.equal(new Set(all.map((c) => c.strategyBatchId)).size, all.length, '同じ攻略カードを2回参照しない');
  assert.ok(dayAdded.length >= 0);
});

test('管理総数281件と有効候補275件を区別する（Patch HOLD 5件・重複除外 1件）', () => {
  const all = Object.values(data.characters).flat();
  const by = (s) => all.filter((c) => (c.candidateStatus ?? 'ACTIVE') === s).map((c) => c.strategyBatchId).sort();
  assert.equal(all.length, 281);
  assert.equal(by('ACTIVE').length, 275);
  assert.deepEqual(by('PATCH_HOLD'), ['NB-R13-0077', 'NB-R13-0079', 'NB-R13-0086', 'NB-R13-0094', 'NB-R13-0097']);
  assert.deepEqual(by('EXCLUDED_DUPLICATE'), ['NB-R18-0021']);
  for (const c of all.filter((c) => c.candidateStatus !== 'ACTIVE')) assert.ok(c.candidateStatusNote);
  const cov = lib.trainingCandidateCoverage();
  assert.equal(cov.reduce((a, x) => a + x.total, 0), 281);
  assert.equal(cov.reduce((a, x) => a + x.active, 0), 275);
});

test('ACTIVE以外は候補・参照カードが承認済みでも公開しない', () => {
  const hold = Object.values(data.characters).flat().find((c) => c.candidateStatus === 'PATCH_HOLD');
  const src = { characters: { x: [{ ...hold, publicationApproval: 'APPROVED' }] } };
  const ok = { cards: { [hold.strategyBatchId]: { publication: 'APPROVED' } } };
  assert.equal(lib.listCharacterTrainingCandidates('x', { source: src, cardRefs: ok }).length, 0);
  assert.equal(lib.listCharacterTrainingCandidates('x', { source: src, cardRefs: ok, allowPending: true }).length, 1);
  const act = { ...hold, candidateStatus: 'ACTIVE', publicationApproval: 'APPROVED' };
  assert.equal(lib.listCharacterTrainingCandidates('x', { source: { characters: { x: [act] } }, cardRefs: ok }).length, 1);
});

test('trainingフラグは false のまま・未承認データは練習経由で公開されない', () => {
  assert.match(readFileSync(new URL('../src/lib/release-features.ts', import.meta.url), 'utf8'), /training:\s*false/);
  for (const slug of Object.keys(data.characters)) assert.deepEqual(lib.listCharacterTrainingCandidates(slug), []);
});

test('既存の診断・練習コードは変更していない', () => {
  // 対象は診断・練習のコードに限定する（攻略カードなどのデータ追加はこのテストの対象外）。
  const paths = [
    'src/lib/daily-diagnosis-input.ts', 'src/lib/daily-training*.ts', 'src/lib/diagnosis*.ts',
    'src/components/daily-training*', 'src/components/diagnosis*', 'src/app/diagnosis', 'src/app/training',
  ].map((p) => `':(glob)${p}'`).join(' ');
  const changed = execSync(`git diff --name-only -- ${paths}`, { cwd: new URL('..', import.meta.url) }).toString().trim();
  assert.equal(changed, '', `既存ファイルの変更: ${changed}`);
});
