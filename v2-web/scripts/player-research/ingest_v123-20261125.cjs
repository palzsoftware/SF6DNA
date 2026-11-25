// Ingest B's video handoff V1–V3 (2026-11-25). All rows stay PENDING. Idempotent on the same baseline.
// Usage: node ingest_v123.js <inDir> <v2-webDir> <report.json>
const fs = require("fs");
const path = require("path");
const parse = require("./csv.cjs");
const [inDir, web, reportOut] = process.argv.slice(2);
const p = f => path.join(web, "src/data", f);
const read = f => JSON.parse(fs.readFileSync(p(f), "utf8"));
const write = (f, v) => fs.writeFileSync(p(f), JSON.stringify(v, null, 2) + "\n");
const videos = read("player-research/videos.json");
const bindings = read("player-research/video-bindings.json");
const sup = read("player-research/profile-supplements.json");
const researchBindings = read("player-research/research-bindings.json");
const registered = read("character-videos/registered.json");
const chars = read("character-videos/character-ids.json").characters;
const slugByName = Object.fromEntries(Object.entries(chars).map(([s, c]) => [c.name, s]));
const PROD = "wnuxaxbrpudyypzdbdho", DEV = "vvsknbmlfvvnrmgtyhbf", YT = /^[A-Za-z0-9_-]{11}$/;
const idsBefore = new Set([...videos.map(v => v.youtubeId), ...registered.map(v => v.youtubeId)]);
const bindingsBefore = bindings.length;
const report = { rows: {}, outcomes: {}, playerLinksAdded: 0, characterLinksAdded: 0, newPlayerRows: 0, newCharacterRows: 0, versionNotes: 0, patchConfirmed: 0, held: [] };
const outcome = (src, k) => { report.outcomes[k] = (report.outcomes[k] || 0) + 1; report.rows[src] = (report.rows[src] || 0) + 1; };

const identities = slug => {
  const s = sup.find(x => x.playerSlug === slug);
  if (s) return s.identities;
  const m = new Map();
  for (const b of bindings) if (b.playerSlug === slug && !m.has(b.environment)) m.set(b.environment, b.playerId);
  const rb = researchBindings[slug];
  if (rb?.production && !m.has(PROD)) m.set(PROD, rb.production);
  if (rb?.development && !m.has(DEV)) m.set(DEV, rb.development);
  return [...m].map(([environment, playerId]) => ({ environment, playerId }));
};
const addBindings = (slug, key) => { for (const id of identities(slug)) if (!bindings.some(b => b.environment === id.environment && b.recommendationKey === key)) bindings.push({ environment: id.environment, playerId: id.playerId, playerSlug: slug, recommendationKey: key }); };
const channel = s => s.replace(/（(第三者|本人ch|公式)）$/, "");
const parseFull = cell => { const m = (cell || "").match(/watch\?v=([A-Za-z0-9_-]{11})(?:&t=\d+s)?\s*([^\s].*)?/); return m ? { youtubeId: m[1], startSeconds: null, chapterNote: m[2] ? `概要欄の章 ${m[2]}・映像未照合` : null } : null; };
const kindOf = t => /ランクマ・リプレイ/.test(t) ? "配信・ランクマ" : /大会対戦/.test(t) ? "大会対戦" : "本人解説";

