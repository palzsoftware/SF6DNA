import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderUnified,bundle} from './helpers/character-unified-ssr.mjs';

const css=readFileSync(new URL('../src/components/character-unified-page.module.css',import.meta.url),'utf8');
const row=(id,scheme)=>({moveId:id,scheme,commandText:'236P',numericNotation:null,buttonNotation:null,conditionText:null});
const move=(id,media)=>({id,slug:id,name:'検証用技'+id,moveType:'special',commands:[row(id,'classic')],frame:null,
 media:media?{id:'media-'+id,moveId:id,mediaType:'gif',mediaUrl:'/fixture.gif',posterUrl:null,sourceUrl:null,sourceLabel:null,status:'published'}:null});

test('G101: mixed media groups reserve a 16:9 placeholder only on multi-column widths',()=>{
 const block=css.slice(css.indexOf('/* G101:'));
 assert.ok(block.length>0,'G101 rule present');
 assert.match(block,/@media \(min-width: 641px\)/);
 assert.match(block,/\.moveGrid:has\(> \.moveCard\[data-has-media="true"\]\) > \.moveCard\[data-has-media="false"\] \.mediaSlot/);
 assert.match(block,/aspect-ratio: 16 \/ 9/);
});

test('G101: compact placeholder for media-less cards is preserved as the default',()=>{
 assert.match(css,/\.moveCard\[data-has-media="false"\] \.mediaSlot \{ min-height: 32px; height: 32px; padding: 4px; \}/);
 assert.match(css,/@media \(max-width: 640px\) \{ \.mediaSlot \{ height: 144px; \} \}/);
});

test('G101: placeholder copy and data-has-media markers are unchanged in mixed groups',()=>{
 const html=renderUnified('ryu',{bundle:bundle([move('g101-a',true),move('g101-b',false)])});
 const card=id=>html.slice(html.indexOf(`data-move-id="${id}"`)).split('</article>')[0];
 assert.match(card('g101-a'),/data-has-media="true"/);
 assert.doesNotMatch(card('g101-a'),/動作映像は準備中/);
 assert.match(card('g101-b'),/data-has-media="false"/);
 assert.match(card('g101-b'),/動作映像は準備中/);
});
