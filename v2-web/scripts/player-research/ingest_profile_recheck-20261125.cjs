// B's 48-player profile recheck (317 rows) → profile-supplements.json. Every row gets exactly one outcome.
// Rules: fix confirmed errors/blanks; never replace an already-confirmed value with a shorter Q&A summary;
// device model only when confirmed; minors' birth dates stay unpublished; sub-character candidates stay pending;
// SNS only official / mutually-linked values; unconfirmed-operator channels are not added to the SNS section.
// Usage: node ingest_profile_recheck.js <inDir> <v2-webDir> <report.json>
const fs = require("fs"), path = require("path");
const parse = require("./csv.cjs");
const [inDir, web, reportOut] = process.argv.slice(2);
const file = path.join(web, "src/data/player-research/profile-supplements.json");
const sup = JSON.parse(fs.readFileSync(file, "utf8"));
const rows = parse(path.join(inDir, "recheck.csv"));
const CHECKED = "2026-11-25";
const MINORS = new Set(["hinao", "takepi"]);
const report = { total: rows.length, outcomes: {}, byItem: {}, pending: [], held: [], applied: [] };
const outcome = (r, k, note) => {
  report.outcomes[k] = (report.outcomes[k] || 0) + 1;
  const it = report.byItem[r["項目"]] ??= {}; it[k] = (it[k] || 0) + 1;
  if (k.startsWith("反映")) report.applied.push(`${r["選手ID"]} ${r["項目"]}: ${note}`);
  if (k.startsWith("確認待ち")) report.pending.push(`${r["選手ID"]} ${r["項目"]}: ${r["修正案"]}`);
  if (k.startsWith("保留")) report.held.push(`${r["選手ID"]} ${r["項目"]}: ${r["修正案"]}（${r["採用理由または保留理由"].slice(0, 60)}）`);
};
const norm = s => String(s ?? "").replace(/[「」\s]/g, "").replace(/[（(]/g, "（").replace(/[）)]/g, "）");
const srcUrl = r => (r["根拠URL"] || "").split(/\s+/).find(u => /^https:\/\//.test(u)) || null;
const setFact = (s, field, label, value, basis, url, extra = {}) => {
  const i = s.facts.findIndex(f => f.field === field);
  const fact = { field, label, value, basis, sourceUrl: url, checkedOn: CHECKED, ...extra };
  if (i >= 0) s.facts[i] = { ...s.facts[i], ...fact }; else s.facts.push(fact);
};
const deviceText = v => { const [type, model] = v.split("／"); return { type: type.trim(), model: model && !/^機種候補/.test(model) ? model.trim() : null }; };

for (const r of rows) {
  const s = sup.find(x => x.playerSlug === r["選手ID"]);
  if (!s) { outcome(r, "保留（選手IDが48人に該当なし）"); continue; }
  const item = r["項目"], judge = r["判定"], proposal = r["修正案"], url = srcUrl(r);
  const get = field => s.facts.find(f => f.field === field);
  if (judge === "確認待ち") { outcome(r, "確認待ち（担当判断が必要）"); continue; }
  if (judge === "保留") { outcome(r, "保留（本人照合・運営者が未確認）"); continue; }
  switch (item) {
    case "生年月日": {
      if (MINORS.has(s.playerSlug)) { outcome(r, "既存値を維持（未成年のため非掲載）"); break; }
      const f = get("birthDate");
      if (f && norm(f.value) === norm(proposal)) outcome(r, "既存値を維持（同じ値）");
      else if (!url) outcome(r, "保留（出典URLなし）");
      else { setFact(s, "birthDate", "生年月日", proposal, "SFL公式選手プロフィール", url); outcome(r, "反映（誤り・空欄の修正）", proposal); }
      break;
    }
    case "出身": case "趣味・好きなもの": {
      const field = item === "出身" ? "hometown" : "hobby";
      const f = get(field);
      if (f && norm(f.value) === norm(proposal)) outcome(r, "既存値を維持（同じ値）");
      else if (!url || /未確認/.test(proposal)) outcome(r, "保留（出典URLなし）");
      else {
        setFact(s, field, item === "出身" ? "出身" : "趣味", proposal, item === "出身" ? "SFL公式選手プロフィール" : "本人回答（SFL公式Q&A・開幕前）", url);
        outcome(r, "反映（誤り・空欄の修正）", proposal);
      }
      break;
    }
    case "デバイス": {
      const f = get("device"), next = deviceText(proposal);
      const value = next.model ? `${next.type}（${next.model}）` : next.type;
      if (f && norm(f.value) === norm(value)) outcome(r, "既存値を維持（同じ値）");
      else if (!url) outcome(r, "保留（出典URLなし）");
      else {
        setFact(s, "device", "デバイス", value, next.model ? "種類はSFL公式選手データ、機種は二次まとめ（今季の本人発信は未照合）" : "種類はSFL公式選手データ（機種は未確認のため非掲載）",
          url, { deviceType: next.type, deviceModel: next.model });
        outcome(r, "反映（誤り・空欄の修正）", value);
      }
      break;
    }
    case "プレイスタイル": {
      // Already-confirmed self comment is kept; the short Q&A summary only fills a blank.
      const f = get("selfComment"), q = proposal.replace(/^「|」$/g, "");
      if (f && norm(f.value) === norm(q)) outcome(r, "既存値を維持（同じ値）");
      else if (f) outcome(r, "既存値を維持（確認済みの記述を置き換えない）");
      else if (!url) outcome(r, "保留（出典URLなし）");
      else { setFact(s, "selfComment", "本人コメント（プレイの見どころ）", q, "本人回答（SFL公式Q&A「俺のプレイのここを見ろ！」・開幕前の自己申告）", url); outcome(r, "反映（空欄の補完）", q); }
      break;
    }
    case "使用キャラ（履歴）": {
      // Per-match usage (格ゲーチェッカー) is tournament usage history; confirmed main/sub stay unchanged.
      const usage = (proposal.match(/SFL2026使用：([^／]+)/) || [])[1];
      if (!usage) { outcome(r, "保留（集計値なし）"); break; }
      const f = get("sflMatchCharacters");
      if (f && norm(f.value) === norm(usage)) { outcome(r, "既存値を維持（同じ値）"); break; }
      setFact(s, "sflMatchCharacters", "SFL2026の試合での使用キャラ（使用回数）", usage.trim(), "格ゲーチェッカーの試合別記録（大会での使用履歴。現在のメイン・サブの判定ではない）",
        url ?? "https://sf.esports.capcom.com/sfl2026/", { state: "HISTORICAL" });
      outcome(r, "反映（大会での使用履歴を追加）", usage.trim());
      break;
    }
    case "YouTube": case "Twitch": {
      const sns = get("sns");
      const links = Array.isArray(sns?.value) ? sns.value : [];
      const cur = links.find(l => l.kind === item);
      if (!/^https:\/\//.test(proposal)) { outcome(r, "保留（URLなし）"); break; }
      if (cur && cur.url.replace(/\/$/, "") === proposal.replace(/\/$/, "")) { outcome(r, "既存値を維持（同じ値）"); break; }
      if (cur && /相互リンク/.test(cur.basis)) { outcome(r, "既存値を維持（相互リンクで確認済み）"); break; }
      const basis = /相互リンク/.test(r["採用理由または保留理由"]) ? "本人のYouTube・Twitch・Xの相互リンクで確認" : "SFL公式選手データのSNSリンク";
      const nextLinks = [...links.filter(l => l.kind !== item), { kind: item, url: proposal, basis }];
      if (sns) sns.value = nextLinks; else s.facts.push({ field: "sns", label: "SNS・外部リンク", value: nextLinks, basis: "本人との対応を確認できた公式リンクのみ", sourceUrl: url, checkedOn: CHECKED });
      outcome(r, cur ? "反映（誤りの修正）" : "反映（空欄の補完）", proposal);
      break;
    }
    case "別表記":
      // Search aliases live in the DB (player_aliases); this is a DB change, recorded as a proposal only.
      outcome(r, "保留（DBの別名登録が必要）"); break;
    default:
      outcome(r, `保留（未対応の項目: ${item}）`);
  }
}
// Order facts consistently for display.
const ORDER = ["sflTeam", "affiliationHistory", "sflRegisteredCharacters", "sflMatchCharacters", "characterHistory", "device", "birthDate", "hometown", "hobby", "selfComment", "sns"];
for (const s of sup) s.facts.sort((a, b) => ORDER.indexOf(a.field) - ORDER.indexOf(b.field));
fs.writeFileSync(file, JSON.stringify(sup, null, 2) + "\n");
fs.writeFileSync(reportOut, JSON.stringify(report, null, 2));
const sum = Object.values(report.outcomes).reduce((a, b) => a + b, 0);
console.log(JSON.stringify({ total: report.total, sum, outcomes: report.outcomes, byItem: report.byItem }, null, 1));
