"use client";

import { useState } from "react";
import Link from "next/link";
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
  const [loading, setLoading] = useState(false);
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [currentPatch, setCurrentPatch] = useState<CurrentPatch | null>(null);
  const [message, setMessage] = useState<string | null>(null);

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
    <section>
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
          {currentPatch.officialUrl ? <a className="text-link" href={currentPatch.officialUrl} target="_blank" rel="noreferrer">公式変更リスト ↗</a> : null}
        </div>
      ) : null}

      {message ? <p className="muted" role="status" aria-live="polite">{message}</p> : null}
      {evidence.length ? (
        <div className="search-result-list">
          {evidence.map((item) => (
            <article className="search-result" key={`${item.type}:${item.id}`}>
              <span className="search-result__type">{item.type}</span>
              <Link href={item.href}><strong>{item.title}</strong></Link>
              {item.subtitle ? <span>{item.subtitle}</span> : null}
              <div className="source-list">
                {(item.sources ?? []).map((source) => (
                  <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>
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
