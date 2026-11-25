// Builds the E・Code 2026-11-25 local candidate data from the B・Chrome CSVs.
// Usage: node build.js <inDir> <v2-webDir> <reportDir>
const fs = require("fs");
const path = require("path");
const parse = require("./csv.cjs");
const [inDir, web, reportDir] = process.argv.slice(2);
const dataDir = path.join(web, "src/data/player-research");
const read = f => JSON.parse(fs.readFileSync(path.join(dataDir, f), "utf8"));
const write = (p, v) => fs.writeFileSync(p, JSON.stringify(v, null, 2) + "\n");
const CHECKED_ON = "2026-11-25";

const profile = parse(path.join(inDir, "profile.csv"));
const delta = parse(path.join(inDir, "profile_delta.csv"));
const videosCsv = parse(path.join(inDir, "videos.csv"));
const videoDelta = parse(path.join(inDir, "videos_delta.csv"));
const videos = read("videos.json");
const bindings = read("video-bindings.json");
const teamBindings = read("team-bindings.json");
// Product character slugs (e.g. dee-jay, mai) as already used by reviewed player-video characterLinks.
const slugByCharName = {};
for (const v of videos) for (const c of v.characterLinks ?? []) slugByCharName[c.name] = c.slug;
if (Object.keys(slugByCharName).length !== 32) throw new Error("expected 32 product character slugs");
const charLink = name => {
  const clean = name.replace(/（.*?）/g, "").trim();
  const slug = slugByCharName[clean];
  return slug ? { slug, name: clean } : null;
};
const SFL48 = profile.map(p => p["選手ID"]);
const nameToSlug = Object.fromEntries(profile.map(p => [p["表示名"], p["選手ID"]]));
const report = { videos: [], profiles: [], holds: [], csvCorrections: [] };

// ---- identity: env + real ID per slug, reused from already-reviewed bindings ----
const ENV = { production: "wnuxaxbrpudyypzdbdho", development: "vvsknbmlfvvnrmgtyhbf" };
function identities(slug) {
  const out = new Map();
  for (const b of bindings) if (b.playerSlug === slug) out.set(b.environment, b.playerId);
  for (const t of teamBindings) if (t.playerSlug === slug && !out.has(t.environment)) out.set(t.environment, t.playerId);
  return [...out].map(([environment, playerId]) => ({ environment, playerId }));
}
const byKey = new Map(videos.map(v => [v.key, v]));
function addBindings(slug, key) {
  for (const id of identities(slug)) {
    if (!bindings.some(b => b.environment === id.environment && b.playerSlug === slug && b.recommendationKey === key))
      bindings.push({ environment: id.environment, playerId: id.playerId, playerSlug: slug, recommendationKey: key });
  }
}
const toSeconds = t => t.split(":").map(Number).reduce((a, n) => a * 60 + n, 0);

