// ローカルQA表示のGIFがChromiumで実際に「表示され・動いている」かを確かめる(読み取り専用)。
// 使い方: node verify-gif-playback.mjs --character jp [--base http://127.0.0.1:3107] [--view qa|unified] [--out <dir>]
//   qa      : /internal/gif-qa/<slug>          (QA専用ページ)
//   unified : /internal/gif-qa/<slug>/unified  (通常ページと同じ CharacterUnifiedPage に接続した確認ページ)
// 合格条件: 期待本数のGIFが全て読み込め(naturalWidth>0)、フレームが変化し、配信エラー(4xx/5xx)が無く、noindexである。
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import path from "node:path";
const require = createRequire(import.meta.url);

/** @returns {Promise<{view:string,character:string,expected:number,imgs:number,loaded:number,moving:number,movingUnmeasured:number,bad:string[],noindex:boolean,mp4Videos:number,pass:boolean}>} */
export async function verifyGifPlayback({ character, base = "http://127.0.0.1:3107", view = "qa", expected, outDir, expectedMp4 = null }) {
  const { chromium } = require("playwright");
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const bad = [];
    page.on("response", (r) => { if (r.url().includes("/gif-qa/") && r.status() >= 400) bad.push(`${r.status()} ${r.url()}`); });
    await page.goto(`${base}/internal/gif-qa/${character}${view === "unified" ? "/unified" : ""}`, { waitUntil: "load", timeout: 120000 });
    // 開発サーバーは接続を張り続けるため networkidle を使わず、画面が落ち着くまで少し待つ。
    // 待機中のページ再読込(開発サーバーの再接続)で実行環境が壊れた場合は1回だけやり直す。
    const settle = async () => { await page.waitForTimeout(3000); await page.evaluate(() => Promise.all([...document.querySelectorAll("img[src*='gif-qa']")].map((i) =>
      Promise.race([i.decode().catch(() => {}), new Promise((r) => setTimeout(r, 10000))])))); };
    try { await settle(); } catch { await page.waitForLoadState("load"); await settle(); }
    // ページ内の画像は遅延読込のため、1枚ずつ画面へ移動し、読み込み完了を待ってから判定する
    const locs = page.locator("img[src*='gif-qa']"); const count = await locs.count(); // 再描画で要素が差し替わっても追従できるよう、都度ロケーターで取得する
    // 先に全画像を eager にして読み込み完了を待つ(後から読み込まれてレイアウトがずれるのを防ぐ)
    await page.evaluate(() => document.querySelectorAll("img[src*='gif-qa']").forEach((el) => { el.loading = "eager"; }));
    await page.waitForFunction(() => [...document.querySelectorAll("img[src*='gif-qa']")].every((el) => el.complete && el.naturalWidth > 0), null, { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(500);
    let loaded = 0, moving = 0, movingUnmeasured = 0;
    for (let n = 0; n < count; n++) {
      const h = locs.nth(n);
      // 通常ページの画像は loading="lazy"。ヘッドレスでは遅延読込が発火しない場合があるため、
      // 検査では eager にして「配信・デコード・再生」を確かめる(遅延読込の挙動そのものは検査対象外)
      await h.evaluate((el) => { el.loading = "eager"; window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - innerHeight / 2, behavior: "instant" }); });
      const ok = await h.evaluate((el) => new Promise((resolve) => {
        const t0 = Date.now();
        const tick = () => (el.complete && el.naturalWidth > 0 ? resolve(true) : Date.now() - t0 > 10000 ? resolve(false) : setTimeout(tick, 100));
        tick();
      }));
      if (!ok) continue;
      loaded++;
      // 動いているか: 同じ要素を350ms間隔で2回撮って差があるか(読み込み後はレイアウトが安定しているため撮れる)
      await page.waitForTimeout(300);
      // Playwrightの要素スクリーンショットは通常ページ上で「非表示」と誤判定するため、表示領域を直接切り出す
      const shoot = async () => {
        const r = await h.evaluate((el) => { window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - innerHeight / 2, behavior: "instant" }); const b = el.getBoundingClientRect(); return { x: b.x, y: b.y, width: b.width, height: b.height }; });
        return page.screenshot({ clip: { x: Math.max(0, r.x), y: Math.max(0, r.y), width: Math.max(1, Math.min(r.width, 1280 - r.x)), height: Math.max(1, Math.min(r.height, 900 - r.y)) } });
      };
      try {
        const first = await shoot(); await page.waitForTimeout(350);
        if (!first.equals(await shoot())) moving++;
      } catch { movingUnmeasured++; } // 通常ページ上ではスクロール位置の都合で撮れない場合がある(その場合は未計測として記録)
    }
    const imgs = { length: count };
    const noindex = /name="robots" content="noindex/.test(await page.content());
    const mp4Videos = await page.$$eval("video", (v) => v.length);
    if (outDir) { mkdirSync(outDir, { recursive: true }); await page.screenshot({ path: path.join(outDir, `playback-${character}-${view}.png`), fullPage: true }); }
    return { view, character, expected, imgs: imgs.length, loaded, moving, movingUnmeasured, bad, noindex, mp4Videos,
      // 動作(moving)は QA専用ページでは必須。通常ページ接続の確認(unified)では読み込み・配信・MP4/GIFの数を必須とし、動作は参考値
      pass: imgs.length === expected && loaded === expected && bad.length === 0 && noindex && (view === "unified" || moving === expected) &&
        (expectedMp4 === null || mp4Videos === expectedMp4), // 既存MP4が減っていない(MP4優先の維持)
    };
  } finally { await browser.close(); }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const arg = (k, d = null) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : d; };
  const r = await verifyGifPlayback({ character: arg("character"), base: arg("base") ?? undefined, view: arg("view", "qa"), expected: Number(arg("expected", "0")), outDir: arg("out") ?? undefined });
  console.log(JSON.stringify(r, null, 2)); process.exit(r.pass ? 0 : 1);
}
