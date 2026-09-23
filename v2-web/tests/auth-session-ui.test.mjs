import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync(new URL("../src/app/auth/page.tsx", import.meta.url), "utf8");

test("Auth uses a server-validated user and separates guest and account UI", () => {
  assert.match(page, /getSupabaseAuthServerClient/);
  assert.match(page, /supabase\.auth\.getUser\(\)/);
  assert.match(page, /accountEmail \? \(/);
  assert.match(page, /ログイン中/);
  assert.match(page, /<LogoutButton/);
  assert.match(page, /<AuthForm nextPath=\{nextPath\}/);
  assert.doesNotMatch(page, /getSession\(\)/);
});

test("Auth handles missing sessions as guests and exposes a safe check error", () => {
  assert.match(page, /AuthSessionMissingError/);
  assert.match(page, /ログイン状態を確認できませんでした/);
});

test("Auth return paths are constrained to the local origin", () => {
  assert.match(page, /candidate\?\.startsWith\("\/"\)/);
  assert.match(page, /const safeOrigin = "https:\/\/sf6dna\.invalid"/);
  assert.match(page, /new URL\(candidate, safeOrigin\)/);
  assert.match(page, /parsed\.origin !== safeOrigin/);
  assert.match(page, /parsed\.pathname/);
});
