import assert from "node:assert/strict";
import test from "node:test";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, renameSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { inspectGif, sha256Hex } from "../../scripts/luke-gif/gif-inspect.mjs";
import { applyConnection, buildGifManifest, classifyFiles, mergeLock, validateApprovals } from "../../scripts/luke-gif/verify-luke-gifs.mjs";
import { validateMotionMediaManifest } from "../../scripts/validate-motion-media.mjs";

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const json = (p) => JSON.parse(readFileSync(here(p), "utf8"));
const mapping = json("../../scripts/luke-gif/luke-gif-mapping.json");
const approvals = json("../../scripts/luke-gif/luke-gif-approvals.json");
const fixtureMoves = json("../src/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json").characters.luke.moves;
const mp4Manifest = json("../src/data/SF6DNA_VER1_LUKE_MEDIA_MANIFEST_20260924.json");
const gifManifest = json("../src/data/SF6DNA_VER1_LUKE_GIF_MANIFEST_20261116.json");
const loader = readFileSync(here("../src/lib/preview-motion-media-pilot.ts"), "utf8");
const lockPath = here("../../scripts/luke-gif/luke-gif-lock.json");

/** 手組みの最小GIF。映像は持たないが、検査が見るブロック構造は本物と同じ。 */
function makeGif({ w = 480, h = 270, delays = [5, 5, 5], loop = 0, trailer = true } = {}) {
  const parts = [Buffer.from("GIF89a"), Buffer.from([w & 255, w >> 8, h & 255, h >> 8, 0x80, 0, 0]), Buffer.from([0, 0, 0, 255, 255, 255])];
  if (loop !== null) parts.push(Buffer.from([0x21, 0xff, 11]), Buffer.from("NETSCAPE2.0"), Buffer.from([3, 1, loop & 255, loop >> 8, 0]));
  for (const d of delays) {
    parts.push(Buffer.from([0x21, 0xf9, 4, 0, d & 255, d >> 8, 0, 0]));
    parts.push(Buffer.from([0x2c, 0, 0, 0, 0, w & 255, w >> 8, h & 255, h >> 8, 0, 0x02, 0x02, 0x44, 0x01, 0x00]));
  }
  if (trailer) parts.push(Buffer.from([0x3b]));
  return Buffer.concat(parts);
}

test("GIF inspector reads frames, size, loop and duration from the bytes", () => {
  const r = inspectGif(makeGif({ delays: [5, 5, 10], loop: 0 }));
  assert.deepEqual([r.ok, r.frames, r.width, r.height, r.loopCount, r.durationMs], [true, 3, 480, 270, 0, 200]);
  assert.equal(inspectGif(makeGif({ loop: null })).loopCount, null);
  assert.equal(inspectGif(makeGif({ delays: [0] })).durationMs, 100, "delay 0 is shown as 0.1s by browsers");
});

test("GIF inspector rejects non-GIF, cut-off and empty files", () => {
  assert.ok(inspectGif(Buffer.from("<html>sign in</html>")).errors[0].startsWith("NOT_GIF"));
  const full = makeGif();
  assert.ok(inspectGif(full.subarray(0, full.length - 1)).errors.some((e) => e.includes("missing trailer")));
  assert.ok(inspectGif(full.subarray(0, 60)).errors.some((e) => e.startsWith("INVALID_GIF")));
  assert.equal(inspectGif(makeGif({ delays: [] })).ok, false);
});

// --- 分類ロジック(合成データ) ---
const synthMapping = {
  mp4MaintainedSlugs: ["luke-nose-breaker"],
  files: [
    ["ok.gif", "luke-standing-lp", "candidate"],
    ["kept.gif", "luke-nose-breaker", "candidate"],
    ["missing.gif", "luke-standing-lk", "candidate"],
    ["dup-a.gif", "luke-standing-mp", "candidate"],
    ["dup-b.gif", "luke-standing-mk", "candidate"],
    ["noloop.gif", "luke-standing-hk", "candidate"],
    ["one.gif", "luke-crouching-lp", "candidate"],
    ["cut.gif", "luke-crouching-lk", "candidate"],
    ["badslug.gif", "luke-does-not-exist", "candidate"],
    ["unconfirmed.gif", "luke-crouching-hk", "unconfirmed_mapping"],
    ["old.gif", "luke-standing-hp", "suspected_old"],
    ["alt.gif", "luke-sa1-vulcan-blast", "alt_version"],
    ["nomatch.gif", null, "no_move_match"],
  ].map(([driveTitle, slug, role]) => ({ driveTitle, slug, role, expectedSize: 0, fetch: true })),
};

