// ローカルQA専用GIF表示(隔離ルート)の静的テスト。承認・公開を伴わないことを確認する。
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { loadMp4MoveIds } from "../../scripts/gif-intake/validate-gif-intake.mjs";

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const json = (p) => JSON.parse(readFileSync(here(p), "utf8"));
const doc = json("../src/data/gif-intake/local-qa/SF6DNA_LOCAL_QA_GIF_LUKE_20261116.json");
const fixture = json("../src/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json").characters.luke;
// 一括QA(静的一致36本)と、対象外素材の個別QA(補足)を合わせたものが、表示対象の根拠
const visual = [...json("../../scripts/gif-intake/luke-visual-qa-20261116.json").entries,
  ...json("../../scripts/gif-intake/luke-visual-qa-supplement-20261116.json").entries];
const protectedApprovals = json("../../scripts/luke-gif/luke-gif-approvals.json");

// TSのlibをNodeで実行して結果を受け取る(型だけのimportは実行時に消える)
function runLib(code) {
  const r = spawnSync(process.execPath, ["--experimental-strip-types", "--no-warnings", "--input-type=module", "-e",
    `import * as m from ${JSON.stringify("file://" + here("../src/lib/local-qa-gif.ts"))}; ${code}`], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr);
  return JSON.parse(r.stdout);
}

test("データは localQaOnly・NOT_APPROVED で、15本すべてが目視QA CONFIRMED のもの", () => {
  assert.equal(doc.localQaOnly, true);
  assert.equal(doc.approval, "NOT_APPROVED");
  assert.equal(doc.entries.length, 15);
  const confirmed = new Set(visual.filter((e) => e.result === "CONFIRMED" && e.localConnectionCandidate).map((e) => e.moveSlug));
  assert.deepEqual(new Set(doc.entries.map((e) => e.moveSlug)), confirmed);
  assert.ok(!/approved_for_preview/.test(JSON.stringify(doc)), "承認状態を示す語を含まない");
});

test("技ID・slugは公開用データ(Luke)と一致し、重複せず、GIF実体のSHA-256が一致する", () => {
  const byId = new Map(fixture.moves.map((m) => [m.id, m.slug]));
  const ids = new Set(), files = new Set(), shas = new Set();
  for (const e of doc.entries) {
    assert.equal(byId.get(e.moveId), e.moveSlug, e.moveSlug);
    assert.ok(!ids.has(e.moveId) && !files.has(e.fileName) && !shas.has(e.sha256), `重複 ${e.moveSlug}`);
    ids.add(e.moveId); files.add(e.fileName); shas.add(e.sha256);
    const p = here(`../.sf6dna-local-qa-gif/luke/${e.fileName}`);
    if (!existsSync(p)) continue; // GIF実体はgit管理外。無い環境(CI等)ではスキップせず下の別テストで明示
    assert.equal(createHash("sha256").update(readFileSync(p)).digest("hex"), e.sha256, e.fileName);
  }
});

test("GIF実体はpublic/に置かれていない(本番に載る経路に入っていない)", () => {
  for (const e of doc.entries) assert.ok(!existsSync(here(`../public/media/moves/luke/gif/${e.fileName}`)), e.fileName);
});

test("15本はいずれも既存MP4・既存mediaを持たず、保護対象の承認Registryにも入っていない", () => {
  const mp4 = loadMp4MoveIds();
  const withMedia = new Set(fixture.moves.filter((m) => m.media).map((m) => m.id));
  const approved = new Set(protectedApprovals.approvedSlugs);
  for (const e of doc.entries) {
    assert.ok(!mp4.has(e.moveId), `MP4あり ${e.moveSlug}`);
    assert.ok(!withMedia.has(e.moveId), `media あり ${e.moveSlug}`);
    assert.ok(!approved.has(e.moveSlug), `承認済みに混入 ${e.moveSlug}`);
  }
});

