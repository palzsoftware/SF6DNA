import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
// V25 intake-review helper (ChatGPT) loaded with the repo's transpile pattern. It is a review tool: no DB write, no publication switch.
const gate = (() => { const m = { exports: {} };
  const code = ts.transpileModule(readFileSync(new URL('../src/lib/tournament-intake-review.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  new Function('module', 'exports', 'require', code)(m, m.exports, () => ({})); return m.exports; })();
const {classifyTournamentIntake: check, classifyBatch}=gate;
const c={environment:'production',tournamentId:'11111111-1111-4111-8111-111111111111',playerId:'22222222-2222-4222-8222-222222222222',playerSlug:'example-player',divisionKey:'sf6-singles',placement:5,kind:'individual'};
const e={environment:c.environment,tournamentId:c.tournamentId,playerId:c.playerId,playerSlug:c.playerSlug,identityConfirmed:true,tournamentConfirmed:true,divisionCompatible:true,sourceConfirmed:true,publicationApproved:true,playerPublished:true,tournamentPublished:true,publicPlayerGatePassed:true};
const cases=[
['all evidence confirmed',{}, {},'READY_FOR_REVIEW'],
['unregistered player',{playerId:null},{},'HOLD'],
['unverified identity',{}, {identityConfirmed:false},'HOLD'],
['different slug',{playerSlug:'other-player'}, {},'HOLD'],
['different UUID',{playerId:'33333333-3333-4333-8333-333333333333'}, {},'HOLD'],
['development candidate',{environment:'development'}, {},'HOLD'],
['development evidence',{}, {environment:'development'},'HOLD'],
['unknown tournament',{tournamentId:null}, {},'HOLD'],
['unverified tournament',{}, {tournamentConfirmed:false},'HOLD'],
['different tournament',{tournamentId:'44444444-4444-4444-8444-444444444444'}, {},'HOLD'],
['unapproved publication',{}, {publicationApproved:false},'HOLD'],
['draft player',{}, {playerPublished:false},'HOLD'],
['draft tournament',{}, {tournamentPublished:false},'HOLD'],
['public gate rejected',{}, {publicPlayerGatePassed:false},'HOLD'],
['unconfirmed source',{}, {sourceConfirmed:false},'HOLD'],
['unsupported division',{}, {divisionCompatible:false},'HOLD'],
['missing division',{divisionKey:''}, {},'HOLD'],
['team result',{kind:'team'}, {},'HOLD'],
['missing placement',{placement:null}, {},'HOLD'],
['invalid placement',{placement:0}, {},'HOLD'],
['fractional placement',{placement:1.5}, {},'HOLD'],
['malformed player UUID',{playerId:'not-uuid'}, {},'HOLD'],
['unsafe slug',{playerSlug:'../admin'}, {},'HOLD'],
['truthy string is not approval',{}, {publicationApproved:'true'},'HOLD'],
];
for(const [name,cp,ep,expected] of cases) test(name,()=>assert.equal(check({...c,...cp},{...e,...ep},'production').state,expected));
test('absent evidence',()=>assert.equal(check(c,null,'production').state,'HOLD'));
test('unknown target',()=>assert.equal(check(c,e,'unknown').state,'HOLD'));
test('same legacy key with distinct divisions holds both',()=>assert.deepEqual(classifyBatch([{candidate:c,evidence:e},{candidate:{...c,divisionKey:'other'},evidence:e}],'production').map(x=>x.reason),['LEGACY_KEY_COLLISION','LEGACY_KEY_COLLISION']));
test('duplicate identical inputs hold both',()=>assert.ok(classifyBatch([{candidate:c,evidence:e},{candidate:c,evidence:e}],'production').every(x=>x.state==='HOLD')));
test('same placing for different players is valid',()=>{const p={...c,playerId:'33333333-3333-4333-8333-333333333333',playerSlug:'other-player'};assert.ok(classifyBatch([{candidate:c,evidence:e},{candidate:p,evidence:{...e,playerId:p.playerId,playerSlug:p.playerSlug}}],'production').every(x=>x.state==='READY_FOR_REVIEW'));});
