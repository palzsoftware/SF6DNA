import test from "node:test";
import assert from "node:assert/strict";
import {
  classifyCharacterVideo, dedupeCharacterRelatedVideos, filterUniqueAutoVideoHits,
  groupCharacterRelatedVideos, youtubeVideoIdFromUrl,
} from "../src/lib/character-related-video-contract.mjs";

const video = (id, url, level = "unknown", videoType = "guide", categories = []) => ({
  id, url, level, videoType, categories,
});

test("extracts canonical YouTube IDs from supported URL forms and rejects untrusted URLs", () => {
  for (const url of [
    "https://www.youtube.com/watch?v=abcdefghijk&t=3",
    "https://youtu.be/abcdefghijk",
    "https://youtube.com/shorts/abcdefghijk",
    "https://www.youtube-nocookie.com/embed/abcdefghijk",
  ]) assert.equal(youtubeVideoIdFromUrl(url), "abcdefghijk");
  for (const url of [
    "http://youtube.com/watch?v=abcdefghijk",
    "https://youtube.example/watch?v=abcdefghijk",
    "https://youtube.com.evil.test/watch?v=abcdefghijk",
    "https://user:pass@youtube.com/watch?v=abcdefghijk",
    "https://youtube.com/watch?v=short",
  ]) assert.equal(youtubeVideoIdFromUrl(url), null);
});

test("deduplicates registered videos by YouTube ID without mutating input", () => {
  const rows = [video("db-1", "https://youtu.be/abcdefghijk"), video("db-2", "https://www.youtube.com/watch?v=abcdefghijk"), video("db-3", "https://youtu.be/lmnopqrstuv")];
  const result = dedupeCharacterRelatedVideos(rows);
  assert.deepEqual(result.map(row => row.id), ["db-1", "db-3"]);
  assert.equal(rows.length, 3);
});

test("search hits matching registered IDs or repeated search IDs stay out of results", () => {
  const hits = [
    { videoId: "abcdefghijk", watchUrl: "https://www.youtube.com/watch?v=abcdefghijk" },
    { videoId: "lmnopqrstuv", watchUrl: "https://www.youtube.com/watch?v=lmnopqrstuv" },
    { videoId: "lmnopqrstuv", watchUrl: "https://youtu.be/lmnopqrstuv" },
    { videoId: "12345678901", watchUrl: "https://youtu.be/abcdefghijk" },
  ];
  assert.deepEqual(filterUniqueAutoVideoHits(hits, ["abcdefghijk"]), [{ videoId: "lmnopqrstuv", watchUrl: "https://www.youtube.com/watch?v=lmnopqrstuv" }]);
  assert.equal(hits.length, 4);
});

test("only explicit level or match metadata classifies registered records", () => {
  assert.equal(classifyCharacterVideo(video("a", "https://youtu.be/abcdefghijk", "beginner")), "beginner");
  assert.equal(classifyCharacterVideo(video("b", "https://youtu.be/abcdefghijk", "intermediate")), "intermediate");
  assert.equal(classifyCharacterVideo(video("c", "https://youtu.be/abcdefghijk", "advanced")), "advanced");
  assert.equal(classifyCharacterVideo(video("d", "https://youtu.be/abcdefghijk", "unknown", "match")), "match");
  assert.equal(classifyCharacterVideo(video("e", "https://youtu.be/abcdefghijk", "unknown", "guide", ["match"])), "match");
  assert.equal(classifyCharacterVideo(video("f", "https://youtu.be/abcdefghijk", "unknown", "guide", ["combo"])), "unclassified");
});

test("groups retain pending records and never turn a title or search hit into a category", () => {
  const rows = [
    video("a", "https://youtu.be/abcdefghijk", "beginner"),
    video("b", "https://youtu.be/lmnopqrstuv", "unknown", "guide", ["combo"]),
    video("c", "https://youtu.be/12345678901", "unknown", "match"),
  ];
  const groups = groupCharacterRelatedVideos(rows);
  assert.deepEqual(groups.beginner.map(row => row.id), ["a"]);
  assert.deepEqual(groups.match.map(row => row.id), ["c"]);
  assert.deepEqual(groups.unclassified.map(row => row.id), ["b"]);
  assert.equal("searchHit" in groups.unclassified[0], false);
});
