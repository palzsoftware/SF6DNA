import { PlayerEvidenceSections } from "@/components/player-evidence-sections";
import { publicPageMetadata } from "@/lib/public-page-metadata";
import { PlayerIdentity } from "@/components/player-identity";
import { VideoCard } from "@/components/video-card";
import { formatVideoPublishedDate, listVideos } from "@/lib/event-media";
import { playerRoleLabel, playerTypeLabel } from "@/lib/player-labels";
import { playerRegionLabel, playerSourceCta, safePlayerBio, playerBioSummary } from "@/lib/player-presentation";
import { videoPlayerHref } from "@/lib/video-player-filter";
import { getPlayerBySlug } from "@/lib/players";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../players.module.css";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const player = await getPlayerBySlug(slug);
  return publicPageMetadata(`/players/${encodeURIComponent(slug)}`, { title: player ? `${player.displayName} | プレイヤー情報` : "プレイヤー情報", description: player ? `${player.displayName}の使用キャラクターやプロフィールを紹介します。` : undefined }, Boolean(player));
}

export default async function PlayerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const player = await getPlayerBySlug(slug);
  if (!player) notFound();
  const externalLinks = [["YouTubeチャンネルを見る", player.youtubeUrl], ["Twitchを見る", player.twitchUrl], ["本人のXを見る", player.xUrl], ["Webサイトを見る", player.websiteUrl]].filter((item): item is [string, string] => Boolean(item[1]));
  const relatedVideos = await listVideos({ playerId: player.id, limit: 8 }).catch(() => {
    console.error("[player-page] related videos unavailable");
    return [];
  });
  const bio = safePlayerBio(player.bio);
  const summary = playerBioSummary(bio);

  return <div className={`site-shell page-stack ${styles.playerPage} experience-profile`}>
    <section className={`character-hero ${styles.hero}`}>
      <div className={styles.heroCopy}><p className="eyebrow">プレイヤープロフィール</p><h1>{player.displayName}</h1>{player.realName ? <p className={styles.realName}>{player.realName}</p> : null}<p>{summary ?? "公開情報を確認できた項目から掲載しています。"}</p>
        <dl className={styles.facts}><div><dt>種別</dt><dd>{playerTypeLabel(player.playerType)}</dd></div>{player.teamName ? <div><dt>掲載チーム</dt><dd>{player.teamName}</dd></div> : null}<div><dt>地域</dt><dd>{playerRegionLabel(player.region, player.countryCode)}</dd></div><div><dt>使用関係のあるキャラクター</dt><dd>{player.characters.map((item) => item.characterName).join(" / ") || "確認中"}</dd></div></dl>
        <Link className="button-primary inline-button" href="#player-videos">この選手の動画を見る</Link>
      </div>
      <PlayerIdentity name={player.displayName} imageUrl={player.imageUrl} team={player.teamName} region={player.region ?? player.countryCode} characters={player.characters.map((item) => item.characterName)} />
    </section>
    <section className="info-panel"><h2>30秒でわかるプレイヤー</h2><p>使用キャラクター、大会実績、関連動画から活動をたどれます。掲載チーム・使用キャラクターは、現在の所属やメインを断定するものではありません。</p>{externalLinks.length ? <div className={styles.actionLinks}>{externalLinks.map(([label, href]) => <a href={href} target="_blank" rel="noopener noreferrer" key={label}>{label} ↗</a>)}</div> : null}</section>
    <PlayerEvidenceSections intake={player.profileIntake} />
    <section className={styles.detailGrid}>
      <article className="info-panel"><h2>使用キャラクター</h2>{player.characters.length ? <div className={styles.characterLinks}>{player.characters.map((item) => <Link href={`/characters/${item.characterSlug}`} key={`${item.characterId}:${item.role}`}><strong>{item.characterName}</strong><small>{playerRoleLabel(item.role)}</small></Link>)}</div> : <p>確認済みの使用キャラクターはまだありません。</p>}</article>
      <article className="info-panel"><h2>SNS・外部リンク</h2>{externalLinks.length ? <div className={styles.actionLinks}>{externalLinks.map(([label, href]) => <a href={href} target="_blank" rel="noopener noreferrer" key={label}>{label} ↗</a>)}</div> : <p>確認済みのSNS・外部リンクはまだありません。</p>}</article>
    </section>
    <section className="info-panel"><h2>大会実績</h2>{player.tournamentResults.length ? <ul className={styles.resultList}>{player.tournamentResults.map((result) => <li key={`${result.tournamentId}:${result.placement ?? "na"}`}><Link href={`/tournaments/${result.tournamentSlug}`}>{result.tournamentName}</Link>{result.placement ? <strong>{result.placement}位</strong> : null}{result.note ? <small>{result.note}</small> : null}</li>)}</ul> : <p>公開済みの大会実績はまだありません。確認できた情報から追加します。</p>}</section>
    <section id="player-videos" className={styles.section}><div className={styles.sectionHead}><div><p className="eyebrow">関連コンテンツ</p><h2>{player.displayName}の動画を見る</h2><p>おすすめ動画は現在準備中です。ここでは公開済みの関連動画を掲載しています。</p></div><Link className="text-link" href={videoPlayerHref(player.displayName, player.id)}>すべての動画を見る</Link></div>{relatedVideos.length ? <div className={styles.videoRail} tabIndex={0} aria-label={`${player.displayName}の関連動画`}>{relatedVideos.map((video) => <VideoCard video={video} publishedDate={formatVideoPublishedDate(video.publishedAt)} key={video.id} />)}</div> : <div className="empty-state"><p>このプレイヤーの関連動画はまだ掲載していません。</p><Link className="inline-button button-secondary" href="/videos">動画一覧を見る</Link></div>}</section>
    {bio && bio !== summary ? <details className="info-panel"><summary>プロフィールを詳しく読む</summary><p>{bio}</p></details> : null}
    <section className="info-panel"><h2>情報源</h2>{player.sources.length ? <ul className={styles.sourceList}>{player.sources.map((source) => <li key={`${source.id}:${source.relationship}`}><a href={source.url} target="_blank" rel="noopener noreferrer"><strong>{playerSourceCta(source)}</strong><span>{source.title}{source.publisher ? ` / ${source.publisher}` : ""}</span></a></li>)}</ul> : <p>確認できる公式情報を追加中です。</p>}</section>
  </div>;
}