function runSynthetic({ lock = null, tweak = () => {} } = {}) {
  const dir = mkdtempSync(path.join(tmpdir(), "luke-gif-"));
  const dup = makeGif({ delays: [5, 5, 7] });
  const bytes = {
    "ok.gif": makeGif({ delays: [4, 4] }), "kept.gif": makeGif({ delays: [6, 6] }),
    "dup-a.gif": dup, "dup-b.gif": dup,
    "noloop.gif": makeGif({ loop: null }), "one.gif": makeGif({ delays: [5] }),
    "cut.gif": makeGif({ trailer: false }),
    "unconfirmed.gif": makeGif({ delays: [3, 3] }), "old.gif": makeGif({ delays: [8, 8] }),
    "alt.gif": makeGif({ delays: [9, 9] }), "nomatch.gif": makeGif({ delays: [2, 2] }),
  };
  tweak(bytes);
  for (const [name, buf] of Object.entries(bytes)) writeFileSync(path.join(dir, name), buf);
  const m = { ...synthMapping, files: synthMapping.files.map((f) => ({ ...f, expectedSize: bytes[f.driveTitle]?.length ?? 1234 })) };
  const moves = [...fixtureMoves, ...[]];
  const byTitle = Object.fromEntries(classifyFiles({ mapping: m, fixtureMoves: moves, lock, findFile: (t) => (existsSync(path.join(dir, t)) ? path.join(dir, t) : null) }).map((r) => [r.title, r]));
  return { byTitle, bytes };
}

test("only a clean candidate becomes CONNECTABLE; every fault is named and blocks", () => {
  const { byTitle: r } = runSynthetic();
  assert.equal(r["ok.gif"].status, "CONNECTABLE");
  assert.equal(r["kept.gif"].status, "GIF_AVAILABLE_MP4_KEPT", "existing MP4 stays; GIF is not connected on top");
  assert.match(r["missing.gif"].reasons.join(), /MISSING/);
  assert.match(r["dup-a.gif"].reasons.join(), /DUPLICATE_CONTENT/);
  assert.match(r["dup-b.gif"].reasons.join(), /DUPLICATE_CONTENT/);
  assert.match(r["noloop.gif"].reasons.join(), /NO_LOOP/);
  assert.match(r["one.gif"].reasons.join(), /SINGLE_FRAME/);
  assert.match(r["cut.gif"].reasons.join(), /INVALID_GIF/);
  assert.match(r["badslug.gif"].reasons.join(), /SLUG_NOT_IN_FIXTURE/);
  for (const t of ["missing.gif", "dup-a.gif", "dup-b.gif", "noloop.gif", "one.gif", "cut.gif", "badslug.gif"]) assert.equal(r[t].status, "BLOCKED", t);
});

test("held / old / alternative / unmatched GIFs are never CONNECTABLE even when they are valid files", () => {
  const { byTitle: r } = runSynthetic();
  assert.equal(r["unconfirmed.gif"].status, "HOLD_UNCONFIRMED_MAPPING");
  assert.equal(r["old.gif"].status, "EXCLUDED_SUSPECTED_OLD");
  assert.equal(r["alt.gif"].status, "NOT_USED_ALT_VERSION");
  assert.equal(r["nomatch.gif"].status, "NO_MOVE_MATCH");
});

test("size mismatch and a changed file after the SHA lock are blocked", () => {
  const first = runSynthetic();
  const lock = { files: { "ok.gif": { sha256: first.byTitle["ok.gif"].sha256 } } };
  assert.equal(runSynthetic({ lock }).byTitle["ok.gif"].status, "CONNECTABLE");
  const changed = runSynthetic({ lock, tweak: (b) => { b["ok.gif"] = makeGif({ delays: [4, 4, 4] }); } });
  assert.match(changed.byTitle["ok.gif"].reasons.join(), /SHA_MISMATCH_LOCK/);
  assert.equal(changed.byTitle["ok.gif"].status, "BLOCKED");
  assert.equal(sha256Hex(Buffer.from("a")).length, 64);
});

