#!/usr/bin/env node
// ローカルQA用「派生パターン(通常/チャージ/パーフェクト)」データの生成。新規ファイルを書くだけ(既存データは変更しない)。
// 前提: GIF実体は v2-web/.sf6dna-local-qa-gif/luke/ に置いてある(gitignore済み)。技IDは公開用データから引く(増やさない)。
// 使い方: node scripts/gif-intake/build-local-qa-variants.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const read = (f) => JSON.parse(readFileSync(path.join(ROOT, f), "utf8"));
const moves = read("v2-web/src/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json").characters.luke.moves;
const inventory = read("scripts/gif-intake/asset-inventory-luke-manon-jp-20261116.json").records.filter((r) => r.character === "luke");
const gifDir = path.join(ROOT, "v2-web/.sf6dna-local-qa-gif/luke");
const info = (fileName, sourceFile, variantKey, observation) => {
  const bytes = readFileSync(path.join(gifDir, fileName));
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  const inv = inventory.find((r) => r.file === sourceFile);
  if (!inv || inv.sha256 !== sha256) throw new Error(`SHA-256が台帳と一致しません: ${sourceFile}`);
  return { variantKey, fileName, sha256, bytes: bytes.length, durationMs: inv.durationMs, sourceFile, observation };
};
const group = (slug, connection, variants, pendingReason) => {
  const m = moves.find((x) => x.slug === slug);
  if (!m) throw new Error(`公開用データに技がありません: ${slug}`);
  return { moveId: m.id, moveSlug: slug, connection, ...(pendingReason ? { pendingReason } : {}), variants };
};
const PENDING = "親の技(弱/中/強)の強度を映像だけでは確認できない。技カードには接続せず、表示方法の試作確認のみ。";
const groups = [
  // 親(通常版)が既にローカル接続済み → 切り替え表示まで可
  group("luke-aerial-flash-knuckle", "CONNECTED", [
    info("luke-aerial-flash-knuckle.gif", "22_47-luke-aerial-flash-knuckle.gif", "normal", "空中で前方へ進みヒット火花。接続済みの通常版(変更なし)。"),
    info("luke-aerial-flash-knuckle-charged.gif", "22_48-luke-aerial-flash-knuckle-charged.gif", "charged", "通常版と違い、構え→宙返りを含む動きと紫がかった火花。映像上は別パターンと判別できる。"),
  ]),
  // 親の強度が未確認 → 試作のみ
  ...[["l", "light", "弱"], ["m", "medium", "中"], ["h", "heavy", "強"]].map(([k, w, jp]) => {
    const n = { l: [35, 36, 37], m: [38, 39, 40], h: [41, 42, 43] }[k];
    return group(`luke-flash-knuckle-${k}`, "PENDING_PARENT_STRENGTH", [
      info(`luke-flash-knuckle-${k}-normal.gif`, `22_${n[0]}-luke-${w}-flash-knuckle.gif`, "normal", `${jp}フラッシュナックルの通常版候補(強度は未確認)。`),
      info(`luke-flash-knuckle-${k}-charged.gif`, `22_${n[1]}-luke-${w}-flash-knuckle-charged.gif`, "charged", k === "l" ? "通常版候補とほぼ同じ動き・同じ長さで、映像だけでは違いを判別しにくい。" : "チャージ版候補。"),
      info(`luke-flash-knuckle-${k}-perfect.gif`, `22_${n[2]}-luke-${w}-flash-knuckle-perfect.gif`, "perfect", "パーフェクト版候補(画面左下にSUCCESS表示を含むものがある)。"),
    ], PENDING);
  }),
];
const doc = { schemaVersion: 1, characterSlug: "luke", localQaOnly: true, approval: "NOT_APPROVED",
  note: "ローカルQA専用。公開承認ではない。同じ技IDに複数GIFを切り替えて見せる表示方法の検証用。技IDは増やしていない。", groups };
const out = path.join(ROOT, "v2-web/src/data/gif-intake/local-qa/SF6DNA_LOCAL_QA_GIF_LUKE_VARIANTS_20261116.json");
writeFileSync(out, JSON.stringify(doc, null, 2) + "\n");
console.log(`${groups.length} groups / ${groups.reduce((n, g) => n + g.variants.length, 0)} files -> ${path.relative(ROOT, out)}`);
