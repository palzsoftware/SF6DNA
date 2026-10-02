import { VisualIcon, destinationIcon } from "@/components/visual-icon";
export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { listCharacters } from "@/lib/characters";
import { pickRandomHeroCharacters } from "@/lib/home-hero";

const todayActions = [
  {
    phase: "TRAIN",
    accent: "orange",
    title: "今日の15分練習",
    description: "3つの5分メニューで、今日取り組む課題をすぐ決める。",
    href: "/me/training",
  },
  {
    phase: "DIAGNOSIS",
    accent: "violet",
    title: "自分の課題を診断する",
    description: "プレイ傾向や上達課題を整理して、次の練習につなげる。",
    href: "/diagnosis",
  },
  {
    phase: "CHARACTER",
    accent: "blue",
    title: "キャラクターを調べる",
    description: "キャラクターの特徴、技、関連プレイヤーや動画を見る。",
    href: "/characters",
  },
] as const;

const resumeLinks = [
  ["SAVE", "お気に入り", "保存したキャラ", "/favorites"],
  ["MY", "マイキャラ", "使用キャラの設定", "/my-characters"],
  ["HIST", "診断履歴", "前の診断結果", "/diagnosis/history"],
] as const;

const browseLinks = [
  ["SEARCH", "検索", "サイト内を検索", "/search"],
  ["PLAYER", "プレイヤー", "参考プレイヤーを探す", "/players"],
  ["CHARACTER", "キャラクター", "特徴と技を見る", "/characters"],
  ["SOURCE", "情報源", "出典と掲載方針", "/sources"],
] as const;

const recentUpdates = [
  ["2026-10-01", "リリース前QAを強化", "Lukeの入力表示とログイン時のエラー表示を見直しました。"],
  ["2026-10-01", "情報源の表示を整理", "公式技表など、リンク先の内容が分かる案内へ調整しました。"],
  ["2026-09-30", "コンボ入力表示を改善", "コンボの原文を保持しながら、入力を読み取りやすくする共通表示を整えました。"],
] as const;

export default async function HomePage() {
  const characters = await listCharacters();
  const heroCharacters = pickRandomHeroCharacters(characters);

  return (
    <div className="site-shell page-stack lab-home">
      <section className="home-hero">
        <div className="home-hero__copy">
          <p className="eyebrow">SF6DNA / TRAINING LAB</p>
          <h1>次の対戦で、<span>何を試そう？</span></h1>
          <p>課題を整理して、今日やることを決める。<br />キャラクターの技や動画も、ここから。</p>
          <div className="home-hero__actions">
            <Link className="button-primary" href="/me/training">今日の15分練習を始める</Link>
            <Link className="button-secondary" href="/diagnosis">診断する</Link>

          </div>
        </div>
        <div className="home-hero__visual" aria-label="SF6キャラクター">
          <div className="lab-dna" aria-hidden="true">{[0,1,2,3,4,5].map((node) => <i key={node} />)}</div>
          <span className="lab-visual-label" aria-hidden="true">FIND YOUR NEXT MOVE</span>
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

      <section className="daily-section" aria-labelledby="today-title">
        <div className="section-heading">
          <h2 id="today-title">今日やること</h2>
          <p>まずは15分。課題が曖昧なら診断から。</p>
        </div>
        <div className="daily-grid">
          {todayActions.map((action) => (
            <Link className="daily-card home-purpose-card" data-accent={action.accent} href={action.href} key={action.phase}>
              <span className="daily-card__icon-slot" aria-hidden="true"><VisualIcon kind={action.phase === "TRAIN" ? "training" : action.phase === "DIAGNOSIS" ? "diagnosis" : "character"} /></span>
              <span className="daily-card__phase">{action.phase === "TRAIN" ? "TODAY’S TRAINING" : action.phase}</span>
              {action.phase === "TRAIN" ? <div className="lab-timer" aria-label="5分の練習を3つ、合計15分">{[1,2,3].map((part) => <span key={part}><b>05</b><small>min</small></span>)}<em>15分で、ひとつ前へ。</em></div> : null}
              <strong>{action.title}</strong>
              <p>{action.description}</p>
              <span className="daily-card__arrow">{action.phase === "TRAIN" ? "練習メニューを見る" : action.title}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="experience-continue" aria-labelledby="resume-title">
        <div className="section-heading">
          <h2 id="resume-title">続きから</h2>
          <p>お気に入り、マイキャラ、前の診断へ。</p>
        </div>
        <nav className="home-public-nav" aria-label="続きから">
          {resumeLinks.map(([icon, title, description, href]) => (
            <Link className="home-public-link" href={href} key={href}>
              <span className="home-public-link__icon" aria-hidden="true">{icon}</span>
              <strong><VisualIcon kind={destinationIcon(href)} />{title}</strong>
              <span>{description}</span>
            </Link>
          ))}
        </nav>
      </section>

      <section className="experience-explore" aria-labelledby="browse-title">
        <div className="section-heading">
          <h2 id="browse-title">情報を探す</h2>
          <p>{characters.length ? `${characters.length}キャラクターの情報や、プレイヤー・動画・情報源を探せます。` : "キャラクター、プレイヤー、動画、情報源を探せます。"}</p>
        </div>
      <section className="home-command-center" aria-label="SF6DNAを検索">
        <div className="home-command-search">
          <strong>キャラクター・プレイヤー・動画を検索</strong>
          <form className="search-form" action="/search">
            <div className="visual-search-control"><VisualIcon kind="search" /><input className="visual-search-field" name="q" placeholder="例：JP / 翔" aria-label="キャラクター・プレイヤー・動画を検索" /></div>
            <button type="submit">検索</button>
          </form>
        </div>
      </section>

        <nav className="home-public-nav" aria-label="情報を探す">
          {browseLinks.map(([icon, title, description, href]) => (
            <Link className="home-public-link" href={href} key={href}>
              <span className="home-public-link__icon" aria-hidden="true">{icon}</span>
              <strong><VisualIcon kind={destinationIcon(href)} />{title}</strong>
              <span>{description}</span>
            </Link>
          ))}
        </nav>
      </section>

      <section className="experience-watch" aria-labelledby="watch-title"><div><p className="eyebrow">WATCH</p><h2 id="watch-title">今日は、動画から学ぶ。</h2><p>気になるキャラクターやプレイヤーで絞って、攻略・対戦動画へ。</p></div><Link className="button-primary" href="/videos">動画を探す</Link><span className="experience-play" aria-hidden="true">▶</span></section>

      <section className="experience-updates" aria-labelledby="updates-title">
        <div className="section-heading">
          <h2 id="updates-title">最近の更新</h2>
          <p>最近の改善を紹介します。</p>
        </div>
        <div className="guide-stack experience-update-strip">
          {recentUpdates.map(([date, title, body]) => (
            <article className="info-panel" key={`${date}-${title}`}>
              <p className="eyebrow">{date}</p>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <Link className="inline-button button-secondary" href="/changelog">更新履歴をすべて見る</Link>
      </section>


    </div>
  );
}
