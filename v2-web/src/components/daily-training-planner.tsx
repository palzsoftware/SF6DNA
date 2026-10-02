"use client";

import { MiniIllustration } from "@/components/mini-illustration";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getDiagnosisHistory, getCharacterStatuses } from "@/lib/local-user-tools";
import { buildDailyTrainingPlan, getLatestLocalDiagnosisFocus, resolveDailyTrainingSelection, type DailyTrainingPlan, type DailyTrainingItem, type DailyTrainingRequest, type ImprovementFocus } from "@/lib/daily-training";
import { createPractice, readPractice, savePractice, togglePracticeItem, planIdentity, latestUnfinished, practiceHref, type PracticeSession } from "@/lib/daily-practice";
import type { DailyTrainingContext } from "@/lib/daily-training-data";
import styles from "./daily-training-planner.module.css";

const detailSections = [
  ["setup", "トレモ／リプレイの準備"], ["minute01", "0〜1分"], ["minute13", "1〜3分"], ["minute35", "3〜5分"],
  ["successCondition", "クリア条件"], ["commonFailure", "よくあるつまずき"], ["adjustment", "難しいときの調整"], ["matchFocus", "対戦で意識すること"],
] as const;

function TrainingCard({ item, index, expanded, complete, onToggle, onComplete, enabled }: { enabled: boolean; item: DailyTrainingItem; index: number; expanded: boolean; complete: boolean; onToggle: () => void; onComplete: () => void }) {
  const panelId = `training-detail-${index}`;
  return <article className={`${styles.card} ${styles[item.detail.category]} ${complete ? styles.complete : ""}`}>
    <button className={styles.cardHeader} type="button" aria-expanded={expanded} aria-controls={panelId} onClick={onToggle}>
      <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
      <span className={styles.cardTitle}>
        <span className={styles.meta}>{complete ? "✓ 完了" : expanded ? "練習中" : "未開始"} ・ 5分</span>
        <strong>{item.title}</strong><span>{item.goal}</span>
      </span>
      <span className={styles.toggle}>{expanded ? "閉じる −" : "練習内容を見る ＋"}</span>
    </button>
    {expanded ? <div className={styles.cardBody} id={panelId}>
      <section className={styles.purpose}><h3>目的</h3><p>{item.detail.why}</p></section>
      <div className={styles.detailGrid}>{detailSections.map(([key, label]) => <section className={styles.detailSection} key={key}>
        <h3>{label}</h3><ul>{item.detail[key].map((line) => <li key={line}>{line}</li>)}</ul>
      </section>)}</div>
      <button className={complete ? styles.undoButton : styles.completeButton} type="button" disabled={!enabled} onClick={onComplete}>{complete ? "完了を取り消す" : "この練習を完了にする"}</button>
    </div> : null}
  </article>;
}

