"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { DiagnosisDefinition } from "@/types/diagnosis";

const AXIS_LABELS: Record<string, string> = {
  anti_air: "対空",
  drive_rush_defense: "ドライブラッシュ対応",
  impact_response: "インパクト返し",
  punish: "確定反撃",
  defense: "防御・切り返し",
  offense: "攻めの選択肢",
  meter: "ゲージ管理",
  matchup: "キャラ対策",
  execution: "コンボ・セットプレイ精度",
  neutral: "中距離・立ち回り",
  corner_defense: "画面端の守り",
  decision: "観察・判断",
};

function axisLabel(key: string) {
  return AXIS_LABELS[key] ?? key;
}

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
    const priorities = result.filter(([, score]) => score > 0).slice(0, 3);
    const topQuery = priorities.map(([key]) => axisLabel(key)).join(" ");

    return (
      <section className="info-panel diagnosis-result">
        <p className="eyebrow">RESULT</p>
        <h2>優先して改善したい項目</h2>
        <p>点数が高いほど「今の練習優先度が高い」という自己評価結果です。実戦ログやリプレイで確認すると精度が上がります。</p>
        {priorities.length ? (
          <ol>
            {priorities.map(([key, score]) => (
              <li key={key}><strong>{axisLabel(key)}</strong>：優先度 {score}/3</li>
            ))}
          </ol>
        ) : (
          <p>自己評価上は大きな弱点がありません。実戦ログから細かな課題を確認してください。</p>
        )}
        <div className="diagnosis-actions">
          {topQuery ? <Link className="button-primary" href={`/search?q=${encodeURIComponent(topQuery)}`}>関連攻略を探す</Link> : null}
          {topQuery ? <Link className="button-secondary" href={`/coach?q=${encodeURIComponent(topQuery)}`}>AIコーチ用Evidenceを見る</Link> : null}
          <button className="button-secondary" type="button" onClick={() => { setIndex(0); setAnswers({}); }}>最初からやり直す</button>
        </div>
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
