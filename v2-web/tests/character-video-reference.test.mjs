import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/character-video-references.ts", import.meta.url), "utf8");
const compiled = { exports: {} };
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports: compiled.exports, URL, Set });
const references = compiled.exports.characterVideoReferences;
const row = (overrides = {}) => ({ id: "source-1", title: "Luke guide", url: "https://www.youtube.com/watch?v=VTWNWpdNyWc", publisher: "BuzerioFGC", sourceType: "video", relationship: "guide_reference", ...overrides });

test("an existing public guide reference preserves its identity and attribution", () => {
  const [item] = references([row()], []);
  assert.equal(item.id, "source-1");
  assert.equal(item.publisher, "BuzerioFGC");
  assert.equal(item.thumbnailUrl, "https://i.ytimg.com/vi/VTWNWpdNyWc/hqdefault.jpg");
  assert.equal(item.slug, undefined);
});

test("candidate relations never become public video cards", () => {
  assert.equal(references([row({ relationship: "candidate" }), row({ relationship: "unresolved" })], []).length, 0);
});

test("unsafe URLs, deceptive domains, playlists and invalid video identifiers are withheld", () => {
  for (const url of ["javascript:alert(1)", "http://youtu.be/VTWNWpdNyWc", "https://youtube.com.evil.test/watch?v=VTWNWpdNyWc", "https://www.youtube.com/playlist?list=abc", "https://youtu.be/too-short"]) {
    assert.equal(references([row({ url })], []).length, 0, url);
  }
});

test("duplicate source URLs and already-listed Video entities are not repeated", () => {
  assert.equal(references([row(), row({ id: "source-2" })], []).length, 1);
  assert.equal(references([row()], [row().url]).length, 0);
});