test("manifest builder: only approved slugs are shown; the output passes the shared motion-media validator", () => {
  const { byTitle } = runSynthetic();
  const connectable = [byTitle["ok.gif"]];
  const manifest = buildGifManifest({ connectable, fixtureMoves, approvedSlugs: [] });
  assert.equal(manifest.clips[0].verification_status, "capture_received");
  assert.deepEqual(validateMotionMediaManifest(manifest, { checkFiles: false }).errors, []);
  const approved = buildGifManifest({ connectable, fixtureMoves, approvedSlugs: ["luke-standing-lp"] });
  assert.equal(approved.clips[0].verification_status, "approved_for_preview");
  assert.equal(approved.clips[0].media_url, "/media/moves/luke/gif/luke-standing-lp.gif");
  assert.equal(approved.clips[0].move_id, fixtureMoves.find((m) => m.slug === "luke-standing-lp").id);
});

// --- 実データの整合性(いまのリポジトリ) ---
test("mapping covers all 50 Luke moves exactly once and follows the confirmed policy", () => {
  assert.equal(fixtureMoves.length, 50);
  const slugs = new Set(fixtureMoves.map((m) => m.slug));
  const candidates = mapping.files.filter((f) => f.role === "candidate");
  const unconfirmed = mapping.files.filter((f) => f.role === "unconfirmed_mapping");
  const candidateSlugs = candidates.map((f) => f.slug);
  assert.equal(new Set(candidateSlugs).size, candidateSlugs.length, "one candidate GIF per move");
  const covered = [...candidateSlugs, ...unconfirmed.map((f) => f.slug), ...mapping.holdNoAssetSlugs];
  assert.deepEqual([...covered].sort(), [...slugs].sort(), "every move is a candidate, unconfirmed, or no-asset HOLD");
  for (const f of mapping.files.filter((x) => x.slug)) assert.ok(slugs.has(f.slug), f.slug);
  assert.deepEqual(unconfirmed.map((f) => f.driveTitle).sort(), ["22_12-luke-trench-break.gif", "22_45-luke-od-flash-knuckle-followup.gif"]);
  assert.deepEqual(mapping.files.filter((f) => f.role === "suspected_old").map((f) => f.driveTitle).sort(), ["22_18-luke-jumping-hk.gif", "22_5-luke-standing-hp.gif"]);
  assert.deepEqual([...mapping.holdNoAssetSlugs].sort(), ["luke-back-throw", "luke-forward-hp", "luke-forward-hp-hp", "luke-forward-throw"]);
  assert.deepEqual(candidates.filter((f) => /^luke-sa[123]-/.test(f.slug)).map((f) => f.driveTitle).sort(), ["luke-sa1-balanced.gif", "luke-sa2-balanced.gif", "luke-sa3-balanced.gif"]);
  assert.equal(new Set(mapping.files.map((f) => f.driveId)).size, mapping.files.length);
  assert.equal(new Set(mapping.files.map((f) => f.driveTitle)).size, mapping.files.length);
  assert.equal(mapping.files.length, 71);
});

test("existing MP4 connections stay as they are and are listed as maintained", () => {
  assert.deepEqual([...mapping.mp4MaintainedSlugs].sort(), mp4Manifest.clips.map((c) => c.move_slug).sort());
  assert.equal(mp4Manifest.clips.length, 6);
  const idBySlug = new Map(fixtureMoves.map((m) => [m.slug, m.id]));
  for (const clip of mp4Manifest.clips) assert.equal(idBySlug.get(clip.move_slug), clip.move_id);
});

