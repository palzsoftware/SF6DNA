"use client";

import { MiniIllustration } from "@/components/mini-illustration";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { deleteDiagnosisHistory, getDiagnosisHistory, type DiagnosisHistoryRecord } from "@/lib/local-user-tools";
import { usePersonalizationOwner } from "@/lib/use-personalization-owner";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { createOwnerResponseFence, deleteSupabaseDiagnosisHistory, readSupabaseDiagnosisHistory, type DbDiagnosisHistoryRecord, type DiagnosisHistoryDeleteResult, type DiagnosisHistorySupabaseClient } from "@/lib/diagnosis-history-supabase";

type HistoryViewRecord = DiagnosisHistoryRecord | DbDiagnosisHistoryRecord;

function ownerKey(owner: string | null) { return owner ?? "unresolved"; }
function historyClient() { return getSupabaseBrowserClient() as unknown as DiagnosisHistorySupabaseClient; }

export function DiagnosisHistoryTool() {
  const [records, setRecords] = useState<HistoryViewRecord[]>([]);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [actionFailed, setActionFailed] = useState(false);
  const [loadedOwner, setLoadedOwner] = useState<string | null>(null);
  const requestFence = useRef(createOwnerResponseFence());
  const { state: ownerState, isCurrent } = usePersonalizationOwner();

  useEffect(() => {
    let active = true;
    const fence = requestFence.current;
    const timer = window.setTimeout(() => {
      if (!active) return;
      setReady(false);
      setFailed(false);
      setActionFailed(false);
      setRecords([]);
      setLoadedOwner(null);
      if (ownerState.status === "loading") return;
      if (ownerState.status !== "ready" || !isCurrent()) {
        setFailed(true);
        setReady(true);
        return;
      }

      const key = ownerKey(ownerState.owner);
      const token = fence.begin(key);
      const finish = (next: HistoryViewRecord[] | null) => {
        if (!active || !fence.isCurrent(token, key, isCurrent)) return;
        if (next === null) setFailed(true);
        else {
          setRecords(next);
          setLoadedOwner(key);
        }
        setReady(true);
      };

      if (ownerState.owner === "guest") {
        finish(getDiagnosisHistory("guest"));
      } else {
        try {
          void readSupabaseDiagnosisHistory(ownerState.owner, historyClient())
            .then(result => finish(result.status === "ok" ? result.records : null))
            .catch(() => finish(null));
        } catch {
          finish(null);
        }
      }
    }, 0);
    return () => { active = false; window.clearTimeout(timer); fence.invalidate(); };
  }, [ownerState, isCurrent]);

  async function remove(id: string) {
    if (ownerState.status !== "ready" || !isCurrent() || loadedOwner !== ownerKey(ownerState.owner)) {
      setActionFailed(true);
      return;
    }
    setActionFailed(false);
    if (ownerState.owner === "guest") {
      if (!deleteDiagnosisHistory("guest", id)) {
        setActionFailed(true);
        return;
      }
      const next = getDiagnosisHistory("guest");
      if (next === null) setActionFailed(true);
      else setRecords(next);
    } else {
      let result: DiagnosisHistoryDeleteResult;
      try {
        result = await deleteSupabaseDiagnosisHistory(ownerState.owner, id, historyClient());
      } catch {
        setActionFailed(true);
        return;
      }
      if (!isCurrent() || loadedOwner !== ownerKey(ownerState.owner)) return;
      if (result.status !== "deleted") {
        setActionFailed(true);
        return;
      }
      setRecords(current => current.filter(record => record.id !== id));
    }
  }

  const currentOwner = ownerState.status === "ready" && isCurrent() ? ownerKey(ownerState.owner) : null;
  if (ownerState.status === "loading") return <div className="empty-state"><p>診断履歴を読み込んでいます。</p></div>;
  if (failed || ownerState.status !== "ready" || !isCurrent()) return <div className="empty-state" role="alert"><h2>診断履歴を確認できません</h2><p>認証状態または保存状態を確認してから、もう一度お試しください。Guest履歴を本人履歴として読み替えることはありません。</p><Link className="button-secondary inline-button" href="/diagnosis">診断を選ぶ</Link></div>;
  if (!ready || !currentOwner || loadedOwner !== currentOwner) return <div className="empty-state"><p>診断履歴を読み込んでいます。</p></div>;
  const retryNotice = actionFailed ? <p className="data-notice" role="alert">削除を完了できませんでした。履歴は画面に保持しています。状態を確認してから再度お試しください。</p> : null;
  if (!records.length) return <div className="empty-state"><MiniIllustration kind="history" /><h2>診断履歴はまだありません</h2><p>診断を最後まで完了すると、{ownerState.owner === "guest" ? "この端末" : "アカウント"}に結果概要が保存されます。</p><Link className="button-secondary inline-button" href="/diagnosis">診断を選ぶ</Link></div>;

  return (
    <div className="history-list experience-timeline">
      {retryNotice}
      {records.map((record) => (
        <article className="info-panel" key={record.id}>
          <div className="user-character-card__head">
            <div>
              <time className="eyebrow" dateTime={record.completedAt}>{new Date(record.completedAt).toLocaleString("ja-JP")}</time>
              <h2>{record.diagnosisTitle}</h2>
            </div>
            <button className="text-button" type="button" onClick={() => void remove(record.id)}>削除</button>
          </div>
          {record.topResults.length ? (
            <ol>
              {record.topResults.map((item) => <li key={item.key}><strong>{"label" in item ? item.label : item.key}</strong>：{item.score}</li>)}
            </ol>
          ) : <p>強い傾向は記録されませんでした。</p>}
          {record.diagnosisSlug ? <Link className="text-link" href={`/diagnosis/${record.diagnosisSlug}`}>この診断をもう一度行う</Link> : null}
        </article>
      ))}
    </div>
  );
}
