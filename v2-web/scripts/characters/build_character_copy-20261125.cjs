// Builds src/data/character-copy/character-copy-20261125.json from C's 32-character copy CSV
// (SF6DNA_CHARACTER_COPY_32_FOR_E_20261125.csv). Local candidate only: no DB write, no schema change.
// Usage: node scripts/characters/build_character_copy-20261125.cjs <csv> <out.json>
const fs = require("fs");

function parseCsv(file) {
  const t = fs.readFileSync(file, "utf8").replace(/^﻿/, "");
  const rows = []; let r = [], f = "", q = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) { if (c === '"') { if (t[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === ",") { r.push(f); f = ""; }
    else if (c === "\n") { r.push(f.replace(/\r$/, "")); rows.push(r); r = []; f = ""; }
    else f += c;
  }
  if (f || r.length) { r.push(f); rows.push(r); }
  const h = rows.shift();
  return rows.filter(x => x.length > 1).map(x => Object.fromEntries(h.map((k, i) => [k, x[i] ?? ""])));
}

// Arjun: adopt only text backed by the official frame table; hold text that rests on pre-release articles or
// viewer posts (current performance is not asserted until checked in the released game).
const ARJUN_HOLD = {
  summary: "実装前の記事に基づく説明のため保留",
  weaknesses: "公式資料で裏付けられないため保留",
  firstSteps: [0, 2], // 1: viewer post, 3: depends on pre-release mechanics
  guide: ["how", "weak"],
};

const [csv, out] = process.argv.slice(2);
const rows = parseCsv(csv);
const bySlug = {};
const held = [];
for (const row of rows) {
  const slug = row.slug;
  const entry = bySlug[slug] ??= { slug, name: row["キャラ"], sources: [], checkedOn: row["確認日"], state: row["状態"] };
  for (const u of row["出典URL"].split(/\s*／\s*/)) {
    const url = (u.match(/https:\/\/\S+?(?=（|$)/) || [])[0];
    const note = (u.match(/（(.*)）/) || [])[1] || "";
    if (url && !entry.sources.some(s => s.url === url)) entry.sources.push({ url, note });
  }
  const item = row["項目"]; const action = row["対応"]; const text = row["差し替え原稿"].trim();
  const field = item.startsWith("冒頭") ? "summary" : item.startsWith("強み") ? "strengths" : item.startsWith("注意点") ? "weaknesses"
    : item.startsWith("最初に") ? "firstSteps" : item.startsWith("詳しい") ? "guide" : null;
  if (!field) throw new Error(`unknown item ${item}`);
  if (action === "維持") continue;
  if (field === "firstSteps") {
    let steps = text.split(/\s*／\s*/).map(s => s.replace(/^\d+\.\s*/, "").trim()).filter(Boolean);
    if (slug === "arjun") { held.push({ slug, field, reason: "視聴者投稿・実装前情報に基づく手順を保留", text: ARJUN_HOLD.firstSteps.map(i => steps[i]) }); steps = steps.filter((_, i) => !ARJUN_HOLD.firstSteps.includes(i)); }
    entry.firstSteps = steps;
  } else if (field === "guide") {
    const g = {};
    for (const part of text.split(/\s*／\s*/)) {
      const m = part.match(/^(どう勝つ|強い所|苦手)：(.*)$/);
      if (!m) throw new Error(`guide part ${slug}: ${part}`);
      g[{ "どう勝つ": "how", "強い所": "strong", "苦手": "weak" }[m[1]]] = m[2].trim();
    }
    if (slug === "arjun") for (const k of ARJUN_HOLD.guide) { held.push({ slug, field: `guide.${k}`, reason: "実装前の記事の情報を含むため保留", text: g[k] }); delete g[k]; }
    entry.guide = g;
  } else if (action === "差し替え") {
    if (slug === "arjun" && ARJUN_HOLD[field]) { held.push({ slug, field, reason: ARJUN_HOLD[field], text }); continue; }
    entry[field] = text;
  }
}
const data = { source: "SF6DNA_CHARACTER_COPY_32_FOR_E_20261125.csv (C)", builtOn: "2026-11-25",
  note: "出典確認済み・ゲーム内での確認は未実施。舞の表示名・URLは変更しない。", characters: bySlug, held };
fs.mkdirSync(require("path").dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(data, null, 2) + "\n");
const n = f => Object.values(bySlug).filter(e => e[f]).length;
console.log({ characters: Object.keys(bySlug).length, summary: n("summary"), strengths: n("strengths"), weaknesses: n("weaknesses"), firstSteps: n("firstSteps"), guide: n("guide"), held: held.length });
