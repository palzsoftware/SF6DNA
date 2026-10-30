import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {loadSource,renderUnified,roster,assertUniqueAnchors} from './helpers/character-unified-ssr.mjs';

test('public roster keeps preference controls while Ver.1.0 strategy references stay hidden',()=>{
 assert.equal(Object.keys(roster).length,31);
 for(const slug of Object.keys(roster)){
  const html=renderUnified(slug,{localReferences:React.createElement('aside',{'data-test-local':slug},React.createElement('a',{href:'https://example.test/strategy-reference'},'PRIVATE_STRATEGY_REFERENCE'))});
  assert.match(html,/user-tool-actions/);assert.doesNotMatch(html,/data-test-local|PRIVATE_STRATEGY_REFERENCE|https:\/\/example\.test\/strategy-reference/);
  assert.equal((html.match(/data-strategy-publication="CLOSED"/g)||[]).length,4);
  assert.match(html,/aria-label="キャラクター個人設定"/);assertUniqueAnchors(assert,html);
 }
});
test('corrected Arjun still has nine draft placeholders and no preference actions or inferred fields',()=>{
 const previous=process.env.VERCEL_ENV;process.env.VERCEL_ENV='preview';
 try{
  const data=loadSource('lib/pre-release-character');const record=data.getPreReleaseCharacter('arjun');
  const props=data.preReleaseUnifiedProps(record);
  assert.equal(record.bundle.moves[3].name,'神気の巨巌');assert.match(record.profile.tagline,/配信が開始/);
  assert.equal(props.showPreferences,false);
  assert.equal(record.bundle.moves.length,9);
  for(const move of record.bundle.moves){assert.equal(move.status,'draft');assert.equal(move.frame,null);assert.deepEqual(move.commands,[]);}
  const html=renderToStaticMarkup(React.createElement(loadSource('components/character-unified-page').CharacterUnifiedPage,props));
  assert.doesNotMatch(html,/user-tool-actions|神気の巨厳|参戦予定/);assertUniqueAnchors(assert,html);
  const frames=[...html.matchAll(/<dl class="frames">(.*?)<\/dl>/g)].map(m=>m[1]).join('');
  assert.equal((frames.match(/>確認中<\/dd>/g)||[]).length,54);
  assert.match(html,/update20261013/);assert.match(html,/arjun\/movelist/);
 }finally{if(previous===undefined)delete process.env.VERCEL_ENV;else process.env.VERCEL_ENV=previous;}
});
test('unified, Luke pilot and JP caller share admitted slug anchor identity',()=>{
 const ref=loadSource('lib/move-card-reference');
 for(const component of ['character-unified-page','character-detail-pilot','jp-character-detail']){
  const source=fs.readFileSync(new URL('../src/components/'+component+'.tsx',import.meta.url),'utf8');
  assert.match(source,/anchorId: moveCardAnchorId\((?:entry\.)?move\.slug\)/);assert.match(source,/id=\{moveCardAnchorId\(move.slug\)/);assert.match(source,/tabIndex=\{-1\}/);
 }
 const id='admitted-id',slug='jp-special-test',anchorId=ref.moveCardAnchorId(slug);
 const groups=[{items:[{id,anchorId}]}];
 assert.deepEqual(ref.resolveMoveCardReference('#'+anchorId,groups),{id,anchorId});
 assert.equal(ref.resolveMoveCardReference('#move-'+id,groups),null);
 assert.equal(ref.resolveMoveCardReference('#'+anchorId,[...groups,...groups]),null);
});
