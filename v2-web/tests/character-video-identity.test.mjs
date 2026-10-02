import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
const result = { exports: {} };
const js = ts.transpileModule(readFileSync(new URL("../src/lib/character-video-references.ts", import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
new Function("module", "exports", js)(result, result.exports);
const { getYouTubeVideoId, uniqueCharacterVideos, characterVideoReferences } = result.exports;
test("watch, short, live and short-link URLs share identity; untrusted hosts are rejected", () => {
  for (const url of ["https://youtu.be/abcdefghijk", "https://www.youtube.com/watch?v=abcdefghijk&t=20", "https://youtube.com/shorts/abcdefghijk", "https://m.youtube.com/live/abcdefghijk/"]) assert.equal(getYouTubeVideoId(url), "abcdefghijk");
  for (const url of ["https://youtube.com.evil.test/watch?v=abcdefghijk", "http://youtu.be/abcdefghijk", "javascript:alert(1)"]) assert.equal(getYouTubeVideoId(url), null);
});
test("video dedupe has no three or six card cap and retains relation order", () => {
  const videos = Array.from({ length: 12 }, (_, i) => ({ id: String(i), url: `https://youtu.be/abcdefghi${String(i).padStart(2, "0")}` }));
  const deduped = uniqueCharacterVideos([...videos, { id: "duplicate", url: "https://youtube.com/live/abcdefghi00" }]);
  assert.equal(deduped.length, 12); assert.deepEqual(deduped, videos);
});
test("references dedupe against Video entities by ID without promoting candidate sources", () => {
  const sources = [{ id: "same", relationship: "reference", url: "https://youtube.com/shorts/abcdefghijk" }, { id: "candidate", relationship: "candidate", url: "https://youtu.be/lmnopqrstuv" }, { id: "safe", relationship: "reference", url: "https://youtu.be/12345678901" }];
  const refs = characterVideoReferences(sources, ["https://youtube.com/watch?v=abcdefghijk"]);
  assert.deepEqual(refs.map(ref => ref.id), ["safe"]); assert.match(refs[0].thumbnailUrl, /12345678901/);
});
