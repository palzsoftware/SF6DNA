export const metadata = { title: "更新履歴" };

const entries = [
  { date: "2026-08-28", title: "Pre-Phase20 Legacy Parity", body: "お気に入り、マイキャラ使用状況、キャラクター比較、ランク記録、診断履歴、About/FAQ/Sources等の旧版独自機能をv2向けに再構築。" },
  { date: "2026-08-28", title: "Phase19", body: "DB整合性、Patch lifecycle、Public Gate Matrix、Source/Evidence、CI、Securityを横断監査し、内部Hardeningを完了。" },
  { date: "2026-08-28", title: "Phase18", body: "全31キャラのCurrent Patch品質監査、公開候補分類、Move/Strategy Public Gateを強化。" },
  { date: "2026-08-28", title: "Phase16-17", body: "SEO、metadata、robots、sitemap、Release Candidate、内部Acceptanceを整備。" },
  { date: "2026-08-27", title: "Phase13-14", body: "31キャラ共通データモデルを構築し、Public UI・Search・Recommendation・AI Coach Retrievalへ接続。" },
];

export default function ChangelogPage() {
  return (
    <div className="site-shell page-stack">
      <section className="hero"><p className="eyebrow">CHANGELOG</p><h1>更新履歴</h1><p>v2の主要な機能追加・品質改善をまとめています。</p></section>
      <section className="guide-stack">
        {entries.map((entry) => <article className="info-panel" key={`${entry.date}-${entry.title}`}><p className="eyebrow">{entry.date}</p><h2>{entry.title}</h2><p>{entry.body}</p></article>)}
      </section>
    </div>
  );
}
