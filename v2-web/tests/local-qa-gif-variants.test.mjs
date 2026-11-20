// ローカルQA専用「派生パターン(通常/チャージ/パーフェクト)」の静的テスト。承認・公開を伴わず、技IDを増やさないことを確認する。
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, existsSync, mkdtempSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const json = (p) => JSON.parse(readFileSync(here(p), "utf8"));
const variantDoc = json("../src/data/gif-intake/local-qa/SF6DNA_LOCAL_QA_GIF_LUKE_VARIANTS_20261116.json");
const qaDoc = json("../src/data/gif-intake/local-qa/SF6DNA_LOCAL_QA_GIF_LUKE_20261116.json");
const fixture = json("../src/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json").characters.luke;

// TSの2ファイルをJSに変換して読み込む(@/ の別名は実ファイルへ置き換える)
async function loadLibs() {
  const dir = mkdtempSync(join(tmpdir(), "variants-test-"));
  const conv = (src, file, repl) => {
    let out = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
    for (const [a, b] of repl) out = out.split(a).join(b);
    writeFileSync(join(dir, file), out);
  };
  const base = readFileSync(here("../src/lib/local-qa-gif.ts"), "utf8");
  conv(base, "local-qa-gif.mjs", [["./official-txt-character-page-connection.mjs", pathToFileURL(here("../src/lib/official-txt-character-page-connection.mjs")).href]]);
  conv(readFileSync(here("../src/lib/local-qa-gif-variants.ts"), "utf8"), "variants.mjs", [["@/lib/local-qa-gif", "./local-qa-gif.mjs"]]);
  return import(pathToFileURL(join(dir, "variants.mjs")).href);
}
const moves = fixture.moves.map(({ id, slug }) => ({ id, slug }));

test("データは localQaOnly・NOT_APPROVED で、技IDは公開用データのものだけ(増やしていない)", () => {
  assert.equal(variantDoc.localQaOnly, true);
  assert.equal(variantDoc.approval, "NOT_APPROVED");
  const byId = new Map(fixture.moves.map((m) => [m.id, m.slug]));
  for (const g of variantDoc.groups) assert.equal(byId.get(g.moveId), g.moveSlug, g.moveSlug);
  assert.ok(!/approved_for_preview/.test(JSON.stringify(variantDoc)));
});

test("派生は7本で、登録SHA-256は技内で重複しない", () => {
  const derived = variantDoc.groups.flatMap((g) => g.variants.filter((v) => v.variantKey !== "normal"));
  assert.equal(derived.length, 7);
  for (const g of variantDoc.groups) {
    const shas = new Set();
    for (const v of g.variants) {
      assert.match(v.sha256, /^[a-f0-9]{64}$/);
      shas.add(v.sha256);
    }
    assert.equal(shas.size, g.variants.length, `${g.moveSlug} に同一内容がある`);
  }
});

test("ローカル保管の派生GIF実体と登録SHA-256が一致する", async (t) => {
  for (const variant of variantDoc.groups.flatMap(group => group.variants)) {
    const file = here(`../.sf6dna-local-qa-gif/luke/${variant.fileName}`);
    await t.test(variant.fileName, { skip: !existsSync(file) && "HOLD: ローカルQA素材未配置" }, () => {
      assert.equal(createHash("sha256").update(readFileSync(file)).digest("hex"), variant.sha256);
    });
  }
});

test("接続済みはエアリアルFKの1技だけで、通常版は既存の接続済みGIFと同一(差し替えない)。他はすべて試作のみ", () => {
  const connected = variantDoc.groups.filter((g) => g.connection === "CONNECTED");
  assert.deepEqual(connected.map((g) => g.moveSlug), ["luke-aerial-flash-knuckle"]);
  const parent = qaDoc.entries.find((e) => e.moveId === connected[0].moveId);
  const normal = connected[0].variants.find((v) => v.variantKey === "normal");
  assert.equal(normal.fileName, parent.fileName);
  assert.equal(normal.sha256, parent.sha256);
  // 試作のみの技は、技カード用QAデータ(15本)に入っていない = 技カードに接続していない
  const connectedIds = new Set(qaDoc.entries.map((e) => e.moveId));
  for (const g of variantDoc.groups.filter((x) => x.connection !== "CONNECTED")) {
    assert.ok(!connectedIds.has(g.moveId), g.moveSlug);
    assert.ok(g.pendingReason);
  }
});