test("planLocalQaGifs: 正常な15本は全て受理、MP4優先・不一致・重複・不正ファイル名・承認済み表記は除外", () => {
  const moves = fixture.moves.map(({ id, slug }) => ({ id, slug }));
  const out = runLib(`
    const doc = ${JSON.stringify(doc)}; const moves = ${JSON.stringify(moves)};
    const ok = m.planLocalQaGifs({ doc, moves, movesWithMedia: new Set() });
    const first = doc.entries[0], second = doc.entries[1];
    const mp4 = m.planLocalQaGifs({ doc, moves, movesWithMedia: new Set([first.moveId]) });
    const wrongSlug = m.planLocalQaGifs({ doc: { ...doc, entries: [{ ...first, moveSlug: "luke-x" }] }, moves, movesWithMedia: new Set() });
    const noMove = m.planLocalQaGifs({ doc: { ...doc, entries: [{ ...first, moveId: "00000000-0000-0000-0000-000000000000" }] }, moves, movesWithMedia: new Set() });
    const dup = m.planLocalQaGifs({ doc: { ...doc, entries: [first, { ...second, moveId: first.moveId, moveSlug: first.moveSlug }] }, moves, movesWithMedia: new Set() });
    const unsafe = m.planLocalQaGifs({ doc: { ...doc, entries: [{ ...first, fileName: "../x.gif" }] }, moves, movesWithMedia: new Set() });
    const approved = m.planLocalQaGifs({ doc: { ...doc, approval: "APPROVED" }, moves, movesWithMedia: new Set() });
    const notQa = m.planLocalQaGifs({ doc: { ...doc, localQaOnly: false }, moves, movesWithMedia: new Set() });
    console.log(JSON.stringify({ ok: ok.accepted.length, mp4: [mp4.accepted.length, mp4.skipped.map(s => s.reason)],
      wrongSlug: wrongSlug.skipped[0].reason, noMove: noMove.skipped[0].reason, dup: dup.skipped.map(s => s.reason),
      unsafe: unsafe.skipped[0].reason, approved: [approved.accepted.length, approved.skipped[0].reason], notQa: [notQa.accepted.length, notQa.skipped[0].reason] }));`);
  assert.equal(out.ok, 15);
  assert.deepEqual(out.mp4, [14, ["MP4_PRIORITY_KEPT"]]);
  assert.equal(out.wrongSlug, "SLUG_MISMATCH");
  assert.equal(out.noMove, "MOVE_NOT_FOUND");
  assert.deepEqual(out.dup, ["DUPLICATE_MOVE_ID"]);
  assert.equal(out.unsafe, "UNSAFE_FILE_NAME");
  assert.deepEqual(out.approved, [0, "DOC_APPROVAL_NOT_NOT_APPROVED"]);
  assert.deepEqual(out.notQa, [0, "DOC_NOT_LOCAL_QA_ONLY"]);
});

test("表示記録は未承認ステータスで、公開用/media/ではなく隔離ルートのURLを指す", () => {
  const out = runLib(`console.log(JSON.stringify(m.toLocalQaMotionMedia(${JSON.stringify(doc.entries[0])}, "luke", 0)));`);
  assert.equal(out.status, "local_qa_not_approved");
  assert.equal(out.mediaType, "gif");
  assert.match(out.mediaUrl, /^\/internal\/gif-qa\/luke\/media\/[a-z0-9-]+\.gif$/);
  assert.ok(!out.mediaUrl.startsWith("/media/"));
});

test("入口の判定: 開発環境のlocalhost+フラグ有のときだけ許可(本番・Vercel・外部ホスト・フラグ無しは拒否)", () => {
  const cases = runLib(`const base = { nodeEnv: "development", enabled: "1", host: "localhost:3000" };
    const f = (o) => m.isLocalQaGifRequest({ ...base, ...o });
    console.log(JSON.stringify({ dev: f({}), prod: f({ nodeEnv: "production" }), vercel: f({ vercel: "1" }), vercelPreview: f({ vercelEnv: "preview" }),
      noFlag: f({ enabled: undefined }), external: f({ host: "sf6dna.example.com" }), ip: f({ host: "127.0.0.1:3107" }), spoof: f({ host: "localhost.evil.com" }) }));`);
  assert.deepEqual(cases, { dev: true, prod: false, vercel: false, vercelPreview: false, noFlag: false, external: false, ip: true, spoof: false });
});

