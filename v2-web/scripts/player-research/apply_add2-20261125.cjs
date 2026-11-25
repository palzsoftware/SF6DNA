// Applies B's ADD2 rows to the local candidate data (all rows stay PENDING). Idempotent.
// Usage: node apply_add2.js <v2-webDir> <proposal.json>
const fs = require("fs");
const path = require("path");
const [web, proposalFile] = process.argv.slice(2);
const p = f => path.join(web, "src/data", f);
const read = f => JSON.parse(fs.readFileSync(p(f), "utf8"));
const write = (f, v) => fs.writeFileSync(p(f), JSON.stringify(v, null, 2) + "\n");
const proposal = JSON.parse(fs.readFileSync(proposalFile, "utf8"));
const videos = read("player-research/videos.json");
const bindings = read("player-research/video-bindings.json");
const sup = read("player-research/profile-supplements.json");
const registered = read("character-videos/registered.json");
const log = [];

// 1. Clip cards for jr / yas / wabiichi / kawano (one card per match and player; the full stream stays a supporting link).
for (const c of proposal.clipCards) {
  const { bindings: ids, ...row } = c;
  row.matchEvidence = { ...row.matchEvidence, chapterNote: `概要欄の章 ${row.matchEvidence.chapterTime}（選手紹介を含む可能性・開始時刻ではない）` };
  if (!videos.some(v => v.key === row.key)) { videos.push(row); log.push(`clip ${row.key}`); }
  for (const id of ids) if (id.playerId && !bindings.some(b => b.environment === id.environment && b.recommendationKey === row.key))
    bindings.push({ environment: id.environment, playerId: id.playerId, playerSlug: row.playerSlug, recommendationKey: row.key });
}

// 2. Character-page match videos not tied to a player (Alex new official, Marisa 2025 past tournament).
const charMatch = [
  { key: "character-match-hXprOsQeWPs", characterSlug: "alex", youtubeId: "hXprOsQeWPs",
    title: "Zhen (M. Bison) vs. HotDog29 (Alex) - GTW vs. Yesports - Day 4 - SFL EMEAA 2026", channelName: "Capcom Fighters",
    sourceDate: "2026-09-11", category: "対戦", origin: "公式大会の対戦（SFL EMEAA 2026）", playerSlug: null,
    evidenceBasis: "公式チャンネルのタイトル・概要欄で選手とキャラを確認。映像未確認（B・Chrome 2026-11-25 ADD2）。HotDog29・ZhenはPlayer図鑑48名の対象外のため選手には紐づけない",
    caution: null, publicationApproval: "PENDING" },
  // Displayed titles omit the Division/section (description and title disagree) and any unverified usage time.
  { key: "character-match-goaaIfjiP7c", characterSlug: "marisa", youtubeId: "goaaIfjiP7c",
    title: "あきら（キャミィ）vs ジョニィ（マリーザ）｜SFL: Pro-JP 2025", channelName: "Capcom Fighters JP",
    sourceDate: "2025-11-12", category: "対戦", origin: "2025年の過去大会（SFL: Pro-JP 2025）", playerSlug: "johnny",
    evidenceBasis: "公式タイトルで選手・キャラを確認。映像未確認。概要欄の節表記がタイトルと不一致のため節情報は表示しない",
    caution: "2025年の過去大会です。現行バージョンと異なる場合があります。", publicationApproval: "PENDING" },
  { key: "character-match-lzINQNblcww", characterSlug: "marisa", youtubeId: "lzINQNblcww",
    title: "水派（舞）vs 板橋ザンギエフ（マリーザ・ザンギエフ）｜SFL: Pro-JP 2025", channelName: "Capcom Fighters JP",
    sourceDate: "2025-11-26", category: "対戦", origin: "2025年の過去大会（SFL: Pro-JP 2025）", playerSlug: "itabashi-zangief",
    evidenceBasis: "公式タイトルで確認（試合中にマリーザ・ザンギエフを切替）。マリーザ使用区間は映像未確認のため時刻は表示しない",
    caution: "2025年の過去大会です。現行バージョンと異なる場合があります。", publicationApproval: "PENDING" },
];
for (const row of charMatch) {
  const dupPlayer = videos.filter(v => v.youtubeId === row.youtubeId).map(v => v.key);
  const dupReg = registered.filter(v => v.youtubeId === row.youtubeId).map(v => v.key);
  if (dupReg.length) { log.push(`skip ${row.key}: already registered ${dupReg}`); continue; }
  if (dupPlayer.length) log.push(`note ${row.key}: also a player row ${dupPlayer}`);
  registered.push(row); log.push(`character ${row.key}`);
}

// 4. SNS: bonchan / kazunoko YouTube+Twitch confirmed by mutual links; existing verified X kept.
for (const s of proposal.snsHoldRelease) {
  const row = sup.find(x => x.playerSlug === s.playerSlug);
  const sns = row.facts.find(f => f.field === "sns");
  const basis = "本人のYouTube・Twitch・Xの相互リンクで確認（B・Chrome 2026-11-25）。SFL公式データ側は入れ替わりの誤登録と判断";
  const keepX = sns.value.filter(l => l.kind === "X");
  if (keepX.length !== 1 || keepX[0].url !== s.x) throw new Error(`unexpected X for ${s.playerSlug}`);
  sns.value = [...keepX, { kind: "YouTube", url: s.youtube, basis }, { kind: "Twitch", url: s.twitch, basis }];
  log.push(`sns ${s.playerSlug}`);
}

write("player-research/videos.json", videos);
write("player-research/video-bindings.json", bindings);
write("player-research/profile-supplements.json", sup);
write("character-videos/registered.json", registered);
console.log(log.join("\n"));
