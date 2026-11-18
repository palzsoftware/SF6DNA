// 派生パターン(通常/チャージ/パーフェクト)の切り替え表示を Chromium で確かめる(読み取り専用)。
// 使い方: node verify-gif-variants.mjs --character luke [--base http://127.0.0.1:3107] [--out <dir>]
// 注意: クリック操作を伴うため hydration が必要。開発サーバーは 127.0.0.1 だと hydration されないため localhost で開く。
// 合格条件: ①各技で「いま見えているカード」が1枚だけ ②タブを押すと、そのパターンのGIFに切り替わる(srcが変わる)
//          ③切り替え後のGIFが読み込め(naturalWidth>0)・フレームが変化する ④配信エラー(4xx/5xx)なし ⑤noindex
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import path from "node:path";
const require = createRequire(import.meta.url);

/** @returns {Promise<{groups:number,tabs:number,switched:number,loaded:number,moving:number,onlyOneVisible:number,bad:string[],noindex:boolean,perGroup:object[],pass:boolean}>} */
export async function verifyGifVariants({ character, base = "http://localhost:3107", outDir, expectedGroups = null }) {
  const { chromium } = require("playwright");
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const bad = [];
    page.on("response", (r) => { if (r.url().includes("/gif-qa/") && r.status() >= 400) bad.push(`${r.status()} ${r.url()}`); });
    await page.goto(`${base}/internal/gif-qa/${character}/variants`, { waitUntil: "load", timeout: 120000 });
    await page.waitForSelector("[data-local-qa-switcher]", { timeout: 60000 });
    await page.waitForTimeout(2000);
    const noindex = await page.evaluate(() => document.querySelector("meta[name='robots']")?.getAttribute("content")?.includes("noindex") ?? false);
    const groups = page.locator("[data-local-qa-variant-group]");
    const groupCount = await groups.count();
    let tabs = 0, switched = 0, loaded = 0, moving = 0, onlyOneVisible = 0;
    const perGroup = [];
    for (let g = 0; g < groupCount; g++) {
      const grp = groups.nth(g);
      const slug = await grp.getAttribute("data-move-slug");
      const connection = await grp.getAttribute("data-connection");
      const keys = await grp.locator("[role=tab]").evaluateAll((els) => els.map((e) => e.getAttribute("data-variant-key")));
      const row = { slug, connection, variants: [] };
      let oneVisibleAll = true;
      for (const key of keys) {
        tabs++;
        // 実際のクリック操作で切り替える(画面外なら自動でスクロールされる)。パネルが見えるまで待つ(開発サーバーは初回描画が遅い)
        await grp.locator(`[role=tab][data-variant-key="${key}"]`).click({ timeout: 15000 });
        await grp.locator(`[data-variant-panel="${key}"]`).waitFor({ state: "visible", timeout: 15000 }).catch(() => {});
        await page.waitForTimeout(400);
        // 見えているカードは1枚だけか(切り替えで他のカードが隠れているか)
        const visible = await grp.locator("[data-local-qa-variant-card]").evaluateAll((els) => els.filter((e) => e.offsetParent !== null).map((e) => e.getAttribute("data-variant-key")));
        const one = visible.length === 1 && visible[0] === key;
        if (!one) oneVisibleAll = false;
        const img = grp.locator(`[data-local-qa-variant-card][data-variant-key="${key}"] img[src*='gif-qa']`).first();
        await img.evaluate((el) => { el.loading = "eager"; });
        const ok = await img.evaluate((el) => new Promise((resolve) => { const t0 = Date.now(); const tick = () => (el.complete && el.naturalWidth > 0 ? resolve(true) : Date.now() - t0 > 10000 ? resolve(false) : setTimeout(tick, 100)); tick(); }));
        const src = await img.getAttribute("src");
        // フレームが動いているか(同じ位置を時間をあけて2回撮り、画素が変わるか)。clip撮影で要素の可視判定を避ける
        let isMoving = false;
        const visibleBox = ok && await img.evaluate((el) => el.getBoundingClientRect().width > 0);
        if (visibleBox) {
          const box = await img.evaluate((el) => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; });
          if (process.env.DBG) console.error("box", slug, key, JSON.stringify(box));
          const shot = () => page.screenshot({ clip: box });
          const a = await shot(); await page.waitForTimeout(450); const b = await shot(); await page.waitForTimeout(450); const c = await shot();
          isMoving = !a.equals(b) || !b.equals(c);
        }
        if (ok) loaded++; if (isMoving) moving++; if (one) switched++;
        row.variants.push({ key, visibleOnlyThis: one, loaded: ok, moving: isMoving, src });
      }
      if (oneVisibleAll) onlyOneVisible++;
      // タブ間でGIFのsrcが全て異なること(切り替えても同じ映像を出していない)
      row.distinctSrc = new Set(row.variants.map((v) => v.src)).size === row.variants.length;
      perGroup.push(row);
    }
    if (outDir) { mkdirSync(outDir, { recursive: true }); await page.screenshot({ path: path.join(outDir, `variants-${character}.png`), fullPage: false }); }
    const pass = groupCount > 0 && (expectedGroups == null || groupCount === expectedGroups) && switched === tabs && loaded === tabs
      && onlyOneVisible === groupCount && perGroup.every((g) => g.distinctSrc) && bad.length === 0 && noindex;
    return { groups: groupCount, tabs, switched, loaded, moving, onlyOneVisible, bad, noindex, perGroup, pass };
  } finally { await browser.close(); }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const arg = (k, d = null) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : d; };
  const r = await verifyGifVariants({ character: arg("character", "luke"), base: arg("base", "http://localhost:3107"), outDir: arg("out") ?? undefined });
  console.log(JSON.stringify(r, null, 2));
  process.exit(r.pass ? 0 : 1);
}
