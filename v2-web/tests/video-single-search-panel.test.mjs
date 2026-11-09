import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read=path=>readFileSync(new URL("../src/"+path,import.meta.url),"utf8");
test("top search is the only search panel when YouTube auto search is disabled",()=>{
 const page=read("app/videos/page.tsx");
 const form=read("components/video-search-panel.tsx");
 const source=read("lib/auto-youtube-videos.ts");
 assert.equal((page.match(/<VideoSearchForm /g)||[]).length,1);
 assert.match(page,/\{autoVideoEnabled\(\) \? <Suspense/);
 assert.match(source,/!process\.env\.VERCEL/);
 assert.match(page,/initialQuery=\{listingQuery\} hideSearchInput/);
 assert.equal((form.match(/name="q"/g)||[]).length,1);
});
test("auto-search result heading does not pretend to be a second search panel",()=>{
 const source=read("components/auto-video-results.tsx");
 assert.doesNotMatch(source,/スト6の動画を探す/);
 assert.match(source,/YouTube検索結果/);
});