// ---- 1. Division F 第7節 delta: match evidence on the full stream + clip cards ----
const FULL = "BDKiKN1KD0s";
const clipByMatch = new Map(); // chapter time -> clip id (from the original video CSV)
for (const r of videosCsv) if (r["動画ID"] === FULL) {
  const m = r["備考"].match(/クリップ ([A-Za-z0-9_-]{11})/);
  if (m) clipByMatch.set(r["開始時刻"], m[1]);
}
for (const r of videoDelta) {
  const slug = r["選手ID"];
  const fullKey = `${slug}-${FULL}`;
  const full = byKey.get(fullKey);
  if (!full) { report.holds.push({ slug, reason: "フル配信の既存行がない", youtubeId: FULL }); continue; }
  const characterBasis = r["キャラ確認"] === "映像で確認" ? "video_confirmed" : "official_clip_title";
  const evidence = {
    chapterTime: r["概要欄章時刻"],
    // The observed time is one moment inside the match (about 2 min after the chapter). Not a start time.
    matchIdentifiedAt: r["映像確認時刻"],
    matchIdentifiedBy: r["映像で確認した内容"],
    characterBasis,
    characterBasisNote: characterBasis === "video_confirmed" ? r["注記"].split("。")[0] : "公式単試合クリップの題名で確認（映像の使用キャラは未確認）",
    checkedOn: r["確認日"],
  };
  full.matchEvidence = evidence;
  const clipId = clipByMatch.get(r["概要欄章時刻"]);
  const clipKey = `${slug}-${clipId}`;
  let clip = byKey.get(clipKey);
  let action = "既存クリップに根拠を追記";
  if (!clip) {
    // Copy the opponent's reviewed clip row (same official clip, same match) and re-point it to this player.
    const template = videos.find(v => v.youtubeId === clipId);
    if (!template) { report.holds.push({ slug, reason: "公式単試合クリップの行が見つからない", youtubeId: clipId }); continue; }
    const link = charLink(r["使用キャラ"]);
    clip = {
      key: clipKey, playerSlug: slug, title: template.title, youtubeId: clipId, channelName: template.channelName,
      kind: "大会対戦",
      reason: `${r["使用キャラ"]}を使用（使用履歴として掲載。メイン・サブの判定ではありません）。対戦相手: ${r["対戦相手と使用キャラ"]}。`,
      relationConfirmed: true, publicationApproval: "PENDING", sourceDate: template.sourceDate ?? "",
      evidenceBasis: `フル配信の対戦カード映像確認（${r["映像確認時刻"]}・${r["確認日"]}）＋公式単試合クリップ題名。`,
      identityBinding: "2026-11-25 SF6DNA_SFL48_VIDEOS_DELTA_20261125.csv。既存のフル配信行と同じ選手IDで照合。",
      characterLinks: link ? [link] : [],
      startSeconds: 0,
      sameMatchFullStream: { youtubeId: FULL, startSeconds: null, chapterNote: `概要欄の章 ${r["概要欄章時刻"]}・未照合` },
    };
    videos.push(clip); byKey.set(clipKey, clip);
    action = "単試合クリップ行を追加";
  }
  clip.matchEvidence = evidence;
  // Chapter time and the observed in-match moment are both kept as records only; neither becomes a t= link.
  clip.sameMatchFullStream = { youtubeId: FULL, startSeconds: null, chapterNote: `概要欄の章 ${r["概要欄章時刻"]}・未照合` };
  addBindings(slug, fullKey); addBindings(slug, clipKey);
  report.videos.push({ slug, youtubeId: clipId, fullStream: FULL, action, characterBasis });
}

// ---- 2. New player explainer / ranked videos from the 11/25 video CSV ----
const KIND = {
  "解説（選手本人）": "本人解説", "解説・ランクマ（選手本人）": "本人解説", "解説（選手本人・対策）": "本人解説",
  "コーチング（選手本人ch）": "本人解説", "解説（メディア・本人出演）": "本人解説",
  "対戦（ランクマ・本人ch切り抜き）": "配信・ランクマ",
};
const PLAYER_ALIASES = { "Shuto": "shuto", "もけ": "moke", "ぷげら": "pugera", "ACQUA": "acqua", "ナウマン": "nauman", "ガチくん": "gachikun", "sako": "sako" };
const characterVideos = [];
for (const r of videosCsv) {
  const id = r["動画ID"].replace(/\\/g, "");
  const kindLabel = r["種別"];
  const link = charLink(r["使用キャラ"]);
  if (kindLabel === "解説（大会・ゲーム公式）") {
    characterVideos.push({
      key: `official-guide-${id}`, characterSlug: link?.slug ?? null, youtubeId: id, title: r["タイトル"], channelName: r["チャンネル"],
      sourceDate: r["公開日"], category: "解説", origin: "公式キャラクターガイド", playerSlug: null,
      evidenceBasis: r["確認根拠"], caution: "発売・追加時点の仕様の紹介です。現行バージョンと異なる場合があります。",
      publicationApproval: "PENDING",
    });
    continue;
  }
  if (id === FULL) continue;
  const playerSlug = PLAYER_ALIASES[r["対象選手"]] ?? nameToSlug[r["対象選手"]] ?? null;
  const inSfl48 = playerSlug && SFL48.includes(playerSlug);
  if (KIND[kindLabel] !== "配信・ランクマ") {
    characterVideos.push({
      key: `player-guide-${id}`, characterSlug: link?.slug ?? null, youtubeId: id, title: r["タイトル"], channelName: r["チャンネル"],
      sourceDate: r["公開日"], category: "解説", origin: inSfl48 ? "選手の解説動画" : "解説動画（Player図鑑48名の対象外）",
      playerSlug: inSfl48 ? playerSlug : null,
      evidenceBasis: r["確認根拠"], caution: null, publicationApproval: "PENDING",
    });
  }
  if (!inSfl48) { report.holds.push({ youtubeId: id, reason: `選手紐づけなし: ${r["対象選手"]} はPlayer図鑑48名の対象外（キャラページのみ）` }); continue; }
  const key = `${playerSlug}-${id}`;
  if (byKey.has(key)) { report.csvCorrections.push({ youtubeId: id, csv: r["既存登録との重複"], actual: "既存（videos.json に同じ選手・動画あり）" }); continue; }
  const kind = KIND[kindLabel];
  if (!kind) { report.holds.push({ youtubeId: id, reason: `未対応の種別 ${kindLabel}` }); continue; }
  const row = {
    key, playerSlug, title: r["タイトル"], youtubeId: id, channelName: r["チャンネル"], kind,
    reason: kind === "配信・ランクマ" ? `${r["使用キャラ"]}を使用（本人チャンネルの切り抜き。対戦相手の選手名は未確認）。`
      : kindLabel.includes("メディア") ? `${r["使用キャラ"]}について本人が出演して解説している動画（メディア制作）。` : `${r["使用キャラ"]}について本人が解説している動画。`,
    relationConfirmed: true, publicationApproval: "PENDING", sourceDate: r["公開日"],
    evidenceBasis: `${r["確認根拠"]}（2026-11-25 SF6DNA_SFL48_VIDEOS_20261125.csv）`,
    identityBinding: "2026-11-25 動画CSV。既存の確認済みバインディングと同じ選手IDで照合。",
    characterLinks: link ? [link] : [],
  };
  if (!identities(playerSlug).length) { report.holds.push({ youtubeId: id, reason: `${playerSlug} の環境別IDが台帳にない` }); continue; }
  videos.push(row); byKey.set(key, row); addBindings(playerSlug, key);
  report.videos.push({ slug: playerSlug, youtubeId: id, action: `${kind}を追加` });
}
// CSV said BDKiKN1KD0s was 新規 — it was already registered for all 18 players.
report.csvCorrections.push({ youtubeId: FULL, csv: "なし（新規）", actual: `既存（${videos.filter(v => v.youtubeId === FULL).length}選手の行あり。11/19統合で登録済み）` });

