// B final check (SF6DNA_E_FIX_FINALCHECK_20261125.csv): adds the 3 videos that were not in the candidate yet.
// Other 9 items were already reflected (F7 clip folding, Sagat / Jamie corrections, goaaIfjiP7c section HOLD,
// Bonchan / Kazunoko SNS, ACQUA / Takagi / Johnny SNS left out). Idempotent. Titles from YouTube oEmbed 2026-11-25.
// Times seen in the video and description chapters stay notes; no playback start time is set.
// Usage: node scripts/player-research/ingest_finalcheck-20261125.cjs [v2-webDir]
const fs = require("fs"), path = require("path");
const web = process.argv[2] || path.join(__dirname, "../..");
const p = f => path.join(web, "src/data/player-research", f);
const videos = JSON.parse(fs.readFileSync(p("videos.json"), "utf8"));
const bindings = JSON.parse(fs.readFileSync(p("video-bindings.json"), "utf8"));
const sup = JSON.parse(fs.readFileSync(p("profile-supplements.json"), "utf8"));
const checked = "2026-11-25";
const rows = [
  { playerSlug: "yas", youtubeId: "ogYDRoQZ7cw", kind: "配信・ランクマ", character: ["ryu", "リュウ"],
    title: "SF6 ▰ YAS (#1 Ranked Ryu) vs KAZUNOKO (#3 Ranked Cammy) ▰ High Level Gameplay", channelName: "SF6 High Level Replays",
    reason: "ランクマッチ／リプレイでリュウを使用（使用履歴。メイン・サブの判定ではありません）。相手: かずのこ（キャミィ）。第三者チャンネルの投稿（出演選手は画面で確認）。公開日は未確認です。",
    evidence: "映像確認：ゲーム内名「YAS」・RYU／相手「Kazunoko」・CAMMY（映像確認時刻 1:00。本人とキャラの確認時刻で、試合開始時刻ではない）（B・2026-11-25 最終点検）" },
  { playerSlug: "john-takeuchi", youtubeId: "CNsAkggGGmc", kind: "配信・ランクマ", character: ["jamie", "ジェイミー"],
    title: "【世界1位 極・ジェイミー】 竹内ジョン (ジェイミー) vs キャミィ , サガット , ルーク｜魅せるゼェッ！酔いを深めつつ叩き込む豪快な連撃 【スト6】", channelName: "SF6 Battlers Archive",
    reason: "ランクマッチ／リプレイでジェイミーを使用（複数試合のまとめ。使用履歴でメイン・サブの判定ではありません）。第三者チャンネルの投稿（出演選手は画面で確認）。公開日は未確認です。",
    evidence: "映像確認：ゲーム内名「DFM竹内ジョン(本垢)」・JAMIE（映像確認時刻 1:00。本人とキャラの確認時刻で、試合開始時刻ではない）（B・2026-11-25 最終点検）" },
  { playerSlug: "johnny", youtubeId: "AkcN0vJFDLk", kind: "本人解説", character: ["elena", "エレナ"],
    title: "【スト6】IBUSHIGINチーム練習ヴァイパー編！CR対策とアニメマンガ雑談【ジョニィ】【FUKUSHIMA IBUSHIGIN】", channelName: "ジョニィ / Johnny",
    reason: "チーム練習の対戦でエレナを使用（公式大会ではありません。使用履歴として掲載し、メイン・サブの判定ではありません）。投稿チャンネルの運営者は未確認です。",
    evidence: "映像確認：自分側「YOU」・ゲーム内名「ジョニィ」・ELENA（V7と同じCFN。映像確認時刻 1:00）。概要欄チャプター「00:10 ジョニィ試合」は備考のみ（B・2026-11-25 最終点検）",
    cardNote: "チーム練習の対戦（公式大会ではない）", chapterTime: "0:10", uploaderChannel: "ジョニィ / Johnny", channelOperatorConfirmed: false },
];
let added = 0;
for (const r of rows) {
  const key = `${r.playerSlug}-${r.youtubeId}`;
  if (!videos.some(v => v.key === key)) {
    const row = { key, playerSlug: r.playerSlug, title: r.title, youtubeId: r.youtubeId, channelName: r.channelName, kind: r.kind,
      reason: r.reason, relationConfirmed: true, publicationApproval: "PENDING", evidenceBasis: r.evidence,
      identityBinding: "2026-11-25 B最終点検。既存の環境別IDで照合。", characterLinks: [{ slug: r.character[0], name: r.character[1] }],
      uploaderChannel: r.uploaderChannel ?? `${r.channelName}（第三者）` };
    if (r.channelOperatorConfirmed === false) row.channelOperatorConfirmed = false;
    if (r.cardNote) row.cardNote = r.cardNote;
    row.matchEvidence = { identifiedAt: "1:00", ...(r.chapterTime ? { chapterTime: r.chapterTime } : {}), startTimeConfirmed: false, checkedOn: checked };
    videos.push(row); added++;
  }
  for (const id of sup.find(s => s.playerSlug === r.playerSlug).identities)
    if (!bindings.some(b => b.environment === id.environment && b.recommendationKey === key))
      bindings.push({ environment: id.environment, playerId: id.playerId, playerSlug: r.playerSlug, recommendationKey: key });
}
fs.writeFileSync(p("videos.json"), JSON.stringify(videos, null, 2) + "\n");
fs.writeFileSync(p("video-bindings.json"), JSON.stringify(bindings, null, 2) + "\n");
console.log("added", added, "rows");
