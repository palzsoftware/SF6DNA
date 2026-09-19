function evidence(id, kind, statement, overrides = {}) {
  return { id, kind, statement, sourceId: null, sourceUrl: null, patch: null, confidence: 0.7, verificationStatus: "unverified", characterSlug: null, playerId: null, createdAt: null, patchStatus: null, sourceType: null, sourceReliability: null, ...overrides };
}

function result(overrides = {}) {
  return { summary: "確認できる情報を整理します。", strengths: [], priorityIssues: [], drills: [], evidence: [], uncertainty: [], nextActions: [], ...overrides };
}

const verified = evidence("verified", "VERIFIED_GAME_FACT", "公式情報で確認されたゲーム事実です。", { sourceId: "official", sourceUrl: "https://www.streetfighter.com/6/ja-jp/", patch: "2.10", patchStatus: "PATCH_MATCH", verificationStatus: "verified", characterSlug: "jp", sourceType: "official" });
const assertion = evidence("assertion", "PLAYER_STATEMENT", "この技は+3Fだと思う。", { sourceId: "user-input:question", playerId: "synthetic-player" });
const reviewed = evidence("reviewed", "SOURCE_BACKED_FACT", "公開プロフィールに掲載された情報です。", { sourceId: "profile", sourceUrl: "https://example.com/profile", verificationStatus: "reviewed", playerId: "synthetic-player", sourceType: "player_profile" });

export const GOLDEN_COACH_FIXTURES = [
  { id: "diagnosis-only", result: result({ priorityIssues: [{ id: "p", title: "対空", detail: "対空判断を確認します。", evidenceIds: ["diag"] }], strengths: [{ id: "s", title: "確認", detail: "相手の動きを見ています。", evidenceIds: ["diag"] }], evidence: [evidence("diag", "PLAYER_STATEMENT", "対空が課題だと回答した。", { sourceId: "diagnosis:synthetic" })] }) },
  { id: "diagnosis-daily", result: result({ drills: [{ id: "d", title: "15分練習", purpose: "対空判断", steps: ["5分ずつ3課題を行う"], successCondition: "8回成功", evidenceIds: ["daily"] }], evidence: [evidence("daily", "PLAYER_STATEMENT", "今日の練習は対空です。", { sourceId: "daily:synthetic" })] }) },
  { id: "user-assertion", result: result({ evidence: [assertion], uncertainty: ["ユーザー入力のフレーム情報は未検証です。"] }) },
  { id: "assertion-verified", result: result({ evidence: [assertion, verified] }) },
  { id: "stale-patch", result: result({ evidence: [evidence("stale", "SOURCE_BACKED_FACT", "旧Patchの技情報です。", { sourceId: "old", sourceUrl: "https://example.com/old", patch: "1.0", patchStatus: "PATCH_STALE", verificationStatus: "reviewed" })] }) },
  { id: "conflicting-sources", result: result({ evidence: [verified, reviewed], uncertainty: ["複数出典の内容が一致していないため、結論は保留します。"] }) },
  { id: "source-backed", result: result({ evidence: [reviewed] }) },
  { id: "no-evidence", result: result({ summary: "" }) },
  { id: "player-inference", result: result({ evidence: [evidence("inference", "AI_INFERENCE", "守りを優先する傾向がある可能性があります。", { playerId: "synthetic-player" })] }) },
  { id: "mixed-context", result: result({ strengths: [{ id: "mixed-s", title: "観察", detail: "確認してから行動しています。", evidenceIds: ["observed"] }], priorityIssues: [{ id: "mixed-p", title: "対空", detail: "対空判断を確認します。", evidenceIds: ["assertion"] }], evidence: [assertion, verified, reviewed, evidence("observed", "OBSERVED_BEHAVIOR", "公開試合で対空を選択した。", { sourceId: "video", sourceUrl: "https://youtube.com/watch?v=synthetic", playerId: "synthetic-player", verificationStatus: "reviewed" })], nextActions: ["根拠を確認して練習する。"] }) },
];
