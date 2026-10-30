"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getDiagnosisHistory, saveDiagnosisHistory } from "@/lib/local-user-tools";
import { usePersonalizationOwner } from "@/lib/use-personalization-owner";
import { personalStorageKey, type PersonalOwner } from "@/lib/personalization-storage";
import { buildDailyTrainingHref } from "@/lib/daily-training";
import { releaseFeatures } from "@/lib/release-features";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
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

type DatabaseSaveStatus = "idle" | "saving" | "saved" | "failed";

type PendingDiagnosisSave = {
  requestId: string;
  fingerprint: string;
};

const AXIS_LABELS: Record<string, string> = {
  anti_air: "対空", drive_rush_defense: "ドライブラッシュ対応", impact_response: "インパクト返し", punish: "確定反撃",
  defense: "防御・切り返し", offense: "攻めの選択肢", meter: "ゲージ管理", matchup: "キャラ対策",
  execution: "コンボ・セットプレイ精度", neutral: "中距離・立ち回り", corner_defense: "画面端の守り", decision: "観察・判断",
  aggression: "前に出る攻め", patience: "待ち・観察", keepout: "遠距離・けん制", rushdown: "近距離ラッシュ",
  grappling: "投げ・コマンド投げ", setup: "設置・セットプレイ", footsies: "差し合い・地上戦", mobility: "機動力・位置調整",
  simplicity: "操作の分かりやすさ", technicality: "テクニカル操作", defense_preference: "守りから組み立てる", explosive: "一気に試合を動かす",
};

const IMPROVEMENT_AXES = new Set([
  "anti_air", "drive_rush_defense", "impact_response", "punish", "defense", "offense",
  "meter", "matchup", "execution", "neutral", "corner_defense", "decision",
]);

function axisLabel(key: string) { return AXIS_LABELS[key] ?? key; }
function draftKey(owner: PersonalOwner | null, slug: string) {
  const key = personalStorageKey(owner, "diagnosis_draft");
  return key ? `${key}:${slug}` : null;
}
function saveRequestKey(owner: PersonalOwner | null, slug: string) {
  const key = personalStorageKey(owner, "diagnosis_save_request");
  return key ? `${key}:${slug}` : null;
}

function createRequestId() {
  if (typeof crypto === "undefined" || !("randomUUID" in crypto)) {
    throw new Error("このブラウザでは安全な保存IDを生成できません。");
  }
  return crypto.randomUUID();
}

function readPendingSave(key: string): PendingDiagnosisSave | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PendingDiagnosisSave>;
    if (typeof parsed.requestId !== "string" || typeof parsed.fingerprint !== "string") return null;
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(parsed.requestId)) return null;
    return { requestId: parsed.requestId, fingerprint: parsed.fingerprint };
  } catch {
    return null;
  }
}

function calculateTotals(diagnosis: DiagnosisDefinition, answers: Record<string, string>) {
  const totals: Record<string, number> = {};
  for (const q of diagnosis.questions) {
    const optionId = answers[q.id];
    const option = q.options.find((item) => item.id === optionId);
    if (!option) continue;
    for (const [key, value] of Object.entries(option.scorePayload)) totals[key] = (totals[key] ?? 0) + Number(value || 0);
  }
  return totals;
}

function resultCopy(type: string) {
  if (type === "playstyle") return { title: "あなたのプレイスタイル傾向", body: "点数が高い項目ほど、好みや得意だと感じる戦い方が回答に強く表れています。実戦では複数のスタイルを組み合わせます。", scoreLabel: "傾向", searchLabel: "関連する攻略を探す" };
  if (type === "character_fit") return { title: "相性が良さそうなキャラクター特性", body: "点数が高い項目ほど、キャラクター選びで重視したい特性です。特性を十分に確認できたキャラクターだけを候補に表示します。", scoreLabel: "適性", searchLabel: "関連キャラ・攻略を探す" };
  return { title: "まず取り組む練習", body: "回答から練習候補を挙げています。選ばれた理由を確認して、今日取り組む課題を決めましょう。", scoreLabel: "優先度", searchLabel: "関連攻略を探す" };
}

