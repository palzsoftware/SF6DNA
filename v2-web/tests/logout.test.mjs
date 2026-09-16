import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const source = readFileSync(new URL('../src/components/logout-button.tsx', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
function harness(signOut, initError = false) {
  const state = []; const routes = []; const calls = [];
  const loadedModule = { exports: {} };
  const imports = {
    react: { useRef: value => ({ current: value }), useState: value => {
      const i = state.length; state.push(value); return [value, next => { state[i] = next; }];
    } },
    'react/jsx-runtime': { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) },
    '@/lib/supabase/client': { getSupabaseBrowserClient: () => {
      if (initError) throw Error('private configuration');
      return { auth: { signOut: async options => { calls.push(options); return signOut(); } } };
    } },
  };
  new Function('module', 'exports', 'require', 'window', js)(loadedModule, loadedModule.exports,
    name => { assert.ok(imports[name], name); return imports[name]; },
    { location: { replace: path => routes.push(path) } });
  const tree = loadedModule.exports.LogoutButton();
  const button = tree.props.children.find(x => x?.type === 'button');
  return { state, routes, calls, run: button.props.onClick };
}
test('logout terminates only this session and replaces the document after success', async () => {
  const h = harness(async () => ({ error: null })); await h.run();
  assert.deepEqual(h.calls, [{ scope: 'local' }]); assert.deepEqual(h.routes, ['/auth']); assert.equal(h.state[0], false);
});
test('logout service error does not redirect or expose server error', async () => {
  const h = harness(async () => ({ error: { message: 'private error' } })); await h.run();
  assert.deepEqual(h.routes, []); assert.match(h.state[1], /ログアウトできません/); assert.doesNotMatch(h.state[1], /private/); assert.equal(h.state[0], false);
});
test('logout network exception leaves the action retryable', async () => {
  const h = harness(async () => { throw Error('private token'); }); await h.run(); await h.run();
  assert.equal(h.calls.length, 2); assert.deepEqual(h.routes, []); assert.equal(h.state[0], false); assert.doesNotMatch(h.state[1], /private/);
});
test('missing client configuration is handled without leaking configuration', async () => {
  const h = harness(async () => ({ error: null }), true); await h.run();
  assert.deepEqual(h.routes, []); assert.equal(h.state[0], false); assert.match(h.state[1], /接続を確認/);
});
test('logout ignores a second click while the first request is pending', async () => {
  let finish; const pending = new Promise(resolve => { finish = resolve; });
  const h = harness(() => pending); const first = h.run(); await h.run();
  assert.equal(h.calls.length, 1); assert.equal(h.state[0], true);
  finish({ error: null }); await first; assert.deepEqual(h.routes, ['/auth']);
});
