"use client";

import { useId, useState, type ReactNode } from "react";
import { matchesMoveSearch, type SearchableMove } from "@/lib/character-move-filter";
import styles from "./character-move-explorer.module.css";

type MoveItem = SearchableMove & { id: string; content: ReactNode };
type MoveGroup = { type: string; label: string; items: MoveItem[] };

export function CharacterMoveExplorer({ groups, groupClassName, listClassName, className, table = false, enabled = true }: {
  groups: MoveGroup[];
  groupClassName: string;
  listClassName: string;
  className?: string;
  table?: boolean;
  enabled?: boolean;
}) {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const filtered = groups.filter(group => category === "all" || category === group.type)
    .map(group => ({ ...group, items: group.items.filter(item => matchesMoveSearch(item, query)) }))
    .filter(group => group.items.length > 0);
  const total = groups.reduce((count, group) => count + group.items.length, 0);
  const count = filtered.reduce((sum, group) => sum + group.items.length, 0);
  const active = Boolean(query.trim()) || category !== "all";

  return <div className={[styles.explorer, className].filter(Boolean).join(" ")}>
    {enabled ? <div className={styles.controls}>
      <label htmlFor={inputId}>技名・コマンドを検索</label>
      <input id={inputId} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="技名や入力コマンド" />
      <div className={styles.categories} role="group" aria-label="技のカテゴリ">
        {[{ type: "all", label: "すべて" }, ...groups].map(group =>
          <button type="button" key={group.type} aria-pressed={category === group.type} onClick={() => setCategory(group.type)}>{group.label}</button>
        )}
      </div>
      <div className={styles.result}><p role="status" aria-live="polite">{count} / {total} 技</p>
        {active ? <button type="button" onClick={() => { setQuery(""); setCategory("all"); }}>絞り込みを解除</button> : null}
      </div>
    </div> : null}
    {filtered.length ? filtered.map((group, index) => <details className={groupClassName} key={group.type} open={active || index === 0}>
      <summary><strong>{group.label}</strong><span>{group.items.length}技</span></summary>
      <div className={listClassName} role={table ? "table" : undefined} aria-label={table ? `${group.label}の技データ` : undefined}>
        {group.items.map(item => <MoveContent key={item.id} content={item.content} />)}
      </div>
    </details>) : <p>該当する技がありません。技名やカテゴリを変えてください。</p>}
  </div>;
}

function MoveContent({ content }: { content: ReactNode }) { return content; }