export function DiagnosisRunner({ diagnosis }: { diagnosis: DiagnosisDefinition }) {
  const ownerContext = usePersonalizationOwner();
  const { state } = ownerContext;
  // A new diagnosis or auth generation gets fresh state before effects can save it.
  const sessionKey = JSON.stringify([
    diagnosis.id, diagnosis.slug, diagnosis.diagnosisType, diagnosis.questions,
    state.status, state.status === "ready" ? state.owner : null,
    state.status === "ready" ? state.version : null,
  ]);
  return <DiagnosisSession key={sessionKey} diagnosis={diagnosis} ownerContext={ownerContext} />;
}

function DiagnosisSession({ diagnosis, ownerContext }: {
  diagnosis: DiagnosisDefinition;
  ownerContext: ReturnType<typeof usePersonalizationOwner>;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [resumedCount, setResumedCount] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [hydratedOwner, setHydratedOwner] = useState<PersonalOwner | null>(null);
  const [draftStorageFailed, setDraftStorageFailed] = useState(false);
  const [historyStorageFailed, setHistoryStorageFailed] = useState(false);
  const [resetStorageFailed, setResetStorageFailed] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [recommendationMessage, setRecommendationMessage] = useState<string | null>(null);
  const [recommendationLoading, setRecommendationLoading] = useState(false);
  const [databaseSaveStatus, setDatabaseSaveStatus] = useState<DatabaseSaveStatus>("idle");
  const [databaseSaveMessage, setDatabaseSaveMessage] = useState<string | null>(null);
  const [historyRetryVersion, setHistoryRetryVersion] = useState(0);
  const { state: historyOwnerState, isCurrent: isHistoryOwnerCurrent } = ownerContext;
  const currentOwner = historyOwnerState.status === "ready" && isHistoryOwnerCurrent()
    ? historyOwnerState.owner
    : null;
  const currentOwnerVersion = historyOwnerState.status === "ready" ? historyOwnerState.version : null;
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const historySaved = useRef(false);
  const localHistoryOwner = useRef<PersonalOwner | null>(null);
  const localHistoryRecord = useRef<Parameters<typeof saveDiagnosisHistory>[1] | null>(null);
  const databaseSaveStarted = useRef(false);
  const databaseSaveInFlight = useRef(false);
  const databaseSaveGeneration = useRef(0);
  const question = diagnosis.questions[index];
  const completed = diagnosis.questions.length > 0 && index >= diagnosis.questions.length;

  useEffect(() => {
    const generation = ++databaseSaveGeneration.current;
    historySaved.current = false;
    localHistoryOwner.current = null;
    localHistoryRecord.current = null;
    databaseSaveStarted.current = false;
    databaseSaveInFlight.current = false;
    if (!currentOwner || !isHistoryOwnerCurrent()) return;
    const owner = currentOwner;
    const key = draftKey(owner, diagnosis.slug);
    if (!key) return;

    const timer = window.setTimeout(() => {
      if (generation !== databaseSaveGeneration.current || !isHistoryOwnerCurrent()) return;
      try {
        const raw = window.localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw) as Record<string, string>;
          const valid: Record<string, string> = {};
          for (const q of diagnosis.questions) {
            if (q.options.some((option) => option.id === parsed[q.id])) valid[q.id] = parsed[q.id];
          }
          const count = Object.keys(valid).length;
          if (count) {
            setAnswers(valid);
            setResumedCount(count);
            const firstUnanswered = diagnosis.questions.findIndex((q) => !valid[q.id]);
            setIndex(firstUnanswered === -1 ? diagnosis.questions.length : firstUnanswered);
          }
        }
      } catch {
        setDraftStorageFailed(true);
        try {
          window.localStorage.removeItem(key);
        } catch {
          // The browser can reject both reading and removing local drafts.
        }
      } finally {
        if (generation === databaseSaveGeneration.current && isHistoryOwnerCurrent()) {
          setHydratedOwner(owner);
          setHydrated(true);
        }
      }
    }, 0);
    return () => {
      window.clearTimeout(timer);
      // Invalidate pending saves when this diagnosis/owner session is removed.
      databaseSaveGeneration.current += 1;
    };
  }, [currentOwner, currentOwnerVersion, diagnosis.questions, diagnosis.slug, isHistoryOwnerCurrent]);

  useEffect(() => {
    if (completed && hydrated) resultHeadingRef.current?.focus();
  }, [completed, hydrated]);

  useEffect(() => {
    if (!currentOwner || !isHistoryOwnerCurrent() || !hydrated || hydratedOwner !== currentOwner) return;
    const key = draftKey(currentOwner, diagnosis.slug);
    if (!key) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(answers));
    } catch {
      const generation = databaseSaveGeneration.current;
      const timer = window.setTimeout(() => {
        if (generation === databaseSaveGeneration.current) setDraftStorageFailed(true);
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [answers, currentOwner, diagnosis.slug, hydrated, hydratedOwner, isHistoryOwnerCurrent]);

  const totals = useMemo(() => (completed ? calculateTotals(diagnosis, answers) : {}), [answers, completed, diagnosis]);
  const result = useMemo(() => Object.entries(totals).sort((a, b) => b[1] - a[1]), [totals]);

  useEffect(() => {
    if (!completed || !currentOwner || !isHistoryOwnerCurrent() || !hydrated || hydratedOwner !== currentOwner || historySaved.current) return;
    const generation = databaseSaveGeneration.current;
    const timer = window.setTimeout(() => {
      if (generation !== databaseSaveGeneration.current || historySaved.current) return;
      if (!isHistoryOwnerCurrent() || hydratedOwner !== currentOwner) return;
      if (currentOwner !== "guest") { setHistoryStorageFailed(false); return; }
      if (localHistoryOwner.current && localHistoryOwner.current !== currentOwner) { setHistoryStorageFailed(true); return; }
      localHistoryOwner.current ??= currentOwner;
      const topResults = result.filter(([, score]) => score > 0).slice(0, 6).map(([key, score]) => ({ key, label: axisLabel(key), score }));
      try {
        let record = localHistoryRecord.current;
        if (!record) {
          const history = getDiagnosisHistory(currentOwner);
          const requestStorageKey = saveRequestKey(currentOwner, diagnosis.slug);
          if (!history || !requestStorageKey) throw new Error("guest_history_unavailable");
          const fingerprint = JSON.stringify({ diagnosisId: diagnosis.id,
            answers: diagnosis.questions.map(item => [item.id, answers[item.id]]), topResults });
          const rawRequest = window.localStorage.getItem(requestStorageKey);
          const previous = readPendingSave(requestStorageKey);
          if (rawRequest !== null && !previous) throw new Error("guest_request_unreadable");
          const pending = previous?.fingerprint === fingerprint ? previous : { requestId: createRequestId(), fingerprint };
          window.localStorage.setItem(requestStorageKey, JSON.stringify(pending));
          const saved = history.find(item => item.id === pending.requestId);
          record = { id: pending.requestId, diagnosisSlug: diagnosis.slug,
            diagnosisTitle: diagnosis.title, diagnosisType: diagnosis.diagnosisType, topResults,
            completedAt: saved?.completedAt ?? new Date().toISOString() };
          localHistoryRecord.current = record;
        }
        if (!isHistoryOwnerCurrent() || !saveDiagnosisHistory(currentOwner, record)) { setHistoryStorageFailed(true); return; }
        historySaved.current = true;
        setHistoryStorageFailed(false);
      } catch {
        setHistoryStorageFailed(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [completed, currentOwner, diagnosis.diagnosisType, diagnosis.id, diagnosis.questions, diagnosis.slug, diagnosis.title, answers, historyRetryVersion, hydrated, hydratedOwner, isHistoryOwnerCurrent, result]);

  useEffect(() => {
    if (!completed || !currentOwner || !isHistoryOwnerCurrent() || !hydrated || hydratedOwner !== currentOwner ||
      (diagnosis.diagnosisType !== "character_fit" && diagnosis.diagnosisType !== "comprehensive")) return;
    let active = true;
    const controller = new AbortController();
    const styleScores = Object.fromEntries(Object.entries(totals).filter(([key]) => !IMPROVEMENT_AXES.has(key)));
    async function loadRecommendations() {
      setRecommendationLoading(true);
      setRecommendationMessage(null);
      setRecommendations([]);
      try {
        const response = await fetch("/api/diagnosis/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scores: styleScores, limit: 5 }),
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Recommendation request failed");
        const payload = await response.json();
        if (!active) return;
        setRecommendations(Array.isArray(payload.recommendations) ? payload.recommendations : []);
        setRecommendationMessage(payload.message === "verified + published のキャラクター特性マッピングが十分に揃っていません。"
          ? "推薦に必要なキャラクター情報を準備しています。"
          : typeof payload.message === "string" ? payload.message : null);
      } catch {
        if (!active) return;
        setRecommendations([]);
        setRecommendationMessage("おすすめのキャラクターを読み込めませんでした。診断結果はこのまま見られます。");
      } finally {
        if (active) setRecommendationLoading(false);
      }
    }
    void loadRecommendations();
    return () => {
      active = false;
      controller.abort();
    };
  }, [completed, currentOwner, diagnosis.diagnosisType, hydrated, hydratedOwner, isHistoryOwnerCurrent, totals]);

  const saveCompletedDiagnosis = useCallback(async () => {
    if (!completed || !currentOwner || currentOwner === "guest" || !isHistoryOwnerCurrent() ||
      !hydrated || hydratedOwner !== currentOwner || databaseSaveInFlight.current) return;
    const saveOwner = currentOwner;
    databaseSaveInFlight.current = true;
    const generation = databaseSaveGeneration.current;
    const isSaveCurrent = () => generation === databaseSaveGeneration.current &&
      isHistoryOwnerCurrent() && currentOwner === saveOwner && hydratedOwner === saveOwner;

    try {
      const supabase = getSupabaseBrowserClient();
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (!isSaveCurrent()) return;
      if (authError) throw authError;
      const expectedUserId = saveOwner.startsWith("uid:") ? saveOwner.slice(4).toLowerCase() : null;
      if (!expectedUserId || authData.user?.id?.toLowerCase() !== expectedUserId) throw new Error("diagnosis_owner_changed");

      const answerPayload = diagnosis.questions.map((item) => ({
        question_id: item.id,
        option_id: answers[item.id],
      }));
      const resultPayload = {
        diagnosis_type: diagnosis.diagnosisType,
        scores: totals,
        top_results: result.filter(([, score]) => score > 0).map(([key, score]) => ({ key, score })),
      };
      const fingerprint = JSON.stringify({ diagnosisId: diagnosis.id, resultPayload, answerPayload });
      const storageKey = saveRequestKey(saveOwner, diagnosis.slug);
      if (!storageKey) throw new Error("diagnosis_owner_invalid");
      const stored = readPendingSave(storageKey);
      const pending = stored?.fingerprint === fingerprint
        ? stored
        : { requestId: createRequestId(), fingerprint };

      window.localStorage.setItem(storageKey, JSON.stringify(pending));
      if (!isSaveCurrent()) return;
      setDatabaseSaveStatus("saving");
      setDatabaseSaveMessage(null);

      const { data, error } = await supabase.rpc("save_diagnosis_result_with_answers", {
        p_diagnosis_id: diagnosis.id,
        p_result_payload: resultPayload,
        p_answers: answerPayload,
        p_request_id: pending.requestId,
      });
      if (!isSaveCurrent()) return;
      if (error) throw error;

      if (typeof data !== "string") throw new Error("診断結果IDを確認できませんでした。");
      // The completed draft survives reloads. Keep its request identity until
      // reset or a different payload, so revisiting this result is idempotent.
      setDatabaseSaveStatus("saved");
      setDatabaseSaveMessage(null);
    } catch {
      if (!isSaveCurrent()) return;
      console.error("[diagnosis] result save failed");
      setDatabaseSaveStatus("failed");
      setDatabaseSaveMessage("診断結果をアカウントに保存できませんでした。下のボタンからもう一度お試しください。");
    } finally {
      if (isSaveCurrent()) {
        databaseSaveInFlight.current = false;
      }
    }
  }, [answers, completed, currentOwner, diagnosis, hydrated, hydratedOwner, isHistoryOwnerCurrent, result, totals]);

  useEffect(() => {
    if (!completed || !currentOwner || !isHistoryOwnerCurrent() || !hydrated || hydratedOwner !== currentOwner || databaseSaveStarted.current) return;
    databaseSaveStarted.current = true;
    void saveCompletedDiagnosis();
  }, [completed, currentOwner, hydrated, hydratedOwner, isHistoryOwnerCurrent, saveCompletedDiagnosis]);

  function reset() {
    if (!currentOwner || !isHistoryOwnerCurrent() || hydratedOwner !== currentOwner) {
      setResetStorageFailed(true);
      return;
    }
    const draftStorageKey = draftKey(currentOwner, diagnosis.slug);
    const requestStorageKey = saveRequestKey(currentOwner, diagnosis.slug);
    if (!draftStorageKey || !requestStorageKey) {
      setResetStorageFailed(true);
      return;
    }
    try {
      window.localStorage.removeItem(draftStorageKey);
      window.localStorage.removeItem(requestStorageKey);
    } catch {
      // Keep the result, request identity, and save generation until retry succeeds.
      setResetStorageFailed(true);
      return;
    }
    databaseSaveGeneration.current += 1;
    historySaved.current = false;
    localHistoryOwner.current = null;
    localHistoryRecord.current = null;
    databaseSaveStarted.current = false;
    databaseSaveInFlight.current = false;
    setResetStorageFailed(false);
    setHistoryStorageFailed(false);
    setDatabaseSaveStatus("idle"); setDatabaseSaveMessage(null);
    setIndex(0); setAnswers({}); setResumedCount(0); setRecommendations([]); setRecommendationMessage(null);
  }

  if (!diagnosis.questions.length) return <div className="empty-state"><p>公開済みの質問がまだありません。</p></div>;
  if (historyOwnerState.status === "error") return <div className="empty-state" role="alert"><p>ログイン状態を確認できませんでした。通信状態を確認して、もう一度お試しください。</p><button type="button" className="button-secondary" onClick={() => window.location.reload()}>再読み込みして確認する</button></div>;
  if (!currentOwner || !isHistoryOwnerCurrent()) return <div className="empty-state"><p>認証状態を確認しています…</p></div>;
  if (!hydrated || hydratedOwner !== currentOwner) return <div className="empty-state"><p>前回の回答を確認しています…</p></div>;

  if (completed) {
    if (diagnosis.diagnosisType === "comprehensive") {
      const improvement = result.filter(([key, score]) => IMPROVEMENT_AXES.has(key) && score > 0).slice(0, 3);
      const style = result.filter(([key, score]) => !IMPROVEMENT_AXES.has(key) && score > 0).slice(0, 3);
      const topQuery = [...improvement, ...style].map(([key]) => axisLabel(key)).join(" ");
      return <section className="info-panel diagnosis-result"><p className="eyebrow">RESULT</p><h2 ref={resultHeadingRef} tabIndex={-1}>総合診断結果</h2><p>改善優先度は「先に練習したいこと」、プレイスタイル傾向は「好みの戦い方」を示します。まずは優先度の高い項目を確認し、今日の15分練習へ進みましょう。</p>{resumedCount ? <p className="data-notice">この結果には、この端末に保存されていた前回の回答 {resumedCount}件を使っています。</p> : null}{resetStorageFailed ? <div className="data-notice" role="alert"><p>この端末に保存された回答や保存情報を一部削除できませんでした。再読み込み後に以前の回答が表示される場合があります。</p></div> : null}<div className="diagnosis-save-summary" aria-label="保存状況"><HistoryStorageNotice failed={historyStorageFailed} onRetry={() => setHistoryRetryVersion((value) => value + 1)} /><DatabaseSaveNotice status={databaseSaveStatus} message={databaseSaveMessage} onRetry={() => void saveCompletedDiagnosis()} /></div><div className="character-columns"><div><h3>改善優先度</h3><ResultList rows={improvement} label="優先度" diagnosis={diagnosis} answers={answers} /></div><div><h3>プレイスタイル傾向</h3><ResultList rows={style} label="傾向" diagnosis={diagnosis} answers={answers} /></div></div><RecommendationBlock loading={recommendationLoading} recommendations={recommendations} message={recommendationMessage} /><div className="diagnosis-actions"><Link className="button-primary" href={buildDailyTrainingHref(diagnosis.diagnosisType, result)}>今日の練習を決める</Link>{topQuery ? <Link className="button-secondary" href={`/search?q=${encodeURIComponent(topQuery)}`}>関連情報をまとめて探す</Link> : null}{releaseFeatures.aiCoach && topQuery ? <Link className="button-secondary" href={`/coach?q=${encodeURIComponent(topQuery)}`}>AIコーチの根拠情報を見る</Link> : null}<Link className="button-secondary" href="/diagnosis/history">診断履歴を見る</Link><ResetButton onReset={reset} /></div></section>;
    }
    const copy = resultCopy(diagnosis.diagnosisType);
    const priorities = result.filter(([, score]) => score > 0).slice(0, 3);
    const topQuery = priorities.map(([key]) => axisLabel(key)).join(" ");
    return <section className="info-panel diagnosis-result"><p className="eyebrow">RESULT</p><h2 ref={resultHeadingRef} tabIndex={-1}>{copy.title}</h2>{resumedCount ? <p className="data-notice">この結果には、この端末に保存されていた前回の回答 {resumedCount}件を使っています。</p> : null}{resetStorageFailed ? <div className="data-notice" role="alert"><p>この端末に保存された回答や保存情報を一部削除できませんでした。再読み込み後に以前の回答が表示される場合があります。</p></div> : null}<div className="diagnosis-save-summary" aria-label="保存状況"><HistoryStorageNotice failed={historyStorageFailed} onRetry={() => setHistoryRetryVersion((value) => value + 1)} /><DatabaseSaveNotice status={databaseSaveStatus} message={databaseSaveMessage} onRetry={() => void saveCompletedDiagnosis()} /></div><p>{copy.body}</p><ResultList rows={priorities} label={copy.scoreLabel} diagnosis={diagnosis} answers={answers} />{diagnosis.diagnosisType === "character_fit" ? <RecommendationBlock loading={recommendationLoading} recommendations={recommendations} message={recommendationMessage} /> : null}<div className="diagnosis-actions"><Link className="button-primary" href={buildDailyTrainingHref(diagnosis.diagnosisType, result)}>今日の練習を決める</Link>{topQuery ? <Link className="button-secondary" href={`/search?q=${encodeURIComponent(topQuery)}`}>{copy.searchLabel}</Link> : null}{releaseFeatures.aiCoach && topQuery ? <Link className="button-secondary" href={`/coach?q=${encodeURIComponent(topQuery)}`}>AIコーチの根拠情報を見る</Link> : null}<Link className="button-secondary" href="/diagnosis/history">診断履歴を見る</Link><ResetButton onReset={reset} /></div></section>;
  }

  const selected = answers[question.id];
  return <section className="diagnosis-runner">{resetStorageFailed ? <div className="data-notice" role="alert"><p>この端末に保存された回答や保存情報を一部削除できませんでした。再読み込み後に以前の回答が表示される場合があります。</p></div> : null}{draftStorageFailed ? <div className="data-notice" role="alert"><p>この端末の回答を読み書きできませんでした。診断は続けられますが、中断後に再開できない場合があります。</p></div> : null}{resumedCount ? <div className="data-notice"><strong>前回の回答 {resumedCount}件を再利用</strong><p>この端末に保存された回答を使い、最初の未回答の質問から再開しています。</p></div> : null}<div className="analysis-position"><strong>{diagnosis.title}</strong><span>質問 {index + 1} / {diagnosis.questions.length}</span></div><ol className="analysis-markers" aria-label="回答状況">{diagnosis.questions.map((item, position) => <li key={item.id} aria-current={position === index ? "step" : undefined} data-answered={Boolean(answers[item.id])}><span className="sr-only">質問{position + 1}：{answers[item.id] ? "回答済み" : "未回答"}</span></li>)}</ol><h2>{question.prompt}</h2>{question.helpText ? <p className="muted">{question.helpText}</p> : null}<div className="diagnosis-options">{question.options.map((option) => <button className={selected === option.id ? "diagnosis-option is-selected" : "diagnosis-option"} key={option.id} aria-pressed={selected === option.id} type="button" onClick={() => setAnswers((current) => ({ ...current, [question.id]: option.id }))}>{option.label}</button>)}</div><div className="diagnosis-actions"><button className="button-secondary" type="button" disabled={index === 0} onClick={() => setIndex((value) => Math.max(0, value - 1))}>戻る</button><button className="button-primary" type="button" disabled={!selected} onClick={() => { setIndex((value) => value === index ? value + 1 : value); }}>{index === diagnosis.questions.length - 1 ? "結果を見る" : "次へ"}</button></div></section>;
}

const RESULT_PRACTICE: Record<string, { scene: string; observe: string; practice: string }> = {
  "anti_air": {
    "scene": "相手のジャンプを見た場面",
    "observe": "飛び込みを受けた直前、自分が技を出していたか、地上で待っていたかを確認します。",
    "practice": "相手のジャンプを録画し、自分が動ける状態で対空を出せるか試します。"
  },
  "drive_rush_defense": {
    "scene": "ラッシュから触られた場面",
    "observe": "ラッシュが始まった距離と、そのとき自分が押していた技を確認します。",
    "practice": "同じ距離のラッシュを録画し、ガードする場合と技で止める場合を比べます。"
  },
  "impact_response": {
    "scene": "インパクトを受けた直前",
    "observe": "自分が技の動作中だったか、何もしていない状態だったかを確認します。",
    "practice": "動ける状態でインパクトを返す練習から始め、使った技から返せるかも別に試します。"
  },
  "punish": {
    "scene": "相手の技をガードした直後",
    "observe": "自分の反撃が間に合ったか、相手にガードされたかを確認します。",
    "practice": "同じ技をガードする状況を再現し、反撃が確定する技を1つ探します。"
  },
  "defense": {
    "scene": "起き上がりに攻撃を受けた場面",
    "observe": "ガード・投げ抜け・技出しのどれを選び、相手の何に負けたかを確認します。",
    "practice": "相手の攻めを1つ録画し、まず打撃をガードする練習から試します。"
  },
  "offense": {
    "scene": "自分の攻めが止まった場面",
    "observe": "相手がガード・技出し・後退のどれで対応したかを確認します。",
    "practice": "相手の対応を録画し、それに対して使う攻めを1つ試します。"
  },
  "meter": {
    "scene": "ゲージを使った場面",
    "observe": "使う直前の残量と、その使用でダメージ・位置・守りの何を得たかを確認します。",
    "practice": "同じ場面をゲージ使用あり・なしで試し、残量と結果を比べます。"
  },
  "matchup": {
    "scene": "同じ相手の技に困った場面",
    "observe": "技名、距離、ガードしたか当たったかを1つ記録します。",
    "practice": "その技を録画し、ガード後に反撃できるか、距離を取れるか試します。"
  },
  "execution": {
    "scene": "コンボや起き攻めが途切れた場面",
    "observe": "入力履歴を見て、予定と違った入力・タイミングを1か所探します。",
    "practice": "失敗したつなぎだけを切り出し、成功したら前後の動きを足します。"
  },
  "neutral": {
    "scene": "地上で相手の技に当たった場面",
    "observe": "前進中・技を出す前後・後退中のどこで当たったかを確認します。",
    "practice": "同じ距離と相手の技を再現し、歩いてガードする位置を試します。"
  },
  "corner_defense": {
    "scene": "画面端でダメージを受けた直前",
    "observe": "自分が「技を出した・ジャンプした・ガードしていた」のどれだったか、相手の行動と一緒に確認します。",
    "practice": "技を出して相手の打撃に負けていた場合は、その攻めを録画してガードする練習を試します。"
  },
  "decision": {
    "scene": "同じ相手の行動を2回受けた場面",
    "observe": "2回目に自分の対応を変えたかを確認します。同じ行動がなければ、気になった行動を1つ記録します。",
    "practice": "記録した相手の行動を再現し、次に試す対応を1つ決めます。"
  }
};

function ResultList({ rows, label, diagnosis, answers }: {
  rows: Array<[string, number]>;
  label: string;
  diagnosis: DiagnosisDefinition;
  answers: Record<string, string>;
}) {
  if (!rows.length) return <p>はっきりした傾向が出ませんでした。</p>;
  return <ol className="analysis-results">
    {rows.map(([key, score]) => {
      const evidence = diagnosis.questions.flatMap((question) => {
        const option = question.options.find((item) => item.id === answers[question.id]);
        return option && Number(option.scorePayload[key]) > 0
          ? [{ id: question.id, prompt: question.prompt, answer: option.label }] : [];
      });
      const tied = rows.filter(([, value]) => value === score).length > 1;
      const task = label === "優先度" ? RESULT_PRACTICE[key] : undefined;
      return <li key={key} className="diagnosis-task-card">
        <header className="diagnosis-task-heading"><span className="diagnosis-task-symbol" aria-hidden="true">◎</span><div><p className="diagnosis-task-kicker">{task ? "今日の練習候補" : "回答から見えた傾向"}</p><h3>{axisLabel(key)}</h3></div></header>
        {task ? <div className="diagnosis-task-plan"><section><h4>まず確認すること</h4><strong>{task.scene}</strong><p>{task.observe}</p></section><section><h4>最初に試す練習</h4><p>{task.practice}</p><p className="diagnosis-task-goal">確認の目安：場面を1つ記録し、次に試す対応を1つ決められたら、今日の練習へ進みましょう。</p></section></div> : null}
        <details className="diagnosis-task-details"><summary>{label === "優先度" ? "選ばれた理由・回答を見る" : "この傾向の理由・回答を見る"}</summary>
        <p className="diagnosis-result-reason"><strong>{label === "優先度" ? "練習候補に選ばれた理由" : "この傾向が出た理由"}</strong></p>
        <p>次の回答が、この項目の診断点に加算されています。</p>
        {evidence.length ? <dl className="diagnosis-answer-evidence">{evidence.map((item) => <div key={item.id}><dt>{item.prompt}</dt><dd>回答：{item.answer}</dd></div>)}</dl> : <p>理由となる回答を確認できませんでした。</p>}
        <p className="diagnosis-score-note">回答に基づく診断点：{score}{tied ? "（同点の項目があります。表示順は優劣を示しません）" : ""}</p>
        </details>
      </li>;
    })}
  </ol>;
}
function DatabaseSaveNotice({ status, message, onRetry }: { status: DatabaseSaveStatus; message: string | null; onRetry: () => void }) {
  if (status === "idle") return <div className="data-notice" role="status"><p>アカウントへの保存は、まだ確認できていません。練習にはこのまま進めます。</p></div>;
  if (status === "saving") return <div className="data-notice" role="status"><p>診断結果をアカウントへ保存しています…</p></div>;
  if (status === "saved") return <div className="data-notice" role="status"><p>診断結果をアカウントへ保存しました。</p></div>;
  return <div className="data-notice" role="alert"><p>{message ?? "診断結果を保存できませんでした。"}</p><button className="button-secondary" type="button" onClick={onRetry}>保存を再試行</button></div>;
}
function RecommendationBlock({ loading, recommendations, message }: { loading: boolean; recommendations: Recommendation[]; message: string | null }) { return <div className="data-notice"><h3>キャラクター推薦</h3><div role="status" aria-label="キャラクター推薦" aria-live="polite" aria-atomic="true">{loading ? <p>確認済みのキャラクター特性から候補を探しています…</p> : null}{!loading && recommendations.length ? <ol>{recommendations.map((item) => <li key={item.characterId}><Link href={`/characters/${item.slug}`}><strong>{item.name}</strong></Link>：一致度 {item.matchPercent}% <span className="muted">（{item.mappedTraits}/{item.activeTraits}特性を比較）</span>{item.reasons.length ? <div className="muted">一致した特性：{item.reasons.map((reason) => reason.label).join(" / ")}</div> : null}</li>)}</ol> : null}{!loading && !recommendations.length ? <p>{message ?? "推薦に必要なキャラクター情報がまだ不足しています。"}</p> : null}</div></div>; }
function ResetButton({ onReset }: { onReset: () => void }) { return <button className="button-secondary" type="button" onClick={onReset}>最初からやり直す</button>; }

function HistoryStorageNotice({ failed, onRetry }: { failed: boolean; onRetry: () => void }) {
  if (!failed) return null;
  return <div className="data-notice" role="alert"><p>診断結果をこの端末の履歴に保存できませんでした。結果はこのまま見られます。認証または保存状態を確認して、再試行できます。</p><button className="button-secondary" type="button" onClick={onRetry}>履歴保存を再試行</button></div>;
}
