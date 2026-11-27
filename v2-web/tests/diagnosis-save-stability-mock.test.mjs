import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import ts from "typescript";
import { environment, A } from "./helpers/diagnosis-owner-save-harness.mjs";

// V45：保存の安定性（モック検証）。本物のDBは使わない。
// 保存RPCはメモリ上の偽DB（user×診断×request_id で1行）で、失敗・応答消失・遅延を再現する。
// ここでの PASS は「画面側の処理がこう動く」ことの確認であり、実DB・Previewでの確認ではない。

const linkOf = (tree) => {
  const seen = [];
  (function walk(node) {
    if (!node || typeof node !== "object") return;
    if (node.type?.name === "SaveAwareHistoryLink") seen.push(node.props);
    for (const child of Object.values(node)) if (child && typeof child === "object") walk(child);
  })(tree);
  return seen;
};
function signedIn() { const env = environment(); env.seedDraft(A); return env; }

test("保存失敗→再試行：行は1つだけ、2回とも同じ request_id", async () => {
  const env = signedIn();
  env.failNext();
  const view = env.mount();
  await view.settle();
  assert.equal(view.getStatus(), "failed");
  assert.equal(env.rows.size, 0);
  view.retry();
  await view.settle();
  assert.equal(view.getStatus(), "saved");
  assert.equal(env.rows.size, 1);
  assert.equal(env.calls.length, 2);
  assert.equal(env.calls[0].p_request_id, env.calls[1].p_request_id);
});

test("保存は確定したが応答が届かなかった→再試行しても重複登録しない", async () => {
  const env = signedIn();
  env.loseNextResponse();
  const view = env.mount();
  await view.settle();
  assert.equal(view.getStatus(), "failed");
  assert.equal(env.rows.size, 1);
  view.retry();
  await view.settle();
  assert.equal(view.getStatus(), "saved");
  assert.equal(env.rows.size, 1);
});

test("同じアカウントの2タブで同時に完了しても1行", async () => {
  const env = signedIn();
  const tab1 = env.mount(), tab2 = env.mount();
  await Promise.all([tab1.settle(), tab2.settle()]);
  assert.equal(env.calls.length, 2);
  assert.equal(env.calls[0].p_request_id, env.calls[1].p_request_id);
  assert.equal(env.rows.size, 1);
  assert.equal(tab1.getStatus(), "saved");
  assert.equal(tab2.getStatus(), "saved");
});

test("通信遅延中は「保存中」、応答後に初めて「保存済み」になる（完了前に成功と表示しない）", async () => {
  const env = signedIn();
  const release = env.holdNext();
  const view = env.mount();
  await view.settle();
  assert.equal(view.getStatus(), "saving");
  assert.equal(env.rows.size, 0);
  // 履歴ボタンにも同じ保存状態が渡り、2か所とも食い違わない。
  const links = linkOf(view.getTree());
  assert.ok(links.length >= 1);
  for (const props of links) assert.deepEqual(props, { status: "saving", guest: false });
  release();
  await view.settle();
  assert.equal(view.getStatus(), "saved");
  for (const props of linkOf(view.getTree())) assert.equal(props.status, "saved");
});

test("保存中に履歴へ移っても保存は続き、確定後に履歴を読み直せば出る（画面を離れた場合の再保存は同じ request_id）", async () => {
  const env = signedIn();
  env.loseNextResponse(); // 1回目：確定したが画面には届かない＝途中で画面を離れたのと同じ状態
  await env.mount().settle();
  assert.equal(env.rows.size, 1);
  // 診断ページを開き直す（下書き・request_id はこの端末に残る）
  await env.mount().settle();
  assert.equal(env.rows.size, 1);
  assert.equal(env.calls[0].p_request_id, env.calls[1].p_request_id);
});

// 表示部品の文言（モック不要の単体）。
const src = readFileSync(new URL("../src/components/save-aware-history-link.tsx", import.meta.url), "utf8");
const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
const mod = { exports: {} };
new Function("module", "exports", "require", js)(mod, mod.exports, () => ({ default: "a", jsx: () => null, jsxs: () => null, Fragment: "f" }));
test("履歴ボタンの注意：保存中と失敗のときだけ出し、保存済み・未確認・ゲストでは出さない", () => {
  const { historyLinkNote } = mod.exports;
  assert.match(historyLinkNote("saving", false), /保存中/);
  assert.match(historyLinkNote("failed", false), /履歴には表示されません/);
  assert.doesNotMatch(historyLinkNote("failed", false), /再試行|もう一度/); // 既存のエラー表示と重ねない
  assert.equal(historyLinkNote("saved", false), null);
  assert.equal(historyLinkNote("idle", false), null);
  for (const s of ["idle", "saving", "saved", "failed"]) assert.equal(historyLinkNote(s, true), null);
});

// 実際に描画したHTMLで、注意文が保存状態どおりに出るか（モック上の描画。ブラウザではない）。
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
function resolve(node) {
  if (Array.isArray(node)) return node.map(resolve);
  if (!node || typeof node !== "object") return node;
  if (typeof node.type === "function") return resolve(node.type(node.props));
  return { ...node, props: { ...node.props, children: resolve(node.props?.children) } };
}
function element(node, path = "r") {
  if (Array.isArray(node)) return node.map((c, i) => element(c, `${path}:${i}`));
  if (!node || typeof node !== "object") return node;
  const { children, ref: _ref, ...props } = node.props; void _ref;
  return createElement(node.type, { ...props, key: path }, element(children, `${path}:c`));
}
const html = (view) => renderToStaticMarkup(element(resolve(view.getTree())));

test("描画：保存中→注意あり、保存済み→注意なし、失敗→履歴に出ない旨が1回だけ（再試行の案内は既存表示の1か所のみ）", async () => {
  const env = signedIn();
  const release = env.holdNext();
  const view = env.mount();
  await view.settle();
  assert.match(html(view), /保存中です。保存が終わってから開くと/);
  assert.doesNotMatch(html(view), /アカウントへ保存しました/);
  release();
  await view.settle();
  assert.doesNotMatch(html(view), /保存中です。|history-link-note/);
  assert.match(html(view), /アカウントへ保存しました/);

  const env2 = signedIn();
  env2.failNext();
  const failed = env2.mount();
  await failed.settle();
  const out = html(failed);
  assert.equal(out.split("履歴には表示されません").length - 1, 1);
  assert.equal(out.split("保存を再試行").length - 1, 1);
  assert.match(out, /href="\/diagnosis\/history"/);
});
