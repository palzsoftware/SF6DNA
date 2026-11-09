import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const root = new URL("../src/", import.meta.url);
const read = path => readFileSync(new URL(path, root), "utf8");
test("preview-only route is gated and reuses the shared library", () => {
 const source = read("app/videos/ryu-preview/page.tsx");
 assert.match(source, /VERCEL_ENV !== "preview"/);
 assert.match(source, /notFound\(\)/);
 assert.match(source, /index: false/);
 assert.match(source, /<VideoLibrary[^>]*previewCandidates/);
});
test("27 unique candidates without confirmed public relation IDs", () => {
 const source = read("lib/ryu-video-preview.ts");
 const ids = [...source.matchAll(/\[\s*"([A-Za-z0-9_-]{11})"/g)].map(x=>x[1]);
 assert.equal(ids.length, 27);
 assert.equal(new Set(ids).size, 9);
 assert.doesNotMatch(source, /entityRefs\s*:/);
 assert.doesNotMatch(source, /matchBindings\s*:/);
});
test("preview mode preserves shared favorite, watched and share controls and avoids 404 detail links", () => {
 const card = read("components/video-card.tsx");
 const lib = read("components/video-library.tsx");
 assert.match(card, /previewCandidate \? video\.title : <Link/);
 assert.match(card, /toggleFavorite/);
 assert.match(card, /toggleWatched/);
 assert.match(card, /void share\(\)/);
 assert.match(lib, /previewCandidate=\{previewCandidates\}/);
});
