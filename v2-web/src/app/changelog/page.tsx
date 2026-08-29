export const metadata = { title: "更新履歴" };

const entries = [
  { date: "2026-08-29", title: "リリース前UI調整", body: "ホーム、キャラクター、診断などの画面デザインと案内文を見直し、公開前の最終調整を進めています。" },
  { date: "2026-08-29", title: "上達支援ツールを追加", body: "対戦後30秒ログ、直近10戦の振り返り、弱点整理、リプレイ復習、対面ナレッジカードを追加しました。" },
  { date: "2026-08-29", title: "Modern操作データを監査", body: "公式情報で安全に確認できるModern操作を整理し、確認できないコマンドは推測で補わない方針を維持しました。" },
  { date: "2026-08-28", title: "キャラクターデータ品質を強化", body: "現行パッチの技・フレーム・出典を横断確認し、公開条件を満たした情報だけを表示する仕組みを強化しました。" },
  { date: "2026-08-28", title: "マイ機能を拡充", body: "お気に入り、マイキャラ、キャラクター比較、ランク記録、診断履歴、情報源ページなどを追加しました。" },
];

export default function ChangelogPage() {
  return (
    <div className="site-shell page-stack">
      <section className="hero"><p className="eyebrow">CHANGELOG</p><h1>更新履歴</h1><p>SF6DNAの主要な機能追加・品質改善をまとめています。</p></section>
      <section className="guide-stack">
        {entries.map((entry) => <article className="info-panel" key={`${entry.date}-${entry.title}`}><p className="eyebrow">{entry.date}</p><h2>{entry.title}</h2><p>{entry.body}</p></article>)}
      </section>
    </div>
  );
}
