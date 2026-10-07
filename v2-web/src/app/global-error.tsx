"use client";

// This boundary replaces the root layout, so it must work without its CSS or providers.
export default function GlobalError({ retry }: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="ja">
      <head>
        <title>画面を表示できませんでした | SF6DNA</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
      </head>
      <body style={{ margin: 0, background: "#101820", color: "#ffffff", fontFamily: "sans-serif" }}>
        <main style={{ maxWidth: 640, margin: "64px auto", padding: 24 }}>
          <section role="alert">
            <h1>画面を表示できませんでした</h1>
            <p>一時的な読み込みエラーの可能性があります。もう一度お試しください。</p>
            <button type="button" onClick={retry} style={{ minHeight: 44, padding: "8px 20px", font: "inherit" }}>再試行</button>
            {/* A full navigation recovers even when the root layout/router is broken. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <p><a href="/" style={{ color: "#9be9ff", display: "inline-block", padding: "12px 0" }}>トップページへ戻る</a></p>
          </section>
        </main>
      </body>
    </html>
  );
}
