import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/character-move-filter.ts", import.meta.url), "utf8");
const mod = { exports: {} };
new Function("module", "exports", ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText)(mod, mod.exports);
const { matchesMoveScheme } = mod.exports;

test("Classic and Modern filters only narrow explicit scheme evidence", () => {
  assert.equal(matchesMoveScheme({ name: "x", commands: [], schemes: ["classic"] }, "classic"), true);
  assert.equal(matchesMoveScheme({ name: "x", commands: [], schemes: ["classic"] }, "modern"), false);
  assert.equal(matchesMoveScheme({ name: "x", commands: [], schemes: ["modern"] }, "modern"), true);
  assert.equal(matchesMoveScheme({ name: "x", commands: [], schemes: ["modern"] }, "classic"), false);
  assert.equal(matchesMoveScheme({ name: "x", commands: [], schemes: ["modern_simple"] }, "modern"), true);
  assert.equal(matchesMoveScheme({ name: "x", commands: [], schemes: ["modern-manual"] }, "modern"), true);
  assert.equal(matchesMoveScheme({ name: "x", commands: [], schemes: ["modern_assist"] }, "modern"), true);
});

test("unknown/common/shared scheme labels remain visible instead of being falsely filtered out", () => {
  for (const schemes of [[], ["common"], ["shared"], ["unknown"], ["both"], ["mixed"], [""], ["modern_unknown"], ["classic", "common"], ["classic", ""]]) {
    const move = { name: "x", commands: [], schemes };
    assert.equal(matchesMoveScheme(move, "classic"), true, JSON.stringify(schemes));
    assert.equal(matchesMoveScheme(move, "modern"), true, JSON.stringify(schemes));
  }
});

test("mixed explicit Classic and Modern evidence remains visible in both filters", () => {
  const move = { name: "x", commands: [], schemes: ["classic", "modern_assist"] };
  assert.equal(matchesMoveScheme(move, "classic"), true);
  assert.equal(matchesMoveScheme(move, "modern"), true);
});
