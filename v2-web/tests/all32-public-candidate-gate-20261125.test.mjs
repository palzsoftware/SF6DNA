import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);
function realModule(file) {
  const result = { exports: {} };
  const script = ts.transpileModule(readFileSync(new URL(`../src/${file}`, import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  const dir = file.slice(0, file.lastIndexOf("/") + 1);
  new Function("module", "exports", "require", script)(result, result.exports, name => {
    if (name.endsWith(".json")) return { __esModule: true, default: JSON.parse(readFileSync(new URL(`../src/${name.replace(/^@\//, "")}`, import.meta.url), "utf8")) };
    const local = name.startsWith("@/") ? name.slice(2) : name.startsWith(".") ? new URL(name, `file:///${dir}`).pathname.slice(1) : null;
    if (local) return realModule(local + (existsSync(new URL(`../src/${local}.tsx`, import.meta.url)) ? ".tsx" : ".ts"));
    return require(name);
  });
  return result.exports;
}
const approval = realModule("lib/production-character-approval.ts");
const { resolveReleaseCharacterMoves } = realModule("lib/release-character-move-resolver.ts");
const { unifiedControlInputFallback } = realModule("lib/character-unified-contract.ts");

const digest = "a".repeat(64);
const grantMove = (extra = {}) => ({ id: "m1", slug: "m1", factDigest: digest, identityConfirmed: true, commandEvidence: "APPROVED_CURRENT", frameEvidence: "APPROVED_CURRENT", sourceStatus: "APPROVED_CURRENT", ...extra });
const registry = moves => ({ schemaVersion: 1, releaseId: "SF6DNA_VER1_0", baseRcSha: "d929501ee45b86e2f2b18d7efc09381e7b4d8cb6",
  characters: [{ characterId: "c1", slug: "c", approved: true, revoked: false, patchId: "p1", approvalRef: "r", approvedBy: "b", approvedAt: "2026-11-25T00:00:00Z",
    checkpointId: "x", checkpointHash: digest, candidateHash: digest, expectedCount: moves.length, moves }] });

test("ledger: commandScheme is optional and only modern_only is accepted", () => {
  assert.equal(approval.validateApprovalRegistry(registry([grantMove()])), true);
  assert.equal(approval.validateApprovalRegistry(registry([grantMove({ commandScheme: "modern_only" })])), true);
  assert.equal(approval.validateApprovalRegistry(registry([grantMove({ commandScheme: "classic" })])), false);
  assert.equal(approval.validateApprovalRegistry(registry([grantMove({ commandScheme: "any" })])), false);
});

const source = (entityType, entityId) => ({ entityType, entityId, sourceId: "s1", relationship: "primary", title: "t", url: "https://www.streetfighter.com/6/ja-jp/character/c/frame", sourceType: "official_frame_data", publisher: "CAPCOM", publishedAt: null, accessedAt: null, reliabilityLevel: "official" });
function proof(scheme) {
  const move = { id: "m1", slug: "m1", status: "published", frame: { verificationStatus: "verified" } };
  const p = { move, characterId: "c1", patchId: "p1", rawMove: { id: "m1", character_id: "c1", status: "published" },
    commands: [{ id: "k1", move_id: "m1", control_scheme: scheme }], frames: [{ id: "f1", move_id: "m1", valid_from_patch_id: "p1", valid_to_patch_id: null, verification_status: "verified" }],
    sources: [source("move", "m1"), source("move_command", "k1"), source("move_frame_data", "f1")] };
  return p;
}
test("grant: a modern_only grant binds the Modern command; a plain grant still requires Classic", () => {
  const modern = proof("modern"), classic = proof("classic");
  const g = extra => registry([grantMove({ factDigest: approval.productionFactDigest(extra.p), ...extra.m })]).characters[0];
  assert.equal(approval.isProductionMoveApproved(g({ p: modern, m: { commandScheme: "modern_only" } }), modern), true);
  assert.equal(approval.isProductionMoveApproved(g({ p: modern, m: {} }), modern), false, "Modern alone never passes a plain grant");
  assert.equal(approval.isProductionMoveApproved(g({ p: classic, m: { commandScheme: "modern_only" } }), classic), false);
  assert.equal(approval.isProductionMoveApproved(g({ p: classic, m: {} }), classic), true);
  const changed = { ...modern, frames: [{ ...modern.frames[0], damage_official_condition: "改ざん" }] };
  assert.equal(approval.isProductionMoveApproved(g({ p: modern, m: { commandScheme: "modern_only" } }), changed), false, "evidence columns are bound by the digest");
});

const base = { characterId: "c1", currentPatchId: "p1", gateReadyIds: new Set(["m1"]), officialCommandIds: new Set(["k1"]), officialFrameIds: new Set(["f1"]),
  moves: [{ id: "m1", character_id: "c1", slug: "m1", name_ja: "技", move_type: "normal", status: "published" }],
  frames: [{ id: "f1", move_id: "m1", valid_from_patch_id: "p1", valid_to_patch_id: null, verification_status: "verified", startup: "6", active: null, recovery: null, on_hit: null, on_block: null, damage: null,
    damage_official_text: "※1100", damage_official_condition: "※持続の3F目以降は個別ダメージ（800）" }] };
test("resolver: Modern-only only for listed moves; marked damage is kept as written with its condition", () => {
  const modern = [{ id: "k1", move_id: "m1", control_scheme: "modern", command_text: "3＋強", numeric_notation: null, button_notation: null, condition_text: null, sort_order: 0 }];
  assert.deepEqual(resolveReleaseCharacterMoves({ ...base, commands: modern }), [], "unchanged rule: no Classic, no card");
  const [move] = resolveReleaseCharacterMoves({ ...base, commands: modern, modernOnlyIds: new Set(["m1"]) });
  assert.equal(move.officialControl, "modern_only");
  assert.equal(move.frame.damage, "※1100");
  assert.equal(move.damageCondition, "※持続の3F目以降は個別ダメージ（800）");
  assert.equal(unifiedControlInputFallback("classic", move), "Classic表に掲載なし（公式表はModernのみ）");
  const [plain] = resolveReleaseCharacterMoves({ ...base, frames: [{ ...base.frames[0], damage: 900 }],
    commands: [{ ...modern[0], control_scheme: "classic", command_text: "2HK" }] });
  assert.equal(plain.frame.damage, 900, "a numeric damage is never replaced by the notation");
  assert.equal(plain.damageCondition, undefined);
});

test("page: production evidence comes only from moves that passed the gate and their grant", () => {
  const page = readFileSync(new URL("../src/app/characters/[slug]/page.tsx", import.meta.url), "utf8");
  assert.match(page, /move\.publicEvidence \? \[\[move\.id, move\.publicEvidence\]\]/);
  const loader = readFileSync(new URL("../src/lib/character-detail-data.ts", import.meta.url), "utf8");
  assert.match(loader, /if \(!isProductionMoveApproved\([\s\S]*?\)\) return \[\];\s*return \[\{ \.\.\.move, publicEvidence: grantedMoveEvidence/);
  assert.match(loader, /code === "42703"/, "frames are read as before until the evidence columns exist");
});

test("move detail never labels a version-unconfirmed frame with the site's current patch", () => {
  const detail = readFileSync(new URL("../src/lib/content-detail.ts", import.meta.url), "utf8");
  assert.match(detail, /const unconfirmedVersion = frame\?\.version_status === "unconfirmed";/);
  assert.match(detail, /frame\.valid_from_patch_id && !unconfirmedVersion/, "the patch row is not even read for such a frame");
  assert.match(detail, /対応バージョン未確定（公式フレーム表/);
  assert.match(detail, /code === "42703" \? await query\(MOVE_FRAME_COLUMNS\)/, "read as before until the evidence columns exist");
});

test("JP: the stale table note is shown with the 2026.08.03 change (アクノ also cancelable); other notes untouched", () => {
  const { correctedOfficialNote } = realModule("lib/official-note-corrections.ts");
  const { officialMoveDisplayNotes } = realModule("lib/official-move-display-notes.ts");
  const fixed = correctedOfficialNote("jp:web:107", "連打キャンセル対応 ※ヴィーハト・チェーニのみキャンセル可能");
  assert.match(fixed, /^連打キャンセル対応 ヴィーハト・チェーニ、ヴィーハト・アクノにキャンセル可能（2026\.08\.03 公式バトル変更リストによる。公式フレーム表の備考「ヴィーハト・チェーニのみキャンセル可能」は未更新）$/);
  assert.equal(correctedOfficialNote("jp:web:999", "※ヴィーハト・チェーニのみキャンセル可能"), "※ヴィーハト・チェーニのみキャンセル可能", "only the four reviewed moves");
  assert.deepEqual(officialMoveDisplayNotes({ ws5CanonicalSource: "jp:web:102", ws5OfficialRawRecord: { note: ["※ヴィーハト・チェーニのみキャンセル可能"] } }),
    [correctedOfficialNote("jp:web:102", "※ヴィーハト・チェーニのみキャンセル可能")]);
});

test("local fill never shows a total frame value from the page's embedded data", () => {
  const fill = readFileSync(new URL("../src/lib/all32-official-move-fill.ts", import.meta.url), "utf8");
  assert.match(fill, /const FILL_FIELDS: readonly FillField\[\] = \["startup", "active", "recovery", "onHit", "onBlock", "damage"\];/);
});
