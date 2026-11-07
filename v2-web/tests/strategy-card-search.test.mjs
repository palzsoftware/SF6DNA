import test from "node:test";
import assert from "node:assert/strict";
import { searchStrategyCards, strategyCategories } from "../src/lib/strategy-card-search.mjs";
const cards = [
  {id:"c0",kind:"combo",title:"小技コンボ", category:"basic",driveCost:0,saCost:0,searchTerms:["しゃがみ弱K","236P"]},
  {id:"c1",kind:"combo",title:"SA3締め",category:"sa",driveCost:3,saCost:3,searchTerms:["OD波動拳"]},
  {id:"c2",kind:"combo",title:"ゲージなしと書かれた未検証候補",driveCost:null,saCost:null},
  {id:"c3",kind:"combo",title:"SA2コンボ",driveCost:0,saCost:2},
  {id:"s1",kind:"setplay",title:"安全飛び",category:"safejump",searchTerms:["画面端","F式"]},
  {id:"p1",kind:"sequence",title:"暴れ潰し",searchTerms:["固め","ドライブラッシュ"]},
  {id:"x1",kind:"counter",title:"豪鬼の百鬼対策",searchTerms:["百鬼襲","百鬼","AKUMA"]},
];
const within = kind => cards.filter(row=>row.kind===kind);
test("combo: SA3 and SA2 are exact, separate from unknown", () => {
  assert.deepEqual(searchStrategyCards(within("combo"),{query:"SA3"}).map(x=>x.id),["c1"]);
  assert.deepEqual(searchStrategyCards(within("combo"),{query:"SA2"}).map(x=>x.id),["c3"]);
});
test("combo: gauge-free requires explicit two zeros; null is not zero", () => {
  assert.deepEqual(searchStrategyCards(within("combo"),{query:"ゲージなし"}).map(x=>x.id),["c0"]);
});
test("setplay/sequence/counter search independently with own terms", () => {
  assert.deepEqual(searchStrategyCards(within("setplay"),{query:"F式"}).map(x=>x.id),["s1"]);
  assert.deepEqual(searchStrategyCards(within("sequence"),{query:"固め"}).map(x=>x.id),["p1"]);
  assert.deepEqual(searchStrategyCards(within("counter"),{query:"百鬼"}).map(x=>x.id),["x1"]);
  assert.deepEqual(searchStrategyCards(within("counter"),{query:"安全飛び"}),[]);
});
test("category and query AND; empty returns zero",()=>{
  assert.deepEqual(searchStrategyCards(within("combo"),{query:"SA3",category:"basic"}),[]);
  assert.deepEqual(searchStrategyCards(within("setplay"),{query:"存在しない"}),[]);
  assert.deepEqual(strategyCategories(within("combo")), [{value:"basic",label:"basic"},{value:"sa",label:"sa"}]);
});
test("search doesn't modify rows",()=>{
 const original=JSON.stringify(cards); searchStrategyCards(within("combo"),{query:"SA3"});assert.equal(JSON.stringify(cards),original);
});
