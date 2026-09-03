import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

function loadLocalizationModule() {
  const source = read("src/lib/detail-localization.ts");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const testModule = { exports: {} };
  vm.runInNewContext(output, {
    exports: testModule.exports,
    module: testModule,
  });
  return testModule.exports;
}

test("Move metadata is rendered with natural Japanese labels", () => {
  const localize = loadLocalizationModule();

  assert.equal(localize.localizeMoveType("target_combo"), "ターゲットコンボ");
  assert.equal(localize.localizeMoveStrength("od_heavy"), "OD強");
  assert.equal(localize.localizeMoveCancelType("chain, special, super"), "連打キャンセル・必殺技キャンセル・SAキャンセル");
  assert.equal(localize.localizeMoveHitLevel("high,overhead,high"), "上段・中段・上段");
  assert.equal(localize.localizeMoveInvincibility("1-8 Full, 9-10 Air"), "1～8F 完全無敵、9～10F 対空無敵");
  assert.equal(localize.localizeMoveInvincibility("6-20 Strike/Projectile"), "6～20F 打撃・飛び道具無敵");
});

test("Move and character guidance hides internal English review prose", () => {
  const localize = loadLocalizationModule();

  assert.equal(
    localize.localizeMoveText("Awaiting current official/in-game verification."),
    "現行版の公式情報または実機での確認待ちです。"
  );
  assert.equal(
    localize.localizeCharacterGuideText("Training進行"),
    "トレーニングの進め方"
  );
  assert.equal(
    localize.localizeCharacterGuideText("Drive 3本以下ではDリバを残す。"),
    "Dゲージ3本以下ではドライブリバーサルを残す。"
  );
  assert.equal(
    localize.localizeCharacterGuideText("Drive GaugeとSAを管理する。"),
    "DゲージとSAを管理する。"
  );
});

test("Move Preview detail remains token-gated, invoker-only, and read-only", () => {
  const sql = read("../supabase/migrations/20260903220227_phase44_move_japanese_preview.sql");

  assert.match(sql, /private\.is_phase23_device_preview\(\)/);
  assert.match(sql, /security invoker/i);
  assert.match(sql, /m\.status <> 'archived'/);
  assert.match(sql, /c\.status = 'published'/);
  assert.match(sql, /c\.is_playable = true/);
  assert.match(sql, /revoke all on function[\s\S]*from public/i);
  assert.match(sql, /grant execute on function[\s\S]*to anon/i);
  assert.doesNotMatch(sql, /\binsert\s+into\b|\bupdate\s+public\.|\bdelete\s+from\b/i);
});

test("Move motion media Preview can evaluate its public RLS helper", () => {
  const sql = read("../supabase/migrations/20260903220228_phase44_move_motion_media_preview_permission.sql");

  assert.match(sql, /grant execute on function private\.is_move_motion_media_public_ready\(uuid\)/i);
  assert.match(sql, /to anon, authenticated, service_role/i);
  assert.doesNotMatch(sql, /\binsert\s+into\b|\bupdate\s+public\.|\bdelete\s+from\b/i);
});

test("Move detail route forwards Preview token without weakening the public gate", () => {
  const page = read("src/app/moves/[slug]/page.tsx");
  const preview = read("src/lib/device-preview.ts");
  const detail = read("src/lib/content-detail.ts");

  assert.match(page, /normalizeDevicePreviewToken\(query\.preview\)/);
  assert.match(page, /!previewActive && !\(await isMovePublicReady\(slug\)\)/);
  assert.match(page, /getMoveBySlug\(slug, previewToken\)/);
  assert.match(page, /preview=\{previewActive\}/);
  assert.match(preview, /get_phase44_move_detail_preview/);
  assert.match(detail, /getDevicePreviewContentDetail\("move", slug, previewToken\)/);
  assert.match(detail, /localizeMoveCancelType/);
  assert.match(detail, /localizeMoveInvincibility/);
});

test("Character overview and Move list apply Japanese display localization", () => {
  const characters = read("src/lib/characters.ts");
  const sections = read("src/lib/character-sections.ts");
  const page = read("src/app/characters/[slug]/[section]/page.tsx");

  assert.match(characters, /localizeCharacterGuideText\(\s*row\.body,\s*moveGlossary,\s*\)/);
  assert.match(sections, /localizeMoveText\(row\.usageSummary\)/);
  assert.match(sections, /localizeTrainingType\(row\.trainingType\)/);
  assert.match(page, /classic: "クラシック"/);
  assert.match(page, /target_combo: "ターゲットコンボ"/);
});

test("Phase46 adds all character overviews without changing publication state", () => {
  const sql = read("../supabase/migrations/20260902004628_phase46_character_overview_and_japanese_copy.sql");
  assert.equal((sql.match(/^    \('/gm) ?? []).length, 31);
  assert.match(sql, /update public\.characters/);
  assert.match(sql, /strengths_summary/);
  assert.match(sql, /weaknesses_summary/);
  assert.doesNotMatch(sql, /set[\s\S]{0,100}status\s*=/i);
});

test("Phase47 keeps imported notes and supplies Japanese Move copy", () => {
  const sql = read("../supabase/migrations/20260902004632_phase47_move_japanese_explanations.sql");
  const detail = read("src/lib/content-detail.ts");
  const form = read("src/components/admin-move-form.tsx");
  assert.match(sql, /add column if not exists description_ja/);
  assert.match(sql, /add column if not exists usage_summary_ja/);
  assert.match(sql, /get_phase47_move_japanese_preview/);
  assert.doesNotMatch(sql, /update\s+public\.moves[\s\S]{0,120}set\s+status\s*=/i);
  assert.match(detail, /usage_summary_ja \?\? data\.description_ja/);
  assert.match(detail, /\["技の説明", data\.description_ja/);
  assert.match(form, /技の説明（日本語・画面表示用）/);
});

test("Move GIF storage is admin-only for writes and optional on detail pages", () => {
  const sql = read("../supabase/migrations/20260902004635_phase48_move_motion_storage.sql");
  const action = read("src/app/admin/moves/[id]/motion-actions.ts");
  const detail = read("src/components/simple-detail.tsx");
  assert.match(sql, /'move-motion-media'/);
  assert.match(sql, /array\['image\/gif', 'video\/mp4', 'video\/webm'\]/);
  assert.match(sql, /private\.is_admin\(\)/);
  assert.match(action, /maxUploadBytes = 25 \* 1024 \* 1024/);
  assert.match(action, /status.*draft.*reviewed/s);
  assert.match(detail, /detail\.media\?\.length/);
  assert.match(detail, /<h2>技の動き<\/h2>/);
});

test("Phase49 removes mechanical spacing and type-inappropriate guidance", () => {
  const sql = read("../supabase/migrations/20260902004745_phase49_move_japanese_copy_polish.sql");
  assert.match(sql, /move_type = 'throw'/);
  assert.match(sql, /move_type = 'taunt'/);
  assert.match(sql, /replace\(usage_summary_ja, '。 ', '。'\)/);
  assert.doesNotMatch(sql, /set\s+status\s*=/i);
});
