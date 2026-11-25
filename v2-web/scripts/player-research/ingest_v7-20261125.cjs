// V7: Johnny's 10th video (AmZn_aPumJY, team scrim vs ENZO). Idempotent. AkcN0vJFDLk stays on hold.
// Usage: node ingest_v7.js <inDir> <v2-webDir>
const fs = require("fs"), path = require("path");
const parse = require("./csv.cjs");
const [inDir, web] = process.argv.slice(2);
const p = f => path.join(web, "src/data/player-research", f);
const videos = JSON.parse(fs.readFileSync(p("videos.json"), "utf8"));
const bindings = JSON.parse(fs.readFileSync(p("video-bindings.json"), "utf8"));
const sup = JSON.parse(fs.readFileSync(p("profile-supplements.json"), "utf8"));
const [r] = parse(path.join(inDir, "v7.csv"));
if (r["動画ID"] !== "AmZn_aPumJY" || r["選手ID"] !== "johnny") throw new Error("unexpected V7 row");
const key = "johnny-AmZn_aPumJY";
if (!videos.some(v => v.key === key)) {
  videos.push({
    key, playerSlug: "johnny", title: r["タイトル"], youtubeId: r["動画ID"], channelName: "ジョニィ / Johnny",
    // Not an official tournament and not ranked: counted under 本人の解説・実演 (B's classification).
    kind: "本人解説",
    reason: "チーム間スクリムでエレナを使用（ENZO・サガットとの対戦。公式大会ではありません）。使用履歴として掲載し、メイン・サブの判定ではありません。投稿チャンネルの運営者は未確認です。日付は公開日です。",
    relationConfirmed: true, publicationApproval: "PENDING", sourceDate: r["公開日"],
    evidenceBasis: `${r["確認根拠"]}（映像確認時刻 ${r["映像確認時刻"]}。本人とキャラの確認時刻で、試合開始時刻ではない。概要欄の章時刻 ${r["再生開始時刻（掲載用）"]} は映像で開始位置を確認するまで備考のみ）（B・Chrome 2026-11-25 V7）`,
    identityBinding: "2026-11-25 V7。SFL48の環境別IDで照合。",
    characterLinks: [{ slug: "elena", name: "エレナ" }],
    uploaderChannel: r["投稿元"], channelOperatorConfirmed: false,
    cardNote: "チーム間スクリム（公式大会ではない）",
    matchEvidence: { identifiedAt: r["映像確認時刻"], chapterTime: r["再生開始時刻（掲載用）"], startTimeConfirmed: false, checkedOn: "2026-11-25" },
  });
}
for (const id of sup.find(s => s.playerSlug === "johnny").identities)
  if (!bindings.some(b => b.environment === id.environment && b.recommendationKey === key))
    bindings.push({ environment: id.environment, playerId: id.playerId, playerSlug: "johnny", recommendationKey: key });
fs.writeFileSync(p("videos.json"), JSON.stringify(videos, null, 2) + "\n");
fs.writeFileSync(p("video-bindings.json"), JSON.stringify(bindings, null, 2) + "\n");
console.log("ok", videos.filter(v => v.playerSlug === "johnny").length, "johnny rows; held AkcN0vJFDLk present:", videos.some(v => v.youtubeId === "AkcN0vJFDLk"));
