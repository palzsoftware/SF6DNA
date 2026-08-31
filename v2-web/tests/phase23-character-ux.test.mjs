import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("Phase23 device preview stays token-gated while covering every playable character", () => {
  const sql = read("../supabase/migrations/20260831_phase23_expand_device_preview_all_characters.sql");

  assert.ok(sql.includes("private.is_phase23_device_preview()"), "preview token/expiry gate missing");
  assert.ok(sql.includes("c.status = 'published'"), "preview target must remain a published Character shell");
  assert.ok(sql.includes("c.is_playable = true"), "preview target must remain playable");
  assert.ok(!sql.includes("c.slug = 'ryu'"), "preview must no longer be Ryu-only");
  assert.ok((sql.match(/security invoker/gi) ?? []).length >= 3, "preview RPCs must remain invoker functions");
  assert.doesNotMatch(sql, /\bupdate\s+public\.|\bdelete\s+from\s+public\./i, "preview migration must remain read-only");
});

test("character Move pages avoid repeated empty motion placeholders", () => {
  const page = read("src/app/characters/[slug]/[section]/page.tsx");

  assert.ok(page.includes('source.sourceType === "official_movelist"'), "official movelist must come from Character Sources");
  assert.ok(page.includes("move.media ?"), "motion should render only when media exists");
  assert.ok(!page.includes("GIF / 短尺動画は準備中です。"), "empty motion placeholder must not repeat for every Move");
  assert.ok(!page.includes("officialMovelistUrls"), "movelist URLs must not be hard-coded per Character");
});

test("character UX keeps existing routes and hides empty profile panels", () => {
  const directory = read("src/app/characters/page.tsx");
  const detail = read("src/app/characters/[slug]/page.tsx");
  const layout = read("src/app/layout.tsx");

  for (const route of ["/favorites", "/compare", "/counters", "/training"]) {
    assert.ok(directory.includes(route), `character directory quick route missing: ${route}`);
  }
  assert.ok(detail.includes("hasStrengthProfile"), "empty strength/weakness panels should be suppressed");
  assert.ok(detail.includes("guide-groups"), "guide sections should be grouped for scanning");
  assert.ok(layout.includes("./ux-refresh.css"), "UX refresh stylesheet missing");
});
