
type Claim = { text: string; basis: string } | null;
export type PlayerResearchItem = {
  research_id: string; player_slug: string; analysis_category: string;
  analysis_title: string; observed_behavior: Claim; situation: Claim;
  possible_reason: Claim; strength_or_purpose: Claim; practical_lesson: Claim;
  source_url: string; source_title: string; source_date: string | null;
  game_patch: string | null; last_reviewed_at: string;
  verification_status: string; publication_approval: string;
};
const basisLabels: Record<string, string> = {
  first_person_statement: "本人の説明", observed_fact: "観察した行動",
  third_party_analysis: "第三者の分析", ai_hypothesis: "AIによる応用案・仮説",
};
function safeUrl(value: string): string | null {
  try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password ? url.href : null; }
  catch { return null; }
}
function ClaimText({ label, claim }: { label: string; claim: Claim }) {
  if (!claim) return null;
  return <div><dt>{label}（{basisLabels[claim.basis] ?? "分類未確認"}）</dt><dd>{claim.text}</dd></div>;
}
/** draftPreview is for isolated review only. Never derive it from URL parameters. */
export function PlayerResearchSections({ playerSlug, items, draftPreview = false }: {
  playerSlug: string; items: readonly PlayerResearchItem[]; draftPreview?: boolean;
}) {
  const visible = items.filter(item => item.player_slug === playerSlug &&
    (draftPreview || (item.publication_approval === "APPROVED" && item.verification_status === "verified")));
  if (!visible.length) return null;
  return <section className="info-panel" aria-label="プレイヤーの研究" style={{ minWidth: 0, overflowWrap: "anywhere" }}>
    <h2>プレイ・判断・練習から学ぶ</h2>
    {draftPreview ? <p role="note">掲載前の確認用です。本人の説明と分析・応用案を分けて表示しています。</p> : null}
    {visible.map(item => <details key={item.research_id}>
      <summary style={{ paddingBlock: 12, cursor: "pointer" }}>{item.analysis_title}</summary>
      <dl>
        <ClaimText label="確認した内容" claim={item.observed_behavior} />
        <ClaimText label="状況" claim={item.situation} />
        <ClaimText label="判断の理由" claim={item.possible_reason} />
        <ClaimText label="目的・強み" claim={item.strength_or_purpose} />
        <ClaimText label="自分の練習への取り入れ方" claim={item.practical_lesson} />
      </dl>
      {safeUrl(item.source_url) ? <p><a href={safeUrl(item.source_url)!} target="_blank" rel="noopener noreferrer">{item.source_title}</a></p> : null}
      <p>資料公開日：{item.source_date ?? "不明"} ／ パッチ：{item.game_patch ?? "未確認（現行仕様の保証なし）"}</p>
      <p>確認状態：{item.verification_status === "verified" ? "根拠確認済み" : "追加確認が必要"} ／ 最終確認：{item.last_reviewed_at}</p>
    </details>)}
  </section>;
}