export function DailyTrainingPlanner({ dateKey, request, context, sessionId = null, fresh = false }: { dateKey: string; request: DailyTrainingRequest | null; context: DailyTrainingContext; sessionId?: string | null; fresh?: boolean }) {
  const [local, setLocal] = useState<{ focus: ImprovementFocus | null; ready: boolean; unavailable: boolean }>({ focus: null, ready: false, unavailable: false });
  useEffect(() => {
    if (request) return;
    const timer = window.setTimeout(() => {
      try { setLocal({ focus: getLatestLocalDiagnosisFocus(getDiagnosisHistory(), new Date()), ready: true, unavailable: false }); }
      catch { setLocal({ focus: null, ready: true, unavailable: true }); }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [request]);

  const selection = resolveDailyTrainingSelection({ request, localFocus: local.focus, primaryIssue: context.primaryIssue });
  const generatedPlan = buildDailyTrainingPlan({ dateKey, selection });
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [repeatPlan, setRepeatPlan] = useState<DailyTrainingPlan | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = readPractice();
      let focus: ImprovementFocus | null = null;
      try { focus = request ? null : getLatestLocalDiagnosisFocus(getDiagnosisHistory(), new Date()); } catch { /* legacy local history may be malformed */ }
      const candidate = buildDailyTrainingPlan({ dateKey, selection: resolveDailyTrainingSelection({ request, localFocus: focus, primaryIssue: context.primaryIssue }) });
      const found = fresh ? null : sessionId ? stored.sessions.find(s => s.id === sessionId) : !request ? latestUnfinished(stored.sessions) ?? stored.sessions.find(s => s.planId === planIdentity(candidate)) : stored.sessions.find(s => s.planId === planIdentity(candidate));
      setSession(found ?? null);
      setRepeatPlan(fresh && sessionId ? stored.sessions.find(s => s.id === sessionId)?.plan ?? null : null);
      if (stored.unavailable) setNotice("このブラウザでは練習を保存できません。画面を閉じると進捗が消える場合があります。");
      else if (sessionId && !found) setNotice("保存した練習が見つかりません。新しいメニューから始められます。");
      else if (stored.invalid) setNotice("読み込めない保存内容がありました。利用できる履歴だけを表示しています。");
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [dateKey, request, context.primaryIssue, sessionId, fresh]);
  const plan = session?.plan ?? repeatPlan ?? generatedPlan;
  const [expandedId, setExpandedId] = useState<string | null>(plan.items[0]?.id ?? null);
  const activeExpandedId = expandedId === null || plan.items.some((item) => item.id === expandedId) ? expandedId : plan.items[0]?.id ?? null;
  const activeCompletedIds = new Set(plan.items.filter((item) => session?.completedIds.includes(item.id)).map((item) => item.id));
  const completeMinutes = activeCompletedIds.size * 5;
  const completed = completeMinutes === plan.totalMinutes;
  const checkingHistory = !request && !local.ready;
  const completionFocus = plan.items.find((item) => activeCompletedIds.has(item.id))?.detail.matchFocus[0] ?? plan.items[0]?.detail.matchFocus[0];

  function persist(next: PracticeSession) {
    setSession(next);
    const saved = savePractice(next);
    setNotice(saved ? "このブラウザに保存しました。" : "保存できませんでした。進捗はこの画面に残っています。ブラウザの保存設定や空き容量を確認し、再度保存してください。");
    if (saved) window.history.replaceState(window.history.state, "", practiceHref(next.id));
  }
  function newSession() {
    let mains: Array<[string, unknown]> = [];
    let diagnosisId: string | null = null;
    try { mains = Object.entries(getCharacterStatuses()).filter(([slug, status]) => status === "main" && /^[a-z0-9-]+$/.test(slug));
    const diagnosis = plan.source === "local_diagnosis" ? getDiagnosisHistory().find(r => getLatestLocalDiagnosisFocus([r], new Date()) === local.focus) : null;
      diagnosisId = diagnosis?.id ?? null;
    } catch { /* optional local metadata must not block practice */ }
    return createPractice(plan, window.crypto.randomUUID(), new Date().toISOString(), mains.length === 1 ? mains[0][0] : null, diagnosisId);
  }
  function start() { persist(newSession()); }
  function completeItem(id: string) {
    if (!loaded) return;
    if (!session) {
      const next = newSession();
      persist(togglePracticeItem(next, id, new Date().toISOString()));
    } else {
      const latest = readPractice().sessions.find(s => s.id === session.id);
      const base = notice.includes("保存できませんでした") ? session : latest ?? session;
      persist(togglePracticeItem(base, id, new Date().toISOString()));
    }
  }
  return <div className="site-shell page-stack">
    <section className={`hero compact-hero ${styles.hero}`}>
      <div className="illustration-heading"><MiniIllustration kind="training" /><div><p className="eyebrow">DAILY TRAINING</p><h1>今日の15分練習</h1><p>{plan.dateKey.replaceAll("-", "/")}（日本時間）・5分 × 3課題</p></div></div>
      <div className={styles.progressCard} aria-live="polite"><span>この練習の進捗</span><strong>{completeMinutes} / {plan.totalMinutes}分</strong>
        <div className={styles.progressTrack} role="progressbar" aria-label="この練習の進捗" aria-valuemin={0} aria-valuemax={15} aria-valuenow={completeMinutes}><span style={{ width: `${completeMinutes / plan.totalMinutes * 100}%` }} /></div>
      </div>
    </section>
    <section className={styles.reason} aria-live="polite"><p className={styles.sectionLabel}>この3課題を選んだ理由</p><h2>{plan.theme}</h2>
      <p>{checkingHistory ? "診断履歴を読み込んでいます。その間は基礎または対戦向けのメニューを表示します。" : plan.reason}</p>
      <div className="diagnosis-actions">
        {!session ? <button className="button-primary" type="button" disabled={!loaded || checkingHistory} onClick={start}>このメニューで練習を始める</button> : <span>{completed ? "15分完了" : `${activeCompletedIds.size} / 3 完了・残り ${15 - completeMinutes}分`}</span>}
        <Link className="button-secondary" href="/me/training/history">練習履歴を見る</Link>
      </div>
      <p className="muted" role="status">{!loaded ? "保存した練習を読み込んでいます。" : notice || (session ? "保存した練習の続きです。" : "ログインなしで、このブラウザに保存できます。")}</p>
      {session && notice.includes("保存できませんでした") ? <button className="button-secondary" type="button" onClick={() => persist(session)}>再度保存する</button> : null}
      {!checkingHistory && plan.source === "default" && (context.state === "unavailable" || local.unavailable) ? <p>診断履歴を読み込めなかったため、基本メニューを表示しています。</p> : null}
    </section>
    <section className={styles.cards} aria-label="今日の練習項目">{plan.items.map((item, index) => <TrainingCard key={item.id} item={item} index={index} expanded={activeExpandedId === item.id} complete={activeCompletedIds.has(item.id)} enabled={loaded && !checkingHistory}
      onToggle={() => setExpandedId(activeExpandedId === item.id ? null : item.id)} onComplete={() => completeItem(item.id)} />)}</section>
    {completed ? <section className={styles.completion} aria-live="polite"><p className={styles.sectionLabel}>15 / 15分</p><h2>15分メニュー完了</h2><p>おつかれさまでした。次の対戦では、まず1つだけ試してみましょう。</p>{completionFocus ? <p><strong>実戦テーマ：</strong>{completionFocus}</p> : null}<div className="diagnosis-actions"><Link className="button-primary" href="/me/training/history">練習履歴を見る</Link><Link className="button-secondary" href={session ? `${practiceHref(session.id)}&new=1` : "/me/training?new=1"}>もう一度練習する</Link><Link className="button-secondary" href="/">Homeへ戻る</Link></div></section> : null}
    <section className="info-panel"><p>メニューは日本時間の日付と課題に合わせて選びます。保存した練習は日付が変わっても続けられます。別のメニューを始めるときは、新しい練習を選んでください。</p>
      <p className="muted">練習内容と完了状態はこのブラウザに保存されます。他の端末やアカウントとは同期しません。ブラウザのデータ削除で履歴も消えます。未確認の技・コンボ情報は練習メニューに含めません。</p>
      <div className="diagnosis-actions"><Link className="button-primary" href="/diagnosis/improvement-check">上達課題を診断する</Link><Link className="button-secondary" href="/diagnosis/history">診断履歴を見る</Link><Link className="button-secondary" href="/me/training?new=1">新しい練習を選ぶ</Link></div>
    </section>
  </div>;
}
