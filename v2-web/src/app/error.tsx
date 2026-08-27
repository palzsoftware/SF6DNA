"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="site-shell page-stack">
      <section className="empty-state" role="alert">
        <p className="eyebrow">ERROR</p>
        <h1>画面を表示できませんでした</h1>
        <p>一時的な読み込みエラーの可能性があります。もう一度お試しください。</p>
        <button className="button-primary inline-button" type="button" onClick={reset}>再試行</button>
      </section>
    </div>
  );
}