test("the committed GIF manifest is either empty (pending) or fully consistent with files, lock, fixture and approvals", () => {
  assert.equal(gifManifest.character_slug, "luke");
  if (gifManifest.clips.length === 0) {
    assert.deepEqual(gifManifest.source_files, [], "nothing is connected before the verified run");
    return;
  }
  const publicRoot = here("../public/");
  assert.deepEqual(validateMotionMediaManifest(gifManifest, { publicRoot }).errors, []);
  const idBySlug = new Map(fixtureMoves.map((m) => [m.slug, m.id]));
  const mp4Ids = new Set(mp4Manifest.clips.map((c) => c.move_id));
  const allowed = new Set(mapping.files.filter((f) => f.role === "candidate").map((f) => f.slug));
  assert.ok(existsSync(lockPath), "SHA lock is required once GIFs are connected");
  const lock = JSON.parse(readFileSync(lockPath, "utf8"));
  const bySource = new Map(gifManifest.source_files.map((s) => [s.filename, s.sha256]));
  for (const clip of gifManifest.clips) {
    assert.equal(clip.media_type, "gif");
    assert.equal(idBySlug.get(clip.move_slug), clip.move_id, `${clip.move_slug}: id/slug mismatch`);
    assert.ok(allowed.has(clip.move_slug), `${clip.move_slug}: not a confirmed candidate`);
    assert.ok(!mp4Ids.has(clip.move_id), `${clip.move_slug}: already has an MP4`);
    assert.equal(lock.files[clip.source_file]?.sha256, bySource.get(clip.source_file), `${clip.move_slug}: SHA not locked`);
    assert.equal(sha256Hex(readFileSync(path.join(publicRoot, clip.media_url))), bySource.get(clip.source_file), `${clip.move_slug}: file content changed`);
    if (clip.verification_status === "approved_for_preview") assert.ok(approvals.approvedSlugs.includes(clip.move_slug), `${clip.move_slug}: shown without approval`);
  }
  for (const slug of approvals.approvedSlugs) assert.ok(gifManifest.clips.some((c) => c.move_slug === slug), `${slug}: approved but not connected`);
});

test("loader keeps the Preview-only gate, leaves the MP4 path intact and adds GIFs for Luke only", () => {
  assert.match(loader, /characterId === LUKE_CHARACTER_ID && lukeManifest.character_slug === "luke"/);
  assert.match(loader, /filter\(\(clip\) => clip.verification_status === "approved_for_preview"\)/);
  assert.match(loader, /import lukeGifManifest from "@\/data\/SF6DNA_VER1_LUKE_GIF_MANIFEST_20261116.json"/);
  assert.match(loader, /if \(characterId !== LUKE_CHARACTER_ID\) return records;/);
  assert.match(loader, /!movesWithMp4\.has\(clip\.move_id\)/);
  const flags = readFileSync(here("../src/lib/release-features.ts"), "utf8");
  for (const f of ["aiCoach", "training", "publicStrategyContent"]) assert.match(flags, new RegExp(`${f}: false`));
});

// ======================================================================
// 段階分離(ロック作成 / 目視承認 / 反映)と、安全な反映のテスト
// ======================================================================
const MANIFEST_REL = "v2-web/src/data/SF6DNA_VER1_LUKE_GIF_MANIFEST_20261116.json";
const GIF_DIR_REL = "v2-web/public/media/moves/luke/gif";
const PENDING = '{"manifest_version":"1.0","character_slug":"luke","source_owner":"user_capture","captured_patch":"2026.08.03","capture_date":"2026-11-13","source_files":[],"clips":[]}\n';
const listDir = (d) => (existsSync(d) ? readdirSync(d).sort() : null);

/** 合成リポジトリ(取り込み先)と、合成GIF2本(a=luke-standing-lp, b=luke-standing-mp)を作る。 */
function applySetup() {
  const root = mkdtempSync(path.join(tmpdir(), "luke-apply-"));
  const src = path.join(root, "src"); const repo = path.join(root, "repo"); const stage = path.join(root, "stage");
  mkdirSync(src); mkdirSync(path.join(repo, "v2-web/src/data"), { recursive: true });
  writeFileSync(path.join(repo, MANIFEST_REL), PENDING);
  const bytes = { "a.gif": makeGif({ delays: [4, 4] }), "b.gif": makeGif({ delays: [6, 6, 6] }) };
  for (const [n, b] of Object.entries(bytes)) writeFileSync(path.join(src, n), b);
  const m = { mp4MaintainedSlugs: [], files: [["a.gif", "luke-standing-lp"], ["b.gif", "luke-standing-mp"]].map(([driveTitle, slug]) => ({ driveTitle, slug, role: "candidate", expectedSize: bytes[driveTitle].length, fetch: true })) };
  const results = classifyFiles({ mapping: m, fixtureMoves, lock: null, findFile: (t) => path.join(src, t) });
  assert.deepEqual(results.map((r) => r.status), ["CONNECTABLE", "CONNECTABLE"]);
  const lock = { schema: 1, files: Object.fromEntries(results.map((r) => [r.title, { sha256: r.sha256, size: r.size }])) };
  const run = (over = {}) => applyConnection({ results, approvals: { approvedSlugs: ["luke-standing-lp"] }, lock, fixtureMoves, repoRoot: repo, stageDir: stage, ...over });
  return { root, repo, stage, results, lock, run, destDir: path.join(repo, GIF_DIR_REL), manifestPath: path.join(repo, MANIFEST_REL), bytes };
}

