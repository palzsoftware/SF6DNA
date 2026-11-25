// Ingest B's 32-character inventory (987 rows) + ranked/replay (46 rows) into the local candidate data.
// All rows stay PENDING. Idempotent: re-running on the same baseline gives the same output.
// Usage: node ingest_inventory.js <inDir> <v2-webDir> <reportOut.json>
const fs = require("fs");
const path = require("path");
const parse = require("./csv.cjs");
const [inDir, web, reportOut] = process.argv.slice(2);
const p = f => path.join(web, "src/data", f);
const read = f => JSON.parse(fs.readFileSync(p(f), "utf8"));
const write = (f, v) => fs.writeFileSync(p(f), JSON.stringify(v, null, 2) + "\n");
const inv = parse(path.join(inDir, "inventory.csv"));
const ranked = parse(path.join(inDir, "ranked.csv"));
const videos = read("player-research/videos.json");
const bindings = read("player-research/video-bindings.json");
const sup = read("player-research/profile-supplements.json");
const researchBindings = read("player-research/research-bindings.json");
const registered = read("character-videos/registered.json");
const chars = read("character-videos/character-ids.json").characters;
const slugByName = Object.fromEntries(Object.entries(chars).map(([slug, c]) => [c.name, slug]));
Object.assign(slugByName, { "A.K.I": "aki", "M.バイソン": "m-bison", "ディージェイ": "dee-jay", "不知火舞": "mai", "Cヴァイパー": "c-viper" });
const PROD = "wnuxaxbrpudyypzdbdho", DEV = "vvsknbmlfvvnrmgtyhbf";
const YT = /^[A-Za-z0-9_-]{11}$/;
const report = { playerRowsAdded: 0, playerRowsCharacterLinked: 0, characterRowsAdded: 0, held: {}, unknownCharacter: [], unknownPlayer: {}, duplicatesSkipped: 0 };
const hold = (why, r) => { report.held[why] = (report.held[why] || 0) + 1; };

// Environment IDs: SFL48 supplements first, then IDs already used by reviewed bindings.
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
const charSlug = name => slugByName[(name || "").replace(/（.*?）/g, "").trim()] ?? null;
const parseFull = cell => {
  const m = (cell || "").match(/watch\?v=([A-Za-z0-9_-]{11})(?:&t=(\d+)s)?\s*([^\s].*)?/);
  return m ? { youtubeId: m[1], startSeconds: null, chapterNote: m[3] ? `概要欄の章 ${m[3]}・映像未照合` : null } : null;
};
const ADOPT = new Set(["掲載候補", "掲載候補（新規）", "新規候補(公式単試合クリップ)", "既存紐づけ補強", "掲載候補（選手登録が前提）"]);
// Character-page-only explainer candidates that B named explicitly for a character page (2026-11-25 reconciliation).
const CHARACTER_PAGE_GUIDES = new Map([
  ["JP詳細の関連動画候補（2026.08.03以降の資料）", null],
  ["リュウ詳細の関連動画候補＋Shutoの動画候補。2026.08.03より前の資料と明記", "2026年8月3日より前の資料です。現行バージョンと異なる場合があります。"],
]);
// One outcome per source CSV row (rows and added bindings are counted separately).
const rowOutcome = {};
const outcome = k => { rowOutcome[k] = (rowOutcome[k] || 0) + 1; };
const byKey = new Map(videos.map(v => [v.key, v]));
const regByKey = new Map(registered.map(v => [v.key, v]));