test("既存の表示経路・保護対象からQA用モジュールを参照していない", () => {
  const protectedFiles = ["../src/lib/preview-motion-media-pilot.ts", "../src/lib/daily-training.ts", "../src/components/diagnosis-history-tool.tsx",
    "../src/components/move-motion-media.tsx", "../src/components/character-unified-page.tsx", "../src/lib/release-confirmed-media.ts"];
  for (const f of protectedFiles) assert.ok(!/local-qa-gif|gif-qa|sf6dna-local-qa/.test(readFileSync(here(f), "utf8")), f);
});

// ---- JP・Manon(Lukeと同じ共通基盤の横展開) ----
for (const ch of ["jp", "manon"]) {
  const d = json(`../src/data/gif-intake/local-qa/SF6DNA_LOCAL_QA_GIF_${ch.toUpperCase()}_20261116.json`);
  const fx = json("../src/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json").characters[ch];
  // JPは追補(OD ストリボーグ/OD トルバラン)の目視QAも併せて見る。元の台帳ファイルは変更しない
  // 追補で判定が更新されたファイル(マノンSA1/SA2)は、追補の判定を採用する
  const superseded = new Set(ch === "manon" ? json("../../scripts/gif-intake/manon-visual-qa-supplement-20261117.json").entries.map((e) => e.file) : []);
  const vq = [...json(`../../scripts/gif-intake/${ch}-visual-qa-20261116.json`).entries.filter((e) => !superseded.has(e.file)),
    ...(ch === "jp" ? json("../../scripts/gif-intake/jp-visual-qa-supplement-20261116.json").entries : []),
    ...(ch === "manon" ? [...json("../../scripts/gif-intake/manon-visual-qa-supplement-20261117.json").entries, ...json("../../scripts/gif-intake/manon-sa-light-visual-qa-20261117.json").entries, ...json("../../scripts/gif-intake/p3-visual-qa-manon-20261117.json").entries, ...json("../../scripts/gif-intake/p4-visual-qa-manon-20261117.json").entries] : [])]; // マノンSA1/SA2は入力表示で区別できた追補(11/17)

  test(`${ch}: データは localQaOnly・NOT_APPROVED で、目視QA CONFIRMED のものだけ(要追加確認は含まない)`, () => {
    assert.equal(d.characterSlug, ch);
    assert.equal(d.localQaOnly, true);
    assert.equal(d.approval, "NOT_APPROVED");
    // JPは受領パッケージ(統合Manifest)でHOLDの素材を除く
    const pkgFile = "../../scripts/gif-intake/packages/jp-47-handoff-20261116/integration_manifest.json";
    const held = ch === "jp" ? new Set(json(pkgFile).records.filter((r) => r.mapping_status === "HOLD").map((r) => r.asset_filename)) : new Set();
    const confirmed = vq.filter((e) => e.result === "CONFIRMED" && e.localConnectionCandidate && !held.has(e.file));
    assert.deepEqual(new Set(d.entries.map((e) => e.moveSlug)), new Set(confirmed.map((e) => e.moveSlug)));
    for (const e of vq.filter((x) => held.has(x.file))) assert.ok(!d.entries.some((x) => x.moveSlug === e.moveSlug), `パッケージHOLDが混入 ${e.moveSlug}`);
    assert.ok(d.entries.length > 0);
    for (const e of vq.filter((x) => x.result !== "CONFIRMED")) {
      assert.ok(!d.entries.some((x) => x.moveSlug === e.moveSlug), `未確認が混入 ${e.moveSlug}`);
      assert.equal(e.localConnectionCandidate, false);
    }
    assert.ok(vq.every((e) => e.approval === "NOT_APPROVED"));
  });

  test(`${ch}: 技ID/slug一致・重複なし・SHA-256一致・public外・既存MP4/mediaなし`, () => {
    const byId = new Map(fx.moves.map((m) => [m.id, m.slug]));
    const mp4 = loadMp4MoveIds();
    const withMedia = new Set(fx.moves.filter((m) => m.media).map((m) => m.id));
    const seen = new Set();
    for (const e of d.entries) {
      assert.equal(byId.get(e.moveId), e.moveSlug);
      assert.ok(!seen.has(e.moveId) && !seen.has(e.fileName) && !seen.has(e.sha256), `重複 ${e.moveSlug}`);
      seen.add(e.moveId); seen.add(e.fileName); seen.add(e.sha256);
      assert.ok(!mp4.has(e.moveId) && !withMedia.has(e.moveId), `MP4/media あり ${e.moveSlug}`);
      assert.ok(!existsSync(here(`../public/media/moves/${ch}/gif/${e.fileName}`)));
      const p = here(`../.sf6dna-local-qa-gif/${ch}/${e.fileName}`);
      if (existsSync(p)) assert.equal(createHash("sha256").update(readFileSync(p)).digest("hex"), e.sha256, e.fileName);
    }
  });

  test(`${ch}: ファイル名の規則でQA用データが見つかり、QA用の既存MP4マニフェストが解決できる`, () => {
    // 以前はキャラごとの対応表への登録を確認していた。今は規則で自動探索するため、規則に合うファイルが実在することを確認する
    const qaFiles = readdirSync(here("../src/data/gif-intake/local-qa"));
    assert.ok(qaFiles.some((f) => new RegExp(`^SF6DNA_LOCAL_QA_GIF_${ch.toUpperCase()}_\\d{8}\\.json$`).test(f)), "QA用データ");
    const mp4Files = readdirSync(here("../src/data")).filter((f) => /^SF6DNA_VER1_.*_MEDIA_MANIFEST_.*\.json$/.test(f));
    assert.ok(mp4Files.some((f) => JSON.parse(readFileSync(here(`../src/data/${f}`), "utf8").replace(/^\uFEFF/, "")).character_slug === ch), "MP4マニフェスト(character_slug一致)");
  });
}

