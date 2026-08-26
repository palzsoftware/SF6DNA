import Link from "next/link";
import { listCharacters } from "@/lib/characters";

const pillars = [
  {
    title: "診断",
    description: "短時間でプレイ傾向・課題・相性の良いキャラクター候補を確認する。",
    href: "/diagnosis",
  },
  {
    title: "キャラクター情報",
    description: "技・フレーム・コンボ・セットプレイ・立ち回り・対策を横断して調べる。",
    href: "/characters",
  },
  {
    title: "プレイヤー情報",
    description: "プロ・強豪・キャラ職人・配信者から、参考になるプレイヤーを探す。",
    href: "/players",
  },
  {
    title: "AIコーチ",
    description: "SF6DNAの構造化データを根拠に、課題と次の練習を整理する。",
    href: "/coach",
  },
];

export default async function HomePage() {
  const characters = await listCharacters();

  return (
    <div className="site-shell page-stack">
      <section className="hero">
        <p className="eyebrow">SF6 TOTAL PLATFORM</p>
        <h1>SF6で困ったらSF6DNA</h1>
        <p>
          自分を知る、キャラクターを知る、相手を知る。初心者から上級者まで使える
          Street Fighter 6総合プラットフォームです。
        </p>
      </section>

      <section aria-label="SF6DNA横断検索">
        <form className="search-form" action="/search">
          <input name="q" placeholder="キャラ・技・別名・コンボ・対策を検索" aria-label="SF6DNAを検索" />
          <button type="submit">検索</button>
        </form>
      </section>

      <section aria-labelledby="main-content-title">
        <div className="section-heading">
          <h2 id="main-content-title">4大メインコンテンツ</h2>
          <p>
            {characters.length
              ? `現在はプレイアブル${characters.length}キャラクターの基本エンティティを登録済みです。攻略データは検証済みのものから公開します。`
              : "攻略データは出典とパッチを確認したものから順次公開します。"}
          </p>
        </div>
        <div className="card-grid">
          {pillars.map((pillar) => (
            <Link className="feature-card" href={pillar.href} key={pillar.title}>
              <div><h3>{pillar.title}</h3><p>{pillar.description}</p></div>
              <span>開く →</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="section-heading"><h2>攻略・練習データ</h2><p>キャラクター辞典からも同じデータへ接続します。</p></div>
        <div className="card-grid">
          <Link className="feature-card" href="/combos"><h3>コンボ</h3><span>見る →</span></Link>
          <Link className="feature-card" href="/counters"><h3>対策</h3><span>見る →</span></Link>
          <Link className="feature-card" href="/setups"><h3>セットプレイ</h3><span>見る →</span></Link>
          <Link className="feature-card" href="/training"><h3>トレーニング</h3><span>見る →</span></Link>
        </div>
      </section>
    </div>
  );
}