// ---- 1. ranked/replay: 7 adoption candidates only; 39 unverified stay on hold ----
const rankedAdopted = new Set();
for (const r of ranked) {
  if (r["状態"] !== "採用候補") { hold("ランクマ: 本人対応未確認", r); continue; }
  const slug = r["選手ID"], id = r["動画ID"], c = charSlug(r["使用キャラ"]);
  if (!YT.test(id) || !c || !identities(slug).length) { hold("ランクマ: ID・キャラ照合不可", r); continue; }
  rankedAdopted.add(id);
  const key = `${slug}-${id}`;
  const own = /本人ch/.test(r["投稿チャンネル"]);
  const row = byKey.get(key) ?? {
    key, playerSlug: slug, title: r["タイトル"], youtubeId: id, channelName: r["投稿チャンネル"].replace(/（本人ch）$/, ""),
    kind: "配信・ランクマ",
    // Usage history only (main/sub unchanged). Opponent name omitted; the date is the upload date, not the match date.
    reason: `ランクマッチで${r["使用キャラ"]}を使用（使用履歴。メイン・サブの判定ではありません）。${own ? "本人チャンネルの投稿" : "第三者チャンネルの投稿（出演選手は画面のCFN名で確認）"}。日付は投稿日です。`,
    relationConfirmed: true, publicationApproval: "PENDING", sourceDate: r["投稿日"],
    evidenceBasis: `${r["確認根拠"]}（確認時刻 ${r["該当時刻"]}。試合開始時刻ではない）。B・Chrome 2026-11-25 SFL48_RANKED_REPLAY`,
    identityBinding: "2026-11-25 ランクマCSV。SFL48の環境別IDで照合。",
    characterLinks: [{ slug: c, name: chars[c].name }],
    uploaderChannel: r["投稿チャンネル"], performerConfirmedBy: "画面のCFN名",
    matchEvidence: { identifiedAt: r["該当時刻"], startTimeConfirmed: false, checkedOn: "2026-11-25" },
  };
  if (!byKey.has(key)) { videos.push(row); byKey.set(key, row); report.playerRowsAdded++; }
  addBindings(slug, key);
}