test("approvals must name only connectable moves, without duplicates", () => {
  const ok = new Set(["luke-standing-lp"]);
  assert.deepEqual(validateApprovals({ approvedSlugs: ["luke-standing-lp"] }, ok), []);
  assert.match(validateApprovals({ approvedSlugs: ["luke-standing-mp"] }, ok).join(), /APPROVALS_NOT_CONNECTABLE/);
  assert.match(validateApprovals({ approvedSlugs: ["luke-standing-lp", "luke-standing-lp"] }, ok).join(), /重複/);
  assert.match(validateApprovals({ approvedSlugs: "luke-standing-lp" }, ok).join(), /APPROVALS_INVALID/);
  assert.match(validateApprovals({ approvedSlugs: [1] }, ok).join(), /APPROVALS_INVALID/);
  // MP4維持の技・HOLDの技は、検査に通ってもここでは承認できない(CONNECTABLE ではないため)
});

test("SHA lock never silently replaces an already locked SHA", () => {
  const { results, lock } = applySetup();
  assert.deepEqual(mergeLock(lock, results).conflicts, []);
  const tampered = { files: { "a.gif": { sha256: "0".repeat(64), size: 1 } } };
  const merged = mergeLock(tampered, results);
  assert.match(merged.conflicts.join(), /LOCK_CONFLICT: a\.gif/);
  assert.equal(merged.files["a.gif"].sha256, "0".repeat(64), "the old lock entry is kept");
});

test("apply refuses to run before approval or before the lock, and writes nothing", () => {
  const s = applySetup();
  const empty = s.run({ approvals: { approvedSlugs: [] } });
  assert.equal(empty.ok, false); assert.match(empty.errors.join(), /APPROVALS_EMPTY/);
  const unknown = s.run({ approvals: { approvedSlugs: ["luke-forward-hp"] } });
  assert.match(unknown.errors.join(), /APPROVALS_NOT_CONNECTABLE/);
  const noLock = s.run({ lock: null });
  assert.match(noLock.errors.join(), /LOCK_MISSING/);
  const wrongLock = s.run({ lock: { files: { "a.gif": { sha256: "f".repeat(64) } } } });
  assert.match(wrongLock.errors.join(), /LOCK_MISMATCH/);
  assert.equal(listDir(s.destDir), null, "no public GIF directory was created");
  assert.equal(readFileSync(s.manifestPath, "utf8"), PENDING, "manifest untouched");
  assert.equal(listDir(s.stage), null, "nothing was even staged");
});

test("apply copies and publishes only approved GIFs; unapproved ones stay out of public/ and the manifest", () => {
  const s = applySetup();
  const r = s.run();
  assert.deepEqual([r.ok, r.installed], [true, ["luke-standing-lp"]]);
  assert.deepEqual(listDir(s.destDir), ["luke-standing-lp.gif"], "b.gif (not approved) is not copied");
  const m = JSON.parse(readFileSync(s.manifestPath, "utf8"));
  assert.deepEqual(m.clips.map((c) => [c.move_slug, c.verification_status]), [["luke-standing-lp", "approved_for_preview"]]);
  assert.equal(sha256Hex(readFileSync(path.join(s.destDir, "luke-standing-lp.gif"))), s.results[0].sha256);
  assert.ok(!listDir(s.destDir).some((n) => n.endsWith(".tmp")) && !existsSync(`${s.manifestPath}.tmp`), "no temp files left behind");
  assert.equal(s.run().ok, true, "running again with the same input is a no-op");
  // 承認を増やす再実行は許可される(既存の接続は維持)
  const more = s.run({ approvals: { approvedSlugs: ["luke-standing-lp", "luke-standing-mp"] } });
  assert.equal(more.ok, true);
  assert.deepEqual(listDir(s.destDir), ["luke-standing-lp.gif", "luke-standing-mp.gif"]);
});

