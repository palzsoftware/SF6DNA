import Link from "next/link";
import { listCharacters } from "@/lib/characters";

const pillars = [
  {
    icon: "01",
    title: "診断",
    description: "短時間でプレイ傾向・課題・相性の良いキャラクター候補を確認する。",
    href: "/diagnosis",
  },
  {
    icon: "02",
    title: "キャラクター情報",
    description: "技・フレーム・コンボ・セットプレイ・立ち回り・対策を横断して調べる。",
    href: "/characters",
  },
  {
    icon: "03",
    title: "プレイヤー情報",
    description: "プロ・強豪・キャラ職人・配信者から、参考になるプレイヤーを探す。",
    href: "/players",
  },
  {
    icon: "04",
    title: "AIコーチ",
    description: "SF6DNAの構造化データを根拠に、課題と次の練習を整理する。",
    href: "/coach",
  },
];

const subTools = [
  ["CB", "コンボ", "/combos"],
  ["VS", "対策", "/counters"],
  ["OK", "セットプレイ", "/setups"],
  ["TR", "トレーニング", "/training"],
] as const;

export default async function HomePage() {
  const characters = await listCharacters();
  const heroCharacters = ["ryu", "jp", "mai"]
    .map((slug) => characters.find((character) => character.slug === slug))
    .filter((character): character is NonNullable<typeof character> => Boolean(character?.imageUrl));

  return (
    <div className="site-shell page-stack">
      <section className="home-hero">
        <div className="home-hero__copy">
          <p className="eyebrow">SF6 TOTAL PLATFORM</p>
          <h1>SF6で困ったら<span>SF6DNA</span></h1>
          <p>
            自分を知る、キャラクターを知る、相手を知る。
            初心者から上級者まで、対戦前・練習中・対戦後を1つにつなぐStreet Fighter 6総合プラットフォームです。
          </p>
          <div className="home-hero__actions">
            <Link className="button-primary" href="/diagnosis">診断を始める</Link>
            <Link className="button-secondary" href="/characters">キャラクターを調べる</Link>
          </div>
        </div>
        <div className="home-hero__visual" aria-label="SF6キャラクター">
          {heroCharacters.map((character, index) => (
            <Link
              className={`hero-fighter hero-fighter--${String.fromCharCode(97 + index)}`}
              href={`/characters/${character.slug}`}
              key={character.id}
              aria-label={`${character.name}の情報を見る`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={character.imageUrl ?? ""} alt={character.name} />
            </Link>
          ))}
        </div>
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
              ? `プレイアブル${characters.length}キャラクターを収録。公開画面では検証条件を通過したデータだけを表示します。`
              : "攻略データは出典とパッチを確認したものから順次公開します。"}
          </p>
        </div>
        <div className="card-grid">
          {pillars.map((pillar) => (
            <Link className="feature-card" data-icon={pillar.icon} href={pillar.href} key={pillar.title}>
              <div><h3>{pillar.title}</h3><p>{pillar.description}</p></div>
              <span>開く →</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="section-heading"><h2>攻略・練習データ</h2><p>必要な情報へ直接アクセスできます。</p></div>
        <div className="card-grid">
          {subTools.map(([icon, title, href]) => (
            <Link className="feature-card" data-icon={icon} href={href} key={href}>
              <h3>{title}</h3>
              <span>見る →</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
