// 通常ページ(characters/[slug]/page.tsx)へGIFを接続する「差分案」の安全確認テスト。
// 実ページはまだ変更しない(承認待ち)。ここでは差分案そのものと、差分案が呼ぶ関数の動きだけを確認する。
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, copyFileSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const read = (p) => readFileSync(here(p), "utf8");
const PAGE_REL = "v2-web/src/app/characters/[slug]/page.tsx";
const patchHead = read("../../scripts/gif-intake/proposals/page-gif-connect-head.patch");
const patchRyu = read("../../scripts/gif-intake/proposals/page-gif-connect-ryu-branch.patch");

const changedLines = (patch, sign) => patch.split("\n").filter((l) => l.startsWith(sign) && !l.startsWith(sign.repeat(3)));

test("差分案A(HEAD用): 触るのは page.tsx だけ。追加3行(import・コメント・呼び出し)・削除1行(元の finalBundle 行)", () => {
  const files = [...patchHead.matchAll(/^\+\+\+ b\/(.+)$/gm)].map((m) => m[1]);
  assert.deepEqual(files, [PAGE_REL]);
  const added = changedLines(patchHead, "+");
  assert.equal(added.length, 3);
  assert.ok(added.some((l) => l.includes('import { connectLocalQaGifToBundle } from "@/lib/local-qa-gif-page"')));
  assert.ok(added.some((l) => l.includes("connectLocalQaGifToBundle({ characterSlug: character.slug")));
  const removed = changedLines(patchHead, "-");
  assert.deepEqual(removed.map((l) => l.trim()), ["-  const finalBundle = connectedTxt?.bundle ?? bundle;"]);
  // 渡すのは「既存の接続結果(TXT接続があればそれ)」で、既存の挙動を置き換えない
  assert.ok(added.some((l) => l.includes("bundle: connectedTxt?.bundle ?? bundle")));
});

test("差分案Aは作成時のRC基準に当たり、検証用コピーと一致する", () => {
  const dir = mkdtempSync(join(tmpdir(), "pgc-"));
  const target = join(dir, PAGE_REL);
  mkdirSync(join(target, ".."), { recursive: true });
  // 旧提案の適用先と、現在の製品ルートに未承認GIFが入っていないことを別々に確認する。
  const real = read("../src/app/characters/[slug]/page.tsx");
  assert.ok(!/local-qa-gif/.test(real), "実ページは承認前なので未変更のまま");
  const expected = read("../src/app/internal/gif-qa/_page-copy/page.tsx");
  const patchFile = here("../../scripts/gif-intake/proposals/page-gif-connect-head.patch");
  writeFileSync(target, expected);
  const reverse = spawnSync("patch", ["-R", "-p1", "--silent", "-d", dir, "-i", patchFile], { encoding: "utf8" });
  assert.equal(reverse.status, 0, (reverse.stderr ?? "") + (reverse.stdout ?? ""));
  const hash = createHash("sha256").update(readFileSync(target, "utf8").replaceAll("\r\n", "\n")).digest("hex");
  assert.equal(hash, "ad72f88fc9cada52b8540708b912225089e7faeac6ccaa028ee3fce95977995e", "RC 884862a の前像");
  const r = spawnSync("patch", ["-p1", "--silent", "-d", dir, "-i", patchFile], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr + r.stdout);
  assert.equal(readFileSync(target, "utf8"), expected);
});

