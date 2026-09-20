import { composePlayerAnalysis } from "@/lib/player-analysis-composer";
import { canPublishPlayerAnalysis } from "@/lib/player-analysis-public-gate";
import type { PlayerAnalysisItem } from "@/lib/player-analysis";

export function PlayerAnalysisPanel({ playerId, displayName, items, playerPublished = true, identityConflict = false }: { playerId: string; displayName: string; items: PlayerAnalysisItem[]; playerPublished?: boolean; identityConflict?: boolean }) {
  const gate = canPublishPlayerAnalysis({ playerId, playerPublished, identityConflict, items });
  if (!gate.publishable) return null;
  const answer = composePlayerAnalysis({ playerContext: { playerId, displayName }, items });
  return <section className="info-panel" aria-labelledby="player-analysis-heading"><p className="eyebrow">PLAYER ANALYSIS</p><h2 id="player-analysis-heading">根拠に基づくプレイヤー分析</h2><p>{answer.summary}</p>{answer.sections.map((section) => <section key={section.category}><h3>{section.title}</h3><ul>{section.items.map((item) => <li key={item.id}><strong>{item.title}</strong><p>{item.detail}</p></li>)}</ul></section>)}{answer.uncertainties.length ? <><h3>追加確認が必要な情報</h3><ul>{answer.uncertainties.map((item) => <li key={item}>{item}</li>)}</ul></> : null}<h3>根拠</h3><ul>{answer.evidence.map((item) => <li key={item.evidenceId}><strong>{item.kindLabel}</strong><p>{item.statement}</p>{item.sourceReference ? <a className="text-link" href={item.sourceReference.url} target="_blank" rel="noopener noreferrer">情報源を確認 ↗</a> : null}</li>)}</ul><p className="muted">AIによる分析は本人の発言ではありません。根拠と不確実性を分けて表示します。</p></section>;
}
