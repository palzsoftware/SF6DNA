"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { matchesMoveScheme, matchesMoveSearch, type MoveSchemeFilter, type SearchableMove } from "@/lib/character-move-filter";
import { resolveMoveCardReference, focusMoveCardReference } from "@/lib/move-card-reference";
import styles from "./character-move-explorer.module.css";

type MoveItem = SearchableMove & { id: string; content: ReactNode; anchorId?: string; aliasAnchorIds?: string[] };
type MoveGroup = { type: string; label: string; items: MoveItem[] };

export function CharacterMoveExplorer({ groups, groupClassName, listClassName, className, table = false, enabled = true, categories }: {
  groups: MoveGroup[];
  groupClassName: string;
  listClassName: string;
  className?: string;
  table?: boolean;
  enabled?: boolean;
  categories?: Array<{ type: string; label: string }>;
}) {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [scheme, setScheme] = useState<MoveSchemeFilter>("all");
  const [navigation, setNavigation] = useState<{ hash: string } | null>(null);
  const [deepLinkTarget, setDeepLinkTarget] = useState<{ id: string; anchorId: string } | null>(null);
  const handledNavigation = useRef<typeof navigation>(null);
  const focusedTarget = useRef<typeof deepLinkTarget>(null);
  const reference = navigation ? resolveMoveCardReference(navigation.hash, groups) : null;
  const referenceId = reference?.id;
  const referenceAnchor = reference?.anchorId;
  const visibleTarget = deepLinkTarget?.id === referenceId && deepLinkTarget?.anchorId === referenceAnchor
    ? deepLinkTarget : null;

  // Each navigation is a separate request, including a repeated hash event.
  // Parent rerenders and refreshed card contents must not reset user controls.
  useEffect(() => {
    const syncDeepLink = () => setNavigation({ hash: window.location.hash });
    const initialFrame = window.requestAnimationFrame(syncDeepLink);
    const onHashChange = () => {
      // A real navigation supersedes the pending initial-location sync.
      window.cancelAnimationFrame(initialFrame);
      syncDeepLink();
    };
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.cancelAnimationFrame(initialFrame);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  useEffect(() => {
    // An initially missing card may arrive later. Apply each request only once.
    if (!navigation || !referenceId || !referenceAnchor || handledNavigation.current === navigation) return;
    handledNavigation.current = navigation;
    setQuery("");
    setCategory("all");
    setScheme("all");
    setDeepLinkTarget({ id: referenceId, anchorId: referenceAnchor });
  }, [navigation, referenceId, referenceAnchor]);

  useEffect(() => {
    if (!deepLinkTarget || focusedTarget.current === deepLinkTarget ||
        deepLinkTarget.id !== referenceId || deepLinkTarget.anchorId !== referenceAnchor) return;
    const frame = window.requestAnimationFrame(() => {
      focusedTarget.current = deepLinkTarget;
      // Recheck current location and identity after filters have been restored.
      const current = resolveMoveCardReference(window.location.hash, groups);
      if (current?.id === deepLinkTarget.id && current.anchorId === deepLinkTarget.anchorId) {
        focusMoveCardReference(current, document);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [deepLinkTarget, referenceId, referenceAnchor, groups]);
  const filtered = groups.filter(group => !enabled || category === "all" || category === group.type)
    .map(group => ({ ...group, items: group.items.filter(item => !enabled || (matchesMoveSearch(item, query) && matchesMoveScheme(item, scheme))) }))
    .filter(group => group.items.length > 0);
  const total = groups.reduce((count, group) => count + group.items.length, 0);
  const count = filtered.reduce((sum, group) => sum + group.items.length, 0);
  const active = enabled && (Boolean(query.trim()) || category !== "all" || scheme !== "all");

  return <div className={[styles.explorer, className].filter(Boolean).join(" ")}>
    {enabled ? <div className={styles.controls}>
      <label htmlFor={inputId}>技名・コマンドを検索</label>
      <input id={inputId} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="技名や入力コマンド" />
      <div className={styles.filterBlock}>
        <span>技カテゴリ</span>
        <div className={styles.categories} role="group" aria-label="技のカテゴリ">
          {[{ type: "all", label: "すべて" }, ...(categories ?? groups.map(({ type, label }) => ({ type, label })))].map(group =>
            <button type="button" key={group.type} aria-pressed={category === group.type} onClick={() => setCategory(group.type)}>{group.label}</button>
          )}
        </div>
      </div>
      <div className={styles.filterBlock}>
        <span>操作タイプ</span>
        <div className={styles.categories} role="group" aria-label="操作タイプ">
          {([["all", "すべて"], ["classic", "クラシック"], ["modern", "モダン"]] as const).map(([value, label]) =>
            <button type="button" key={value} aria-pressed={scheme === value} onClick={() => setScheme(value)}>{label}</button>
          )}
        </div>
        <small>操作タイプ未確定・共通扱いの技は絞り込みで除外しません。</small>
      </div>
      <div className={styles.result}><p role="status" aria-live="polite">{count} / {total} 技</p>
        {active ? <button type="button" onClick={() => { setQuery(""); setCategory("all"); setScheme("all"); }}>絞り込みを解除</button> : null}
      </div>
    </div> : null}
    {/* Native fragment navigation may open details before React hydrates. Only this native attribute is tolerated; identity checks remain below. */}
    {filtered.length ? filtered.map((group, index) => <details suppressHydrationWarning className={groupClassName} key={group.type} open={active || index === 0 || group.items.some(item => visibleTarget && item.id === visibleTarget.id && item.anchorId === visibleTarget.anchorId)}>
      <summary><strong>{group.label}</strong><span>{group.items.length}技</span></summary>
      <div className={listClassName} role={table ? "table" : undefined} aria-label={table ? `${group.label}の技データ` : undefined}>
        {group.items.map(item => <MoveContent key={item.id} content={item.content} />)}
      </div>
    </details>) : <p>該当する技がありません。技名やカテゴリを変えてください。</p>}
  </div>;
}

function MoveContent({ content }: { content: ReactNode }) { return content; }
