import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const root = new URL("../src/", import.meta.url);
const read = path => readFileSync(new URL(path, root), "utf8");
test("27 unique Ryu candidates with unknown dates preserved", () => {
 const source = read("lib/ryu-video-preview.ts");
 const ids = [...source.matchAll(/\[\s*"([A-Za-z0-9_-]{11})"/g)].map(x=>x[1]);
 assert.equal(ids.length, 27);
 assert.equal(new Set(ids).size, 27);
 assert.match(source, /publishedAt: date \? .* : null/);
 assert.doesNotMatch(source, /entityRefs\s*:/);
 assert.doesNotMatch(source, /matchBindings\s*:/);
});
test("preview sorting, type and player filters combine without altering verified relation gates", () => {
 const source = read("components/video-library.tsx");
 assert.match(source, /const \[previewKind, setPreviewKind\]/);
 assert.match(source, /const \[previewPlayer, setPreviewPlayer\]/);
 assert.match(source, /video\.players\.includes\(previewPlayer\)/);
 assert.match(source, /video\.videoType === previewKind/);
 assert.match(source, /sortVideos\(filterVideos\(previewFiltered,/);
 assert.match(source, /previewCandidates \? <div className=\{styles\.previewFilters\}/);
});
