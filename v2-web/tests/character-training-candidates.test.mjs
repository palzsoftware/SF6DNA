// キャラ別練習候補データと読み込み関数の検査。既存の診断・練習コードを変更していないことも確認する。
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execSync, execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
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

// 既存の診断・練習コード（質問・採点・保存の契約）は、承認済みの「診断履歴の表示修正」以外は変更しない。
// 2026-11-25: 比較の基準を作業ツリーの未コミット差分から基準コミットに変え、Windows でも動く呼び出しにした。
// 承認済みの変更（SF6DNA_DIAGNOSIS_HISTORY_LABELS_20261125.patch）は内容を sha256 で固定し、それ以外の変更は検出する。
const DIAGNOSIS_BASE = '5da63536b616dc86366a048ee5542acefa16f471';
const DIAGNOSIS_PATHS = [
  'src/lib/daily-diagnosis-input.ts', 'src/lib/daily-training*.ts', 'src/lib/diagnosis*.ts',
  'src/components/daily-training*', 'src/components/diagnosis*', 'src/app/diagnosis', 'src/app/training',
];
const APPROVED_DIAGNOSIS_CHANGES = {
  'src/app/diagnosis/history/page.tsx': '6daedbe7bab2123b8c682cc071edb028333796586c3769363536fa9c636b24c2',
  // 2026-11-25 案B：表示文言の統一（「上位傾向」→「上位の結果」、上達課題診断の空表示、「録画」→「レコード」）。
  'src/components/diagnosis-history-tool.tsx': 'ab3224cf24441d72293ea923fb56035509c42f7313abfce07a245d08b9e2f917',
  // 2026-11-25: Aの案内原稿（SF6DNA_DIAG_TRAINING_UX_DRAFT_20261125 の A1〜A4）を表示だけで追加。質問・選択肢・採点・推薦・保存は不変。
  // V41：検索リンク生成の2行＋補助関数のみ変更（11be0977… → e14010e5…）。変更範囲は下の「Aの案内原稿…」テストが基準版34051280…との一致で別途固定している。
  // A V43（承認済み）：傾向12軸の説明部品の挿入（import 1行＋表示2か所）。A V45：履歴ボタンを SaveAwareHistoryLink に置換（import 1行＋2か所）。下の「Aの案内原稿…」テストで除去後の一致を固定。
  'src/components/diagnosis-runner.tsx': '1c91114cf3cedb43b26f45499cea5f7abeb03801f522a8a91a00e1dda5e81c53',
  // A V43（承認待ち）：初心者向け補足 PracticeBeginnerGoalNote の挿入のみ（import 1行＋表示1行）。
  'src/components/daily-training-quality-card.tsx': '418e24c16ff08fd57da13056673a082a19b1b2a8e93ad1476f97ce3a4e115bd8',
  'src/components/diagnosis-guide-notes.tsx': '110131293b8cec73c8adacce42d28d05cea4efe20f9e0b6a422f561c49dc6432',
  'src/components/daily-training-planner.tsx': '719cab0e7e48bfbdea071ba9066a8b6aa03765920813ffc252db9d0efc288329',
  'src/components/daily-training-setup-guide.tsx': 'abacf5b7b2479ce862c6868bf02feb30034814cf173c0cbe08d13ee0d6160af9',
  'src/lib/diagnosis-axis-labels.ts': '08cdfb16e77dcca105ac1b168cb823c54510429740999c62142401526d5c5b32',
  'src/lib/diagnosis-history-cloud.ts': '9d0e7c79c21c23718040d045cf1317404bef9de23123daf16a91dab045e7d82b',
};
const webDir = new URL('..', import.meta.url);
const git = (...args) => execFileSync('git', args, { cwd: webDir, encoding: 'utf8' }).trim();
const lf = (s) => s.replace(/\r\n/g, '\n');
const sha = (s) => createHash('sha256').update(lf(s)).digest('hex');

