import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("unpublished content detail RPC remains token-gated, invoker-only, and read-only", () => {
  const sql = read("../supabase/migrations/20260901_phase39_strategy_detail_device_preview.sql");

  assert.match(sql, /private\.is_phase23_device_preview\(\)/);
  assert.match(sql, /security invoker/i);
  assert.match(sql, /target_entity_type not in \('combo', 'setup', 'sequence', 'training'\)/);
  assert.ok((sql.match(/x\.status <> 'archived'/g) ?? []).length >= 4, "archived rows must stay hidden");
  assert.match(sql, /c\.status = 'published'/);
  assert.match(sql, /c\.is_playable = true/);
  assert.match(sql, /revoke all on function[\s\S]*from public/i);
  assert.match(sql, /grant execute on function[\s\S]*to anon/i);
  assert.doesNotMatch(sql, /\binsert\s+into\b|\bupdate\s+public\.|\bdelete\s+from\b/i);
});

test("detail preview exposes evidence and explicit review state", () => {
  const sql = read("../supabase/migrations/20260901_phase39_strategy_detail_device_preview.sql");
  const detail = read("src/lib/content-detail.ts");

  for (const field of ["patchLabel", "sources", "sourceType", "relationship"]) {
    assert.ok(sql.includes(`'${field}'`), `RPC missing ${field}`);
  }
  for (const label of ["公開状態", "検証状態", "実機確認", "撮影・実機確認待ち"]) {
    assert.ok(detail.includes(label), `detail UI missing ${label}`);
  }
});

test("all four detail routes normalize and forward the Preview token", () => {
  for (const path of [
    "src/app/combos/[slug]/page.tsx",
    "src/app/setups/[slug]/page.tsx",
    "src/app/sequences/[slug]/page.tsx",
    "src/app/training/[slug]/page.tsx",
  ]) {
    const page = read(path);
    assert.match(page, /normalizeDevicePreviewToken\(query\.preview\)/, `${path}: token normalization missing`);
    assert.match(page, /get[A-Za-z]+BySlug\(slug, previewToken\)/, `${path}: token forwarding missing`);
    assert.match(page, /preview=\{isDevicePreviewRequest\(previewToken\)\}/, `${path}: preview notice missing`);
  }
});

test("server refuses Preview RPCs outside Vercel Preview deployments", () => {
  const source = read("src/lib/device-preview.ts");
  assert.match(source, /process\.env\.VERCEL_ENV === "preview"/);
  assert.match(source, /get_phase39_content_detail_preview/);
});

test("Combo Preview localizes English display text from the official Move glossary", () => {
  const localization = read("src/lib/detail-localization.ts");
  const preview = read("src/lib/device-preview.ts");
  const detail = read("src/lib/content-detail.ts");
  const sql = read("../supabase/migrations/20260901_phase40_combo_japanese_glossary_preview.sql");

  assert.match(sql, /security invoker/i);
  assert.match(sql, /private\.is_phase23_device_preview\(\)/);
  assert.match(sql, /join public\.moves/);
  assert.match(sql, /join public\.move_aliases/);
  assert.doesNotMatch(sql, /\binsert\s+into\b|\bupdate\s+public\.|\bdelete\s+from\b/i);
  assert.match(preview, /get_phase41_strategy_move_glossary_preview/);
  assert.match(localization, /立ち/);
  assert.match(localization, /しゃがみ/);
  assert.match(localization, /ドライブラッシュ/);
  assert.match(localization, /パニッシュカウンター/);
  assert.match(detail, /localizeComboText\(previewValue\(data, "notation"\), glossary\)/);
  assert.match(detail, /title: localizeComboText\(String\(data\.name\), glossary\)/);
});

test("Setup and Sequence Preview reuse the guarded Japanese Move glossary", () => {
  const preview = read("src/lib/device-preview.ts");
  const detail = read("src/lib/content-detail.ts");
  const setupPage = read("src/app/setups/[slug]/page.tsx");
  const sequencePage = read("src/app/sequences/[slug]/page.tsx");
  const sql = read("../supabase/migrations/20260901_phase41_strategy_japanese_glossary_preview.sql");

  assert.match(sql, /security invoker/i);
  assert.match(sql, /private\.is_phase23_device_preview\(\)/);
  assert.match(sql, /target_entity_type not in \('combo', 'setup', 'sequence'\)/);
  assert.doesNotMatch(sql, /\binsert\s+into\b|\bupdate\s+public\.|\bdelete\s+from\b/i);
  assert.match(preview, /get_phase41_strategy_move_glossary_preview/);
  assert.match(detail, /localizeComboText\(previewValue\(data, "starter_condition"\), glossary\)/);
  assert.match(detail, /localizeComboText\(previewValue\(data, "sequence_text"\), glossary\)/);
  assert.match(detail, /localizeComboText\(previewValue\(data, "mash_point"\), glossary\)/);
  assert.match(setupPage, /eyebrow="セットプレイ"/);
  assert.match(sequencePage, /eyebrow="連携"/);
});