test("planLocalQaVariantGroups: 正常は受理、MP4優先・不一致・重複・不正名・親差し替え・承認済み表記は除外", async () => {
  const m = await loadLibs();
  const base = { doc: variantDoc, moves, movesWithMedia: new Set(), connectedEntries: qaDoc.entries };
  const ok = m.planLocalQaVariantGroups(base);
  assert.equal(ok.accepted.length, 4);
  assert.equal(ok.skipped.length, 0);
  const g0 = variantDoc.groups[0]; // 接続済みの技
  const pend = variantDoc.groups[1];
  const run = (doc, extra = {}) => m.planLocalQaVariantGroups({ ...base, doc: { ...variantDoc, ...doc }, ...extra });
  assert.equal(run({ approval: "APPROVED" }).skipped[0].reason, "DOC_APPROVAL_NOT_NOT_APPROVED");
  assert.equal(run({ localQaOnly: false }).skipped[0].reason, "DOC_NOT_LOCAL_QA_ONLY");
  assert.equal(run({ groups: [{ ...pend, moveSlug: "luke-x" }] }).skipped[0].reason, "SLUG_MISMATCH");
  assert.equal(run({ groups: [{ ...pend, moveId: "00000000-0000-0000-0000-000000000000" }] }).skipped[0].reason, "MOVE_NOT_FOUND");
  // 試作のみの技が既存MP4/mediaを持つ → MP4優先で除外
  assert.equal(run({ groups: [pend] }, { movesWithMedia: new Set([pend.moveId]) }).skipped[0].reason, "MP4_PRIORITY_KEPT");
  assert.equal(run({ groups: [g0, g0] }).skipped[0].reason, "DUPLICATE_GROUP");
  assert.equal(run({ groups: [{ ...pend, variants: [pend.variants[0]] }] }).skipped[0].reason, "TOO_FEW_VARIANTS");
  assert.equal(run({ groups: [{ ...pend, variants: [{ ...pend.variants[0], fileName: "../x.gif" }, pend.variants[1]] }] }).skipped[0].reason, "UNSAFE_FILE_NAME");
  assert.equal(run({ groups: [{ ...pend, variants: [{ ...pend.variants[0], variantKey: "od" }, pend.variants[1]] }] }).skipped[0].reason, "INVALID_VARIANT_KEY");
  assert.equal(run({ groups: [{ ...pend, variants: [pend.variants[0], { ...pend.variants[1], variantKey: "normal" }] }] }).skipped[0].reason, "DUPLICATE_VARIANT_KEY");
  assert.equal(run({ groups: [{ ...pend, variants: [pend.variants[0], { ...pend.variants[1], sha256: pend.variants[0].sha256 }] }] }).skipped[0].reason, "DUPLICATE_CONTENT");
  // 接続済み扱いの技で通常版を別GIFにすると、既存の通常版を差し替えることになるため除外
  assert.equal(run({ groups: [{ ...g0, variants: [{ ...g0.variants[0], fileName: "luke-other.gif", sha256: "f".repeat(64) }, g0.variants[1]] }] }).skipped[0].reason, "PARENT_FILE_MISMATCH");
  assert.equal(run({ groups: [g0] }, { connectedEntries: [] }).skipped[0].reason, "PARENT_NOT_CONNECTED");
});

test("toVariantMotionMedia: 承認済みに見えないstatusで、公開用/media/ではなく隔離ルートを指す", async () => {
  const m = await loadLibs();
  const g = variantDoc.groups[0];
  const media = m.toVariantMotionMedia(g.variants[1], "luke", g.moveSlug, g.moveId, 1);
  assert.equal(media.status, "local_qa_not_approved");
  assert.equal(media.moveId, g.moveId);
  assert.ok(media.mediaUrl.startsWith("/internal/gif-qa/luke/media/"));
  assert.ok(!media.mediaUrl.startsWith("/media/"));
});

test("切り替え部品と派生ページは、公開ページ・技カード本体から参照されない(隔離ルートのみ)", () => {
  const used = ["../src/app/characters/[slug]/page.tsx", "../src/components/character-unified-page.tsx", "../src/lib/content-detail.ts"]
    .map((f) => readFileSync(here(f), "utf8")).join("\n");
  assert.ok(!/local-qa-variant-switcher|local-qa-gif-variants/.test(used));
});

test("QA用データ(派生)は import されず、実行時に読む(本番バンドルに入らない)", () => {
  const page = readFileSync(here("../src/app/internal/gif-qa/[slug]/variants/page.tsx"), "utf8");
  assert.ok(!/from "@\/data\/gif-intake/.test(page));
  const src = readFileSync(here("../src/lib/local-qa-gif-sources.ts"), "utf8");
  assert.match(src, /_VARIANTS_/); // ファイル名の規則(SF6DNA_LOCAL_QA_GIF_<SLUG>_VARIANTS_<日付>.json)で実行時に探す
  assert.match(src, /readFile/);
});

test("技カード本体への変更案(patch)は4ファイル(既存3 + 新規1)で、実ファイルは未変更", () => {
  const patch = readFileSync(here("../../scripts/gif-intake/proposals/card-media-variants.patch"), "utf8");
  const files = [...patch.matchAll(/^diff --git a\/(\S+) b\//gm)].map((m) => m[1]);
  assert.equal(files.length, 4);
  assert.ok(files.some((f) => f.endsWith("components/move-motion-variant-tabs.tsx")));
  for (const f of ["lib/device-preview.ts", "lib/character-unified-contract.ts", "components/character-unified-page.tsx"]) {
    assert.ok(files.some((x) => x.endsWith(f)), f);
  }
  // 既存の通常表示(MoveMotionMedia)を残し、パターンが2件未満なら従来どおりになる作り
  assert.match(patch, /variants\.length >= 2/);
  assert.match(patch, /\+\s+: media \? <MoveMotionMedia/);
  // 実ファイルは変更していない(提案のみ)
  const card = readFileSync(here("../src/components/character-unified-page.tsx"), "utf8");
  assert.ok(!/MoveMotionVariantTabs|unifiedMoveMediaVariants/.test(card));
  const dp = readFileSync(here("../src/lib/device-preview.ts"), "utf8");
  assert.ok(!/mediaVariants/.test(dp));
});
