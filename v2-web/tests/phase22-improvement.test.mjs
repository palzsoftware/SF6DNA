import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const improvement = fs.readFileSync(new URL('../src/lib/improvement-tools.ts', import.meta.url), 'utf8');
const component = fs.readFileSync(new URL('../src/components/improvement-loop-tool.tsx', import.meta.url), 'utf8');
const diagnosis = fs.readFileSync(new URL('../src/components/diagnosis-runner.tsx', import.meta.url), 'utf8');
const matchup = fs.readFileSync(new URL('../src/lib/matchup-card.ts', import.meta.url), 'utf8');
const matchupPage = fs.readFileSync(new URL('../src/app/matchup-card/page.tsx', import.meta.url), 'utf8');

test('battle log analysis is local and covers Phase22 weakness axes', () => {
  assert.match(improvement, /antiAir/);
  assert.match(improvement, /driveImpact/);
  assert.match(improvement, /punish/);
  assert.match(improvement, /cornerEscape/);
  assert.match(improvement, /driveManagement/);
  assert.match(component, /localStorage/);
  assert.match(component, /直近10戦レビュー/);
  assert.match(component, /Replay復習ワークフロー/);
});

test('diagnosis resume reuses only explicit stored answers', async () => {
  const ts = (await import('typescript')).default;
  const { runInNewContext } = await import('node:vm');
  const ast = ts.createSourceFile('runner.tsx', diagnosis, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const callbacks = [];
  function visit(node) {
    if (ts.isCallExpression(node) &&
        node.expression.getText(ast) === 'window.setTimeout' &&
        node.arguments[0] &&
        node.arguments[0].getText(ast).includes('setResumedCount')) {
      callbacks.push(node.arguments[0]);
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
  assert.equal(callbacks.length, 1, 'exactly one resume callback');
  const callbackJS = ts.transpileModule(
    'const resume = ' + callbacks[0].getText(ast) + ';',
    { compilerOptions: { target: ts.ScriptTarget.ES2022 } }
  ).outputText;
  const draft = ast.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === 'draftKey');
  assert.ok(draft, 'draft key function exists');
  const storageModule = { exports: {} };
  const storageJS = ts.transpileModule(fs.readFileSync(new URL('../src/lib/personalization-storage.ts', import.meta.url), 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS }
  }).outputText;
  new Function('module', 'exports', storageJS)(storageModule, storageModule.exports);
  const keyContext = { personalStorageKey: storageModule.exports.personalStorageKey };
  const draftJS = ts.transpileModule(draft.getText(ast), { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
  runInNewContext(draftJS + '\nthis.makeKey = draftKey;', keyContext);
  const owner = 'uid:11111111-1111-4111-8111-111111111111';
  const key = keyContext.makeKey(owner, 'fixture');
  assert.equal(key, 'sf6dna_v3_user_11111111-1111-4111-8111-111111111111_diagnosis_draft:fixture');
  assert.notEqual(key, keyContext.makeKey('guest', 'fixture'));
  assert.equal(keyContext.makeKey(null, 'fixture'), null);
  const questions = ['q1', 'q2', 'q3'].map(id => ({ id, options: [{ id: 'yes' }] }));

  function resume(saved, current = true, actualGeneration = 1) {
    const observed = { answers: {}, index: 0, count: 0, hydrated: false, hydratedOwner: null, failed: false, reads: 0 };
    const context = {
      diagnosis: { slug: 'fixture', questions },
      owner, key, generation: 1, databaseSaveGeneration: { current: actualGeneration },
      isHistoryOwnerCurrent: () => current,
      window: { localStorage: {
        getItem: key => {
          observed.reads++;
          assert.equal(key, 'sf6dna_v3_user_11111111-1111-4111-8111-111111111111_diagnosis_draft:fixture');
          return JSON.stringify(saved);
        },
        removeItem: () => assert.fail('valid JSON must not be deleted')
      }},
      setAnswers: value => { observed.answers = JSON.parse(JSON.stringify(value)); },
      setResumedCount: value => { observed.count = value; },
      setIndex: value => { observed.index = value; },
      setHydratedOwner: value => { observed.hydratedOwner = value; },
      setHydrated: value => { observed.hydrated = value; },
      setDraftStorageFailed: value => { observed.failed = value; }
    };
    runInNewContext(callbackJS + '\nresume();', context, { timeout: 1000 });
    assert.equal(observed.hydrated, current && actualGeneration === 1);
    assert.equal(observed.hydratedOwner, current && actualGeneration === 1 ? owner : null);
    assert.equal(observed.failed, false);
    return observed;
  }

  for (const stale of [resume({ q1: 'yes' }, false), resume({ q1: 'yes' }, true, 2)]) {
    assert.equal(stale.reads, 0);
    assert.deepEqual(stale.answers, {});
    assert.equal(stale.hydrated, false);
  }
  const partial = resume({ q1: 'yes', q2: 'invalid', q3: 'yes', unknown: 'yes' });
  assert.deepEqual(partial.answers, { q1: 'yes', q3: 'yes' });
  assert.equal(partial.count, 2);
  assert.equal(partial.index, 1);

  const complete = resume({ q1: 'yes', q2: 'yes', q3: 'yes' });
  assert.deepEqual(complete.answers, { q1: 'yes', q2: 'yes', q3: 'yes' });
  assert.equal(complete.count, 3);
  assert.equal(complete.index, 3);

  const empty = resume({ q1: 'invalid', unknown: 'yes' });
  assert.deepEqual(empty.answers, {});
  assert.equal(empty.count, 0);
  assert.equal(empty.index, 0);
});

test('matchup card preserves publication, verification and source gates', () => {
  assert.match(matchup, /\.eq\("status", "published"\)/);
  assert.match(matchup, /\.eq\("verification_status", "verified"\)/);
  assert.match(matchup, /getPublicEntitySources/);
  assert.match(matchupPage, /公開条件を満たした技情報/);
  assert.match(matchupPage, /未確認の情報を推測で補うことはしません/);
});
