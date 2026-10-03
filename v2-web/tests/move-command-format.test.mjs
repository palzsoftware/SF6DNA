import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const source = readFileSync(new URL('../src/lib/move-command-format.ts', import.meta.url), 'utf8');
const mod = { exports: {} };
new Function('module', 'exports', ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText)(mod, mod.exports);
const { formatMoveCommand, moveCommandSearchTerms } = mod.exports;
for (const [input, expected] of Object.entries({ '2MK': '↓ + 中K', '6HP': '→ + 強P', '4HK': '← + 強K', '236LP': '↓↘→ + 弱P', '214HP': '↓↙← + 強P', '623MP': '→↓↘ + 中P', 'j.HK': 'ジャンプ中 + 強K', '5MP~MK': '中P ＞ 中K' })) {
  test(`public command ${input}`, () => assert.equal(formatMoveCommand(input), expected));
}
test('existing JP arrows/Japanese, conditions and unknown grammar remain unchanged', () => {
  for (const input of ['↓↘→ + 弱P', '強P', '（空中で）↓↘→ + P', '[4]6LP', '236LP damage 600', '', '5MP~']) assert.equal(formatMoveCommand(input), input);
});
test('raw and formatted commands are both searchable without changing source data', () => {
  assert.deepEqual(moveCommandSearchTerms('236LP'), ['236LP', '↓↘→ + 弱P']);
  assert.deepEqual(moveCommandSearchTerms('↓↘→ + 弱P'), ['↓↘→ + 弱P']);
});
