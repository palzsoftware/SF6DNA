"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  COACH_PERSONAS,
  DEFAULT_COACH_PERSONA_ID,
  type CoachAnalysisResult,
  type CoachPersonaId,
} from "@/lib/coach-foundation";
import { composeCoachAnswer, type CoachAnswerSection, type CoachComposedAnswer } from "@/lib/coach-answer-composer";
import {
  adaptUserText,
  analyzeCoachContext,
  emptyCoachInputContext,
  type CoachInputContext,
} from "@/lib/coach-shared-analysis";
import type { SearchResultItem } from "@/types/search";
import {
  buildRetrievalQuery,
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

function AnswerSection({ section, answer }: { section: CoachAnswerSection; answer: CoachComposedAnswer }) {
  const evidence = new Map(answer.evidenceSummary.map((item) => [item.evidenceId, item]));
  return <section className="info-panel"><h3>{section.title}</h3>
    {section.id === "summary" ? <p>{answer.lead}</p> : null}
    <ul>{section.items.map((item) => <li key={item.id}>{item.title ? <strong>{item.title}</strong> : null}<p>{item.text}</p>
      {item.details.length ? <ul>{item.details.map((detail) => <li key={detail}>{detail}</li>)}</ul> : null}
      {section.id === "evidence" ? item.evidenceIds.map((id) => {
        const summary = evidence.get(id);
        return summary ? <div key={id}>{summary.patchStatus ? <p className="muted">{retrievalPatchStatusLabel(summary.patchStatus)}</p> : null}{summary.sourceReference ? <a className="text-link" href={summary.sourceReference.url} target="_blank" rel="noopener noreferrer">{summary.sourceReference.label} ↗</a> : null}{answer.persona.id === "research" && summary.sourceReference ? <p className="muted">Source: {summary.sourceReference.sourceType ?? "不明"} / reliability: {summary.sourceReference.sourceReliability ?? "不明"}</p> : null}</div> : null;
      }) : null}
    </li>)}</ul>
  </section>;
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
  const composedAnswer = useMemo(() => composeCoachAnswer({ result: analysisResult, personaId }), [analysisResult, personaId]);
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

      {composedAnswer.sections.map((section) => <AnswerSection key={section.id} section={section} answer={composedAnswer} />)}

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
