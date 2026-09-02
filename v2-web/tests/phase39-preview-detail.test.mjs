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

test("all five detail routes normalize and forward the Preview token", () => {
  for (const path of [
    "src/app/combos/[slug]/page.tsx",
    "src/app/setups/[slug]/page.tsx",
    "src/app/sequences/[slug]/page.tsx",
    "src/app/counters/[slug]/page.tsx",
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
  assert.match(detail, /localizeSetupDetail\("starter_condition", previewValue\(data, "starter_condition"\), glossary\)/);
  assert.match(detail, /localizeSetupDetail\("frame_advantage", previewValue\(data, "frame_advantage"\), glossary\)/);
  assert.match(detail, /localizeComboText\(previewValue\(data, "sequence_text"\), glossary\)/);
  assert.match(detail, /localizeSequenceDetail\("mash_point", previewValue\(data, "mash_point"\), glossary\)/);
  assert.match(setupPage, /eyebrow="セットプレイ"/);
  assert.match(sequencePage, /eyebrow="連携"/);
});

test("Sequence fields use natural Japanese instead of mechanical yes-no labels", () => {
  const localization = read("src/lib/detail-localization.ts");
  const detail = read("src/lib/content-detail.ts");

  assert.match(localization, /連続ガードになる/);
  assert.match(localization, /連続ガードではない/);
  assert.match(localization, /その場で様子を見る/);
  assert.match(localization, /技の強度によって割り込める箇所が変わる/);
  assert.match(localization, /有利時はメキシカンタイフーンを狙う/);
  assert.match(localization, /drive_rush: "ドライブラッシュ連携"/);
  assert.match(localization, /drive_rush: "ドライブラッシュ対策"/);
  assert.match(localization, /正確な距離と連携の隙間は、トレーニングモードで確認が必要です/);
  assert.match(localization, /検証済みのフレーム情報を目安に/);
  assert.match(localization, /地雷の有無で変わる派生は、一部が実機確認待ちです/);
  assert.match(detail, /localizeSetupType\(previewValue\(data, "setup_type"\)\)/);
  assert.match(detail, /localizeSequenceType\(previewValue\(data, "sequence_type"\)\)/);
  assert.match(localization, /safeLiteralPattern/);
  assert.doesNotMatch(detail, /trueBlockstring === true \? "はい"/);
  assert.doesNotMatch(detail, /trueBlockstring === false \? "いいえ"/);
  assert.match(detail, /\["ガード時の状態", localizeBlockstring/);
  assert.match(detail, /\["シミー／様子見"/);
  assert.match(detail, /\["ドライブリバーサルへの対応"/);
});

test("field-specific localization returns natural Japanese for representative stored values", () => {
  const localization = loadLocalizationModule();

  assert.equal(localization.localizeBlockstring(false), "連続ガードではない");
  assert.equal(localization.localizeSetupType("spray"), "スプレー設置");
  assert.equal(localization.localizeSequenceType("drive_rush"), "ドライブラッシュ連携");
  assert.equal(localization.localizeCounterType("drive_rush"), "ドライブラッシュ対策");
  assert.equal(localization.localizeCounterText("Drive Impact"), "ドライブインパクト");
  assert.equal(
    localization.localizeCounterText("Exact distance/gap remains training dependent."),
    "正確な距離と連携の隙間は、トレーニングモードで確認が必要です。"
  );
  assert.equal(
    localization.localizeSetupDetail("frame_advantage", "Source guard +4 hit +8 claim"),
    "ガード時+4F／ヒット時+8F（資料記載）"
  );
  assert.equal(
    localization.localizeSetupDetail("frame_advantage", "hit +7 / guard 0 claim"),
    "ヒット時+7F／ガード時±0F（資料記載）"
  );
  assert.equal(localization.localizeSetupDetail("meter_condition", "Drive 1+"), "Dゲージ1本以上");
  assert.equal(localization.localizeComboText("slight hold"), "少し溜める");
  assert.equal(localization.localizeSourceType("community_frame_database"), "コミュニティフレームデータ");
  assert.equal(localization.localizeSourceRelationship("corroborating"), "裏付け資料");
  assert.equal(localization.localizeCounterText("JP vs ケン 対面対策"), "JP使用時のケン対策");

  const matchupMethod = localization.localizeCounterText(
    "jp-vs-ken-approach / punish / air / corner / zoning をTrainingで再現し、確定・相打ち・読み・不成立を区別する。"
  );
  assert.doesNotMatch(matchupMethod, /jp-vs-ken|Training|読み・不成立/);
  assert.match(matchupMethod, /接近阻止・確定反撃・対空・画面端・遠距離戦/);

  const matchupCondition = localization.localizeCounterText(
    "2026.08.03以降。子Counter5件を参照。実機確認前はverified\/publishedへ昇格しない。"
  );
  assert.doesNotMatch(matchupCondition, /子Counter|verified|published|昇格/);
  assert.match(matchupCondition, /関連する5件の対策/);
});

test("Counter detail Preview remains token-gated and keeps draft data unpublished", () => {
  const sql = read("../supabase/migrations/20260901_phase42_counter_japanese_detail_preview.sql");
  const preview = read("src/lib/device-preview.ts");
  const detail = read("src/lib/content-detail.ts");
  const page = read("src/app/counters/[slug]/page.tsx");

  assert.match(sql, /private\.is_phase23_device_preview\(\)/);
  assert.match(sql, /security invoker/i);
  assert.match(sql, /x\.status <> 'archived'/);
  assert.match(sql, /having count\(distinct japanese\) = 1/i);
  assert.match(sql, /revoke all on function[\s\S]*from public/i);
  assert.match(sql, /revoke all on function[\s\S]*from authenticated/i);
  assert.match(sql, /grant execute on function[\s\S]*to anon/i);
  assert.doesNotMatch(sql, /\binsert\s+into\b|\bupdate\s+public\.|\bdelete\s+from\b/i);
  assert.match(preview, /get_phase42_counter_detail_preview/);
  assert.match(detail, /getDevicePreviewContentDetail\("counter", slug, previewToken\)/);
  assert.match(detail, /localizeCounterText/);
  assert.match(page, /eyebrow="キャラ対策"/);
  assert.match(page, /preview=\{isDevicePreviewRequest\(previewToken\)\}/);
});

test("Training Preview localizes internal codes and English settings without changing source rows", () => {
  const sql = read("../supabase/migrations/20260901_phase43_training_japanese_preview.sql");
  const preview = read("src/lib/device-preview.ts");
  const detail = read("src/lib/content-detail.ts");
  const sections = read("src/lib/character-sections.ts");
  const localization = loadLocalizationModule();

  assert.match(sql, /private\.is_phase23_device_preview\(\)/);
  assert.match(sql, /security invoker/i);
  assert.match(sql, /c\.status = 'published'/);
  assert.match(sql, /c\.is_playable = true/);
  assert.match(sql, /revoke all on function[\s\S]*from public/i);
  assert.match(sql, /revoke all on function[\s\S]*from authenticated/i);
  assert.match(sql, /grant execute on function[\s\S]*to anon/i);
  assert.doesNotMatch(sql, /\binsert\s+into\b|\bupdate\s+public\.|\bdelete\s+from\b/i);
  assert.match(preview, /get_phase43_character_move_glossary_preview/);
  assert.match(detail, /localizeTrainingType/);
  assert.match(detail, /localizeTrainingLevel/);
  assert.match(detail, /localizeTrainingText/);
  assert.match(sections, /localizeTrainingText/);

  assert.equal(localization.localizeTrainingType("combo_retest"), "コンボの実機確認");
  assert.equal(localization.localizeTrainingType("pressure_retest"), "連携の実機確認");
  assert.equal(localization.localizeTrainingType("instructional_media"), "初心者向け解説素材");
  assert.equal(localization.localizeTrainingLevel("advanced"), "上級者向け");
  assert.equal(
    localization.localizeTrainingText("playback_settings", "Frame Meter ON。"),
    "フレームメーター：オン。"
  );
  assert.equal(
    localization.localizeTrainingText("recording_instructions", "ダミー立ち、Guard OFF。"),
    "ダミーを立ち状態にし、ガード：オフ。"
  );
  assert.equal(
    localization.localizeTrainingText("next_step", "成立ならverified候補。不成立ならarchived。"),
    "成立した場合は検証候補にし、不成立ならアーカイブします。"
  );
  assert.equal(
    localization.localizeTrainingText("purpose", "文章・画像から収集した攻略の2026-08-03版成立を確定する。"),
    "文章・画像で確認した内容が、2026.08.03版でも成立するか確認します。"
  );
  assert.equal(
    localization.localizeTrainingText("playback_settings", "4F、ジャンプ、バクステ、パリィ、Dリバ、DI、無敵を必要時に録画。"),
    "4F技、ジャンプ、バックステップ、パリィ、ドライブリバーサル、ドライブインパクト、無敵技を必要に応じて録画します。"
  );
  assert.equal(
    localization.localizeTrainingText("purpose", "中足Cラッシュから生DRとDIの使い分けを覚える"),
    "中足キャンセルラッシュから生ドライブラッシュとドライブインパクトの使い分けを覚える"
  );
  assert.equal(
    localization.localizeTrainingText("method", "立ち強P PC時としゃがみ中P CH時を交互に確認する。"),
    "立ち強P パニッシュカウンター時としゃがみ中P カウンターヒット時を交互に確認する。"
  );
});
