import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const read = p => readFileSync(new URL(p, import.meta.url), 'utf8');
const cards = JSON.parse(read('../src/lib/strategy-research-cards-20261118.json'));
const hold = JSON.parse(read('../src/lib/strategy-reference-source-hold-20261120.json'));

function load() {
  const js = ts.transpileModule(read('../src/lib/strategy-research-contract.ts'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, resolveJsonModule: true, esModuleInterop: true } }).outputText;
  const m = { exports: {} };
  new Function('module', 'exports', 'require', js)(m, m.exports, name => {
    if (name === './strategy-research-cards-20261118.json') return cards;
    if (name === './strategy-reference-source-hold-20261120.json') return hold;
    return require(name);
  });
  return m.exports;
}

test('hold list has 86 unique IDs, all among the 384 displayed cards', () => {
  const ids = new Set(cards.map(c => c.id));
  assert.equal(cards.length, 384);
  assert.equal(new Set(hold.holdCardIds).size, 86);
  assert.ok(hold.holdCardIds.every(id => ids.has(id)));
});

test('held cards never reach any character slot; other cards are unchanged', () => {
  const lib = load();
  const held = new Set(hold.holdCardIds);
  const kinds = ['combo', 'setplay', 'sequence', 'counter'];
  const slugs = [...new Set(cards.map(c => c.characterSlug))];
  let listed = 0;
  for (const slug of slugs) for (const kind of kinds) {
    const out = lib.listStrategyResearchCards(slug, kind);
    assert.ok(out.every(c => !held.has(c.id)), `${slug}/${kind} leaked a held card`);
    listed += out.length;
  }
  assert.equal(listed, 384 - 86);
  assert.equal(lib.isStrategyResearchCardHeld(hold.holdCardIds[0]), true);
});

test('release flags are unchanged by the hold mechanism', () => {
  assert.match(read('../src/lib/release-features.ts'), /publicStrategyContent:\s*false/);
});
