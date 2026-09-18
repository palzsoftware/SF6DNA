"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  COACH_PERSONAS,
  DEFAULT_COACH_PERSONA_ID,
  coachEvidenceKindLabel,
  formatCoachAnalysis,
  type CoachAnalysisResult,
  type CoachFormattedResponse,
  type CoachPersonaId,
  type CoachResponseSection,
} from "@/lib/coach-foundation";
import {
  adaptUserText,
  analyzeCoachContext,
  emptyCoachInputContext,
  type CoachInputContext,
} from "@/lib/coach-shared-analysis";
import type { SearchResultItem } from "@/types/search";
import {
  buildRetrievalQuery,
  retrievalEvidenceStatusLabel,
  retrievalPatchStatusLabel,
} from "@/lib/coach-trusted-retrieval";
import type { CoachEvidenceItem } from "@/lib/coach-foundation";

type SourceItem = {
  title: string;
  url: string;
  sourceType: string;
  publisher: string | null;
  reliabilityLevel: string | null;
};

type EvidenceItem = SearchResultItem & { sources?: SourceItem[] };

type CurrentPatch = {
  versionLabel: string;
  name: string | null;
  releasedAt: string | null;
  officialUrl: string | null;
};

function contextChips(context: CoachInputContext): string[] {
  const chips: string[] = [];
  if (context.diagnosisResult) chips.push("診断結果");
  if (context.dailyTraining) chips.push("今日の練習");
  if (context.userMessage) chips.push("入力メッセージ");
  if (context.characterContext) chips.push(`キャラクター: ${context.characterContext.name}`);
  if (context.playerContext) chips.push(`プレイヤー: ${context.playerContext.displayName}`);
  return chips;
}

function AnalysisSection({ section, response }: { section: CoachResponseSection; response: CoachFormattedResponse }) {
  if (section === "summary") {
    return <section className="info-panel"><h3>今回の要点</h3><p>{response.lead}</p><p>{response.summary}</p></section>;
  }
  if (section === "strengths") {
    if (!response.strengths.length) return null;
    return <section className="info-panel"><h3>確認できた強み</h3><ul>{response.strengths.map((item) => <li key={item.id}><strong>{item.title}</strong> — {item.detail}</li>)}</ul></section>;
  }
  if (section === "priorityIssues") {
    if (!response.priorityIssues.length) return null;
    return <section className="info-panel"><h3>優先して確認する課題</h3><ol>{response.priorityIssues.map((item) => <li key={item.id}><strong>{item.title}</strong><p>{item.detail}</p></li>)}</ol></section>;
  }
  if (section === "drills") {
    if (!response.drills.length) return null;
    return <section className="info-panel"><h3>練習候補</h3>{response.drills.map((item) => <article key={item.id}><strong>{item.title}</strong><p>{item.purpose}</p><ul>{item.steps.map((step) => <li key={step}>{step}</li>)}</ul><p><strong>成功条件:</strong> {item.successCondition}</p></article>)}</section>;
  }
  if (section === "evidence") {
    if (!response.evidence.length) return null;
    return <section className="info-panel"><h3>Evidence</h3><ul>{response.evidence.map((item) => <li key={item.id}><strong>{coachEvidenceKindLabel(item.kind)}</strong><p className="muted">{retrievalEvidenceStatusLabel(item)}</p><p>{item.statement}</p>{item.sourceUrl ? <a className="text-link" href={item.sourceUrl} target="_blank" rel="noopener noreferrer">情報源を見る ↗</a> : null}{item.patch ? <p className="muted">Patch: {item.patch}</p> : null}{item.patchStatus ? <p className="muted">{retrievalPatchStatusLabel(item.patchStatus)}</p> : null}{response.persona.id === "research" && (item.sourceType || item.sourceReliability) ? <p className="muted">Source: {item.sourceType ?? "不明"} / reliability: {item.sourceReliability ?? "不明"}</p> : null}</li>)}</ul></section>;
  }
  if (section === "uncertainty") {
    if (!response.uncertainty.length) return null;
    return <section className="info-panel"><h3>未確認・注意点</h3><ul>{response.uncertainty.map((item) => <li key={item}>{item}</li>)}</ul></section>;
  }
  if (!response.nextActions.length) return null;
  return <section className="info-panel"><h3>次に行うこと</h3><ol>{response.nextActions.map((item) => <li key={item}>{item}</li>)}</ol></section>;
}

