"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { CharacterSummary } from "@/types/character";
import {
  analyzeLastTen,
  causeCategoryLabel,
  EMPTY_IMPROVEMENT_STATE,
  IMPROVEMENT_STORAGE_KEY,
  trainingSuggestion,
  type BattleLog,
  type CauseCategory,
  type CheckValue,
  type ImprovementState,
  type ReplayReview,
} from "@/lib/improvement-tools";

const checkOptions: { value: CheckValue; label: string }[] = [
  { value: "good", label: "できた" },
  { value: "miss", label: "ミス" },
  { value: "unknown", label: "不明/機会なし" },
];

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readState(): ImprovementState {
  if (typeof window === "undefined") return EMPTY_IMPROVEMENT_STATE;
  try {
    const raw = window.localStorage.getItem(IMPROVEMENT_STORAGE_KEY);
    if (!raw) return EMPTY_IMPROVEMENT_STATE;
    const parsed = JSON.parse(raw) as Partial<ImprovementState>;
    return {
      battleLogs: Array.isArray(parsed.battleLogs) ? parsed.battleLogs : [],
      replayReviews: Array.isArray(parsed.replayReviews) ? parsed.replayReviews : [],
    };
  } catch {
    return EMPTY_IMPROVEMENT_STATE;
  }
}

