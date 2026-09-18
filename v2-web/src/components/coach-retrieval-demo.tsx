"use client";

import { useState } from "react";
import Link from "next/link";
import {
  COACH_PERSONAS,
  DEFAULT_COACH_PERSONA_ID,
  getCoachPersona,
  type CoachPersonaId,
} from "@/lib/coach-foundation";
import type { SearchResultItem } from "@/types/search";

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

export function CoachRetrievalDemo({ initialQuestion = "" }: { initialQuestion?: string }) {
  const [question, setQuestion] = useState(initialQuestion.slice(0, 500));
  const [personaId, setPersonaId] = useState<CoachPersonaId>(DEFAULT_COACH_PERSONA_ID);
  const [loading, setLoading] = useState(false);
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [currentPatch, setCurrentPatch] = useState<CurrentPatch | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const selectedPersona = getCoachPersona(personaId);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setEvidence([]);
    setCurrentPatch(null);

    try {
      const response = await fetch("/api/coach/retrieve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage("質問を確認してください。");
        return;
      }
      setEvidence(Array.isArray(data.evidence) ? data.evidence : []);
      setCurrentPatch(data.currentPatch ?? null);
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
        <p>
          コーチごとに説明の順番や詳しさを変えます。根拠、Patch、Source、検証状態は同じ分析結果を共有します。
        </p>
        <div className="character-columns" role="group" aria-label="AIコーチの役割">
          {COACH_PERSONAS.map((persona) => (
            <button
              className={persona.id === personaId ? "button-primary" : "button-secondary"}
              type="button"
              aria-pressed={persona.id === personaId}
              key={persona.id}
              onClick={() => setPersonaId(persona.id)}
            >
              {persona.displayName}
            </button>
          ))}
        </div>
        <div className="data-notice">
          <strong>{selectedPersona.displayName}</strong>
          <p>{selectedPersona.description}</p>
          <p className="muted">
            コーチを切り替えても、verified fact・Source URL・Patch・キャラクター・プレイヤー・Evidence種別は書き換えません。
          </p>
        </div>
      </section>

      <form className="coach-form" onSubmit={submit}>
        <label htmlFor="coach-question"><strong>質問</strong></label>
        <textarea
          id="coach-question"
          maxLength={500}
          minLength={2}
          placeholder="例: JPで舞の画面端を守る時、何を優先すればいい？"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
        />
        <button className="button-primary" type="submit" disabled={loading || question.trim().length < 2}>
          {loading ? "検索中…" : "SF6DNA内を検索"}
        </button>
      </form>

      {currentPatch ? (
        <div className="info-panel">
          <p className="eyebrow">CURRENT PATCH</p>
          <strong>{currentPatch.name ?? currentPatch.versionLabel}</strong>
          <p className="muted">Version: {currentPatch.versionLabel}</p>
          {currentPatch.officialUrl ? <a className="text-link" href={currentPatch.officialUrl} target="_blank" rel="noopener noreferrer">公式変更リスト ↗</a> : null}
        </div>
      ) : null}

      {message ? (
        <section className="info-panel" aria-live="polite">
          <p className="eyebrow">COACH RESPONSE SHELL</p>
          <h2>{selectedPersona.displayName}</h2>
          <h3>今回の要点</h3>
          <p>{message}</p>
          {evidence.length ? (
            <p className="muted">根拠として確認できた項目を下に表示します。生成回答はまだ無効です。</p>
          ) : (
            <p className="muted">根拠が不足しているため、推測でゲーム事実を補いません。</p>
          )}
        </section>
      ) : null}

      {evidence.length ? (
        <div className="search-result-list" aria-label="AIコーチの根拠">
          {evidence.map((item) => (
            <article className="search-result" key={`${item.type}:${item.id}`}>
              <span className="search-result__type">{item.type}</span>
              <Link href={item.href}><strong>{item.title}</strong></Link>
              {item.subtitle ? <span>{item.subtitle}</span> : null}
              <div className="source-list">
                {(item.sources ?? []).map((source) => (
                  <a href={source.url} target="_blank" rel="noopener noreferrer" key={source.url}>
                    出典: {source.publisher ? `${source.publisher} / ` : ""}{source.title}
                    {source.reliabilityLevel ? ` [${source.reliabilityLevel}]` : ""} ↗
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
