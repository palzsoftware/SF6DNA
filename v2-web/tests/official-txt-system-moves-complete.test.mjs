import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
// Recurrence guard (2026-11-20): the canonical builder dropped Ryu's system rows web:600/601/605-609
// (source frame indices 66-67 and 71-80 existed in the embedded JSON but were not emitted).
// Every character must keep the 10 common system rows; known gaps must be listed here with a reason.
const records=JSON.parse(readFileSync(new URL('../src/data/SF6DNA_WS5_OFFICIAL_TXT_CANONICAL_20261026.json',import.meta.url),'utf8'));
const SYSTEM=['600','601','602','603','604','605','606','607','608','609'];
const KNOWN_GAPS={ryu:{ids:['600','601','605','606','607','608','609'],reason:'builder dropped rows; awaiting re-extraction from the original frame TXT (values must not be copied from other characters)'}};
test('every character keeps the common system move rows (web:600-609)',()=>{
  const by=new Map();
  for(const key of Object.keys(records)){const [ch,kind,id]=key.split(':');if(kind==='web'){if(!by.has(ch))by.set(ch,new Set());by.get(ch).add(id);}}
  assert.equal(by.size,32);
  for(const [ch,ids] of by){
    const missing=SYSTEM.filter(id=>!ids.has(id));
    const allowed=KNOWN_GAPS[ch]?.ids??[];
    assert.deepEqual(missing.filter(id=>!allowed.includes(id)),[],`${ch} lost system rows`);
    // A listed gap that has been filled must be removed from KNOWN_GAPS (keeps the list honest).
    assert.deepEqual(allowed.filter(id=>ids.has(id)),[],`${ch} KNOWN_GAPS is stale`);
  }
});
test('source frame indices of system rows are contiguous for characters without known gaps',()=>{
  const idx=new Map();
  for(const [key,v] of Object.entries(records)){const [ch,kind,id]=key.split(':');if(kind!=='web'||!SYSTEM.includes(id))continue;const m=/frame\[(\d+)\]/.exec(v.sourceLocator);if(!idx.has(ch))idx.set(ch,[]);idx.get(ch).push(Number(m[1]));}
  for(const [ch,list] of idx){ if(KNOWN_GAPS[ch]) continue; list.sort((a,b)=>a-b); assert.equal(list.at(-1)-list[0]+1,list.length,`${ch} system rows not contiguous in source`); }
});
