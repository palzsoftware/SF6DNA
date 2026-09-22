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

test("Contact server contract submits only through the validated Supabase RPC", () => {
  const route = readFileSync(new URL("../src/app/api/contact/route.ts", import.meta.url), "utf8");
  const page = readFileSync(new URL("../src/app/contact/page.tsx", import.meta.url), "utf8");
  const form = readFileSync(new URL("../src/components/contact-form.tsx", import.meta.url), "utf8");
  assert.match(route, /getSupabaseAuthServerClient/);
  assert.match(route, /\.rpc\("submit_contact"/);
  assert.match(route, /status: 429/);
  assert.match(route, /hasForeignOrigin/);
  assert.match(route, /MAX_REQUEST_BYTES/);
  assert.match(page, /180日以内に削除/);
  assert.match(page, /PUBLIC_CONTACT_MAILTO/);
  assert.match(page, /フォームが利用できない場合/);
  assert.match(page, /メールで直接問い合わせる/);
  assert.match(form, /問い合わせを送信/);
});

test("Contact migration denies direct public rows and exposes only the submission RPC", () => {
  const migration = readFileSync(new URL("../../supabase/migrations/20260922143000_add_contact_inbox.sql", import.meta.url), "utf8");
  assert.match(migration, /alter table public\.contact_inbox enable row level security/);
  assert.match(migration, /revoke all on table public\.contact_inbox from public, anon, authenticated/);
  assert.doesNotMatch(migration, /create policy/i);
  assert.match(migration, /security definer/);
  assert.match(migration, /set search_path = ''/);
  assert.match(migration, /grant execute on function public\.submit_contact[\s\S]*to anon, authenticated, service_role/);
  assert.match(migration, /extensions\.hmac/);
  assert.match(migration, /interval '180 days'/);
});
