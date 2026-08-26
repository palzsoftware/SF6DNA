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
  aggression: "前に出る攻め",
  patience: "待ち・観察",
  keepout: "遠距離・けん制",
  rushdown: "近距離ラッシュ",
  grappling: "投げ・コマンド投げ",
  setup: "設置・セットプレイ",
  footsies: "差し合い・地上戦",
  mobility: "機動力・位置調整",
  simplicity: "操作の分かりやすさ",
  technicality: "テクニカル操作",
  defense_preference: "守りから組み立てる",
  explosive: "一気に試合を動かす",
};

const IMPROVEMENT_AXES = new Set([
  "anti_air",
  "drive_rush_defense",
  "impact_response",
  "punish",
  "defense",
  "offense",
  "meter",
  "matchup",
  "execution",
  "neutral",
  "corner_defense",
  "decision",
]);

function axisLabel(key: string) {
  return AXIS_LABELS[key] ?? key;
}

function resultCopy(type: string) {
  if (type === "playstyle") {
    return {
      title: "あなたのプレイスタイル傾向",
      body: "点数が高い項目ほど、回答から見える好み・得意志向が強い傾向です。実戦では複数のスタイルを併用します。",
      scoreLabel: "傾向",
      searchLabel: "関連する攻略を探す",
    };
  }
  if (type === "character_fit") {
    return {
      title: "相性が良さそうなキャラクター特性",
      body: "点数が高い項目ほど、キャラクター選びで重視すると相性が良くなりやすい特性です。キャラ固有の難易度や操作タイプも合わせて確認してください。",
      scoreLabel: "適性",
      searchLabel: "関連キャラ・攻略を探す",
    };
  }
  return {
    title: "優先して改善したい項目",
    body: "点数が高いほど「今の練習優先度が高い」という自己評価結果です。実戦ログやリプレイで確認すると精度が上がります。",
    scoreLabel: "優先度",
    searchLabel: "関連攻略を探す",
  };
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

  if (completed && diagnosis.diagnosisType === "comprehensive") {
    const improvement = result.filter(([key, score]) => IMPROVEMENT_AXES.has(key) && score > 0).slice(0, 3);
    const style = result.filter(([key, score]) => !IMPROVEMENT_AXES.has(key) && score > 0).slice(0, 3);
    const topQuery = [...improvement.slice(0, 2), ...style.slice(0, 2)].map(([key]) => axisLabel(key)).join(" ");

    return (
      <section className="info-panel diagnosis-result">
        <p className="eyebrow">RESULT</p>
        <h2>総合診断結果</h2>
        <p>「今優先して改善したいこと」と「好みやすい戦い方」を分けて表示します。自己評価なので、実戦ログと合わせると精度が上がります。</p>

        <div className="character-columns">
          <section>
            <h3>改善優先度 TOP3</h3>
            {improvement.length ? (
              <ol>
                {improvement.map(([key, score]) => <li key={key}><strong>{axisLabel(key)}</strong>：優先度 {score}</li>)}
              </ol>
            ) : <p className="muted">大きな自己申告上の弱点は出ませんでした。</p>}
          </section>
          <section>
            <h3>プレイスタイル傾向 TOP3</h3>
            {style.length ? (
              <ol>
                {style.map(([key, score]) => <li key={key}><strong>{axisLabel(key)}</strong>：傾向 {score}</li>)}
              </ol>
            ) : <p className="muted">はっきりした好みの傾向は出ませんでした。</p>}
          </section>
        </div>

        <div className="diagnosis-actions">
          {topQuery ? <Link className="button-primary" href={`/search?q=${encodeURIComponent(topQuery)}`}>関連攻略・キャラを探す</Link> : null}
          {topQuery ? <Link className="button-secondary" href={`/coach?q=${encodeURIComponent(topQuery)}`}>AIコーチ用Evidenceを見る</Link> : null}
          <button className="button-secondary" type="button" onClick={() => { setIndex(0); setAnswers({}); }}>最初からやり直す</button>
        </div>
      </section>
    );
  }

  if (completed) {
    const copy = resultCopy(diagnosis.diagnosisType);
    const priorities = result.filter(([, score]) => score > 0).slice(0, 3);
    const topQuery = priorities.map(([key]) => axisLabel(key)).join(" ");

    return (
      <section className="info-panel diagnosis-result">
        <p className="eyebrow">RESULT</p>
        <h2>{copy.title}</h2>
        <p>{copy.body}</p>
        {priorities.length ? (
          <ol>
            {priorities.map(([key, score]) => (
              <li key={key}><strong>{axisLabel(key)}</strong>：{copy.scoreLabel} {score}</li>
            ))}
          </ol>
        ) : (
          <p>はっきりした傾向が出ませんでした。回答を変えて再診断するか、実戦ログと合わせて確認してください。</p>
        )}
        <div className="diagnosis-actions">
          {topQuery ? <Link className="button-primary" href={`/search?q=${encodeURIComponent(topQuery)}`}>{copy.searchLabel}</Link> : null}
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