export function CoachRetrievalDemo({
  initialQuestion = "",
  initialContext,
}: {
  initialQuestion?: string;
  initialContext?: CoachInputContext;
}) {
  const baseContext = initialContext ?? emptyCoachInputContext();
  const [question, setQuestion] = useState(initialQuestion.slice(0, 500));
  const [personaId, setPersonaId] = useState<CoachPersonaId>(baseContext.requestedPersona ?? DEFAULT_COACH_PERSONA_ID);
  const [loading, setLoading] = useState(false);
  const [retrievalEvidence, setRetrievalEvidence] = useState<EvidenceItem[]>([]);
  const [currentPatch, setCurrentPatch] = useState<CurrentPatch | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<CoachAnalysisResult>(() => analyzeCoachContext(baseContext));
  const formatted = useMemo(() => formatCoachAnalysis(analysisResult, personaId), [analysisResult, personaId]);
  const chips = useMemo(() => contextChips(baseContext), [baseContext]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setRetrievalEvidence([]);
    setCurrentPatch(null);

    const userMessage = adaptUserText(question);
    const requestContext: CoachInputContext = {
      ...baseContext,
      requestedPersona: personaId,
      ...(userMessage ? { userMessage } : {}),
    };
    const retrievalPlan = buildRetrievalQuery(requestContext);
    setAnalysisResult(analyzeCoachContext({
      ...requestContext,
      retrievalUncertainty: retrievalPlan.uncertainty,
    }));

    try {
      const response = await fetch("/api/coach/retrieve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          retrievalQuery: retrievalPlan.query || question,
          scope: {
            characterId: retrievalPlan.exactCharacterId,
            playerId: retrievalPlan.exactPlayerId,
          },
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage("質問を確認してください。");
        return;
      }
      setRetrievalEvidence(Array.isArray(data.evidence) ? data.evidence : []);
      setCurrentPatch(data.currentPatch ?? null);
      const normalizedRetrievalEvidence = Array.isArray(data.retrievalEvidence) ? data.retrievalEvidence as CoachEvidenceItem[] : [];
      const retrievalUncertainty = Array.isArray(data.retrievalUncertainty)
        ? data.retrievalUncertainty.filter((item: unknown): item is string => typeof item === "string")
        : [];
      setAnalysisResult(analyzeCoachContext({
        ...requestContext,
        retrievalEvidence: normalizedRetrievalEvidence,
        retrievalUncertainty: [...retrievalPlan.uncertainty, ...retrievalUncertainty],
      }));
      setMessage(
        typeof data.message === "string"
          ? data.message
          : "公開品質ゲートを通過した根拠データを確認できませんでした。",
      );
    } catch {
      setMessage("検索処理に失敗しました。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page-stack">
      <section className="info-panel" aria-labelledby="coach-persona-heading">
        <p className="eyebrow">COACH ROLE</p>
        <h2 id="coach-persona-heading">コーチを選ぶ</h2>
        <p>コーチごとに説明の順番や詳しさを変えます。根拠、Patch、Source、検証状態は同じ分析結果を共有します。</p>
        <div className="character-columns" role="group" aria-label="AIコーチの役割">
          {COACH_PERSONAS.map((persona) => (
            <button className={persona.id === personaId ? "button-primary" : "button-secondary"} type="button" aria-pressed={persona.id === personaId} key={persona.id} onClick={() => setPersonaId(persona.id)}>
              {persona.displayName}
            </button>
          ))}
        </div>
      </section>

      <section className="info-panel">
        <p className="eyebrow">AVAILABLE CONTEXT</p>
        <h2>分析に使うContext</h2>
        {chips.length ? <div className="character-columns">{chips.map((chip) => <span className="data-notice" key={chip}>{chip}</span>)}</div> : <p>診断結果や今日の練習などのContextはまだありません。質問だけでも本人発言として安全に扱えます。</p>}
      </section>

      {formatted.sectionOrder.map((section) => <AnalysisSection key={section} section={section} response={formatted} />)}

      <form className="coach-form" onSubmit={submit}>
        <label htmlFor="coach-question"><strong>質問</strong></label>
        <textarea id="coach-question" maxLength={500} minLength={2} placeholder="例: JPで舞の画面端を守る時、何を優先すればいい？" value={question} onChange={(event) => setQuestion(event.target.value)} />
        <button className="button-primary" type="submit" disabled={loading || question.trim().length < 2}>{loading ? "検索中…" : "SF6DNA内を検索"}</button>
      </form>

      {currentPatch ? <div className="info-panel"><p className="eyebrow">CURRENT PATCH</p><strong>{currentPatch.name ?? currentPatch.versionLabel}</strong><p className="muted">Version: {currentPatch.versionLabel}</p>{currentPatch.officialUrl ? <a className="text-link" href={currentPatch.officialUrl} target="_blank" rel="noopener noreferrer">公式変更リスト ↗</a> : null}</div> : null}
      {message ? <p className="muted" role="status" aria-live="polite">{message}</p> : null}

      {retrievalEvidence.length ? (
        <div className="search-result-list" aria-label="AIコーチの検索根拠">
          {retrievalEvidence.map((item) => (
            <article className="search-result" key={`${item.type}:${item.id}`}>
              <span className="search-result__type">{item.type}</span>
              <Link href={item.href}><strong>{item.title}</strong></Link>
              {item.subtitle ? <span>{item.subtitle}</span> : null}
              <div className="source-list">
                {(item.sources ?? []).map((source) => (
                  <a href={source.url} target="_blank" rel="noopener noreferrer" key={source.url}>
                    出典: {source.publisher ? `${source.publisher} / ` : ""}{source.title}{source.reliabilityLevel ? ` [${source.reliabilityLevel}]` : ""} ↗
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
