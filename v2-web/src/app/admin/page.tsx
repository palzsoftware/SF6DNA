export const metadata = { title: "管理 | SF6DNA" };

export default function AdminPage() {
  return (
    <div className="site-shell page-stack">
      <section className="hero">
        <p className="eyebrow">ADMIN</p>
        <h1>管理機能</h1>
        <p>管理画面の書き込み機能は、Supabase AuthとRLSを実DBで確認してから有効化します。</p>
      </section>
      <section className="data-notice">
        <h2>現在はロック中</h2>
        <p>認証なしの管理APIやDB書き込み画面は安全上実装しません。Phase10の権限設計は docs/V2_PHASE10_ADMIN_SECURITY.md を正とします。</p>
      </section>
    </div>
  );
}