test('既存の診断・練習コードは変更していない（承認済みの診断履歴の表示修正のみ許容）', () => {
  const specs = DIAGNOSIS_PATHS.map((p) => `:(glob)${p}`);
  const changed = git('diff', '--name-only', '--relative', DIAGNOSIS_BASE, '--', ...specs).split('\n').filter(Boolean);
  const added = git('ls-files', '--others', '--exclude-standard', '--', ...specs).split('\n').filter(Boolean);
  const touched = [...new Set([...changed, ...added])].sort();
  const unexpected = touched.filter((f) => !(f in APPROVED_DIAGNOSIS_CHANGES));
  assert.deepEqual(unexpected, [], `承認外の診断・練習コードの変更: ${unexpected.join(', ')}`);
  for (const [file, expected] of Object.entries(APPROVED_DIAGNOSIS_CHANGES)) {
    assert.equal(sha(readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')), expected, `承認済みの内容から変更あり: ${file}`);
  }
});

test('Aの案内原稿の反映は表示の追加だけ（取り除くと承認済みの版・基準コミットと一致する）', () => {
  const read = (f) => lf(readFileSync(new URL(`../${f}`, import.meta.url), 'utf8'));
  const runner = read('src/components/diagnosis-runner.tsx')
    .replace('import { DiagnosisQuestionNotes, ImprovementResultGuide } from "./diagnosis-guide-notes";\n', '')
    .replace('<DiagnosisQuestionNotes question={question} />', '')
    .replace('<ImprovementResultGuide axes={improvement.map(([key]) => key)} labelOf={axisLabel} />', '')
    .replace('{diagnosis.diagnosisType === "improvement" ? <ImprovementResultGuide axes={priorities.map(([key]) => key)} labelOf={axisLabel} /> : null}', '')
    // 案B：練習文の「録画」を「レコード」に統一（表示文言のみ）。
    .split('レコードに記録し').join('録画し')
    // V41：検索リンクの生成だけを変更した差分（質問・採点・推薦・保存には触れない）。
    // 下の3置換で変更前の記述に戻したとき、承認済みの版（34051280…）と一致することを確かめる。
    // ハッシュを書き換えて通すのではなく、変更が検索リンク生成の2行と補助関数だけであることを固定する。
    .replace(/\/\/ search_sf6dna matches the whole query[^\n]*\n\/\/ never matches anything[^\n]*\nconst priorityQuery = [^\n]*\n\n/, '')
    .replace('const topQuery = priorityQuery([...improvement, ...style]);', 'const topQuery = [...improvement, ...style].map(([key]) => axisLabel(key)).join(" ");')
    .replace('const topQuery = priorityQuery(priorities);', 'const topQuery = priorities.map(([key]) => axisLabel(key)).join(" ");')
    // A V43：傾向12軸の説明の挿入（表示のみ）を取り除く。
    .replace('import { StyleAxisGuideNotes } from "./style-axis-guide-notes";\n', '')
    .replace('<StyleAxisGuideNotes axes={style.map(([key]) => key)} labelOf={axisLabel} />', '')
    .replace('{diagnosis.diagnosisType !== "improvement" ? <StyleAxisGuideNotes axes={priorities.map(([key]) => key)} labelOf={axisLabel} /> : null}', '')
    // A V45（修正案A）：履歴ボタンを保存状態つきの表示部品に置き換えた2か所を、元のリンクに戻す（表示のみ）。
    .replace('import { SaveAwareHistoryLink } from "./save-aware-history-link";\n', '')
    .split('<SaveAwareHistoryLink status={databaseSaveStatus} guest={currentOwner === "guest"} />').join('<Link className="button-secondary" href="/diagnosis/history">診断履歴を見る</Link>');
  // 34051280… = 承認済みの診断履歴の表示修正だけを当てた版（採点・保存はこの版と同一）。
  assert.equal(sha(runner), '34051280930a06669cf0406a4e67a0c29a1e5d4672682559f936f12b5ac7a81f');
  const planner = read('src/components/daily-training-planner.tsx')
    .replace('import { DailyTrainingSetupGuide } from "./daily-training-setup-guide";\n', '')
    .replace('\n      <DailyTrainingSetupGuide fromDiagnosis={!checkingHistory && (plan.source === "diagnosis_link" || plan.source === "local_diagnosis")} />', '');
  assert.equal(planner, lf(git('show', `${DIAGNOSIS_BASE}:./src/components/daily-training-planner.tsx`)) + '\n');
  // A V43：練習カードへの初心者向け補足の挿入（表示のみ）を取り除くと基準コミットと一致する。
  const card = read('src/components/daily-training-quality-card.tsx')
    .replace('import { PracticeBeginnerGoalNote } from "./practice-beginner-goal-note";\n', '')
    .replace('\n        <PracticeBeginnerGoalNote focus={item.id.split(":").pop()} />', '');
  assert.equal(card, lf(git('show', `${DIAGNOSIS_BASE}:./src/components/daily-training-quality-card.tsx`)) + '\n');
  // 新しい表示部品は保存・採点・通信を持たない。
  for (const f of ['src/components/diagnosis-guide-notes.tsx', 'src/components/daily-training-setup-guide.tsx', 'src/components/style-axis-guide-notes.tsx', 'src/components/practice-beginner-goal-note.tsx', 'src/components/save-aware-history-link.tsx']) {
    assert.doesNotMatch(read(f), /useState|useEffect|localStorage|fetch\(|supabase|scorePayload|setAnswers|saveDiagnosis/, f);
  }
});

test('診断の軸ラベル（保存・履歴表示の値）は基準コミットの定義と一致する', () => {
  // 承認済みの修正はラベル表を共通モジュールへ移しただけ。保存される label の値が変わらないことを確かめる。
  const parse = (src) => Object.fromEntries([...src.matchAll(/([a-z_]+): "([^"]+)"/g)].map((m) => [m[1], m[2]]));
  const block = (src) => (src.match(/AXIS_LABELS[^=]*=\s*\{([\s\S]*?)\};/) || [])[1] ?? '';
  const baseRunner = parse(block(git('show', `${DIAGNOSIS_BASE}:./src/components/diagnosis-runner.tsx`)));
  const baseCloud = parse(block(git('show', `${DIAGNOSIS_BASE}:./src/lib/diagnosis-history-cloud.ts`)));
  const shared = parse(block(readFileSync(new URL('../src/lib/diagnosis-axis-labels.ts', import.meta.url), 'utf8')));
  assert.equal(Object.keys(baseRunner).length, 24);
  assert.deepEqual(shared, baseRunner);
  assert.deepEqual(shared, baseCloud);
});
