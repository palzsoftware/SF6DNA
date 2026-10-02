"use client";
import { getJstDateKey } from "@/lib/daily-training";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MiniIllustration } from "@/components/mini-illustration";
import { VisualIcon } from "@/components/visual-icon";
import { readPractice, latestUnfinished, practiceHref, type PracticeSession } from "@/lib/daily-practice";
import styles from "./practice-history.module.css";
function usePracticeHistory() {
  const [state, setState] = useState<{ ready: boolean; sessions: PracticeSession[]; unavailable: boolean; invalid: boolean }>({ ready: false, sessions: [], unavailable: false, invalid: false });
  useEffect(() => {
    const refresh = () => setState({ ready: true, ...readPractice() });
    const timer = window.setTimeout(refresh, 0);
    window.addEventListener("storage", refresh); window.addEventListener("sf6dna-practice-change", refresh); window.addEventListener("pageshow", refresh);
    return () => { window.clearTimeout(timer); window.removeEventListener("storage", refresh); window.removeEventListener("sf6dna-practice-change", refresh); window.removeEventListener("pageshow", refresh); };
  }, []);
  return state;
}
export function PracticeContinue() {
  const { ready, sessions } = usePracticeHistory();
  const unfinished = latestUnfinished(sessions); const last = sessions[0];
  return <Link className="home-public-link" href={ready && unfinished ? practiceHref(unfinished.id) : ready && last ? "/me/training/history" : "/me/training"}>
    <strong><VisualIcon kind="training" />{ready && unfinished ? "15分練習の続き" : ready && last ? (last.plan.dateKey === getJstDateKey(new Date()) ? "今日の練習完了" : "前回の練習") : "今日の15分練習"}</strong>
    <span>{ready && unfinished ? `${unfinished.completedIds.length} / 3 完了・残り ${15 - unfinished.completedIds.length * 5}分` : ready && last ? "15分完了・履歴を見る" : "5分ずつ、3つの課題"}</span>
  </Link>;
}
export function PracticeHistory() {
  const { ready, sessions, unavailable, invalid } = usePracticeHistory(); const [visible, setVisible] = useState(10);
  return <div className="site-shell page-stack">
    <section className="hero compact-hero"><p className="eyebrow">PRACTICE HISTORY</p><h1>練習履歴</h1><p>取り組んだ課題と、次に続ける練習。</p>
      <p className="muted">このブラウザだけの履歴です。アカウントとは同期しません。ブラウザのデータ削除で消えます。</p>
      <div className="diagnosis-actions"><Link className="button-primary" href="/me/training">15分練習へ</Link><Link className="button-secondary" href="/diagnosis/history">診断履歴を見る</Link></div>
    </section>
    {!ready ? <p role="status">練習履歴を読み込んでいます。</p> : unavailable ? <section className="info-panel" role="status"><h2>保存した練習を読み込めませんでした</h2><p>ブラウザの保存設定を確認してください。ログインなしでも練習は始められます。</p></section> : <>
      {invalid ? <p role="status">読み込めない保存内容がありました。利用できる履歴だけを表示しています。</p> : null}
      {!sessions.length ? <section className="info-panel"><MiniIllustration kind="history" /><h2>最初の15分を始めませんか？</h2><p>始めた練習が、ここに残ります。</p><Link className="button-primary" href="/me/training">今日の15分練習へ</Link></section> : <ol className={styles.timeline} aria-label="練習セッション">{sessions.slice(0, visible).map(s => <li key={s.id} className={styles.session}>
        <div className={styles.heading}><time dateTime={s.startedAt}>{new Date(s.startedAt).toLocaleString("ja-JP")}</time><strong>{s.completedAt ? "✓ 15分完了" : `${s.completedIds.length} / 3 完了`}</strong></div>
        <h2>{s.plan.theme}</h2>{s.characterSlug ? <Link className="tag" href={`/characters/${s.characterSlug}`}>{s.characterSlug}</Link> : null}
        <ul className={styles.items}>{s.plan.items.map(i => <li key={i.id}><span aria-label={s.completedIds.includes(i.id) ? "完了" : "未完了"}>{s.completedIds.includes(i.id) ? "✓" : "○"}</span><span>5分 · {i.title}</span></li>)}</ul>
        {s.completedAt ? <p className="muted">完了：<time dateTime={s.completedAt}>{new Date(s.completedAt).toLocaleString("ja-JP")}</time></p> : null}
        {s.diagnosisId ? <p className="muted">このブラウザの診断から選んだメニューです。</p> : null}
        <div className="diagnosis-actions"><Link className="button-secondary" href={practiceHref(s.id)}>{s.completedAt ? "練習内容を見る" : "続きから"}</Link>{s.completedAt ? <Link className="button-secondary" href={`${practiceHref(s.id)}&new=1`}>もう一度練習する</Link> : null}</div>
      </li>)}</ol>}
      {sessions.length > visible ? <button type="button" className="button-secondary" onClick={() => setVisible(n => n + 10)}>次の10件を見る</button> : null}
    </>}
    <Link href="/">Homeへ戻る</Link>
  </div>;
}