test("unexpected files, different existing content or a hand-edited manifest stop apply before anything is copied", () => {
  const stray = applySetup();
  mkdirSync(stray.destDir, { recursive: true }); writeFileSync(path.join(stray.destDir, "stray.txt"), "x");
  assert.match(stray.run().errors.join(), /UNEXPECTED_FILE/);
  assert.deepEqual(listDir(stray.destDir), ["stray.txt"]);

  const diff = applySetup();
  mkdirSync(diff.destDir, { recursive: true }); writeFileSync(path.join(diff.destDir, "luke-standing-lp.gif"), "someone else");
  assert.match(diff.run({ approvals: { approvedSlugs: ["luke-standing-lp", "luke-standing-mp"] } }).errors.join(), /DEST_DIFFERENT/);
  assert.equal(readFileSync(path.join(diff.destDir, "luke-standing-lp.gif"), "utf8"), "someone else", "existing file is never overwritten");
  assert.deepEqual(listDir(diff.destDir), ["luke-standing-lp.gif"], "the other approved GIF was not copied either (all-or-nothing)");

  const edited = applySetup();
  writeFileSync(edited.manifestPath, JSON.stringify({ ...JSON.parse(PENDING), clips: [{ move_slug: "luke-standing-hk", source_file: "x.gif" }] }));
  assert.match(edited.run().errors.join(), /MANIFEST_UNEXPECTED/);
  assert.equal(listDir(edited.destDir), null);
});

test("a manifest that fails validation leaves no partial result in the repository", () => {
  const s = applySetup();
  const broken = s.results.map((x) => (x.slug === "luke-standing-lp" ? { ...x, moveId: "" } : x)); // move_id が空 → 共有バリデータが拒否する
  const r = s.run({ results: broken });
  assert.equal(r.ok, false); assert.match(r.errors.join(), /MANIFEST_INVALID/);
  assert.equal(listDir(s.destDir), null, "GIFs are not copied when the manifest is invalid");
  assert.equal(readFileSync(s.manifestPath, "utf8"), PENDING);
});

test("a failure while installing rolls back copied GIFs and restores the manifest", () => {
  const s = applySetup();
  const failOnManifest = { copyFileSync, renameSync, writeFileSync: (f, ...rest) => { if (String(f).endsWith(".json.tmp")) throw new Error("disk full (simulated)"); return writeFileSync(f, ...rest); } };
  const r = s.run({ approvals: { approvedSlugs: ["luke-standing-lp", "luke-standing-mp"] }, fsOps: failOnManifest });
  assert.equal(r.ok, false); assert.match(r.errors.join(), /APPLY_FAILED_ROLLED_BACK.*disk full/);
  assert.deepEqual(listDir(s.destDir), [], "GIFs copied in this run were removed");
  assert.equal(readFileSync(s.manifestPath, "utf8"), PENDING, "manifest is back to the pending state");
  assert.equal(s.run().ok, true, "a clean retry works afterwards");
});

// --- CLI(段階の分離) ---
const verifyCli = here("../../scripts/luke-gif/verify-luke-gifs.mjs");
function cliSetup() {
  const s = applySetup();
  const data = path.join(s.root, "data"); mkdirSync(data);
  const m = { mp4MaintainedSlugs: mp4Manifest.clips.map((c) => c.move_slug), holdNoAssetSlugs: [], files: [["a.gif", "luke-standing-lp"], ["b.gif", "luke-standing-mp"]].map(([driveTitle, slug]) => ({ driveTitle, slug, role: "candidate", expectedSize: s.bytes[driveTitle].length, fetch: true })) };
  writeFileSync(path.join(data, "luke-gif-mapping.json"), JSON.stringify(m));
  writeFileSync(path.join(data, "luke-gif-approvals.json"), JSON.stringify({ approvedSlugs: [] }));
  for (const rel of ["v2-web/src/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json", "v2-web/src/data/SF6DNA_VER1_LUKE_MEDIA_MANIFEST_20260924.json"]) copyFileSync(here(`../../${rel}`), path.join(s.repo, rel));
  const cli = (...flags) => spawnSync(process.execPath, [verifyCli, "--repo-root", s.repo, "--data-dir", data, "--search-dir", path.join(s.root, "src"), "--out", path.join(s.root, "out"), ...flags], { encoding: "utf8" });
  return { ...s, data, cli };
}

