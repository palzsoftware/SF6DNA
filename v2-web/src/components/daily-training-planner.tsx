"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getDiagnosisHistory } from "@/lib/local-user-tools";
import { buildDailyTrainingPlan, getLatestLocalDiagnosisFocus, resolveDailyTrainingSelection, type DailyTrainingItem, type DailyTrainingRequest, type ImprovementFocus } from "@/lib/daily-training";
import type { DailyTrainingContext } from "@/lib/daily-training-data";
import styles from "./daily-training-planner.module.css";

const detailSections = [
  ["setup", "トレモ／リプレイの準備"], ["minute01", "0〜1分"], ["minute13", "1〜3分"], ["minute35", "3〜5分"],
  ["successCondition", "クリア条件"], ["commonFailure", "よくあるつまずき"], ["adjustment", "難しいときの調整"], ["matchFocus", "対戦で意識すること"],
] as const;

function TrainingCard({ item, index, expanded, complete, onToggle, onComplete }: { item: DailyTrainingItem; index: number; expanded: boolean; complete: boolean; onToggle: () => void; onComplete: () => void }) {
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
      <button className={complete ? styles.undoButton : styles.completeButton} type="button" onClick={onComplete}>{complete ? "完了を取り消す" : "このトレーニングを完了にする"}</button>
    </div> : null}
  </article>;
}

export function DailyTrainingPlanner({ dateKey, request, context }: { dateKey: string; request: DailyTrainingRequest | null; context: DailyTrainingContext }) {
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
  const plan = buildDailyTrainingPlan({ dateKey, selection });
  const [expandedId, setExpandedId] = useState<string | null>(plan.items[0]?.id ?? null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => new Set());
  const activeExpandedId = plan.items.some((item) => item.id === expandedId) ? expandedId : plan.items[0]?.id ?? null;
  const activeCompletedIds = new Set(plan.items.filter((item) => completedIds.has(item.id)).map((item) => item.id));
  const completeMinutes = activeCompletedIds.size * 5;
  const completed = completeMinutes === plan.totalMinutes;
  const checkingHistory = !request && !local.ready;
  const completionFocus = plan.items.find((item) => activeCompletedIds.has(item.id))?.detail.matchFocus[0] ?? plan.items[0]?.detail.matchFocus[0];

  return <div className="site-shell page-stack">
    <section className={`hero compact-hero ${styles.hero}`}>
      <div><p className="eyebrow">DAILY TRAINING</p><h1>今日の15分練習</h1><p>{plan.dateKey.replaceAll("-", "/")}（日本時間）・5分 × 3課題</p></div>
      <div className={styles.progressCard} aria-live="polite"><span>今日の進捗</span><strong>{completeMinutes} / {plan.totalMinutes}分</strong>
        <div className={styles.progressTrack} role="progressbar" aria-label="今日の練習進捗" aria-valuemin={0} aria-valuemax={15} aria-valuenow={completeMinutes}><span style={{ width: `${completeMinutes / plan.totalMinutes * 100}%` }} /></div>
      </div>
    </section>
    <section className={styles.reason} aria-live="polite"><p className={styles.sectionLabel}>この3課題を選んだ理由</p><h2>{plan.theme}</h2>
      <p>{checkingHistory ? "診断履歴を読み込んでいます。その間は基礎または対戦向けのメニューを表示します。" : plan.reason}</p>
      {!checkingHistory && plan.source === "default" && (context.state === "unavailable" || local.unavailable) ? <p>診断履歴を読み込めなかったため、基本メニューを表示しています。</p> : null}
    </section>
    <section className={styles.cards} aria-label="今日の練習項目">{plan.items.map((item, index) => <TrainingCard key={item.id} item={item} index={index} expanded={activeExpandedId === item.id} complete={activeCompletedIds.has(item.id)}
      onToggle={() => setExpandedId(activeExpandedId === item.id ? null : item.id)} onComplete={() => setCompletedIds((current) => { const next = new Set(current); if (next.has(item.id)) next.delete(item.id); else next.add(item.id); return next; })} />)}</section>
    {completed ? <section className={styles.completion} aria-live="polite"><p className={styles.sectionLabel}>15 / 15分</p><h2>今日のメニュー完了</h2><p>おつかれさまでした。次の対戦では、まず1つだけ試してみましょう。</p>{completionFocus ? <p><strong>実戦テーマ：</strong>{completionFocus}</p> : null}</section> : null}
    <section className="info-panel"><p>メニューは日本時間の日付と課題に合わせて選びます。日付が変わった場合や新しく診断した場合は、ページを開き直してください。</p>
      <p className="muted">練習の完了状態は保存されず、ページを開き直すと消えます。未確認の技・コンボ情報は練習メニューに含めません。</p>
      <div className="diagnosis-actions"><Link className="button-primary" href="/diagnosis/improvement-check">上達課題を診断する</Link><Link className="button-secondary" href="/diagnosis/history">診断履歴を見る</Link></div>
    </section>
  </div>;
}
