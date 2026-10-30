import test from 'node:test';import assert from 'node:assert/strict';import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {loadSource,renderUnified,assertUniqueAnchors,roster} from './helpers/character-unified-ssr.mjs';
const intake=loadSource('lib/arjun-official-intake');
const pending=()=>intake.pendingIntakeField();
const fields=['name','classic','modern','classicCondition','modernCondition','startup','active','recovery','onHit','onBlock','damage','notes'];
const seed=()=>({schema:'sf6dna/arjun-official-intake/1',characterSlug:'arjun',patch:{label:null,verified:false},captures:[],moves:[],coverage:[]});
const record=()=>({localKey:'arjun-test-01',canonicalMoveId:null,canonicalIdentityVerified:false,category:'special',variantKey:'lp',parentLocalKey:null,...Object.fromEntries(fields.map(k=>[k,pending()]))});
const capture=(id,kind,scheme)=>({id,kind,scheme,characterSlug:'arjun',category:'special',originalPath:id+'.png',sha256:({classic:'a',modern:'b',frame:'c'}[id]).repeat(64),url:'https://www.streetfighter.com/6/ja-jp/character/arjun/movelist',capturedAt:'2026-10-13T20:00:00+09:00',page:1,totalPages:1,patchLabel:'TEST_ONLY'});
const fact=(value,id)=>({value,status:'CONFIRMED',evidence:[{captureId:id,rowKey:'row-1',region:'table/row-1'}],reviewedBy:'TEST_REVIEWER',reviewedAt:'2026-10-13T20:01:00+09:00'});
function reviewedBatch(){const b=seed();b.patch={label:'TEST_ONLY',verified:true};b.captures=[capture('classic','commands','classic'),capture('modern','commands','modern'),capture('frame','frame','shared')];const m=record();m.name=fact('TEST_ONLY_NAME','classic');m.classic=fact('236P','classic');m.modern=fact('SP','modern');m.damage=fact(0,'frame');m.onBlock=fact('-60※-93','frame');m.modernCondition=fact('体力25%以下','modern');b.moves=[m];return b;}
test('unreceived fields and unverified Patch produce no numeric or command payload',()=>{
 const b=seed();b.moves=[record()];assert.equal(intake.validateArjunIntake(b).errors.length,0);assert.ok(intake.validateArjunIntake(b).gaps.includes('PATCH_UNCONFIRMED'));assert.equal(intake.arjunIntakeToDraftBundle(b).moves.length,0);
 const received=reviewedBatch();received.patch.verified=false;assert.equal(intake.arjunIntakeToDraftBundle(received).moves.length,0);
});
test('reviewed draft preserves zero/annotations, separates conditions, and never grants publication',()=>{
 const b=reviewedBatch(),before=JSON.stringify(b),m=intake.arjunIntakeToDraftBundle(b).moves[0];
 assert.equal(m.frame.damage,0);assert.equal(m.frame.onBlock,'-60※-93');assert.equal(m.frame.startup,null);assert.equal(m.status,'draft');assert.equal(m.media,null);
 assert.equal(m.commands[0].conditionText,null);assert.equal(m.commands[1].conditionText,'体力25%以下');assert.equal(m.id,'arjun-test-01');assert.equal(JSON.stringify(b),before);
});
test('wrong domain, missing evidence, unreviewed value, crossed control, and mixed Patch are rejected',()=>{
 for(const mutate of [b=>b.captures[0].url='https://example.com/character/arjun',b=>b.moves[0].damage.evidence=[],b=>b.moves[0].classic.reviewedBy=null,b=>b.moves[0].modern.evidence[0].captureId='classic',b=>b.captures[0].patchLabel='OLD']){const b=reviewedBatch();mutate(b);assert.throws(()=>intake.arjunIntakeToDraftBundle(b));}
});
test('duplicate page/move/variant and missing split page are classified',()=>{
 const b=reviewedBatch();b.captures[0].totalPages=2;assert.ok(intake.validateArjunIntake(b).gaps.some(x=>x.startsWith('PAGE_MISSING:')));
 b.captures.push({...b.captures[0],id:'repeat'});b.moves.push(structuredClone(b.moves[0]));const errors=intake.validateArjunIntake(b).errors;for(const key of ['DUPLICATE_PAGE:','MOVE_KEY:','DUPLICATE_VARIANT:'])assert.ok(errors.some(x=>x.startsWith(key)));
});
test('unclear/conflicting fields and unsupported OFFICIAL_NA are never inferred',()=>{
 const b=reviewedBatch();b.moves[0].damage.status='UNCLEAR';b.moves[0].onBlock.status='CONFLICT';const m=intake.arjunIntakeToDraftBundle(b).moves[0];assert.equal(m.frame.damage,null);assert.equal(m.frame.onBlock,null);
 b.moves[0].startup={...fact(null,'frame'),status:'OFFICIAL_NA'};assert.equal(intake.arjunIntakeToDraftBundle(b).moves[0].frameFieldStatus.startup,'OFFICIAL_NA');b.moves[0].startup.value='0';assert.throws(()=>intake.arjunIntakeToDraftBundle(b));
});
test('variant parents, identity duplication and declared row coverage cannot bypass receipt checks',()=>{
 const b=reviewedBatch();b.moves[0].parentLocalKey=b.moves[0].localKey;assert.throws(()=>intake.arjunIntakeToDraftBundle(b));b.moves[0].parentLocalKey=null;
 b.coverage=[{kind:'commands',scheme:'classic',category:'special',complete:true,expectedRows:9}];assert.throws(()=>intake.arjunIntakeToDraftBundle(b));
});
test('one original spanning categories can be referenced without duplicating image receipts',()=>{
 const b=reviewedBatch();for(const c of b.captures)c.category='mixed';assert.equal(intake.validateArjunIntake(b).errors.length,0);
 assert.equal(intake.arjunIntakeToDraftBundle(b).moves.length,1);
});
test('all 31 existing character templates keep their default preference controls',()=>{
 assert.equal(Object.keys(roster).length,31);
 for(const slug of Object.keys(roster))assert.match(renderUnified(slug),/user-tool-actions/,slug);
});
test('control-specific Frame evidence remains pending rather than becoming shared damage',()=>{
 const b=reviewedBatch();b.captures.find(c=>c.kind==='frame').scheme='classic';
 assert.ok(intake.validateArjunIntake(b).gaps.some(g=>g.startsWith('FRAME_CONTROL_SCOPE_PENDING:')));
 const m=intake.arjunIntakeToDraftBundle(b).moves[0];assert.equal(m.frame.damage,null);assert.equal(m.frame.onBlock,null);assert.equal(m.commands.length,2);
});
test('exact old name comparison never creates canonical mapping or deletes unseen candidates',()=>{
 const b=reviewedBatch();const before=JSON.stringify(b),old=[{id:'old-placeholder',name:'TEST_ONLY_NAME'},{id:'unseen',name:'未受領'}];
 const result=intake.compareArjunExistingNames(b,old);assert.equal(result.rows[0].status,'EXACT_NAME_CANDIDATE');assert.equal(result.rows[0].canonicalMapping,'OWNER_REVIEW_REQUIRED');assert.equal(result.oldNamesNotSeen[0].status,'NOT_SEEN_IN_PARTIAL_INTAKE');assert.equal(result.removalAllowed,false);
 b.moves[0].name.value='異なる新名称';assert.equal(intake.compareArjunExistingNames(b,old).rows[0].status,'NEW_OR_NAME_MISMATCH');b.moves[0].name.value='TEST_ONLY_NAME';assert.equal(JSON.stringify(b),before);
});
test('Arjun reuses unified template with pending inputs, frames, media, closed strategy and stable anchors',()=>{
 const env=process.env.VERCEL_ENV;process.env.VERCEL_ENV='preview';try{const data=loadSource('lib/pre-release-character');const props=data.preReleaseUnifiedProps(data.getPreReleaseCharacter('arjun'));const html=renderToStaticMarkup(React.createElement(loadSource('components/character-unified-page').CharacterUnifiedPage,props));
 assert.equal((html.match(/<h1\b/g)||[]).length,1);assert.match(html,/data-character-template="unified-v1"/);assert.match(html,/Classic<\/dt><dd>入力確認中/);assert.match(html,/Modern<\/dt><dd>データ確認中/);assert.match(html,/動作映像は準備中/);assert.match(html,/発生<\/dt><dd>確認中/);assertUniqueAnchors(assert,html);assert.doesNotMatch(html,/user-tool-actions/);
 for(const id of ['pilot-combos','pilot-setplay','pilot-sequences'])assert.match(html,new RegExp('id="'+id+'"'));assert.doesNotMatch(html,/TEST_ONLY|参戦予定/);
 assert.match(renderUnified('ryu'),/user-tool-actions/,'existing characters keep default preferences');
 }finally{if(env===undefined)delete process.env.VERCEL_ENV;else process.env.VERCEL_ENV=env;}
});