export function ImprovementLoopTool({ characters }: { characters: CharacterSummary[] }) {
  const [state, setState] = useState<ImprovementState>(EMPTY_IMPROVEMENT_STATE);
  const [ready, setReady] = useState(false);
  const [opponentId, setOpponentId] = useState(characters[0]?.id ?? "");
  const [result, setResult] = useState<"win" | "loss">("loss");
  const [rating, setRating] = useState("");
  const [damageCause, setDamageCause] = useState("");
  const [antiAir, setAntiAir] = useState<CheckValue>("unknown");
  const [driveImpact, setDriveImpact] = useState<CheckValue>("unknown");
  const [punish, setPunish] = useState<CheckValue>("unknown");
  const [cornerEscape, setCornerEscape] = useState<CheckValue>("unknown");
  const [driveManagement, setDriveManagement] = useState<CheckValue>("unknown");
  const [difficultAction, setDifficultAction] = useState("");
  const [causeCategory, setCauseCategory] = useState<CauseCategory>("judgment");
  const [problemScene, setProblemScene] = useState("");
  const [replayCause, setReplayCause] = useState("");
  const [attemptedAnswer, setAttemptedAnswer] = useState("");
  const [adoptedAnswer, setAdoptedAnswer] = useState("");
  const [retrainingTarget, setRetrainingTarget] = useState("");

  useEffect(() => {
    setState(readState());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(IMPROVEMENT_STORAGE_KEY, JSON.stringify(state));
  }, [ready, state]);

  const analysis = useMemo(() => analyzeLastTen(state.battleLogs), [state.battleLogs]);
  const weakest = [...analysis.weaknessMetrics]
    .filter((metric) => metric.opportunities > 0)
    .sort((a, b) => b.rate - a.rate)[0] ?? null;

  function submitBattleLog(event: FormEvent) {
    event.preventDefault();
    const character = characters.find((item) => item.id === opponentId);
    if (!character) return;
    const log: BattleLog = {
      id: createId(),
      createdAt: new Date().toISOString(),
      opponentCharacterId: character.id,
      opponentName: character.name,
      result,
      rating: rating.trim(),
      damageCause: damageCause.trim(),
      antiAir,
      driveImpact,
      punish,
      cornerEscape,
      driveManagement,
      difficultAction: difficultAction.trim(),
      causeCategory,
    };
    setState((current) => ({ ...current, battleLogs: [log, ...current.battleLogs].slice(0, 200) }));
    setDamageCause("");
    setDifficultAction("");
  }

  function submitReplayReview(event: FormEvent) {
    event.preventDefault();
    if (!problemScene.trim()) return;
    const review: ReplayReview = {
      id: createId(),
      createdAt: new Date().toISOString(),
      problemScene: problemScene.trim(),
      cause: replayCause.trim(),
      attemptedAnswer: attemptedAnswer.trim(),
      adoptedAnswer: adoptedAnswer.trim(),
      retrainingTarget: retrainingTarget.trim(),
    };
    setState((current) => ({ ...current, replayReviews: [review, ...current.replayReviews].slice(0, 100) }));
    setProblemScene("");
    setReplayCause("");
    setAttemptedAnswer("");
    setAdoptedAnswer("");
    setRetrainingTarget("");
  }

  return (
    <div className="page-stack">
      <section className="info-panel">
        <h2>対戦後30秒ログ</h2>
        <p>未入力・不明項目があっても保存できます。分析は直近10戦を対象にします。</p>
        <form className="page-stack" onSubmit={submitBattleLog}>
          <label>相手キャラ
            <select value={opponentId} onChange={(e) => setOpponentId(e.target.value)}>
              {characters.map((character) => <option value={character.id} key={character.id}>{character.name}</option>)}
            </select>
          </label>
          <label>勝敗
            <select value={result} onChange={(e) => setResult(e.target.value as "win" | "loss")}>
              <option value="win">勝ち</option><option value="loss">負け</option>
            </select>
          </label>
          <label>MR / LP<input value={rating} onChange={(e) => setRating(e.target.value)} placeholder="例: MR 1500 / LP 24500" /></label>
          <label>主な被弾原因<input value={damageCause} onChange={(e) => setDamageCause(e.target.value)} placeholder="例: 飛び、ラッシュ小技、投げ" /></label>
          <div className="tool-card-grid">
            {([
              ["対空", antiAir, setAntiAir], ["DI返し", driveImpact, setDriveImpact], ["確反", punish, setPunish],
              ["端脱出", cornerEscape, setCornerEscape], ["Drive管理", driveManagement, setDriveManagement],
            ] as const).map(([label, value, setter]) => (
              <label key={label}>{label}
                <select value={value} onChange={(e) => setter(e.target.value as CheckValue)}>
                  {checkOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
                </select>
              </label>
            ))}
          </div>
          <label>困った技・連携<input value={difficultAction} onChange={(e) => setDifficultAction(e.target.value)} /></label>
          <label>主分類
            <select value={causeCategory} onChange={(e) => setCauseCategory(e.target.value as CauseCategory)}>
              {(["knowledge", "execution", "judgment", "habit", "matchup"] as CauseCategory[]).map((value) => (
                <option value={value} key={value}>{causeCategoryLabel(value)}</option>
              ))}
            </select>
          </label>
          <button type="submit">対戦ログを保存</button>
        </form>
      </section>

      <section className="info-panel">
        <h2>直近10戦レビュー</h2>
        <p>記録 {analysis.recent.length}/10戦・{analysis.wins}勝 {analysis.losses}敗</p>
        <p><strong>次の最優先課題:</strong> {analysis.priority}</p>
        <div className="tool-card-grid">
          {analysis.weaknessMetrics.map((metric) => (
            <article className="info-panel" key={metric.key}>
              <h3>{metric.label}</h3>
              <p>{metric.opportunities ? `ミス ${metric.misses}/${metric.opportunities}（${metric.rate}%）` : "記録なし"}</p>
              <progress max={100} value={metric.rate} aria-label={`${metric.label} ミス率`} />
            </article>
          ))}
        </div>
      </section>

      <section className="info-panel">
        <h2>弱点ヒートマップ / 今日の練習</h2>
        {weakest ? (
          <>
            <p>現在もっとも記録上のミス率が高い項目は <strong>{weakest.label}</strong> です。</p>
            <p>{trainingSuggestion(weakest.key)}</p>
          </>
        ) : <p>対戦ログを追加すると候補を表示します。</p>}
        <p>Source付きTraining/Counterを確認して内容を確定してください。未verified攻略をここで断定表示しません。</p>
        <p><Link href="/trainings">Trainingを見る</Link> / <Link href="/counters">Counterを見る</Link></p>
      </section>

      <section className="info-panel">
        <h2>Replay復習ワークフロー</h2>
        <form className="page-stack" onSubmit={submitReplayReview}>
          <label>問題場面<textarea value={problemScene} onChange={(e) => setProblemScene(e.target.value)} required /></label>
          <label>原因<textarea value={replayCause} onChange={(e) => setReplayCause(e.target.value)} /></label>
          <label>試した回答<textarea value={attemptedAnswer} onChange={(e) => setAttemptedAnswer(e.target.value)} /></label>
          <label>採用回答<textarea value={adoptedAnswer} onChange={(e) => setAdoptedAnswer(e.target.value)} /></label>
          <label>再練習対象<input value={retrainingTarget} onChange={(e) => setRetrainingTarget(e.target.value)} /></label>
          <button type="submit">Replay復習を保存</button>
        </form>
        {state.replayReviews.length > 0 && (
          <div className="page-stack">
            {state.replayReviews.slice(0, 10).map((review) => (
              <article className="info-panel" key={review.id}>
                <h3>{review.problemScene}</h3>
                <p>原因: {review.cause || "不明"}</p>
                <p>採用回答: {review.adoptedAnswer || "未確定"}</p>
                <p>再練習: {review.retrainingTarget || "未設定"}</p>
                <button type="button" onClick={() => setState((current) => ({ ...current, replayReviews: current.replayReviews.filter((item) => item.id !== review.id) }))}>削除</button>
              </article>
            ))}
          </div>
        )}
      </section>

      {state.battleLogs.length > 0 && (
        <section className="info-panel">
          <h2>最近の対戦ログ</h2>
          {state.battleLogs.slice(0, 10).map((log) => (
            <article className="info-panel" key={log.id}>
              <h3>{log.opponentName} — {log.result === "win" ? "勝ち" : "負け"}</h3>
              <p>{log.rating || "MR/LP未入力"} / {causeCategoryLabel(log.causeCategory)}</p>
              <p>{log.damageCause || "主な被弾原因未入力"}</p>
              <button type="button" onClick={() => setState((current) => ({ ...current, battleLogs: current.battleLogs.filter((item) => item.id !== log.id) }))}>削除</button>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
