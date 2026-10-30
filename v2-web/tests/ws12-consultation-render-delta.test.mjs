import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {loadSource} from './helpers/ws12-render-contract.mjs';
const {ConsultationCardReferences}=loadSource('components/consultation-card-references.tsx');
const {lukeLocalComboRelation:relation,lukeLocalComboPayload:payload}=loadSource('lib/luke-local-combo-reference.ts');
const {lukeCanonicalCombo:canonical}=loadSource('lib/luke-canonical-combo.ts');
const render=(relations,payloads)=>renderToStaticMarkup(React.createElement(ConsultationCardReferences,{relations,payloads,kind:'Combo'}));

test('Luke local Combo reaches real shared Recipe SSR with original text and one complete aria label',()=>{
  const before=structuredClone({relation,payload,canonical});
  const html=render([relation],[payload]);
  assert.ok(html.includes(canonical.raw_recipe));
  assert.ok(html.includes('aria-label="クラシック、'+canonical.raw_recipe+'、コマンド表示確認中"'));
  assert.equal((html.match(/role="img"/g)||[]).length,1);
  assert.ok(html.includes('data-render-mode="WHOLE_RAW_FALLBACK"'));
  assert.doesNotMatch(html,/<svg/);
  assert.ok(html.includes('href="'+canonical.safe_href+'"'));
  for(const text of ['2210','3本','+56F','検証録画','対応バージョン・Modern・ジャスト成功の客観確認'])assert.ok(html.includes(text));
  assert.deepEqual({relation,payload,canonical},before);
  assert.equal(payload.recipe.game_verification,'NOT_VERIFIED');
  assert.equal(payload.patch,null);
  assert.equal(relation.publicationAllowed,false);
});

test('altered local Combo recipe or identity never reaches a rendered command card',()=>{
  for(const altered of [{...payload,recipe:{...payload.recipe,raw_recipe:'incorrect recipe'}},{...payload,cardId:'other-id'}]) {
    const html=render([relation],[altered]);
    assert.ok(html.includes('おすすめのコンボは現在確認中'));
    assert.doesNotMatch(html,/role="img"|incorrect recipe|2210/);
  }
});

test('Luke QA recipe follows canonical input without promoting game verification in shared Recipe SSR',()=>{
  const {lukeReferenceRecipe}=loadSource('lib/luke-reference-command.ts');
  const {Sf6CardRecipe}=loadSource('components/sf6-card-command.ts');
  const sample=lukeReferenceRecipe();
  assert.equal(sample.raw_recipe,canonical.raw_recipe);
  assert.equal(sample.recipe_id,canonical.combo_id);
  assert.equal(sample.game_verification,'NOT_VERIFIED');
  assert.deepEqual(sample.steps,[]);
  const html=renderToStaticMarkup(React.createElement(Sf6CardRecipe,{recipe:sample}));
  assert.ok(html.includes(sample.raw_recipe));
  assert.ok(html.includes('aria-label="クラシック、'+sample.raw_recipe+'、コマンド表示確認中"'));
  assert.doesNotMatch(html,/<svg/);
});

test('whole raw fallback escapes supplied text while preserving the source recipe object',()=>{
  const {Sf6CardRecipe}=loadSource('components/sf6-card-command.ts');
  const recipe={...payload.recipe,raw_recipe:'5LP > <script>alert(1)</script> & 条件未確認'};
  const before=structuredClone(recipe);
  const html=renderToStaticMarkup(React.createElement(Sf6CardRecipe,{recipe}));
  assert.doesNotMatch(html,/<script>|<svg/);
  assert.ok(html.includes('5LP &gt; &lt;script&gt;alert(1)&lt;/script&gt; &amp; 条件未確認'));
  assert.deepEqual(recipe,before);
});
