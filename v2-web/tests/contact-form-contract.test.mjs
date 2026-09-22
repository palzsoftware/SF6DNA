import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/contact-form.ts", import.meta.url), "utf8");
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const loadedModule = { exports: {} };
new Function("module", "exports", js)(loadedModule, loadedModule.exports);
const { CONTACT_CATEGORIES, validateContactPayload } = loadedModule.exports;

test("Contact accepts the six approved categories and a valid payload", () => {
  assert.equal(CONTACT_CATEGORIES.length, 6);
  const result = validateContactPayload({ category: "不具合報告", message: "表示が崩れる状態を確認しました。", email: "user@example.com", targetUrl: "https://example.com/page" });
  assert.equal(result.ok, true);
});

test("Contact rejects blank, invalid, overlong and bot payloads", () => {
  assert.equal(validateContactPayload({ category: "不具合報告", message: "短い", email: "user@example.com" }).ok, false);
  assert.equal(validateContactPayload({ category: "不具合報告", message: "十分な長さの問い合わせ内容です。", email: "invalid" }).ok, false);
  assert.equal(validateContactPayload({ category: "不具合報告", message: "あ".repeat(4001), email: "user@example.com" }).ok, false);
  assert.equal(validateContactPayload({ category: "不具合報告", message: "十分な長さの問い合わせ内容です。", email: "user@example.com", website: "bot" }).ok, false);
});

test("Contact server contract stays fail-closed until a backend is approved", () => {
  const route = readFileSync(new URL("../src/app/api/contact/route.ts", import.meta.url), "utf8");
  const page = readFileSync(new URL("../src/app/contact/page.tsx", import.meta.url), "utf8");
  assert.match(route, /delivery_not_configured/);
  assert.match(route, /status: 503/);
  assert.match(page, /入力内容は送信・保存されません/);
  assert.match(page, /PUBLIC_CONTACT_MAILTO/);
});
