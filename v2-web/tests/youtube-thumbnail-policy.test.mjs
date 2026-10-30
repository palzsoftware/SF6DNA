import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";

const source = readFileSync(new URL("../src/lib/youtube-thumbnail.ts", import.meta.url), "utf8");
const stripped = stripTypeScriptTypes(source);
const { youtubeThumbnail } = await import(`data:text/javascript;base64,${Buffer.from(stripped).toString("base64")}`);

const publishedVideos = [
  ["https://www.youtube.com/watch?v=iAs1p3LVdAs", "iAs1p3LVdAs"],
  ["https://www.youtube.com/watch?v=kWS3zqOINUU", "kWS3zqOINUU"],
  ["https://youtube.com/live/6-LsC5hynes", "6-LsC5hynes"],
];

test("three currently published YouTube links preserve thumbnails", () => {
  for (const [url, id] of publishedVideos) {
    assert.equal(youtubeThumbnail(url, id), `https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
  }
});

test("video URL forms resolve a canonical ID without guessing metadata", () => {
  assert.equal(youtubeThumbnail("https://youtu.be/iAs1p3LVdAs", null), "https://i.ytimg.com/vi/iAs1p3LVdAs/hqdefault.jpg");
  assert.equal(youtubeThumbnail("https://m.youtube.com/shorts/iAs1p3LVdAs", null), "https://i.ytimg.com/vi/iAs1p3LVdAs/hqdefault.jpg");
  assert.equal(youtubeThumbnail("https://www.youtube-nocookie.com/embed/iAs1p3LVdAs", null), "https://i.ytimg.com/vi/iAs1p3LVdAs/hqdefault.jpg");
});

test("lookalike domains and non-YouTube destinations never yield a YouTube thumbnail", () => {
  for (const url of [
    "https://evil-youtube.com/watch?v=iAs1p3LVdAs",
    "https://youtube.com.example.org/watch?v=iAs1p3LVdAs",
    "https://example.com/watch?v=iAs1p3LVdAs",
    "https://www.youtube.com@evil.example/watch?v=iAs1p3LVdAs",
    "http://www.youtube.com/watch?v=iAs1p3LVdAs",
  ]) {
    assert.equal(youtubeThumbnail(url, "iAs1p3LVdAs"), null, url);
  }
});

test("inconsistent external_id and malformed/short IDs fail closed", () => {
  assert.equal(youtubeThumbnail("https://www.youtube.com/watch?v=iAs1p3LVdAs", "kWS3zqOINUU"), null);
  assert.equal(youtubeThumbnail("https://www.youtube.com/watch?v=not-enough", null), null);
  assert.equal(youtubeThumbnail("https://youtu.be/iAs1p3LVdAs/other", null), null);
  assert.equal(youtubeThumbnail("javascript:alert(1)", null), null);
});
