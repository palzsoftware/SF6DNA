import { publicPlayerFacts, publicRecommendedVideos, publicPlayerInsights, type PlayerProfileIntake } from "@/lib/player-profile-contract";
import { safeExternalUrl } from "@/lib/safe-external-url";

/** Evidence receiver. Missing intake is hidden; pending candidates never become public facts. */
export function PlayerEvidenceSections({ intake }: { intake?: PlayerProfileIntake }) {
  if (!intake) return <section className="info-panel"><h2>使用デバイス</h2><p>使用デバイスの掲載情報は確認できていません。</p></section>;
  const groups = [
    ["チームの記録", publicPlayerFacts(intake.teams)],
    ["使用キャラクターの記録", publicPlayerFacts(intake.characters)],
    ["使用デバイス", publicPlayerFacts(intake.devices)],
  ] as const;
  const recommended = publicRecommendedVideos(intake.recommendedVideos);
  const insights = [
    ["この選手の強み", publicPlayerInsights(intake.strengths)],
    ["参考にしたいポイント", publicPlayerInsights(intake.referencePoints)],
  ] as const;
  return <>
    {groups.map(([title, rows]) => rows.length ? <section className="info-panel" key={title}><h2>{title}</h2><ul>{rows.map((row, index) => <li key={`${row.sourceUrl}:${index}`}>
      <strong>{row.label}</strong> · {row.state === "CURRENT" ? "現在（情報確認日基準）" : "過去の使用・所属"}
      <small> / 確認日：{row.sourceDate}</small> · <a href={safeExternalUrl(row.sourceUrl)!} target="_blank" rel="noopener noreferrer">情報源</a>
    </li>)}</ul></section> : title === "使用デバイス" ? <section className="info-panel" key={title}><h2>使用デバイス</h2><p>使用デバイスの掲載情報は確認できていません。</p></section> : null)}
    {insights.map(([title, rows]) => rows.length ? <section className="info-panel" key={title}><h2>{title}</h2><ul>{rows.map((row, index) => <li key={`${row.sourceUrl}:${index}`}>
      <p>{row.label}</p>
      <small>{row.kind === "FIRST_PERSON_STATEMENT" ? "本人の発言に基づく情報" : "出典に基づく要約"}{row.state === "HISTORICAL" ? " · 過去の情報" : ""} / 確認日：{row.sourceDate}</small>
      {" · "}<a href={safeExternalUrl(row.sourceUrl)!} target="_blank" rel="noopener noreferrer">情報源</a>
    </li>)}</ul></section> : null)}
    {recommended.length ? <section className="info-panel"><h2>おすすめSF6動画</h2><ul>{recommended.map((video, index) => <li key={`${video.sourceUrl}:${index}`}><a href={safeExternalUrl(video.sourceUrl)!} target="_blank" rel="noopener noreferrer">{video.title}</a><p>{video.recommendationReason}</p></li>)}</ul></section> : null}
  </>;
}
