import Image from "next/image";
import Link from "next/link";
import { listCharacters } from "@/lib/characters";

const dailyActions = [
  {
    phase: "BEFORE MATCH",
    title: "対戦前に対策を確認",
    description: "苦手キャラや要注意行動を短時間で見直す。",
    href: "/counters",
  },
  {
    phase: "PRACTICE",
    title: "今日の練習を決める",
    description: "対空・確反・端防御など、トレモ項目へすぐ移動する。",
    href: "/training",
  },
  {
    phase: "AFTER MATCH",
    title: "対戦後に振り返る",
    description: "自分用ツールで試合の課題と次の練習を整理する。",
    href: "/tools",
  },
  {
    phase: "STUDY",
    title: "キャラクターを研究",
    description: "技・フレーム・コンボ・対策をキャラ単位で横断する。",
    href: "/characters",
  },
] as const;

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
    description: "SF6DNA内の確認済みデータを根拠に、課題と次の練習を整理する。",
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
            対戦前の確認、練習、対戦後の振り返りまでを1か所に。
            必要な情報へ迷わず辿り着けるStreet Fighter 6総合プラットフォームです。
          </p>
          <div className="home-hero__actions">
            <Link className="button-primary" href="/characters">キャラクターを調べる</Link>
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

      <section aria-label="SF6DNA横断検索">
        <form className="search-form" action="/search">
          <input name="q" placeholder="キャラ・技・別名・コンボ・対策を検索" aria-label="SF6DNAを検索" />
          <button type="submit">検索</button>
        </form>
      </section>

      <section className="daily-section" aria-labelledby="daily-title">
        <div className="section-heading">
          <h2 id="daily-title">今すぐ使う</h2>
          <p>プレイのタイミングから、必要なページへ直接移動できます。</p>
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
        <div className="section-heading"><h2>攻略データから探す</h2><p>目的が決まっている場合は直接開けます。</p></div>
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
