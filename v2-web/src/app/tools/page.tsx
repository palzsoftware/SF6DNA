import Link from "next/link";

export const metadata = {
  title: "マイ機能",
  description: "お気に入り、マイキャラ、比較、ランク記録、対戦レビュー、対面カード、診断履歴をまとめた個人向けツールです。",
};

const tools = [
  { href: "/favorites", title: "お気に入り", body: "よく見るキャラクターを端末内に保存してすぐ開けます。" },
  { href: "/my-characters", title: "マイキャラ", body: "メイン・サブ・練習中の使用状況を管理します。" },
  { href: "/compare", title: "キャラクター比較", body: "公開済みの基本情報を2キャラクター並べて比較します。" },
  { href: "/rank-tracker", title: "ランク記録", body: "キャラクター別にMR/LPとメモを記録します。" },
  { href: "/improve", title: "上達ループ", body: "対戦後30秒ログ、直近10戦の振り返り、弱点整理、リプレイ復習をまとめて行います。" },
  { href: "/matchup-card", title: "対面ナレッジカード", body: "確認済みの技情報と、出典を確認できる対策だけを1画面で確認します。" },
  { href: "/diagnosis/history", title: "診断履歴", body: "完了した診断の上位傾向を最大50件まで確認できます。" },
];

export default function ToolsPage() {
  return (
    <div className="site-shell page-stack">
      <section className="hero">
        <p className="eyebrow">MY TOOLS</p>
        <h1>マイ機能</h1>
        <p>お気に入りや対戦記録など、個人向けの管理機能をまとめています。端末内保存を使う項目は、このブラウザ内だけに保持されます。</p>
      </section>
      <section className="tool-card-grid">
        {tools.map((tool) => (
          <Link className="info-panel tool-link-card" href={tool.href} key={tool.href}>
            <h2>{tool.title}</h2>
            <p>{tool.body}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
