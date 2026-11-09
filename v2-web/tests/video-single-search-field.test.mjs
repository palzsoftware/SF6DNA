import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = p => readFileSync(new URL("../src/" + p, import.meta.url), "utf8");
test("/videos uses upper search as the only keyword input and retains sorting/facets", () => {
 const page=read("app/videos/page.tsx");
 const library=read("components/video-library.tsx");
 assert.match(page, /videoSearchQuery\(filters\)/);
 assert.match(page, /initialQuery=\{listingQuery\} hideSearchInput/);
 assert.match(page, /listingQuery\]\.join/);
 assert.match(library, /query: initialQuery/);
 assert.match(library, /!hideSearchInput \? <label>掲載動画を検索/);
 assert.match(library, /setFilters\(\{ \.\.\.EMPTY_FILTERS, query: initialQuery \}\)/);
 assert.match(library, /<label>並び順<select/);
 assert.match(library, /className=\{styles\.filterToggle\}/);
});
test("Ryu candidate standalone preview retains its own inline search", () => {
 const preview=read("app/videos/ryu-preview/page.tsx");
 assert.match(preview, /<VideoLibrary videos=\{RYU_VIDEO_PREVIEW\}/);
 assert.doesNotMatch(preview, /hideSearchInput/);
});
test("YouTube query and listing query share one top field", () => {
 const form=read("components/video-search-panel.tsx");
 assert.match(form, /name="q"/);
 assert.match(form, /検索キーワードは掲載動画の絞り込みにも使用します/);
});
