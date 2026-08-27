import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="site-shell page-stack">
      <section className="empty-state">
        <p className="eyebrow">404</p>
        <h1>ページが見つかりません</h1>
        <p>URLが変更されたか、公開対象ではないデータの可能性があります。</p>
        <Link className="button-secondary inline-button" href="/">トップへ戻る</Link>
      </section>
    </div>
  );
}
