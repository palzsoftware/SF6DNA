export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { listCharacters } from "@/lib/characters";
import { pickRandomHeroCharacters } from "@/lib/home-hero";

const dailyActions = [
  {
    phase: "DISCOVER",
    accent: "blue",
    title: "キャラクターを調べる",
    description: "各キャラクターの基本情報や、関連するプレイヤー・動画を探す。",
    href: "/characters",
  },
  {
    phase: "DIAGNOSIS",
    accent: "violet",
    title: "診断から自分を知る",
    description: "プレイ傾向やキャラクター適性を診断する。",
    href: "/diagnosis",
  },
  {
    phase: "SEARCH",
    accent: "teal",
    title: "SF6の情報を探す",
    description: "キャラクター・プレイヤー・動画を横断して探す。",
    href: "/search",
  },
  {
    phase: "STUDY",
    accent: "orange",
    title: "プレイヤーや動画を見る",
    description: "参考になるプレイヤーや動画を探す。",
    href: "/players",
  },
] as const;

const pillars = [
  {
    icon: "01",
    title: "診断",
    description: "プレイ傾向や相性のよいキャラクターを診断する。",
    href: "/diagnosis",
    featured: false,
  },
  {
    icon: "02",
    title: "キャラクター情報",
    description: "31キャラクターの基本情報を調べる。",
    href: "/characters",
    featured: true,
  },
  {
    icon: "03",
    title: "プレイヤー情報",
    description: "プロ・強豪・キャラクター職人などを探す。",
    href: "/players",
    featured: false,
  },
  {
    icon: "04",
    title: "動画",
    description: "キャラクターやプレイヤーに関連する動画を探す。",
    href: "/videos",
    featured: false,
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
  const heroCharacters = pickRandomHeroCharacters(characters);

  return (
    <div className="site-shell page-stack">
      <section className="home-hero">
        <div className="home-hero__copy">
          <p className="eyebrow">STREET FIGHTER 6 / PLAYER TOOLKIT</p>
          <h1>あなたのSF6を、<span>次のレベルへ</span></h1>
          <p>診断で課題を見つけ、キャラクター情報を調べ、そのまま今日の練習へ進めます。</p>
          <div className="home-hero__actions">
            <Link className="button-primary" href="/diagnosis">診断を始める</Link>
            <Link className="button-secondary" href="/characters">キャラクターを見る</Link>
            <Link className="button-secondary" href="/me/training">今日の15分練習を見る</Link>
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
          <strong>キャラクター・プレイヤー・動画を検索</strong>
          <form className="search-form" action="/search">
            <input name="q" placeholder="名前やキーワードを入力" aria-label="キャラクター・プレイヤー・動画を検索" />
            <button type="submit">検索</button>
          </form>
        </div>
      </section>

      <section className="home-metric-strip" aria-label="SF6DNAで見られる情報">
        <div className="home-metric"><strong>キャラクター</strong><span>{characters.length}キャラを掲載</span></div>
        <div className="home-metric"><strong>横断検索</strong><span>キャラクター・プレイヤー・動画をまとめて検索</span></div>
        <div className="home-metric"><strong>掲載情報</strong><span>キャラクター・プレイヤー・動画を掲載</span></div>
      </section>

      <section className="daily-section" aria-labelledby="daily-title">
        <div className="section-heading">
          <h2 id="daily-title">目的から選ぶ</h2>
          <p>知りたい内容に合わせて公開中の機能から選べます。</p>
        </div>
        <div className="daily-grid">
          {dailyActions.map((action) => (
            <Link className="daily-card home-purpose-card" data-accent={action.accent} href={action.href} key={action.phase}>
              <span className="daily-card__icon-slot" aria-hidden="true">{action.phase.slice(0, 2)}</span>
              <span className="daily-card__phase">{action.phase}</span>
              <strong>{action.title}</strong>
              <p>{action.description}</p>
              <span className="daily-card__arrow">{action.title} →</span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="main-content-title">
        <div className="section-heading">
          <h2 id="main-content-title">SF6DNAの中核</h2>
          <p>
            {characters.length
              ? `${characters.length}キャラクターの基本情報や、関連するプレイヤー・動画を探せます。`
              : "キャラクターの基本情報やプレイヤー・動画を探せます。"}
          </p>
        </div>
        <div className="home-core-grid">
          {pillars.map((pillar) => (
            <Link className={`home-core-card${pillar.featured ? " home-core-card--featured" : ""}`} data-icon={pillar.icon} href={pillar.href} key={pillar.title}>
              <div><h3>{pillar.title}</h3><p>{pillar.description}</p></div>
              <span>{pillar.title}を見る →</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="section-heading"><h2>SF6DNAで見られる情報</h2><p>探したい内容から選べます。</p></div>
        <nav className="home-public-nav" aria-label="SF6DNAで見られる情報">
          {subTools.map(([icon, title, href]) => (
            <Link className="home-public-link" href={href} key={href}>
              <span className="home-public-link__icon" aria-hidden="true">{icon}</span>
              <strong>{title}</strong>
              <span>見る →</span>
            </Link>
          ))}
        </nav>
      </section>
    </div>
  );
}