// ---- 3. Profile supplements (birth date, hometown, hobby, self comment, device, SNS, SFL team, characters) ----
const deltaBy = (slug, item) => delta.find(d => d["選手ID"] === slug && d["項目"] === item);
const confirmed = s => s && s.startsWith("確認済み");
const UNSET = /^(未確認|-|)$/;
const SFL_SOURCE = slug => `https://sf.esports.capcom.com/sfl2026/player/${slug}/`;
const supplements = [];
for (const p of profile) {
  const slug = p["選手ID"];
  const ids = identities(slug);
  const facts = [];
  const add = (field, label, value, basis, sourceUrl, extra = {}) => { if (value && !UNSET.test(value)) facts.push({ field, label, value, basis, sourceUrl, checkedOn: CHECKED_ON, ...extra }); };
  // SFL team (official roster) and normal affiliation (sponsors/agencies, Wiki) are separate fields.
  add("sflTeam", "SFL2026所属チーム", p["SFL2026所属チーム"], "SFL2026公式ロスター", p["SFL2026所属_出典"]);
  add("affiliationHistory", "所属・スポンサー（履歴）", p["Wiki所属_現在"], "Wiki記載（スポンサー・事務所を含む）", p["Wiki出典URL"], { state: "HISTORICAL" });
  const reg = deltaBy(slug, "使用キャラ（公式登録）");
  if (confirmed(reg?.["状態"])) add("sflRegisteredCharacters", "開幕前のSFL公式登録キャラ", reg["新値"].replace(/\//g, "・"), "SFL公式選手データ（開幕前登録。現在のメイン・サブとは別）", SFL_SOURCE(slug));
  add("characterHistory", "SF6での使用キャラ（履歴・参考）", p["Wiki使用キャラ_SF6"].replace(/[CM]：/g, ""), "Wiki記載の使用履歴（現在のメイン・サブの判定ではない）", p["Wiki出典URL"], { state: "HISTORICAL" });
  const dev = deltaBy(slug, "デバイス");
  if (dev && (dev["状態"].startsWith("確認済み") || dev["状態"].startsWith("種類のみ確認済み"))) {
    const [type, modelRaw] = dev["新値"].split("／");
    const modelConfirmed = dev["状態"] === "確認済み（種類=公式、機種=二次まとめ）";
    const model = modelConfirmed && modelRaw && !modelRaw.startsWith("機種候補") ? modelRaw : null;
    add("device", "デバイス", model ? `${type}（${model}）` : type,
      model ? "種類はSFL公式選手データ、機種は二次まとめ（今季の本人発信は未照合）" : "種類はSFL公式選手データ（機種は未確認のため非掲載）",
      dev["出典URL"].split(" ")[0], { deviceType: type, deviceModel: model });
  }
  const birth = deltaBy(slug, "生年月日");
  if (birth && birth["状態"] === "確認済み（SFL公式）") add("birthDate", "生年月日", birth["新値"], "SFL公式選手プロフィール", SFL_SOURCE(slug));
  else if (birth) report.profiles.push({ slug, field: "birthDate", result: "非掲載（未成年のため・指示どおり空欄）" });
  const home = deltaBy(slug, "出身");
  if (confirmed(home?.["状態"])) add("hometown", "出身", home["新値"], "SFL公式選手プロフィール", SFL_SOURCE(slug));
  const hobby = deltaBy(slug, "好きなもの（趣味）");
  if (confirmed(hobby?.["状態"])) add("hobby", "趣味", hobby["新値"], "本人回答（SFL公式Q&A・開幕前）", SFL_SOURCE(slug));
  const qa = deltaBy(slug, "プレイスタイル根拠");
  if (confirmed(qa?.["状態"])) {
    const m = qa["新値"].match(/「(.+?)」→「(.+)」/);
    if (m) add("selfComment", "本人コメント（プレイの見どころ）", m[2], "本人回答（SFL公式Q&A「俺のプレイのここを見ろ！」・開幕前の自己申告）", SFL_SOURCE(slug));
  }
  // SNS: officially listed and matched to this player only. Swapped official links stay on HOLD.
  const sns = [];
  const pushSns = (kind, url, basis) => { if (url && /^https:\/\//.test(url)) sns.push({ kind, url, basis }); };
  const xDelta = deltaBy(slug, "X");
  if (xDelta && xDelta["状態"].startsWith("HOLD")) { pushSns("X", p["X"], "SFL公式ロスター（CAPCOM eSports投稿の転載）・既存確認済みを維持"); report.holds.push({ slug, field: "X", reason: `公式データの入れ替わり疑い: ${xDelta["新値"]} は保留` }); }
  else pushSns("X", p["X"], "SFL公式ロスター（CAPCOM eSports投稿の転載）");
  for (const kind of ["YouTube", "Twitch"]) {
    const d = deltaBy(slug, kind);
    if (d && d["状態"] === "確認済み（SFL公式掲載）") pushSns(kind, d["新値"], "SFL公式選手データのSNSリンク");
    else if (d && d["状態"].startsWith("HOLD")) report.holds.push({ slug, field: kind, reason: `公式データの入れ替わり疑い: ${d["新値"]} は保留（Wiki値 ${p[kind]} も本人未照合のため不採用）` });
  }
  if (sns.length) facts.push({ field: "sns", label: "SNS・外部リンク", value: sns, basis: "本人との対応を確認できた公式リンクのみ", sourceUrl: SFL_SOURCE(slug), checkedOn: CHECKED_ON });
  const row = { playerSlug: slug, displayName: p["表示名"], publicationApproval: "PENDING", identities: ids, facts,
    note: "2026-11-25 B・Chrome CSV（SFL48_PROFILE・PROFILE_DELTA）から作成。プレイスタイルのWiki本文は転載しない。" };
  if (!ids.length) report.holds.push({ slug, reason: "環境別の選手IDが台帳にないため表示接続できない" });
  supplements.push(row);
}

write(path.join(dataDir, "videos.json"), videos);
write(path.join(dataDir, "video-bindings.json"), bindings);
write(path.join(dataDir, "profile-supplements.json"), supplements);
fs.mkdirSync(path.join(web, "src/data/character-videos"), { recursive: true });
write(path.join(web, "src/data/character-videos/registered.json"), characterVideos);
write(path.join(reportDir, "build-report.json"), report);
console.log({ videos: videos.length, bindings: bindings.length, supplements: supplements.length, characterVideos: characterVideos.length,
  added: report.videos.length, holds: report.holds.length, csvCorrections: report.csvCorrections.length });