test("差分案B(Ryuブランチ用)は page.tsx だけを触り、Ryuの既存接続を残したまま QA接続を後段に足す", () => {
  const files = [...patchRyu.matchAll(/^\+\+\+ b\/(.+)$/gm)].map((m) => m[1]);
  assert.deepEqual(files, [PAGE_REL]);
  const added = changedLines(patchRyu, "+").join("\n");
  assert.match(added, /ryuConnectedBundle/);
  assert.match(added, /connectLocalQaGifToBundle\(\{[^}]*bundle: ryuConnectedBundle/);
});

test("差分案は保護対象(公開Manifest・承認Registry・カード本体・フラグ)を一切触らない", () => {
  for (const patch of [patchHead, patchRyu]) {
    for (const p of ["Manifest", "approvals", "character-unified-page", "move-motion-media", "feature-flags", "supabase", "vercel"]) {
      assert.ok(!new RegExp(`^(\\+\\+\\+|---) .*${p}`, "im").test(patch), p);
    }
  }
});

// 差分案が呼ぶ関数(connectLocalQaGifToBundle)の動き。TSを一時フォルダへ写し、@/lib/ を相対パスに直して実行する。
function runConnect(env, host, slug, extra = "") {
  const dir = mkdtempSync(join(tmpdir(), "pgc-lib-"));
  for (const f of ["local-qa-gif.ts", "local-qa-gif-page.ts", "local-qa-gif-sources.ts"]) {
    writeFileSync(join(dir, f.replace(/\.ts$/, ".mts")), read(`../src/lib/${f}`).replaceAll('"@/lib/local-qa-gif-sources"', '"./local-qa-gif-sources.mts"').replaceAll('"@/lib/local-qa-gif"', '"./local-qa-gif.mts"').replace(/from "@\/lib\/[^"]+"/g, (m) => m.replace('@/lib/', './')));
  }
  // 接続処理が参照する既存の .mjs(同じフォルダ内で相互参照するため全て写す)
  for (const f of readdirSync(here("../src/lib"))) if (f.endsWith(".mjs")) copyFileSync(here(`../src/lib/${f}`), join(dir, f));
  const code = `
    import { connectLocalQaGifToBundle } from ${JSON.stringify("file://" + join(dir, "local-qa-gif-page.mts"))};
    import { readFileSync } from "node:fs";
    const fx = JSON.parse(readFileSync(${JSON.stringify(here("../src/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json"))}, "utf8"));
    const bundle = { marker: "kept", moves: fx.characters[${JSON.stringify(slug)}].moves.map((m) => ({ ...m, media: m.media ?? null })) };
    ${extra}
    const out = await connectLocalQaGifToBundle({ characterSlug: ${JSON.stringify(slug)}, bundle, host: ${JSON.stringify(host)} });
    console.log(JSON.stringify({ same: out === bundle, marker: out?.marker, connected: out.moves.filter((m, i) => m.media && !bundle.moves[i].media).length, total: out.moves.length }));`;
  const r = spawnSync(process.execPath, ["--experimental-strip-types", "--no-warnings", "--input-type=module", "-e", code],
    { encoding: "utf8", cwd: here(".."), env: { PATH: process.env.PATH, ...env } });
  assert.equal(r.status, 0, r.stderr);
  return JSON.parse(r.stdout);
}

const DEV = { NODE_ENV: "development", SF6DNA_WS5_TXT_PREVIEW: "1" };

test("本番・Preview・外部ホスト・フラグ無しでは、入力のバンドルをそのまま返す(何も接続しない)", () => {
  for (const [env, host] of [
    [{ NODE_ENV: "production", SF6DNA_WS5_TXT_PREVIEW: "1" }, "localhost:3000"],
    [{ ...DEV, VERCEL: "1" }, "localhost:3000"],
    [DEV, "sf6dna.vercel.app"],
    [DEV, null],
    [{ NODE_ENV: "development" }, "localhost:3000"],
  ]) {
    const o = runConnect(env, host, "luke");
    assert.equal(o.same, true, JSON.stringify([env, host]));
    assert.equal(o.connected, 0);
  }
});

test("開発環境のlocalhostでは、5キャラの未承認GIFだけが接続される(ルーク15 / JP5 / マノン8 / ジュリ5 / ジェイミー7 = 40)", () => {
  const counts = Object.fromEntries(["luke", "jp", "manon", "juri", "jamie", "cammy", "dee-jay", "chun-li", "guile", "lily"].map((s) => [s, runConnect(DEV, "localhost:3000", s)]));
  assert.deepEqual(Object.fromEntries(Object.entries(counts).map(([k, v]) => [k, v.connected])), { luke: 15, jp: 5, manon: 16, juri: 5, jamie: 11, cammy: 29, "dee-jay": 35, "chun-li": 9, guile: 9, lily: 15 });
  for (const v of Object.values(counts)) { assert.equal(v.marker, "kept", "バンドルの他の項目は変えない"); assert.equal(v.same, false); }
});

test("GIFデータが無いキャラ(ryu / zangief)では何もしない", () => {
  for (const s of ["ryu", "zangief"]) assert.equal(runConnect(DEV, "localhost:3000", s).connected, 0, s);
});

test("既に media がある技には触れない(既存優先)", () => {
  // ルークの全技に既存mediaが付いている状態を作り、GIFが1本も上書きしないことを確認
  const o = runConnect(DEV, "localhost:3000", "luke", `for (const m of bundle.moves) m.media = { existing: true };`);
  assert.equal(o.connected, 0);
});

test("本番配布物にQA用JSONを含めない: QA関連のファイル読み込みの path.join は全て turbopackIgnore 付き(付け忘れ防止)", () => {
  for (const f of ["../src/lib/local-qa-gif-sources.ts", "../src/app/internal/gif-qa/[slug]/media/[name]/route.ts"]) {
    const joins = [...read(f).matchAll(/path\.join\(([^,]*),/g)].map((m) => m[1]);
    assert.ok(joins.length > 0, f);
    for (const first of joins) assert.match(first, /turbopackIgnore: true/, `${f}: ${first}`);
  }
});

// 強度が複合根拠のみの接続は公開候補から分離されていること(2026-11-17ユーザー指示)
test("弱根拠(複合根拠のみ)の接続は publicCandidate=false で公開候補から分離されている", () => {
  const dir = new URL("../src/data/gif-intake/local-qa/", import.meta.url);
  let weak = 0;
  for (const f of readdirSync(dir).filter((n) => /^SF6DNA_LOCAL_QA_GIF_.*_20261116\.json$/.test(n) && !n.includes("VARIANTS"))) {
    for (const e of JSON.parse(readFileSync(new URL(f, dir), "utf8")).entries) {
      const isWeak = String(e.observation).startsWith("複合根拠");
      assert.equal(e.publicCandidate === false, isWeak, `${f} ${e.moveSlug}`);
      if (isWeak) { weak++; assert.equal(e.evidenceTier, "COMPOSITE_WEAK_STRENGTH"); }
    }
  }
  assert.equal(weak, 48);
});
