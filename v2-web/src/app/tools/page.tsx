import Link from "next/link";

export const metadata = {
  title: "マイ機能",
  description: "お気に入り、マイキャラ、キャラクター比較、ランク記録をまとめた個人向けツールです。",
};

const tools = [
  { href: "/favorites", title: "お気に入り", body: "よく見るキャラクターを端末内に保存してすぐ開けます。" },
  { href: "/my-characters", title: "マイキャラ", body: "メイン・サブ・練習中の使用状況を管理します。" },
  { href: "/compare", title: "キャラクター比較", body: "公開済み基本情報を2キャラ並べて比較します。" },
  { href: "/rank-tracker", title: "ランク記録", body: "キャラクター別にMR/LPとメモを記録します。" },
];

export default function ToolsPage() {
  return (
    <div className="site-shell page-stack">
      <section className="hero">
        <p className="eyebrow">MY TOOLS</p>
        <h1>マイ機能</h1>
        <p>旧版で使われていた個人管理機能をv2向けに再構築しました。保存内容はこのブラウザ内だけに保持されます。</p>
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
