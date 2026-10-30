"use client";

import { MiniIllustration } from "@/components/mini-illustration";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { readDailyDiagnosisInput, type DailyDiagnosisRecord } from "@/lib/daily-diagnosis-input";
import { getCharacterStatuses, type PersonalOwner } from "@/lib/personalization-storage";
import { usePersonalizationOwner } from "@/lib/use-personalization-owner";
import { readOwnedPractice } from "@/lib/daily-practice-owner";
import { savePracticeWithOwnerLock, type PracticeWrite } from "@/lib/daily-practice-owner-lock";
import { buildDailyTrainingPlan, getLatestLocalDiagnosisFocus, isImprovementFocus, resolveDailyTrainingSelection, type DailyTrainingRequest, type ImprovementFocus } from "@/lib/daily-training";
import { createPractice, togglePracticeItem, planIdentity, latestUnfinished, practiceHref, type PracticeSession } from "@/lib/daily-practice";
import type { DailyTrainingContext } from "@/lib/daily-training-data";
import styles from "./daily-training-planner.module.css";
import { DailyTrainingQualityCard as TrainingCard } from "./daily-training-quality-card";

type PlannerProps = { dateKey: string; request: DailyTrainingRequest | null; context: DailyTrainingContext; sessionId?: string | null; fresh?: boolean };
export function DailyTrainingPlanner(props: PlannerProps) {
  const { state, isCurrent } = usePersonalizationOwner();
  const router = useRouter();
  const refreshed = useRef<string | null>(null);
  const requestType = props.request?.diagnosisType ?? null;
  const requestFocus = props.request?.focus ?? null;
  const request = useMemo(() => requestType ? { diagnosisType: requestType, focus: requestFocus } : null, [requestType, requestFocus]);
  const explicitFocus = isImprovementFocus(request?.focus);
  const contextMatches = state.status === "ready" && props.context.owner === state.owner && isCurrent();
  const waitingForContext = state.status === "ready" && !explicitFocus && !contextMatches;
  const ownerGeneration = state.status === "ready" ? `${state.owner}:${state.version}` : null;
  useEffect(() => {
    if (!waitingForContext || !ownerGeneration || !isCurrent() || refreshed.current === ownerGeneration) return;
    // Refresh at most once per confirmed auth generation. Never show or use the
    // stale server primaryIssue while waiting for a matching server response.
    refreshed.current = ownerGeneration;
    router.refresh();
  }, [waitingForContext, ownerGeneration, isCurrent, router]);
  if (state.status !== "ready") return <section role="status" className="info-panel">{state.status === "error" ? "認証状態を確認できません。再読み込みしてお試しください。" : "利用者を確認しています。"}</section>;
  if (waitingForContext) return <section role="status" className="info-panel">利用者の練習情報を再確認しています。完了しない場合はページを再読み込みしてください。</section>;
  return <DailyTrainingPlannerOwned key={JSON.stringify([state.owner, state.version, props.dateKey, requestType, requestFocus, props.sessionId ?? null, !!props.fresh])} {...props} request={request} owner={state.owner} isCurrent={isCurrent} />;
}
function DailyTrainingPlannerOwned({ dateKey, request, context, sessionId = null, fresh = false, owner, isCurrent }: PlannerProps & { owner: PersonalOwner; isCurrent: () => boolean }) {
  const [local, setLocal] = useState<{ records: DailyDiagnosisRecord[]; focus: ImprovementFocus | null; ready: boolean; unavailable: boolean; practice?: ReturnType<typeof readOwnedPractice> }>({ records: [], focus: null, ready: !!request, unavailable: false });
  useEffect(() => {
    if (request) return;
    let active = true;
    const current = () => active && isCurrent();
    if (!current()) return () => { active = false; };
    if (sessionId || !fresh) {
      const practice = readOwnedPractice(owner);
      const saved = sessionId ? practice.sessions.find(s => s.id === sessionId) : latestUnfinished(practice.sessions);
      if (saved) {
        const timer = window.setTimeout(() => {
          if (current()) setLocal({ records: [], focus: null, ready: true, unavailable: false, practice });
        }, 0);
        return () => { active = false; window.clearTimeout(timer); };
      }
    }
    void readDailyDiagnosisInput(owner, current).then(input => {
      if (!current() || input.state === "stale") return;
      const records = input.state === "ready" ? input.records : [];
      setLocal({ records, focus: getLatestLocalDiagnosisFocus(records, new Date()), ready: true, unavailable: input.state !== "ready" });
    });
    return () => { active = false; };
  }, [request, owner, isCurrent, sessionId, fresh]);

  const selection = resolveDailyTrainingSelection({ request, localFocus: local.focus, primaryIssue: context.primaryIssue });
  const generatedPlan = buildDailyTrainingPlan({ dateKey, selection });
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [repeatSource, setRepeatSource] = useState<PracticeSession | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const busy = useRef(false);
  const pending = useRef<PracticeWrite | null>(null);
  const active = useRef(true);
  useEffect(() => {
    active.current = true;
    return () => { active.current = false; };
  }, []);
  useEffect(() => {
    if (!request && !local.ready) return;
    const timer = window.setTimeout(() => {
      if (!isCurrent()) return;
      const stored = local.practice ?? readOwnedPractice(owner);
      let focus: ImprovementFocus | null = null;
      try { focus = request ? null : getLatestLocalDiagnosisFocus(local.records, new Date()); } catch { /* legacy local history may be malformed */ }
      const candidate = buildDailyTrainingPlan({ dateKey, selection: resolveDailyTrainingSelection({ request, localFocus: focus, primaryIssue: context.primaryIssue }) });
      const found = fresh ? null : sessionId ? stored.sessions.find(s => s.id === sessionId) : !request ? latestUnfinished(stored.sessions) ?? stored.sessions.find(s => s.planId === planIdentity(candidate)) : stored.sessions.find(s => s.planId === planIdentity(candidate));
      const repeatSource = fresh && sessionId ? stored.sessions.find(s => s.id === sessionId) ?? null : null;
      setSession(found ?? null);
      setRepeatSource(repeatSource);
      if (stored.unavailable) setNotice("このブラウザでは練習を保存できません。画面を閉じると進捗が消える場合があります。");
      else if (stored.invalid) setNotice("読み込めない保存内容がありました。利用できる履歴だけを表示しています。");
      else if (sessionId && !found && !repeatSource) setNotice("保存した練習が見つかりません。新しいメニューから始められます。");
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [dateKey, request, context.primaryIssue, sessionId, fresh, owner, local.ready, local.records, local.practice, isCurrent]);
  const plan = session?.plan ?? repeatSource?.plan ?? generatedPlan;
  const [expandedId, setExpandedId] = useState<string | null>(plan.items[0]?.id ?? null);
  const activeExpandedId = expandedId === null || plan.items.some((item) => item.id === expandedId) ? expandedId : plan.items[0]?.id ?? null;
  const activeCompletedIds = new Set(plan.items.filter((item) => session?.completedIds.includes(item.id)).map((item) => item.id));
  const completeMinutes = activeCompletedIds.size * 5;
  const completed = completeMinutes === plan.totalMinutes;
  const checkingHistory = !request && !local.ready;
  const completionFocus = plan.items.find((item) => activeCompletedIds.has(item.id))?.detail.matchFocus[0] ?? plan.items[0]?.detail.matchFocus[0];

  async function persist(write: PracticeWrite, preview: PracticeSession) {
    const current = () => active.current && isCurrent();
    if (!current() || busy.current) return;
    busy.current = true;
    setSaving(true);
    const result = await savePracticeWithOwnerLock({ owner, isCurrent: current, write });
    busy.current = false;
    if (!current()) return;
    setSaving(false);
    if (result.reason === "STALE_OWNER" || result.reason === "NOT_READY") return;
    pending.current = result.ok ? null : write;
    const next = result.session ?? preview;
    setSession(next);
    setNotice(result.ok ? "このブラウザに保存しました。" : "保存できませんでした。進捗はこの画面に残っています。ブラウザの保存設定や空き容量を確認し、再度保存してください。" + (result.reason === "LOCK_UNAVAILABLE" ? " この環境ではタブ間の保存を調整できないため、保存を停止しています。" : ""));
    if (result.ok) {
      try { window.history.replaceState(window.history.state, "", practiceHref(next.id)); }
      catch { setNotice("このブラウザに保存しました。練習URLを更新できませんでした。練習履歴から保存した練習を開けます。"); }
    }
  }
  function newSession() {
    let mains: Array<[string, unknown]> = [];
    let diagnosisId: string | null = repeatSource?.diagnosisId ?? null;
    try { mains = Object.entries(getCharacterStatuses(owner)).filter(([slug, status]) => status === "main" && /^[a-z0-9-]+$/.test(slug));
      if (!repeatSource) {
        const diagnosis = plan.source === "local_diagnosis" ? local.records.find(r => getLatestLocalDiagnosisFocus([r], new Date()) === local.focus) : null;
        diagnosisId = diagnosis?.id ?? null;
      }
    } catch { /* optional local metadata must not block practice */ }
    return createPractice(plan, window.crypto.randomUUID(), new Date().toISOString(), mains.length === 1 ? mains[0][0] : null, diagnosisId);
  }
  function prepareNewSession() {
    try { return newSession(); }
    catch {
      setNotice("練習の保存準備ができませんでした。進捗は変更していません。ページを再読み込みしてお試しください。");
      return null;
    }
  }
  function start() {
    if (!loaded || !isCurrent() || busy.current) return;
    const seed = prepareNewSession();
    if (!seed) return;
    void persist({ seed, toggles: [] }, seed);
  }
  function completeItem(id: string) {
    if (!loaded || !isCurrent() || busy.current) return;
    const seed = session ?? prepareNewSession();
    if (!seed) return;
    const previous = pending.current ?? { seed, toggles: [] };
    const at = new Date().toISOString();
    void persist({ seed: previous.seed, toggles: [...previous.toggles, { id, at }] }, togglePracticeItem(seed, id, at));
  }
  return <div className="site-shell page-stack">
    <section className={`hero compact-hero ${styles.hero}`}>
      <div className="illustration-heading"><MiniIllustration kind="training" /><div><p className="eyebrow">DAILY TRAINING</p><h1>今日の15分練習</h1><p>{plan.dateKey.replaceAll("-", "/")}（日本時間）・5分 × 3課題</p></div></div>
    </section>
    <div className={styles.workspace}>
    <div className={styles.mainColumn}>
    <section className={styles.reason} aria-live="polite"><p className={styles.sectionLabel}>この3課題を選んだ理由</p><h2>{plan.theme}</h2>
      <p>{checkingHistory ? "診断履歴を読み込んでいます。その間は基礎または対戦向けのメニューを表示します。" : plan.reason}</p>
      <div className="diagnosis-actions">
        {!session ? <button className="button-primary" type="button" disabled={!loaded || checkingHistory || saving || !isCurrent()} onClick={start}>このメニューで練習を始める</button> : <span>{completed ? "15分完了" : `${activeCompletedIds.size} / 3 完了・残り ${15 - completeMinutes}分`}</span>}
        <Link className="button-secondary" href="/me/training/history">練習履歴を見る</Link>
      </div>
      <p className="muted" role="status">{!loaded ? "保存した練習を読み込んでいます。" : saving ? "練習を保存しています。" : notice || (session ? "保存した練習の続きです。" : "このブラウザの利用者別領域へ保存します。別端末とは同期しません。")}</p>
      {session && notice.includes("保存できませんでした") ? <button className="button-secondary" type="button" disabled={saving || !isCurrent()} onClick={() => { if (pending.current) void persist(pending.current, session); }}>再度保存する</button> : null}
      {!checkingHistory && plan.source === "default" && (context.state === "unavailable" || local.unavailable) ? <p>{context.state === "unavailable" ? (local.unavailable ? "診断履歴と対戦の課題を読み込めなかったため、基本メニューを表示しています。" : "対戦の課題を読み込めなかったため、基本メニューを表示しています。") : "診断履歴を読み込めなかったため、基本メニューを表示しています。"}</p> : null}
    </section>
    <section className={styles.cards} aria-label="今日の練習項目">{plan.items.map((item, index) => <TrainingCard key={`${session?.id ?? "draft"}:${item.id}`} item={item} index={index} expanded={activeExpandedId === item.id} complete={activeCompletedIds.has(item.id)} enabled={loaded && !checkingHistory && !saving && isCurrent()}
      onToggle={() => setExpandedId(activeExpandedId === item.id ? null : item.id)} onComplete={() => completeItem(item.id)} />)}</section>
    {completed ? <section className={styles.completion} aria-live="polite"><p className={styles.sectionLabel}>15 / 15分</p><h2>15分メニュー完了</h2><p>おつかれさまでした。次の対戦では、まず1つだけ試してみましょう。</p>{completionFocus ? <p><strong>実戦テーマ：</strong>{completionFocus}</p> : null}<div className="diagnosis-actions"><Link className="button-primary" href="/me/training/history">練習履歴を見る</Link><Link className="button-secondary" href={session ? `${practiceHref(session.id)}&new=1` : "/me/training?new=1"}>もう一度練習する</Link><Link className="button-secondary" href="/">Homeへ戻る</Link></div></section> : null}
    </div>
    <aside className={styles.progressSidebar} aria-labelledby="daily15-progress-title">
      <div className={styles.progressCard}>
        <p className={styles.sectionLabel}>TODAY’S PROGRESS</p><h2 id="daily15-progress-title">今日の練習の進捗</h2>
        <div aria-live="polite"><strong>{activeCompletedIds.size} / 3 完了</strong><span>{completeMinutes} / {plan.totalMinutes}分のメニュー</span></div>
        <div className={styles.progressTrack} role="progressbar" aria-label="この練習の進捗" aria-valuemin={0} aria-valuemax={15} aria-valuenow={completeMinutes}><span style={{ width: `${completeMinutes / plan.totalMinutes * 100}%` }} /></div>
        <p className={styles.progressNote}>完了にした項目の目安です。タイマーで計測した時間とは別です。</p>
        <ol className={styles.progressItems}>{plan.items.map((item, index) => <li key={item.id}><button type="button" aria-current={activeExpandedId === item.id ? "step" : undefined} onClick={() => setExpandedId(item.id)}><span>{activeCompletedIds.has(item.id) ? "✓" : String(index + 1).padStart(2, "0")}</span><span>{item.title}<small>{activeCompletedIds.has(item.id) ? "完了" : "5分メニュー"}</small></span></button></li>)}</ol>
        <p className={styles.progressNote}>すべて終わらなくても、次の対戦で試すことを一つ持ち帰りましょう。</p>
        <Link className={styles.progressLink} href="/me/training/history">練習履歴を見る →</Link>
      </div>
    </aside>
    </div>
    <section className="info-panel"><p>メニューは日本時間の日付と課題に合わせて選びます。保存した練習は日付が変わっても続けられます。別のメニューを始めるときは、新しい練習を選んでください。</p>
      <p className="muted">練習内容と完了状態はこのブラウザ内で利用者ごとに保存されます。他の端末とは同期しません。ブラウザのデータ削除で履歴も消えます。未確認の技・コンボ情報は練習メニューに含めません。</p>
      <div className="diagnosis-actions"><Link className="button-primary" href="/diagnosis/improvement-check">上達課題を診断する</Link><Link className="button-secondary" href="/diagnosis/history">診断履歴を見る</Link><Link className="button-secondary" href="/me/training?new=1">新しい練習を選ぶ</Link></div>
    </section>
  </div>;
}
