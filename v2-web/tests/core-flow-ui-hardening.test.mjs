import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
function load(path, imports) {
  const source = readFileSync(new URL(`../src/components/${path}`, import.meta.url), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const testModule = { exports: {} };
  new Function('module', 'exports', 'require', js)(testModule, testModule.exports, name => { if (name === '@/components/mini-illustration') return { MiniIllustration: () => null }; assert.ok(imports[name], name); return imports[name]; });
  return testModule.exports;
}
const jsx = { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) };
function hooks() {
  const state = []; let cursor = 0;
  return { state, reset: () => { cursor = 0; }, react: {
    useState: initial => {
      const i = cursor++; if (!(i in state)) state[i] = typeof initial === 'function' ? initial() : initial;
      return [state[i], next => { state[i] = typeof next === 'function' ? next(state[i]) : next; }];
    }, useEffect: () => {}, useMemo: fn => fn(), useRef: value => ({ current: value }),
  } };
}
function auth(action, clientThrows = false) {
  const h = hooks(); const routes = []; const calls = [];
  const { AuthForm } = load('auth-form.tsx', {
    react: h.react, 'react/jsx-runtime': jsx,
    'next/navigation': { useRouter: () => ({ replace: path => routes.push(path), refresh: () => calls.push('refresh') }) },
    '@/lib/supabase/client': { getSupabaseBrowserClient: () => {
      if (clientThrows) throw Error('private configuration');
      return { auth: { signInWithPassword: action, signUp: action } };
    } },
  });
  function render() { h.reset(); return AuthForm({ nextPath: '/diagnosis/history' }); }
  let tree = render();
  tree.props.children[0].props.children[1].props.onChange({ target: { value: 'test@example.invalid' } });
  tree.props.children[1].props.children[1].props.onChange({ target: { value: 'fixture-password' } });
  tree = render(); return { ...h, routes, calls, buttons: tree.props.children[2].props.children };
}
for (const [i, label] of [[0, 'login'], [1, 'signup']]) {
  test(`${label} network exception reports safe feedback and reenables retry`, async () => {
    const h = auth(async () => { throw Error('private token'); }); await h.buttons[i].props.onClick();
    assert.equal(h.state[3], false); assert.match(h.state[2], /接続を確認/); assert.doesNotMatch(h.state[2], /private/); assert.deepEqual(h.routes, []);
  });
  test(`${label} client initialization failure leaves action usable`, async () => {
    const h = auth(async () => ({ error: null }), true); await h.buttons[i].props.onClick();
    assert.equal(h.state[3], false); assert.match(h.state[2], /接続を確認/);
  });
  test(`${label} API error preserves feedback without redirect`, async () => {
    const h = auth(async () => ({ error: { message: 'private rejection' } })); await h.buttons[i].props.onClick();
    assert.equal(h.state[3], false); assert.match(h.state[2], /できませんでした/); assert.doesNotMatch(h.state[2], /private/); assert.deepEqual(h.routes, []);
  });
}
test('successful login retains its server-normalized destination', async () => {
  const h = auth(async () => ({ error: null })); await h.buttons[0].props.onClick();
  assert.deepEqual(h.routes, ['/diagnosis/history']); assert.deepEqual(h.calls, ['refresh']); assert.equal(h.state[3], false);
});
test('successful signup retains confirmation messaging without redirect', async () => {
  const h = auth(async () => ({ error: null })); await h.buttons[1].props.onClick();
  assert.match(h.state[2], /確認メール/); assert.deepEqual(h.routes, []); assert.equal(h.state[3], false);
});
test('Daily15 closes first and other cards and handles a changed plan', () => {
  const h = hooks(); let ids = ['a', 'b', 'c'];
  const { DailyTrainingPlanner } = load('daily-training-planner.tsx', {
    react: h.react, 'react/jsx-runtime': jsx, 'next/link': { default: 'a' },
    'next/navigation': { useRouter: () => ({ refresh: () => { throw Error('unexpected refresh'); } }) },
    '@/lib/use-personalization-owner': { usePersonalizationOwner: () => ({ state: { status: 'ready', owner: 'guest', version: 1 }, isCurrent: () => true }) },
    '@/lib/personalization-storage': { getCharacterStatuses: () => ({}) },
    '@/lib/daily-diagnosis-input': { readDailyDiagnosisInput: () => { throw Error('unexpected history read'); } },
    '@/lib/daily-practice-owner': { readOwnedPractice: () => { throw Error('unexpected practice read'); } },
    '@/lib/daily-practice-owner-lock': { savePracticeWithOwnerLock: () => { throw Error('unexpected write'); } },
    './daily-training-quality-card': { DailyTrainingQualityCard: () => null },
    '@/lib/daily-practice': {},
    '@/lib/daily-training': { isImprovementFocus: () => false, resolveDailyTrainingSelection: () => ({}), buildDailyTrainingPlan: () => ({
      dateKey: '2026-09-30', theme: 'fixture', reason: 'fixture', source: 'default', totalMinutes: 15,
      items: ids.map(id => ({ id, detail: { matchFocus: ['fixture'] } })),
    }) }, './daily-training-planner.module.css': { default: {} },
  });
  function cards() {
    h.reset(); const wrapper = DailyTrainingPlanner({ dateKey: '2026-09-30', request: { diagnosisType: 'improvement', focus: null }, context: { owner: 'guest', state: 'empty', primaryIssue: null } });
    assert.equal(typeof wrapper.type, 'function');
    const tree = wrapper.type(wrapper.props);
    const findCards = node => {
      if (!node || typeof node !== 'object') return null;
      if (node.props?.['aria-label'] === '今日の練習項目') return node.props.children;
      const children = Array.isArray(node.props?.children) ? node.props.children : [node.props?.children];
      for (const child of children.flat(Infinity)) { const found = findCards(child); if (found) return found; }
      return null;
    };
    return findCards(tree);
  }
  let list = cards(); assert.deepEqual(list.map(x => x.props.expanded), [true, false, false]);
  list[0].props.onToggle(); list = cards(); assert.deepEqual(list.map(x => x.props.expanded), [false, false, false]);
  list[1].props.onToggle(); list = cards(); assert.deepEqual(list.map(x => x.props.expanded), [false, true, false]);
  list[1].props.onToggle(); list = cards(); assert.deepEqual(list.map(x => x.props.expanded), [false, false, false]);
  list[2].props.onToggle(); ids = ['d', 'e', 'f']; list = cards(); assert.deepEqual(list.map(x => x.props.expanded), [true, false, false]);
});
