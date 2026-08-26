"use client";

import { useMemo, useState } from "react";
import type { DiagnosisDefinition } from "@/types/diagnosis";

export function DiagnosisRunner({ diagnosis }: { diagnosis: DiagnosisDefinition }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const question = diagnosis.questions[index];
  const completed = diagnosis.questions.length > 0 && index >= diagnosis.questions.length;

  const result = useMemo(() => {
    if (!completed) return [] as Array<[string, number]>;
    const totals: Record<string, number> = {};
    for (const q of diagnosis.questions) {
      const optionId = answers[q.id];
      const option = q.options.find((item) => item.id === optionId);
      if (!option) continue;
      for (const [key, value] of Object.entries(option.scorePayload)) {
        totals[key] = (totals[key] ?? 0) + Number(value || 0);
      }
    }
    return Object.entries(totals).sort((a, b) => b[1] - a[1]);
  }, [answers, completed, diagnosis.questions]);

  if (!diagnosis.questions.length) {
    return <div className="empty-state"><p>公開済みの質問がまだありません。</p></div>;
  }

  if (completed) {
    return (
      <section className="info-panel diagnosis-result">
        <p className="eyebrow">RESULT</p>
        <h2>簡易診断結果</h2>
        <p>この結果は短時間診断の傾向値です。キャラクター辞典・練習・AIコーチへの導線に利用します。</p>
        {result.length ? (
          <ol>
            {result.slice(0, 5).map(([key, score]) => <li key={key}><strong>{key}</strong>：{score}</li>)}
          </ol>
        ) : <p>判定用スコアが設定されていません。</p>}
        <button className="button-secondary" type="button" onClick={() => { setIndex(0); setAnswers({}); }}>最初からやり直す</button>
      </section>
    );
  }

  const progress = Math.round(((index + 1) / diagnosis.questions.length) * 100);
  const selected = answers[question.id];

  return (
    <section className="diagnosis-runner">
      <div className="diagnosis-progress"><span style={{ width: `${progress}%` }} /></div>
      <p className="muted">{index + 1} / {diagnosis.questions.length}</p>
      <h2>{question.prompt}</h2>
      {question.helpText ? <p className="muted">{question.helpText}</p> : null}
      <div className="diagnosis-options">
        {question.options.map((option) => (
          <button
            className={selected === option.id ? "diagnosis-option is-selected" : "diagnosis-option"}
            key={option.id}
            type="button"
            onClick={() => setAnswers((current) => ({ ...current, [question.id]: option.id }))}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="diagnosis-actions">
        <button className="button-secondary" type="button" disabled={index === 0} onClick={() => setIndex((value) => Math.max(0, value - 1))}>戻る</button>
        <button className="button-primary" type="button" disabled={!selected} onClick={() => setIndex((value) => value + 1)}>{index === diagnosis.questions.length - 1 ? "結果を見る" : "次へ"}</button>
      </div>
    </section>
  );
}
