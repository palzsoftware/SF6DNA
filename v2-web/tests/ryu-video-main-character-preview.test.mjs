import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const src = name => readFileSync(new URL("../src/"+name, import.meta.url),"utf8");
test("videos list admits 27 Ryu candidate source only in Preview and outside server relation filters",()=>{
  const s=src("app/videos/page.tsx");
  assert.match(s,/process\.env\.VERCEL_ENV === "preview" && !invalidFilter && !hasServerFilters && !player/);
  assert.match(s,/publishedIds\.has\(youtubeId\)/);
  assert.match(s,/RYU_VIDEO_PREVIEW\.filter/);
  assert.match(s,/<VideoLibrary videos=\{ryuCandidates\} learningRecords=\{\[\]\} previewCandidates/);
  assert.match(s,/result\.state === "SUCCESS_WITH_RESULTS"/);
});
test("Ryu character page gates candidates without altering normal published relations",()=>{
  const page=src("app/characters/[slug]/page.tsx");
  const view=src("components/character-unified-page.tsx");
  assert.match(page,/process\.env\.VERCEL_ENV === "preview" && character\.slug === "ryu"/);
  assert.match(page,/!publishedYoutubeIds\.has\(youtubeId\)/);
  assert.match(page,/videoCandidateSection=\{showRyuPreview/);
  assert.match(view,/<CharacterRelatedVideos videos=\{connectedVideos\} state=\{videoState\}/);
  assert.match(view,/\{videoCandidateSection\}/);
});
test("No Player publication or Supabase writes added",()=>{
  const video=src("app/videos/page.tsx");
  const char=src("app/characters/[slug]/page.tsx");
  assert.doesNotMatch(video+char,/\.from\(["']videos["']\)\.update/);
  assert.doesNotMatch(video+char,/\.from\(["']entity_videos["']\)\.insert/);
  assert.doesNotMatch(video+char,/PUBLIC_CONFIRMED_VIDEO_RELATIONS\s*=/);
});
