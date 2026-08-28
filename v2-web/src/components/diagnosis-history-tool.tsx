"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { deleteDiagnosisHistory, getDiagnosisHistory, type DiagnosisHistoryRecord } from "@/lib/local-user-tools";

export function DiagnosisHistoryTool() {
  const [records, setRecords] = useState<DiagnosisHistoryRecord[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setRecords(getDiagnosisHistory());
    setReady(true);
  }, []);

  function remove(id: string) {
    deleteDiagnosisHistory(id);
    setRecords(getDiagnosisHistory());
  }

  if (!ready) return <div className="empty-state"><p>診断履歴を読み込んでいます。</p></div>;
  if (!records.length) return <div className="empty-state"><h2>診断履歴はまだありません</h2><p>診断を最後まで完了すると、この端末に結果概要が保存されます。</p></div>;

  return (
    <div className="history-list">
      {records.map((record) => (
        <article className="info-panel" key={record.id}>
          <div className="user-character-card__head">
            <div>
              <p className="eyebrow">{new Date(record.completedAt).toLocaleString("ja-JP")}</p>
              <h2>{record.diagnosisTitle}</h2>
            </div>
            <button className="text-button" type="button" onClick={() => remove(record.id)}>削除</button>
          </div>
          {record.topResults.length ? (
            <ol>
              {record.topResults.map((item) => <li key={item.key}><strong>{item.label}</strong>：{item.score}</li>)}
            </ol>
          ) : <p>強い傾向は記録されませんでした。</p>}
          <Link className="text-link" href={`/diagnosis/${record.diagnosisSlug}`}>この診断をもう一度行う</Link>
        </article>
      ))}
    </div>
  );
}