// ---- 2. inventory (one outcome per source row) ----
const bindingsBefore = bindings.length;
const holdRow = (why, r) => { hold(why, r); outcome(`保留・対象外: ${why}`); };
for (const r of inv) {
  const id = r["動画ID"], treat = r["扱い"];
  if (!YT.test(id)) { holdRow("動画ID不正", r); continue; }
  if (rankedAdopted.has(id)) { outcome("ランクマCSVの採用候補として処理済み"); continue; }
  if (treat === "掲載候補（新規・ランクマ）") { holdRow("ランクマ: 採用候補7件以外", r); continue; }
  const characterPageGuide = CHARACTER_PAGE_GUIDES.has(treat);
  if (!ADOPT.has(treat) && !characterPageGuide) { holdRow(`扱い: ${treat}`, r); continue; }
  if (r["区分"] === "参考") { holdRow("区分: 参考", r); continue; }
  const c = charSlug(r["キャラ"]);
  if (!c) { report.unknownCharacter.push(r["キャラ"]); holdRow("キャラ照合不可", r); continue; }
  const slug = characterPageGuide ? "" : r["選手ID"];
  const ids = slug ? identities(slug) : [];
  const ownChannel = /選手本人/.test(r["出典区分"]);
  const official = r["出典区分"] === "公式";
  const isGuide = r["区分"] === "解説";
  // Player link only with evidence: a registered player ID, and for 解説 only the player's own channel.
  if (slug && ids.length && (!isGuide || ownChannel)) {
    const key = `${slug}-${id}`;
    const existing = byKey.get(key);
    if (existing) {
      // Existing card: fill a missing upload date, add the character link if new.
      if (!existing.sourceDate && r["投稿日"]) { existing.sourceDate = r["投稿日"]; report.sourceDateFilled = (report.sourceDateFilled || 0) + 1; }
      const links = existing.characterLinks ?? (existing.characterLinks = []);
      if (!links.some(l => l.slug === c)) { links.push({ slug: c, name: chars[c].name }); report.playerRowsCharacterLinked++; outcome("既存の選手カードにキャラを追加"); }
      else { report.duplicatesSkipped++; outcome("既存の選手カードと同一（重複）"); }
      addBindings(slug, key);
      continue;
    }
    if (!official && !ownChannel) { holdRow("出典: 公式・本人以外", r); continue; }
    const full = parseFull(r["同一試合のクリップ・フル配信"]);
    const year = (r["投稿日"] || "").slice(0, 4);
    const row = {
      key, playerSlug: slug, title: r["タイトル"], youtubeId: id, channelName: r["投稿元"],
      kind: isGuide ? "本人解説" : "大会対戦",
      reason: isGuide ? `${chars[c].name}について本人が解説している動画。` : `${chars[c].name}を使用（使用履歴として掲載。メイン・サブの判定ではありません）。${r["対戦相手"] && !/^-|題名参照$/.test(r["対戦相手"]) ? `対戦相手: ${r["対戦相手"]}。` : ""}`,
      relationConfirmed: true, publicationApproval: "PENDING", sourceDate: r["投稿日"],
      evidenceBasis: `${r["確認方法"]}（B・Chrome 2026-11-25 32CHAR_VIDEO_INVENTORY／元資料 ${r["元資料"]}）${r["保留理由・備考"] ? "。" + r["保留理由・備考"] : ""}`,
      identityBinding: "2026-11-25 統合一覧。既存の環境別IDで照合。",
      characterLinks: [{ slug: c, name: chars[c].name }],
      ...(full && full.youtubeId !== id ? { startSeconds: 0, sameMatchFullStream: full } : {}),
      ...(year && year < "2026" ? { pastYear: year } : {}),
    };
    videos.push(row); byKey.set(key, row); addBindings(slug, key); report.playerRowsAdded++; outcome("選手カードを新規追加");
    continue;
  }
  if (slug && !ids.length) report.unknownPlayer[slug] = (report.unknownPlayer[slug] || 0) + 1;
  // Character-only: official sources, or a pro's own channel (explainer), or a page B named explicitly.
  if (!official && !(isGuide && ownChannel) && !characterPageGuide) { holdRow("キャラ単独: 公式・本人チャンネル以外", r); continue; }
  const key = `character-${isGuide ? "guide" : "match"}-${id}-${c}`;
  if (regByKey.has(key) || registered.some(v => v.youtubeId === id && v.characterSlug === c)) { report.duplicatesSkipped++; outcome("既存のキャラ動画と同一（重複）"); continue; }
  const year = (r["投稿日"] || "").slice(0, 4);
  const past = year && year < "2026";
  const note = CHARACTER_PAGE_GUIDES.get(treat) ?? null;
  const row = { key, characterSlug: c, youtubeId: id, title: r["タイトル"], channelName: r["投稿元"], sourceDate: r["投稿日"],
    category: isGuide ? "解説" : "対戦",
    origin: past ? `${year}年の${isGuide ? "動画" : "過去大会"}` : isGuide ? (official ? "公式の解説動画" : `${r["選手"]}さん本人の解説動画`) : "公式大会の対戦",
    playerSlug: null, evidenceBasis: `${r["確認方法"]}（B・Chrome 2026-11-25 32CHAR_VIDEO_INVENTORY／出典 ${r["出典区分"]}）。選手はPlayer図鑑に紐づけない`,
    caution: note ?? (past ? `${year}年の動画です。現行バージョンと異なる場合があります。` : null), publicationApproval: "PENDING" };
  registered.push(row); regByKey.set(key, row); report.characterRowsAdded++; outcome("キャラ単独カードを新規追加");
}
report.inventoryRowOutcomes = rowOutcome;
report.inventoryRowsTotal = inv.length;
report.bindingsAddedByInventory = bindings.length - bindingsBefore;


// Past-tournament cards reviewed on 2026-11-25 (ADD2): the player rows use the same cleaned title
// (no conflicting Division / section, year shown), so every screen shows the same card text.
for (const reviewed of registered.filter(v => v.category === "対戦" && v.caution && v.playerSlug)) {
  for (const row of videos.filter(v => v.youtubeId === reviewed.youtubeId)) {
    row.title = reviewed.title;
    row.pastYear = (reviewed.sourceDate || "").slice(0, 4) || row.pastYear;
    report.titleAligned = (report.titleAligned || 0) + 1;
  }
}
write("player-research/videos.json", videos);
write("player-research/video-bindings.json", bindings);
write("character-videos/registered.json", registered);
fs.writeFileSync(reportOut, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ ...report, unknownCharacter: [...new Set(report.unknownCharacter)], unknownPlayerCount: Object.keys(report.unknownPlayer).length, videos: videos.length, registered: registered.length, bindings: bindings.length }, null, 1));
