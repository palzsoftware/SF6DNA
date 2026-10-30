import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {renderUnified,roster,bundle,loadSource,assertUniqueAnchors} from './helpers/character-unified-ssr.mjs';
const card=move=>renderToStaticMarkup(React.createElement(loadSource('components/character-unified-page').UnifiedMoveCard,{move}));
const move=(slug,id)=>structuredClone(roster[slug].moves.find(row=>row.id===id));
test('Manon CA retains Modern condition without copying it into Classic',()=>{
 const record=move('manon','1d2d8c87-2a79-44c4-a3e3-263a7e00f9a4');const original=JSON.stringify(record);const html=card(record);
 assert.doesNotMatch(html,/data-condition-control="classic"/);
 assert.match(html,/data-condition-control="modern">Modern：体力25%以下<\/div>/);
 assert.equal(JSON.stringify(record),original);
});
test('Jamie SA1 keeps annotated Guard and pending Damage without interpreting the legend',()=>{
 const record=move('jamie','e395af47-aedc-467e-b4cb-2aa5c112c348');const html=card(record);
 assert.match(html,/ガード時<\/dt><dd>-60※-93<\/dd>/);
 assert.match(html,/ダメージ<\/dt><dd>確認中<\/dd>/);
 assert.doesNotMatch(html,/ダメージ<\/dt><dd>(2200|1850|0)<\/dd>/);
});
test('Jamie SA2 null combat fields stay pending while literal zero damage remains zero',()=>{
 const html=card(move('jamie','99b9dbf0-5322-4397-bd1f-976a60965a2d'));
 for(const field of ['発生','ヒット時','ガード時'])assert.ok(html.includes(`<dt>${field}</dt><dd>確認中</dd>`));
 assert.match(html,/ダメージ<\/dt><dd>0<\/dd>/);assert.doesNotMatch(html,/900F/);
});
test('wrong-ID and internal conditions cannot become public control conditions',()=>{
 const record=move('manon','1d2d8c87-2a79-44c4-a3e3-263a7e00f9a4');record.commands=[{...record.commands[0],moveId:'wrong-id',conditionText:'WRONG_ID_CONDITION'},{...record.commands[0],conditionText:'publication gated SECRET'}];
 const html=card(record);assert.doesNotMatch(html,/WRONG_ID_CONDITION|SECRET/);assert.doesNotMatch(html,/data-condition-control=/);assert.match(html,/Condition \/ 条件<\/dt><dd>条件確認中<\/dd>/);
});
test('no control inference and no command rewrite in Jamie fused Modern source',()=>{
 const record=move('jamie','e395af47-aedc-467e-b4cb-2aa5c112c348');const before=JSON.stringify(record);
 const c=loadSource('lib/character-unified-contract');const modern=c.unifiedCommandRows(record,'modern');assert.equal(modern.length,1);assert.equal(c.unifiedCommandText(modern[0]),record.commands[1].commandText);
 card(record);assert.equal(JSON.stringify(record),before);
});
test('nine Jamie and Manon Preview media rows preserve exact bindings and remain slots only',()=>{
 let total=0;
 for(const [slug,file] of [['jamie','SF6DNA_VER1_JAMIE_MEDIA_MANIFEST_20261003.json'],['manon','SF6DNA_VER1_MANON_MEDIA_MANIFEST_20260925.json']]){
  const manifest=JSON.parse(fs.readFileSync(new URL('../src/data/'+file,import.meta.url),'utf8'));
  for(const clip of manifest.clips.filter(row=>row.verification_status==='approved_for_preview')){
   const record=move(slug,clip.move_id);assert.ok(record);record.media={id:'qa-'+clip.move_id,moveId:clip.move_id,mediaType:'video',mediaUrl:clip.media_url,posterUrl:clip.poster_url,sourceUrl:null,sourceLabel:null,status:'approved_for_preview',displayOrder:null};
   const html=card(record);assert.ok(html.includes(clip.media_url));assert.ok(html.includes(clip.poster_url));assert.match(html,/preload="none"/);total++;
  }
 }
 assert.equal(total,9);
});
test('exact admitted Luke and JP Move anchors mount once in the unified page',()=>{
 for(const [slug,anchor] of [['luke','move-luke-crouching-mk'],['jp','move-jp-crouching-mp']]){
  const record=roster[slug].moves.find(row=>'move-'+row.slug===anchor);assert.ok(record,anchor);const html=renderUnified(slug,{bundle:bundle([record])});
  assert.equal((html.match(new RegExp(`id="${anchor}"`,'g'))??[]).length,1);assertUniqueAnchors(assert,html);
 }
});
