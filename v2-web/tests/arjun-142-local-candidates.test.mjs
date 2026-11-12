import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const data = JSON.parse(fs.readFileSync(new URL("../src/data/arjun-142-local-research.json",import.meta.url),"utf8"));
const move = JSON.parse(fs.readFileSync(new URL("../src/data/arjun-77-local-candidates.json",import.meta.url),"utf8"));
test("142 distinct unpublished source records",()=>{
  assert.equal(data.count,142);assert.equal(data.records.length,142);
  assert.equal(new Set(data.records.map(x=>x.id)).size,142);
  assert.ok(data.records.every(x=>x.publication_status==="not_imported" && x.in_game_verified===false && x.media_url===null));
});
test("correct 4 strategy card categories",()=>{
  const x=Object.groupBy(data.records,r=>r.category);
  assert.deepEqual(Object.fromEntries(Object.entries(x).map(([k,v])=>[k,v.length])),{combo:27,setplay:46,pressure:26,counter:43});
});
test("exactly 77 ordered move candidates, raw frames retained",()=>{
 assert.equal(move.count,77);assert.equal(move.moves.length,77);
 assert.equal(new Set(move.moves.map(x=>x.sourceWebId)).size,77);
 assert.ok(move.moves.every(x=>x.canonicalMoveUuid===null && x.media===null && x.patchVerified===false));
 assert.ok(move.moves.every(x=>Object.hasOwn(x.sourceFrames,'damage') && Object.hasOwn(x.sourceFrames,'startup_frame')));
});
test("additive route is local only and independent",()=>{
 const route=fs.readFileSync(new URL("../src/app/arjun-research-local/page.tsx",import.meta.url),"utf8");
 assert.match(route,/NODE_ENV !== "development"/);assert.match(route,/process.env.VERCEL_ENV/);
 assert.match(route,/SF6DNA_ARJUN_LOCAL_PREVIEW/);assert.match(route,/notFound\(\)/);
});