test("配信ハンドラ: 入口判定が先でファイル読込が後・ビルド時のファイル追跡(nft)を無効化している", () => {
  const src = readFileSync(here("../src/app/internal/gif-qa/[slug]/media/[name]/route.ts"), "utf8");
  assert.ok(src.indexOf("isLocalQaGifRequest") < src.indexOf("readFile(path.join"), "判定がreadFileより先");
  assert.match(src, /turbopackIgnore:\s*true/);
  assert.ok(src.indexOf("notFound()") < src.indexOf("readFile(path.join"));
});

test("QA用データはimportせず実行時に読む(本番ビルドへ同梱しない)", () => {
  const src = readFileSync(here("../src/lib/local-qa-gif-sources.ts"), "utf8");
  assert.ok(!/import\("@\/data\/gif-intake/.test(src), "QA用JSONをimportしている");
  assert.match(src, /readFile/);
  assert.match(src, /turbopackIgnore: true/);
});

test("connectLocalQaGifToMoves: 既存mediaの技には触れず、mediaの無い技にだけ接続し、入力は変更しない", () => {
  const out = spawnSync(process.execPath, ["--experimental-strip-types", "--no-warnings", "--input-type=module", "-e", `
    import { connectLocalQaGifToMoves } from "./src/lib/local-qa-gif.ts";
    const doc = { schemaVersion: 1, characterSlug: "x", localQaOnly: true, approval: "NOT_APPROVED", entries: [
      { moveId: "a", moveSlug: "x-a", fileName: "x-a.gif", sha256: "1", bytes: 1, width: 1, height: 1, durationMs: 1, sourceFile: "s", visualQa: "CONFIRMED" },
      { moveId: "b", moveSlug: "x-b", fileName: "x-b.gif", sha256: "2", bytes: 1, width: 1, height: 1, durationMs: 1, sourceFile: "s", visualQa: "CONFIRMED" }] };
    const moves = [{ id: "a", slug: "x-a", media: null }, { id: "b", slug: "x-b", media: { kind: "mp4" } }];
    const r = connectLocalQaGifToMoves({ doc, characterSlug: "x", moves });
    console.log(JSON.stringify({ a: r.moves[0].media?.mediaUrl ?? null, b: r.moves[1].media, orig: moves[0].media, acc: r.plan.accepted.length }));`], { cwd: here(".."), encoding: "utf8" });
  assert.equal(out.status, 0, out.stderr);
  const r = JSON.parse(out.stdout);
  assert.equal(r.a, "/internal/gif-qa/x/media/x-a.gif");
  assert.deepEqual(r.b, { kind: "mp4" });
  assert.equal(r.orig, null);
  assert.equal(r.acc, 1);
});

test("JP47本: ManifestのファイルIDで5区分に重複なく分かれ、合計47(HOLD 11の二重計上なし)", () => {
  const pkg = json("../../scripts/gif-intake/packages/jp-47-handoff-20261116/integration_manifest.json").records;
  const ledger = new Map(json("../../scripts/gif-intake/jp-ledger-47-20261116.json").rows.map((r) => [r.filename, r]));
  assert.equal(pkg.length, 47);
  assert.equal(new Set(pkg.map((r) => r.drive_file_id)).size, 47, "ファイルIDが重複");
  const tier = (r) => {
    const l = ledger.get(r.asset_filename);
    if (r.mapping_status === "HOLD") return "A_HOLD"; // 解除しない。他の区分より先に数える
    if (l.static_status === "MP4_PRIORITY_KEPT") return "B_MP4_PRIORITY";
    if (l.local_connection_candidate) return "C_LOCAL_QA_DISPLAY";
    if (l.move_id || ["MATCHED_STATIC", "NEEDS_VISUAL_QA"].includes(l.static_status)) return "D_ID_CANDIDATE_NEEDS_QA";
    return "E_ID_WAITING";
  };
  const count = {};
  for (const r of pkg) count[tier(r)] = (count[tier(r)] ?? 0) + 1;
  assert.deepEqual(count, { A_HOLD: 11, B_MP4_PRIORITY: 13, C_LOCAL_QA_DISPLAY: 3, D_ID_CANDIDATE_NEEDS_QA: 2, E_ID_WAITING: 18 });
  const hold = pkg.filter((r) => r.mapping_status === "HOLD");
  assert.deepEqual(Object.fromEntries(Object.entries(Object.groupBy(hold, (r) => r.category)).map(([k, v]) => [k, v.length])), { DEPARTURE_BRANCH: 8, SPECIAL: 3 });
  // ローカルQA表示の3本はHOLDと重ならない / 公開承認は全て未承認
  assert.ok(pkg.every((r) => r.publication_status === "NOT_APPROVED"));
  const shown = json("../src/data/gif-intake/local-qa/SF6DNA_LOCAL_QA_GIF_JP_20261116.json").entries.map((e) => e.sourceFile);
  assert.ok(shown.every((f) => pkg.find((r) => r.asset_filename === f)?.mapping_status !== "HOLD"));
});

test("正式ページへの差分案: 追加は import 1行 + 呼び出し1行だけで、実ページ本体はまだ変更していない", () => {
  const patch = readFileSync(here("../../scripts/gif-intake/proposals/characters-slug-page.local-qa-gif.patch"), "utf8");
  const added = patch.split("\n").filter((l) => l.startsWith("+") && !l.startsWith("+++"));
  assert.equal(added.length, 3, "追加行は import / コメント / 呼び出しの3行");
  assert.ok(added.some((l) => l.includes('import { connectLocalQaGifToBundle } from "@/lib/local-qa-gif-page"')));
  assert.ok(added.some((l) => l.includes("connectLocalQaGifToBundle({")));
  assert.equal(patch.split("\n").filter((l) => l.startsWith("-") && !l.startsWith("---")).length, 1, "削除は元の finalBundle 行のみ");
  // 実ページは変更しない(承認後に適用する)
  assert.ok(!/local-qa-gif/.test(readFileSync(here("../src/app/characters/[slug]/page.tsx"), "utf8")));
  // 検証用コピーは差分案の適用結果(型検査 tsc の対象)
  const copy = readFileSync(here("../src/app/internal/gif-qa/_page-copy/page.tsx"), "utf8");
  assert.ok(copy.includes("connectLocalQaGifToBundle({ characterSlug: character.slug"));
});

test("本番ビルドに入りうるQA関連コードは、入口判定を通らない限り何も返さない作りである", () => {
  const src = readFileSync(here("../src/lib/local-qa-gif-page.ts"), "utf8");
  assert.match(src, /!isLocalQaGifRequestFromEnv\(host\)\) return bundle/);
});

test("ルーク通常技18件: 1件ずつ確定または理由付きHOLDで、未承認・QA表示の対象外(強度が映像で確定できないため)", () => {
  const doc = json("../../scripts/gif-intake/luke-normals-18-20261116.json");
  const normals = json("../src/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json").characters.luke.moves.filter((m) => m.moveType === "normal");
  assert.equal(normals.length, 18);
  assert.deepEqual(doc.entries.map((e) => e.moveId), normals.map((m) => m.id)); // 公開用データの通常技と順序・IDが一致
  assert.deepEqual(doc.entries.map((e) => e.moveSlug), normals.map((m) => m.slug));
  const statuses = new Set(["CONFIRMED", "HOLD_STRENGTH_UNDETERMINED", "HOLD_DUPLICATE_CONTENT", "HOLD_UNCONFIRMED_MAPPING"]);
  const qa = new Set(json("../src/data/gif-intake/local-qa/SF6DNA_LOCAL_QA_GIF_LUKE_20261116.json").entries.map((e) => e.moveId));
  const inv = new Map(json("../../scripts/gif-intake/asset-inventory-luke-manon-jp-20261116.json").records.filter((r) => r.character === "luke").map((r) => [r.file, r]));
  for (const e of doc.entries) {
    assert.ok(statuses.has(e.status), e.moveSlug);
    assert.equal(e.approval, "NOT_APPROVED");
    assert.equal(e.existingMp4, false);
    assert.equal(inv.get(e.sourceFile)?.sha256, e.sha256, `SHA不一致 ${e.moveSlug}`);
    if (e.status !== "CONFIRMED") assert.ok(e.reasons.length > 0 && e.localQaDisplay === false, `理由なしHOLD ${e.moveSlug}`);
    if (e.status !== "CONFIRMED") assert.ok(!qa.has(e.moveId), `HOLDがQA表示に混入 ${e.moveSlug}`);
  }
  assert.equal(doc.summary.total, 18);
  assert.equal(doc.summary.CONFIRMED + doc.summary.HOLD_STRENGTH_UNDETERMINED + doc.summary.HOLD_DUPLICATE_CONTENT + doc.summary.HOLD_UNCONFIRMED_MAPPING, 18);
  // 同一バイトの重複は、別ラベルの旧ファイルとして台帳に残っている(2組)
  const dupMp = inv.get("22_3-luke-standing-mp.gif").sha256, dupMk = inv.get("22_16-luke-jumping-mk.gif").sha256;
  assert.equal(inv.get("22_5-luke-standing-hp.gif").sha256, dupMp);
  assert.equal(inv.get("22_18-luke-jumping-hk.gif").sha256, dupMk);
  assert.notEqual(inv.get("22_5-luke-standing-hp-verified.gif").sha256, dupMp);
  assert.notEqual(inv.get("22_18-luke-jumping-hk-verified.gif").sha256, dupMk);
});
