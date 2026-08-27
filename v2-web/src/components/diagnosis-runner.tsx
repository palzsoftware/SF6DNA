"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { DiagnosisDefinition } from "@/types/diagnosis";

type Recommendation = {
  characterId: string;
  slug: string;
  name: string;
  matchPercent: number;
  mappedTraits: number;
  activeTraits: number;
  reasons: Array<{ key: string; label: string; userWeight: number; characterScore: number }>;
};

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
  "anti_air", "drive_rush_defense", "impact_response", "punish", "defense", "offense",
  "meter", "matchup", "execution", "neutral", "corner_defense", "decision",
]);

function axisLabel(key: string) {
  return AXIS_LABELS[key] ?? key;
}

function calculateTotals(diagnosis: DiagnosisDefinition, answers: Record<string, string>) {
  const totals: Record<string, number> = {};
  for (const q of diagnosis.questions) {
    const optionId = answers[q.id];
    const option = q.options.find((item) => item.id === optionId);
    if (!option) continue;
    for (const [key, value] of Object.entries(option.scorePayload)) {
      totals[key] = (totals[key] ?? 0) + Number(value || 0);
    }
  }
  return totals;
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
      body: "点数が高い項目ほど、キャラクター選びで重視すると相性が良くなりやすい特性です。検証済みの特性マッピングが揃ったキャラだけ推薦対象にします。",
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
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [recommendationMessage, setRecommendationMessage] = useState<string | null>(null);
  const [recommendationLoading, setRecommendationLoading] = useState(false);
  const question = diagnosis.questions[index];
  const completed = diagnosis.questions.length > 0 && index >= diagnosis.questions.length;

  const totals = useMemo(
    () => (completed ? calculateTotals(diagnosis, answers) : {}),
    [answers, completed, diagnosis],
  );
  const result = useMemo(
    () => Object.entries(totals).sort((a, b) => b[1] - a[1]),
    [totals],
  );

  async function loadRecommendations(scorePayload: Record<string, number>) {
    setRecommendationLoading(true);
    setRecommendationMessage(null);
    try {
      const response = await fetch("/api/diagnosis/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scores: scorePayload, limit: 5 }),
      });
      const payload = await response.json();
      setRecommendations(Array.isArray(payload.recommendations) ? payload.recommendations : []);
      setRecommendationMessage(typeof payload.message === "string" ? payload.message : null);
    } catch {
      setRecommendations([]);
      setRecommendationMessage("キャラクター推薦を取得できませんでした。診断結果自体は利用できます。");
    } finally {
      setRecommendationLoading(false);
    }
  }

  if (!diagnosis.questions.length) {
    return <div className="empty-state"><p>公開済みの質問がまだありません。</p></div>;
  }

  if (completed) {
    if (diagnosis.diagnosisType === "comprehensive") {
      const improvement = result.filter(([key, score]) => IMPROVEMENT_AXES.has(key) && score > 0).slice(0, 3);
      const style = result.filter(([key, score]) => !IMPROVEMENT_AXES.has(key) && score > 0).slice(0, 3);
      const topQuery = [...improvement, ...style].map(([key]) => axisLabel(key)).join(" ");
      return (
        <section className="info-panel diagnosis-result">
          <p className="eyebrow">RESULT</p>
          <h2>総合診断結果</h2>
          <div className="character-columns">
            <div><h3>改善優先度</h3><ResultList rows={improvement} label="優先度" /></div>
            <div><h3>プレイスタイル傾向</h3><ResultList rows={style} label="傾向" /></div>
          </div>
          <RecommendationBlock loading={recommendationLoading} recommendations={recommendations} message={recommendationMessage} />
          <div className="diagnosis-actions">
            {topQuery ? <Link className="button-primary" href={`/search?q=${encodeURIComponent(topQuery)}`}>関連情報を横断検索</Link> : null}
            {topQuery ? <Link className="button-secondary" href={`/coach?q=${encodeURIComponent(topQuery)}`}>AIコーチ用Evidenceを見る</Link> : null}
            <ResetButton onReset={() => { setIndex(0); setAnswers({}); setRecommendations([]); setRecommendationMessage(null); }} />
          </div>
        </section>
      );
    }

    const copy = resultCopy(diagnosis.diagnosisType);
    const priorities = result.filter(([, score]) => score > 0).slice(0, 3);
    const topQuery = priorities.map(([key]) => axisLabel(key)).join(" ");

    return (
      <section className="info-panel diagnosis-result">
        <p className="eyebrow">RESULT</p>
        <h2>{copy.title}</h2>
        <p>{copy.body}</p>
        <ResultList rows={priorities} label={copy.scoreLabel} />
        {diagnosis.diagnosisType === "character_fit" ? (
          <RecommendationBlock loading={recommendationLoading} recommendations={recommendations} message={recommendationMessage} />
        ) : null}
        <div className="diagnosis-actions">
          {topQuery ? <Link className="button-primary" href={`/search?q=${encodeURIComponent(topQuery)}`}>{copy.searchLabel}</Link> : null}
          {topQuery ? <Link className="button-secondary" href={`/coach?q=${encodeURIComponent(topQuery)}`}>AIコーチ用Evidenceを見る</Link> : null}
          <ResetButton onReset={() => { setIndex(0); setAnswers({}); setRecommendations([]); setRecommendationMessage(null); }} />
        </div>
      </section>
    );
  }

  const progress = Math.round(((index + 1) / diagnosis.questions.length) * 100);
  const selected = answers[question.id];

  return (
    <section className="diagnosis-runner">
      <div
        className="diagnosis-progress"
        role="progressbar"
        aria-label="診断の進捗"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      ><span style={{ width: `${progress}%` }} /></div>
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
        <button
          className="button-primary"
          type="button"
          disabled={!selected}
          onClick={() => {
            const finishing = index === diagnosis.questions.length - 1;
            if (finishing && (diagnosis.diagnosisType === "character_fit" || diagnosis.diagnosisType === "comprehensive")) {
              const scorePayload = calculateTotals(diagnosis, answers);
              const styleScores = Object.fromEntries(Object.entries(scorePayload).filter(([key]) => !IMPROVEMENT_AXES.has(key)));
              void loadRecommendations(styleScores);
            }
            setIndex((value) => value + 1);
          }}
        >
          {index === diagnosis.questions.length - 1 ? "結果を見る" : "次へ"}
        </button>
      </div>
    </section>
  );
}

