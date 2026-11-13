"use client";

import { useId, useMemo, useState, type ReactNode } from "react";
import { searchStrategyCards, strategyCategories } from "@/lib/strategy-card-search.mjs";
import styles from "./strategy-card-explorer.module.css";

export type StrategyCardView = {
  id: string;
  kind: "combo" | "setplay" | "sequence" | "counter";
  title: string;
  category?: string | null;
  categoryLabel?: string | null;
  searchTerms?: string[];
  driveCost?: number | null;
  saCost?: number | null;
  content: ReactNode;
};

/** The server must supply ONLY already-authorized records. No data fetching or publishing in this component. */
export function StrategyCardExplorer({ kind, items }: { kind: StrategyCardView["kind"]; items: StrategyCardView[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [condition, setCondition] = useState("");
  const fieldId = useId();
  const authorized = useMemo(() => items.filter(item => item.kind === kind), [items, kind]);
  const categories = useMemo(() => strategyCategories(authorized), [authorized]);
  const currentCategory = categories.some(option => option.value === category) ? category : "all";
  const quickTerms: Record<StrategyCardView["kind"], string[]> = {
    combo: ["SA1", "SA2", "SA3", "ゲージなし"],
    setplay: ["安全飛び", "投げ重ね", "打撃重ね", "起き攻め", "画面端", "その他"],
    sequence: ["暴れ潰し", "固め", "投げ連携", "投げ択", "シミー", "投げ狩り", "中下段", "打撃択", "キャンセル択", "ドライブラッシュ"],
    counter: ["通常技", "特殊技", "ターゲットコンボ", "必殺技", "SA", "投げ後・起き上がり", "画面端", "キャミィ", "波動拳", "波掌撃", "確定反撃"],
  };
  const results = useMemo(() => {
    const byCategory = searchStrategyCards(authorized, { query, category: currentCategory });
    if (!condition) return byCategory;
    if (kind === "setplay" && condition === "その他") {
      const knownSetplayTerms = ["安全飛び", "投げ重ね", "打撃重ね", "起き攻め", "画面端"];
      return byCategory.filter(item => {
        const searchable = [item.title, item.categoryLabel, item.category, ...(item.searchTerms ?? [])]
          .join(" ");
        return !knownSetplayTerms.some(term => searchable.includes(term));
      });
    }
    return searchStrategyCards(byCategory, { query: condition });
  }, [authorized, query, currentCategory, condition, kind]);
  return <div className={styles.explorer} data-strategy-explorer={kind}>
    <label htmlFor={fieldId}>カードを検索</label>
    <input id={fieldId} type="search" value={query} onChange={e => setQuery(e.target.value)}
      placeholder={kind === "combo" ? "技名・SA3・ゲージなし" : kind === "setplay" ? "安全飛び・投げ重ね・画面端" : kind === "sequence" ? "暴れ潰し・固め・ラッシュ" : "対戦キャラ・対象技・対策"} />
    <div className={styles.filters} role="group" aria-label="カテゴリ・条件フィルター">
      <button type="button" aria-pressed={currentCategory === "all" && !condition} onClick={() => { setCategory("all"); setCondition(""); }}>すべて</button>
      {categories.map(option => <button key={option.value} type="button" aria-pressed={currentCategory === option.value}
        onClick={() => setCategory(option.value)}>{option.label}</button>)}
    </div>
    <div className={styles.filters} role="group" aria-label="条件フィルター">
      {quickTerms[kind].map(term => <button key={term} type="button" aria-pressed={condition === term}
        onClick={() => setCondition(condition === term ? "" : term)}>{term}</button>)}
    </div>
    <p className={styles.count} role="status" aria-live="polite">検索結果 {results.length}件</p>
    {results.length ? <div className={styles.rail} role="region" aria-label="検索結果のカード一覧" tabIndex={0}>
      {results.map(item => <div className={styles.item} key={item.id}>{item.content}</div>)}
    </div> : <p className={styles.empty}>該当するカードはありません</p>}
  </div>;
}
