"use client";

import { useState } from "react";
import Link from "next/link";
import type { SearchResultItem } from "@/types/search";

export function CoachRetrievalDemo() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [evidence, setEvidence] = useState<SearchResultItem[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setEvidence([]);

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
      setMessage(
        data.evidence?.length
          ? "現在は根拠候補の検索まで実装済みです。生成回答は信頼できるデータ投入後に有効化します。"
          : "関連する公開済みデータがまだありません。"
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

      {message ? <p className="muted">{message}</p> : null}
      {evidence.length ? (
        <div className="search-result-list">
          {evidence.map((item) => (
            <Link className="search-result" href={item.href} key={`${item.type}:${item.id}`}>
              <span className="search-result__type">{item.type}</span>
              <strong>{item.title}</strong>
              {item.subtitle ? <span>{item.subtitle}</span> : null}
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}
