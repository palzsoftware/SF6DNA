import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {loadSource} from './helpers/ws12-render-contract.mjs';
const {LukeCanonicalComboReference,lukeComboDisplayInputs}=loadSource('components/luke-canonical-combo-reference.tsx');
const {lukeCanonicalCombo:combo}=loadSource('lib/luke-canonical-combo.ts');
const fixture=JSON.parse(readFileSync(new URL('../src/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json',import.meta.url),'utf8'));
test('combo display uses stored Classic move commands without inferring hold or just input',()=>{
 assert.deepEqual(lukeComboDisplayInputs.map(s=>s.name),combo.recipe);
 for(const step of lukeComboDisplayInputs){
  if(!step.moveSlug){assert.equal(step.command,'CDR');continue;}
  const move=fixture.characters.luke.moves.find(m=>m.slug===step.moveSlug);
  assert.ok(move,step.moveSlug);
  const command=move.commands.find(c=>c.scheme==='classic');
  // Normalize whitespace only: no strength, direction or timing substitutions.
  assert.equal(step.command.replace(/\s/g,''),command.commandText.replace(/\s/g,''));
 }
});
test('combo card reuses SVG inputs and Move metric grid, then explains recorded evidence',()=>{
 const prior=process.env.VERCEL_ENV;const before=structuredClone(combo);
 try{
  process.env.VERCEL_ENV='preview';
  const html=renderToStaticMarkup(React.createElement(LukeCanonicalComboReference,{characterSlug:'luke'}));
  assert.match(html,/<h3[^>]*>しゃがみ中K始動/);
  assert.ok((html.match(/<svg/g)||[]).length>=12);
  assert.match(html,/aria-label="コンボの数値と終了状況"/);
  assert.match(html,/2210/);assert.match(html,/\+56F/);
  assert.ok(html.indexOf('コンボの数値と終了状況')<html.indexOf('コンボの説明'));
  assert.match(html,/ホールドの長さ・ジャスト成功の客観確認/);
  assert.match(html,/別録画/);
  assert.equal((html.match(/<video/g)||[]).length,1);
  assert.deepEqual(combo,before);
  process.env.VERCEL_ENV='production';
  assert.equal(renderToStaticMarkup(React.createElement(LukeCanonicalComboReference,{characterSlug:'luke'})),'');
 }finally{if(prior===undefined)delete process.env.VERCEL_ENV;else process.env.VERCEL_ENV=prior;}
});
