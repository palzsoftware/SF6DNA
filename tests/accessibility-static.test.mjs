import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

test("root layout provides keyboard skip navigation and a main landmark", () => {
  const source = read("src/app/layout.tsx");
  assert.match(source, /href="#main-content"/);
  assert.match(source, /<main id="main-content" tabIndex=\{-1\}>/);
});

test("global error and not-found states remain available", () => {
  const error = read("src/app/error.tsx");
  const notFound = read("src/app/not-found.tsx");
  assert.match(error, /^"use client";/);
  assert.match(error, /role="alert"/);
  assert.match(error, /onClick=\{reset\}/);
  assert.match(notFound, /ページが見つかりません/);
});

test("external blank-target links protect the opener", () => {
  const files = walk(join(root, "src")).filter((path) => /\.(tsx|ts)$/.test(path));
  for (const path of files) {
    const source = readFileSync(path, "utf8");
    for (const match of source.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
      assert.match(match[0], /rel="[^"]*noopener[^"]*noreferrer[^"]*"/, `${path}: unsafe external link`);
    }
  }
});

test("native content images reserve layout space and provide alt text", () => {
  const files = walk(join(root, "src")).filter((path) => path.endsWith(".tsx"));
  for (const path of files) {
    const source = readFileSync(path, "utf8");
    for (const match of source.matchAll(/<img\b[^>]*>/g)) {
      assert.match(match[0], /\balt=/, `${path}: image alt missing`);
      assert.match(match[0], /\bwidth=/, `${path}: image width missing`);
      assert.match(match[0], /\bheight=/, `${path}: image height missing`);
    }
  }
});

test("responsive CSS preserves tap targets, wrapping, and table overflow", () => {
  const css = read("src/app/globals.css");
  assert.match(css, /button \{ min-height: 44px/);
  assert.match(css, /\.admin-table-wrap \{ overflow-x: auto/);
  assert.match(css, /\.admin-table th, \.admin-table td[^{]*\{[^}]*overflow-wrap: anywhere/);
  assert.match(css, /\.site-nav \{[^}]*overflow-x: auto/);
});
