import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=(path)=>readFileSync(new URL("../src/"+path,import.meta.url),"utf8");
test("video list uses a single general library for published and Preview-only candidates",()=>{
 const page=read("app/videos/page.tsx");
 assert.match(page, /const displayedVideos = showRyuCandidates \? \[\.\.\.result\.items, \.\.\.ryuCandidates\] : result\.items;/);
 assert.match(page, /<section aria-label="掲載動画">/);
 assert.equal((page.match(/<VideoLibrary /g)||[]).length,1);
 assert.doesNotMatch(page, /<h2>リュウ関連動画/);
 assert.match(page,/!publishedIds\.has\(youtubeId\)/);
 assert.match(page,/process\.env\.VERCEL_ENV === "preview"/);
});
test("shared library preserves published detail links, preview cards remain non-navigable",()=>{
 const library=read("components/video-library.tsx");
 assert.match(library,/previewCandidate=\{previewCandidates && video\.id\.startsWith\("preview-ryu-"\)\}/);
 const page=read("app/videos/page.tsx");
 assert.match(page,/previewCandidates=\{showRyuCandidates\}/);
});