test("CLI: lock creation, approval and apply are separate stages and cannot be combined", () => {
  const c = cliSetup();
  assert.equal(c.cli("--write-lock", "--apply").status, 2, "combined flags are refused");
  assert.equal(c.cli().status, 0, "stage 1 is read-only and passes");
  assert.equal(listDir(c.destDir), null); assert.equal(existsSync(path.join(c.data, "luke-gif-lock.json")), false);

  const approvalsFile = path.join(c.data, "luke-gif-approvals.json");
  writeFileSync(approvalsFile, JSON.stringify({ approvedSlugs: ["luke-standing-mp"] }));
  const noLock = c.cli("--apply"); // 承認があっても、ロックが無ければ反映しない
  assert.equal(noLock.status, 1); assert.match(noLock.stdout, /LOCK_MISSING/);
  assert.equal(listDir(c.destDir), null);
  writeFileSync(approvalsFile, JSON.stringify({ approvedSlugs: [] }));

  assert.equal(c.cli("--write-lock").status, 0);
  assert.equal(existsSync(path.join(c.data, "luke-gif-lock.json")), true, "stage 2 writes the lock");
  assert.equal(listDir(c.destDir), null, "stage 2 does not copy GIFs");
  assert.equal(readFileSync(c.manifestPath, "utf8"), PENDING, "stage 2 does not touch the manifest");

  const unapproved = c.cli("--apply");
  assert.equal(unapproved.status, 1); assert.match(unapproved.stdout, /APPROVALS_EMPTY/);
  assert.equal(listDir(c.destDir), null, "nothing is promoted before approval");

  writeFileSync(path.join(c.data, "luke-gif-approvals.json"), JSON.stringify({ approvedSlugs: ["luke-standing-mp"] }));
  const done = c.cli("--apply");
  assert.equal(done.status, 0, done.stdout + done.stderr);
  assert.deepEqual(listDir(c.destDir), ["luke-standing-mp.gif"]);
  assert.deepEqual(JSON.parse(readFileSync(c.manifestPath, "utf8")).clips.map((x) => x.move_slug), ["luke-standing-mp"]);
});

test("CLI: a changed GIF after locking is blocked and a locked SHA is never rewritten", () => {
  const c = cliSetup();
  assert.equal(c.cli("--write-lock").status, 0);
  writeFileSync(path.join(c.root, "src", "a.gif"), makeGif({ delays: [9, 9] })); // 反映前に中身が変わった
  const r = c.cli("--write-lock");
  assert.equal(r.status, 1); assert.match(r.stdout, /BLOCKED a\.gif.*SHA_MISMATCH_LOCK/);
  const lockText = readFileSync(path.join(c.data, "luke-gif-lock.json"), "utf8");
  assert.equal(c.cli("--write-lock").status, 1);
  assert.equal(readFileSync(path.join(c.data, "luke-gif-lock.json"), "utf8"), lockText, "lock file unchanged");
});

// --- PowerShell(Windows PowerShell 5.1 向けの静的確認。実行確認は PC で行う) ---
test("PowerShell script keeps 5.1-safe encoding/syntax and calls the three stages separately", () => {
  const raw = readFileSync(here("../../scripts/luke-gif/Get-LukeGifs.ps1"));
  assert.deepEqual([...raw.subarray(0, 3)], [0xef, 0xbb, 0xbf], "UTF-8 BOM (5.1 reads BOM-less files as ANSI)");
  const text = raw.toString("utf8");
  assert.ok(/\r\n/.test(text) && !/[^\r]\n/.test(text), "CRLF line endings");
  for (const ps7Only of [/\?\?/, /\?\./, /&&/, /\|\|/, /-Parallel/, /\$IsWindows/, /::new\(/, /\bifnull\b/]) assert.doesNotMatch(text, ps7Only, String(ps7Only));
  assert.match(text, /\[switch\]\$WriteLock/); assert.match(text, /\[switch\]\$Apply/);
  assert.doesNotMatch(text, /'--write-lock'\s*,\s*'--apply'/, "stages are never combined");
  assert.match(text, /\$WriteLock -and \$Apply/, "combined switches are rejected");
  assert.match(text, /Tls12/); assert.match(text, /UTF8Encoding\(\$false\)/);
  assert.match(text, /\$LASTEXITCODE/); assert.match(text, /download-failures\.log/);
  assert.match(text, /予期しない未コミット変更/);
  assert.doesNotMatch(text, /WARN 書き込み先に未コミット/, "dirty destinations stop the run; they are no longer only a warning");
});
