import Image from "next/image";
import Link from "next/link";
import { listCharacters } from "@/lib/characters";

const dailyActions = [
  {
    phase: "DISCOVER",
    title: "キャラクターを調べる",
    description: "各キャラクターの基本情報や関連プレイヤー・動画を確認する。",
    href: "/characters",
  },
  {
    phase: "DIAGNOSIS",
    title: "診断から自分を知る",
    description: "プレイ傾向やキャラクター適性を診断する。",
    href: "/diagnosis",
  },
  {
    phase: "SEARCH",
    title: "公開情報を検索",
    description: "キャラクター・プレイヤー・動画を横断して探す。",
    href: "/search",
  },
  {
    phase: "STUDY",
    title: "プレイヤーや動画を見る",
    description: "参考になるプレイヤーや公開動画から情報を探す。",
    href: "/players",
  },
] as const;

const pillars = [
  {
    icon: "01",
    title: "診断",
    description: "プレイ傾向やキャラクター適性を確認する。",
    href: "/diagnosis",
  },
  {
    icon: "02",
    title: "キャラクター情報",
    description: "プレイアブルキャラクターの基本情報を確認する。",
    href: "/characters",
  },
  {
    icon: "03",
    title: "プレイヤー情報",
    description: "プロ・強豪・キャラクター職人などの公開情報を確認する。",
    href: "/players",
  },
  {
    icon: "04",
    title: "動画",
    description: "キャラクターやプレイヤーに関連する公開動画を確認する。",
    href: "/videos",
  },
];

const subTools = [
  ["CH", "キャラクター", "/characters"],
  ["DG", "診断", "/diagnosis"],
  ["PL", "プレイヤー", "/players"],
  ["VD", "動画", "/videos"],
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
          <p className="eyebrow">STREET FIGHTER 6 / PLAYER TOOLKIT</p>
          <h1>自分を知る。情報を探す。<span>SF6をもっと深く知る。</span></h1>
          <p>
            対戦前の確認、トレモ、対戦後の振り返りを1か所に。
            SF6DNAは「今やりたいこと」から迷わず使えるSF6総合プラットフォームです。
          </p>
          <div className="home-hero__actions">
            <Link className="button-primary" href="/characters">キャラクターから調べる</Link>
            <Link className="button-secondary" href="/diagnosis">診断を始める</Link>
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
              <Image
                src={character.imageUrl ?? ""}
                alt={character.name}
                fill
                sizes="(max-width: 720px) 58vw, (max-width: 980px) 42vw, 28vw"
                priority={index === 0}
              />
            </Link>
          ))}
        </div>
      </section>

      <section className="home-command-center" aria-label="すぐ使う">
        <div className="home-command-search">
          <strong>知りたいことを直接検索</strong>
          <form className="search-form" action="/search">
            <input name="q" placeholder="キャラクター・プレイヤー・動画" aria-label="SF6DNAを検索" />
            <button type="submit">検索</button>
          </form>
        </div>
      </section>

      <section className="home-metric-strip" aria-label="SF6DNA収録状況">
        <div className="home-metric"><strong>{characters.length}キャラ</strong><span>プレイアブルキャラクター</span></div>
        <div className="home-metric"><strong>1か所</strong><span>キャラクター・診断・プレイヤー・動画を横断</span></div>
        <div className="home-metric"><strong>公開情報</strong><span>確認条件を満たしたデータを表示</span></div>
      </section>

      <section className="daily-section" aria-labelledby="daily-title">
        <div className="section-heading">
          <h2 id="daily-title">目的から選ぶ</h2>
          <p>知りたい内容に合わせて公開中の機能から選べます。</p>
        </div>
        <div className="daily-grid">
          {dailyActions.map((action) => (
            <Link className="daily-card" href={action.href} key={action.phase}>
              <span className="daily-card__phase">{action.phase}</span>
              <strong>{action.title}</strong>
              <p>{action.description}</p>
              <span className="daily-card__arrow">開く →</span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="main-content-title">
        <div className="section-heading">
          <h2 id="main-content-title">SF6DNAの中核</h2>
          <p>
            {characters.length
              ? `プレイアブル${characters.length}キャラクターを収録。公開画面では確認条件を満たしたデータだけを表示します。`
              : "攻略データは出典と対象パッチを確認したものから順次公開します。"}
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
        <div className="section-heading"><h2>公開コンテンツから探す</h2><p>目的が決まっている場合は直接開けます。</p></div>
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
