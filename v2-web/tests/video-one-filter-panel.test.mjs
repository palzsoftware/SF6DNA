import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read=p=>readFileSync(new URL("../src/"+p,import.meta.url),"utf8");
test("videos page has one search/filter panel and only card list beneath",()=>{
 const page=read("app/videos/page.tsx");
 const lib=read("components/video-library.tsx");
 assert.equal((page.match(/<VideoSearchForm /g)||[]).length,1);
 assert.match(page,/hideSearchInput listingOnly/);
 assert.match(lib,/\{!listingOnly \? <div className=\{styles\.toolbar\}>/);
 assert.match(lib,/initialPreviewKind/);
 assert.match(lib,/initialPreviewPlayer/);
 assert.match(lib,/initialSort/);
});
test("upper detailed filters own player and sort, while keeping keyword and kind",()=>{
 const form=read("components/video-search-panel.tsx");
 assert.match(form,/name="q"/);
 assert.match(form,/name="kind"/);
 assert.match(form,/name="previewPlayer"/);
 assert.match(form,/name="sort"/);
 assert.match(form,/playerOptions/);
});
test("standalone Ryu preview still has working library filters",()=>{
 const source=read("app/videos/ryu-preview/page.tsx");
 assert.match(source,/<VideoLibrary videos=\{RYU_VIDEO_PREVIEW\}/);
 assert.doesNotMatch(source,/listingOnly/);
});
