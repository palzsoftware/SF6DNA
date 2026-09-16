"use client";

export default function DailyTrainingError({ reset }: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <div className="site-shell page-stack">
    <section className="hero compact-hero"><h1>今日の15分練習</h1></section>
    <section className="info-panel">
      <h2>練習メニューを表示できませんでした。</h2>
      <p>通信状態を確認して、もう一度お試しください。</p>
      <button className="button-secondary" type="button" onClick={reset}>もう一度試す</button>
    </section>
  </div>;
}
