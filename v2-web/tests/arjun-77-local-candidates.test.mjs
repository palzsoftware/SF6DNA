import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const root = new URL("../src/data/arjun-77-local-candidates.json", import.meta.url);
const data = JSON.parse(fs.readFileSync(root,"utf8"));
test("exactly 77 distinct source IDs", () => {
  assert.equal(data.count,77); assert.equal(data.moves.length,77);
  assert.equal(new Set(data.moves.map(x => x.id)).size,77);
  assert.equal(new Set(data.moves.map(x => x.sourceWebId)).size,77);
});
test("all row names and categories non-empty", () => {
  for (const move of data.moves) {assert.ok(move.name.trim());assert.ok(move.sourceType);assert.ok(move.category);}
});
test("no canonical IDs, media or publication grants", () => {
  assert.equal(data.officialCaptureVerified,false);
  assert.equal(data.currentPatchVerified,false);
  assert.equal(data.canonicalIdentitiesVerified,false);
  for(const move of data.moves) {
    assert.equal(move.canonicalMoveUuid,null);
    assert.equal(move.canonicalMoveSlug,null);
    assert.equal(move.media,null);
    assert.equal(move.patchVerified,false);
    assert.equal(move.publicationStatus,"LOCAL_RESEARCH_ONLY");
  }
});
test("original blanks retained without inventing inputs", () => {
  assert.deepEqual(data.moves.filter(x=>!x.classicRaw?.trim()).map(x=>x.sourceWebId),["201","316","321","325","329"]);
  assert.deepEqual(data.moves.filter(x=>!x.modernRaw?.trim()).map(x=>x.sourceWebId),["101","109","111","202","316","321","325","329"]);
});
test("source order and unique 77 renderer keys", () => {
  assert.deepEqual(data.moves.map(x=>x.id), data.moves.map(x=>`arjun-source-webid-${x.sourceWebId}`));
  assert.equal(data.moves[0].sourceWebId,"100"); assert.equal(data.moves.at(-1).sourceWebId,"609");
});
