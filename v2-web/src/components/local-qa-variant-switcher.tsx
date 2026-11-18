"use client";

import { useState, type ReactNode } from "react";

// ローカルQA専用: 同じ技カードの「通常/チャージ/パーフェクト」を切り替えて見せる試作。
// 技カード本体(UnifiedMoveCard)は変更せず、パターンごとに用意したカードを1枚ずつ表示するだけ。
// 表示するカードは親(サーバー側)が作って渡す。ここは「どれを見せるか」の状態だけを持つ。
export function LocalQaVariantSwitcher({ moveSlug, tabs, children }: {
  moveSlug: string;
  tabs: Array<{ key: string; label: string }>;
  children: ReactNode[]; // tabs と同じ順番のカード
}) {
  const [active, setActive] = useState(tabs[0]?.key ?? "");
  return (
    <div data-local-qa-switcher data-move-slug={moveSlug}>
      <div role="tablist" aria-label="動作パターン" style={{ display: "flex", gap: 8, margin: "8px 0" }}>
        {tabs.map((t) => (
          <button key={t.key} type="button" role="tab" aria-selected={active === t.key} data-variant-key={t.key}
            onClick={() => setActive(t.key)}
            style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #888", cursor: "pointer",
              background: active === t.key ? "#222" : "#fff", color: active === t.key ? "#fff" : "#222" }}>
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div key={t.key} role="tabpanel" data-variant-panel={t.key} hidden={active !== t.key}>{children[i]}</div>
      ))}
    </div>
  );
}