function ResultList({ rows, label }: { rows: Array<[string, number]>; label: string }) {
  if (!rows.length) return <p>はっきりした傾向が出ませんでした。</p>;
  return <ol>{rows.map(([key, score]) => <li key={key}><strong>{axisLabel(key)}</strong>：{label} {score}</li>)}</ol>;
}

function RecommendationBlock({ loading, recommendations, message }: { loading: boolean; recommendations: Recommendation[]; message: string | null }) {
  return (
    <div className="data-notice">
      <h3>キャラクター推薦</h3>
      {loading ? <p>検証済みTraitデータから推薦を計算しています…</p> : null}
      {!loading && recommendations.length ? (
        <ol>
          {recommendations.map((item) => (
            <li key={item.characterId}>
              <Link href={`/characters/${item.slug}`}><strong>{item.name}</strong></Link>：一致度 {item.matchPercent}%
              <span className="muted">（{item.mappedTraits}/{item.activeTraits}特性を照合）</span>
              {item.reasons.length ? <div className="muted">主な一致: {item.reasons.map((reason) => reason.label).join(" / ")}</div> : null}
            </li>
          ))}
        </ol>
      ) : null}
      {!loading && !recommendations.length ? <p>{message ?? "推薦用の検証済みキャラクターデータがまだ不足しています。"}</p> : null}
    </div>
  );
}

function ResetButton({ onReset }: { onReset: () => void }) {
  return <button className="button-secondary" type="button" onClick={onReset}>最初からやり直す</button>;
}
