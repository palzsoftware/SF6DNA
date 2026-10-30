import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { environment } from "./helpers/diagnosis-owner-save-harness.mjs";

// Real Runner + real presentational children, deterministic hooks/RPC/storage.
// These verify rendered failure messages and bound retry callbacks, not a real
// browser, focus, authentication, DB persistence, or RLS execution.
function resolve(node) {
  if (Array.isArray(node)) return node.map(resolve);
  if (!node || typeof node !== "object") return node;
  if (typeof node.type === "function") return resolve(node.type(node.props));
  return { ...node, props: { ...node.props, children: resolve(node.props?.children) } };
}
function element(node, renderPath = "root") {
  if (Array.isArray(node)) return node.map((child, index) => element(child, `${renderPath}:${index}`));
  if (!node || typeof node !== "object") return node;
  const { children, ref: ignoredRef, ...props } = node.props;
  void ignoredRef;
  // The deterministic JSX fixture discards JSX key arguments; keys here belong
  // only to its SSR adapter and make no assertion about production list keys.
  return createElement(node.type, { ...props, key: props.key ?? renderPath }, element(children, `${renderPath}:children`));
}
const html = view => renderToStaticMarkup(element(resolve(view.getTree())));
function button(view, label) {
  function find(node) {
    if (Array.isArray(node)) return node.map(find).find(Boolean);
    if (!node || typeof node !== "object") return null;
    if (node.type === "button" && node.props.children === label) return node;
    return find(node.props?.children);
  }
  const result = find(resolve(view.getTree()));
  assert.ok(result, `visible button: ${label}`);
  return result;
}
function keepsResultAndLinks(markup, heading) {
  assert.match(markup, new RegExp(`<h2[^>]*>${heading}</h2>`));
  assert.match(markup, /href="\/daily"[^>]*>今日の練習を決める/);
  assert.match(markup, /href="\/diagnosis\/history"[^>]*>診断履歴を見る/);
}

for (const [diagnosisType, heading] of [["improvement", "まず取り組む練習"], ["comprehensive", "総合診断結果"]]) {
  test(`${diagnosisType}: account failure has an alert and its rendered retry retains result/navigation`, async () => {
    const env = environment({ diagnosisType }); env.failNext();
    const view = env.mount(); await view.settle();
    const failed = html(view);
    assert.match(failed, /role="alert"/);
    assert.match(failed, /診断結果をアカウントに保存できませんでした/);
    assert.doesNotMatch(failed, /診断結果をこの端末の履歴に保存できませんでした/);
    keepsResultAndLinks(failed, heading);
    await button(view, "保存を再試行").props.onClick(); await view.settle();
    const recovered = html(view);
    assert.match(recovered, /診断結果をアカウントへ保存しました/);
    assert.doesNotMatch(recovered, /role="alert"/);
    keepsResultAndLinks(recovered, heading);
  });
}

test("guest history failure has its own alert/retry without an account-failure message or RPC", async () => {
  const env = environment(); env.setUser(null); env.seedDraft(null); env.setHistoryWritesBlocked(true);
  const view = env.mount(); await view.settle();
  const failed = html(view);
  assert.match(failed, /role="alert"/);
  assert.match(failed, /診断結果をこの端末の履歴に保存できませんでした/);
  assert.doesNotMatch(failed, /診断結果をアカウントに保存できませんでした/);
  keepsResultAndLinks(failed, "まず取り組む練習");
  env.setHistoryWritesBlocked(false);
  button(view, "履歴保存を再試行").props.onClick(); await view.settle();
  assert.doesNotMatch(html(view), /role="alert"/);
  keepsResultAndLinks(html(view), "まず取り組む練習");
  assert.equal(env.calls.length, 0);
});

test("character-fit recommendation loading and empty states remain live and retain the result/CTA", async () => {
  let finish;
  const pending = new Promise(resolveFetch => { finish = resolveFetch; });
  const env = environment({ diagnosisType: "character_fit", fetch: () => pending });
  const view = env.mount(); await view.settle();
  const loading = html(view);
  assert.match(loading, /role="status" aria-label="キャラクター推薦" aria-live="polite"/);
  assert.match(loading, /候補を探しています/);
  keepsResultAndLinks(loading, "相性が良さそうなキャラクター特性");
  finish({ ok: true, json: async () => ({ recommendations: [] }) }); await view.settle();
  const empty = html(view);
  assert.match(empty, /推薦に必要なキャラクター情報がまだ不足しています/);
  assert.doesNotMatch(empty, /候補を探しています|href="\/characters\//);
  keepsResultAndLinks(empty, "相性が良さそうなキャラクター特性");
});

test("recommendation failure remains visible without hiding diagnosis result/history/Daily15", async () => {
  const env = environment({ diagnosisType: "character_fit", fetch: async () => { throw Error("fixture unavailable"); } });
  const view = env.mount(); await view.settle();
  const failed = html(view);
  assert.match(failed, /おすすめのキャラクターを読み込めませんでした。診断結果はこのまま見られます/);
  assert.doesNotMatch(failed, /fixture unavailable|href="\/characters\//);
  keepsResultAndLinks(failed, "相性が良さそうなキャラクター特性");
});
