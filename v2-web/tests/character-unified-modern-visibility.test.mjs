import test from 'node:test';
import assert from 'node:assert/strict';
import {loadSource,roster,renderUnified,bundle} from './helpers/character-unified-ssr.mjs';
const contract=loadSource('lib/character-unified-contract');
const {matchesMoveScheme}=loadSource('lib/character-move-filter');
const row=(scheme,overrides={})=>({moveId:'fixture-id',scheme,commandText:'236P',numericNotation:null,buttonNotation:null,conditionText:null,...overrides});
const move=(commands)=>({id:'fixture-id',slug:'fixture-command',name:'検証用技',moveType:'special',commands,frame:null,media:null});
test('missing Modern registration remains visible without borrowing Classic input',()=>{
 const record=move([row('classic')]);const before=JSON.stringify(record);
 assert.equal(matchesMoveScheme({name:record.name,commands:[],schemes:['classic']},'modern'),false,'negative control');
 assert.equal(matchesMoveScheme({name:record.name,commands:[],schemes:contract.unifiedMoveFilterSchemes(record)},'modern'),true);
 assert.equal(contract.unifiedCommandRows(record,'modern').length,0);
 const html=renderUnified('ryu',{bundle:bundle([record])});
 assert.match(html,/<dt>Modern<\/dt><dd>データ確認中<\/dd>/);
 assert.equal(JSON.stringify(record),before);
});
test('wrong-ID and blank Modern rows do not provide registration evidence',()=>{
 for(const invalid of [row('modern',{moveId:'other'}),row('modern',{commandText:'  '})]){
  const record=move([row('classic'),invalid]);
  assert.ok(contract.unifiedMoveFilterSchemes(record).includes('unknown'));
  assert.match(renderUnified('ryu',{bundle:bundle([record])}),/<dt>Modern<\/dt><dd>データ確認中<\/dd>/);
 }
});
test('registered input variants preserve their scheme and condition without mutation',()=>{
 const record=move([row('classic'),row('modern_manual',{commandText:'↓↘→ + 攻撃',conditionText:'空中'})]);
 const before=JSON.stringify(record);const schemes=contract.unifiedMoveFilterSchemes(record);
 assert.deepEqual(schemes,['classic','modern_manual']);
 assert.equal(matchesMoveScheme({name:'',commands:[],schemes},'modern'),true);
 assert.equal(contract.unifiedConditionRows(record)[0].values.length,0);
 assert.deepEqual(contract.unifiedConditionRows(record)[1].values,['空中']);
 assert.equal(JSON.stringify(record),before);
});
test('all 31 stored character records retain incomplete-input cards in either control filter',()=>{
 let total=0,incomplete=0;const before=JSON.stringify(roster);
 assert.equal(Object.keys(roster).length,31);
 for(const character of Object.values(roster))for(const record of character.moves){
  total++;const schemes=contract.unifiedMoveFilterSchemes(record);
  const missing=['classic','modern'].some(s=>!contract.unifiedCommandRows(record,s).some(r=>contract.unifiedCommandText(r).trim()));
  if(missing){incomplete++;for(const scheme of ['classic','modern'])assert.equal(matchesMoveScheme({name:record.name,commands:[],schemes},scheme),true,record.id);}
 }
 assert.equal(total,1939,'stored fixture rows; resolver-rendered count is separately 1936');
 assert.ok(incomplete>0);assert.equal(JSON.stringify(roster),before);
});