const rows = ["v1", "v2", "v3"].flatMap(f => parse(path.join(inDir, `${f}.csv`)).map(r => ({ ...r, _src: f.toUpperCase() })));
for (const r of rows) {
  const id = r["動画ID"], src = r._src;
  if (r["区分"] === "確認待ち") { report.held.push(`${src} ${id} ${r["選手ID"]}: ${r["備考"]}`); outcome(src, "保留（確認待ち）"); continue; }
  const c = slugByName[(r["キャラ"] || "").replace(/（.*?）/g, "").trim()];
  if (!YT.test(id) || !c) { outcome(src, "保留（ID・キャラ照合不可）"); continue; }
  const kind = kindOf(r["種別"]);
  const version = /Year\s*\d/i.test(`${r["備考"]} ${r["確認根拠"]}`) ? `${r["備考"]}`.trim() : null;
  if (version) report.versionNotes++;
  if (/現行パッチ(対応)?確認済み/.test(`${r["備考"]} ${r["確認根拠"]}`)) report.patchConfirmed++;
  const toPlayer = /Player図鑑/.test(r["掲載先"]) && r["選手ID"] && identities(r["選手ID"]).length;
  const evidence = `${r["確認根拠"]}${r["映像確認時刻"] ? `（映像確認時刻 ${r["映像確認時刻"]}。本人とキャラの確認時刻で、試合開始時刻ではない）` : ""}（B・Chrome 2026-11-25 ${src}）`;
  if (toPlayer) {
    const slug = r["選手ID"], key = `${slug}-${id}`;
    const existing = videos.find(v => v.key === key);
    if (existing) {
      const links = existing.characterLinks ?? (existing.characterLinks = []);
      if (!links.some(l => l.slug === c)) { links.push({ slug: c, name: chars[c].name }); report.characterLinksAdded++; outcome(src, "既存の選手カードにキャラを追加"); }
      else outcome(src, "既存の選手カードと同一（重複）");
      addBindings(slug, key);
      continue;
    }
    const third = /第三者/.test(r["投稿元"]), own = /本人ch/.test(r["投稿元"]);
    const row = {
      key, playerSlug: slug, title: r["タイトル"], youtubeId: id, channelName: channel(r["投稿元"]), kind,
      reason: kind === "配信・ランクマ"
        ? `ランクマッチ／リプレイで${chars[c].name}を使用（使用履歴。メイン・サブの判定ではありません）。${third ? "第三者チャンネルの投稿（出演選手は画面で確認）" : own ? "本人チャンネルの投稿" : ""}。日付は公開日です。`
        : kind === "大会対戦" ? `${chars[c].name}を使用（使用履歴として掲載。メイン・サブの判定ではありません）。${r["相手選手"] ? `対戦相手: ${r["相手選手"]}。` : ""}`
        : `${chars[c].name}について本人が解説・実演している動画。`,
      relationConfirmed: true, publicationApproval: "PENDING", sourceDate: r["公開日"],
      ...(r["対戦日"] ? { matchDate: r["対戦日"] } : {}),
      evidenceBasis: evidence,
      identityBinding: `2026-11-25 ${src}。既存の環境別IDで照合。`,
      characterLinks: [{ slug: c, name: chars[c].name }],
      uploaderChannel: r["投稿元"],
      ...(r["映像確認時刻"] ? { matchEvidence: { identifiedAt: r["映像確認時刻"], startTimeConfirmed: false, checkedOn: "2026-11-25" } } : {}),
      ...(version ? { versionNote: version, patchVerified: false } : {}),
    };
    const full = parseFull(r["同一試合のクリップ・フル配信"]);
    if (full && full.youtubeId !== id) Object.assign(row, { startSeconds: 0, sameMatchFullStream: full });
    videos.push(row); addBindings(slug, key);
    if (idsBefore.has(id)) { report.playerLinksAdded++; outcome(src, "既存動画に選手を紐づけ（カードは増えない）"); }
    else { report.newPlayerRows++; outcome(src, "新規動画（選手カード）"); }
    continue;
  }
  // Character page + video list only.
  const category = kind === "本人解説" ? "解説" : "対戦";
  if (registered.some(v => v.youtubeId === id && v.characterSlug === c) || videos.some(v => v.youtubeId === id && (v.characterLinks ?? []).some(l => l.slug === c))) {
    outcome(src, "既存のキャラ紐づけと同一（重複）"); continue;
  }
  registered.push({ key: `character-${category === "解説" ? "guide" : "match"}-${id}-${c}`, characterSlug: c, youtubeId: id, title: r["タイトル"], channelName: channel(r["投稿元"]),
    sourceDate: r["公開日"], category, origin: kind === "配信・ランクマ" ? "ランクマ／リプレイ（第三者投稿）" : /第三者/.test(r["投稿元"]) ? "解説動画（第三者投稿）" : "解説動画",
    playerSlug: null, evidenceBasis: evidence, caution: version ? `出典の版情報: ${version}（現行パッチ対応は未確認）` : null, publicationApproval: "PENDING" });
  if (idsBefore.has(id)) { report.characterLinksAdded++; outcome(src, "既存動画にキャラを紐づけ（カードは増えない）"); }
  else { report.newCharacterRows++; outcome(src, "新規動画（キャラ単独）"); }
}
const idsAfter = new Set([...videos.map(v => v.youtubeId), ...registered.map(v => v.youtubeId)]);
report.newYoutubeIds = [...idsAfter].filter(x => !idsBefore.has(x)).length;
report.bindingsAdded = bindings.length - bindingsBefore;
write("player-research/videos.json", videos);
write("player-research/video-bindings.json", bindings);
write("character-videos/registered.json", registered);
fs.writeFileSync(reportOut, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ ...report, held: report.held.length }, null, 1));
