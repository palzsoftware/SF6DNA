"use client";

import { useMemo, useState } from "react";

export type FaqItem = {
  category: string;
  question: string;
  answer: string;
};

export function FaqBrowser({ items }: { items: FaqItem[] }) {
  const categories = ["すべて", ...Array.from(new Set(items.map((item) => item.category)))];
  const [category, setCategory] = useState("すべて");
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ja");
    return items.filter((item) => {
      const matchesCategory = category === "すべて" || item.category === category;
      const searchableText = `${item.question} ${item.answer}`.toLocaleLowerCase("ja");
      return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [category, items, query]);

  return (
    <section className="faq-browser" aria-label="よくある質問の検索">
      <label className="faq-search">
        <span>質問を検索</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="例：保存、パッチ、情報源"
        />
      </label>

      <div className="faq-categories" role="group" aria-label="FAQカテゴリー">
        {categories.map((item) => (
          <button
            className={item === category ? "is-active" : undefined}
            type="button"
            aria-pressed={item === category}
            onClick={() => setCategory(item)}
            key={item}
          >
            {item}
          </button>
        ))}
      </div>

      <p className="faq-result-count" aria-live="polite">{filteredItems.length}件の質問</p>
      {filteredItems.length ? (
        <div className="faq-list">
          {filteredItems.map((item) => (
            <details className="faq-item" key={item.question}>
              <summary>
                <span>{item.question}</span>
                <small>{item.category}</small>
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>該当する質問がありません</h2>
          <p>検索語を短くするか、別のカテゴリーを選んでください。</p>
        </div>
      )}
    </section>
  );
}
