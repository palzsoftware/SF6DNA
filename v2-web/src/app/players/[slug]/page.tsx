import { PlayerIdentity } from "@/components/player-identity";
import { VideoCard } from "@/components/video-card";
import { formatVideoPublishedDate, listVideos } from "@/lib/event-media";
import { playerRoleLabel, playerTypeLabel } from "@/lib/player-labels";
import { playerRegionLabel, playerSourceCta, safePlayerBio } from "@/lib/player-presentation";
import { getPlayerBySlug } from "@/lib/players";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../players.module.css";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const player = await getPlayerBySlug(slug);
  return { title: player ? `${player.displayName} | プレイヤー情報` : "プレイヤー情報", description: player ? `${player.displayName}の使用キャラクターやプロフィールを紹介します。` : undefined };
}

export default async function PlayerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [player, videos] = await Promise.all([getPlayerBySlug(slug), listVideos()]);
  if (!player) notFound();
  const externalLinks = [["YouTubeチャンネルを見る", player.youtubeUrl], ["Twitchを見る", player.twitchUrl], ["Player本人Xを見る", player.xUrl], ["公式・関連サイトを見る", player.websiteUrl]].filter((item): item is [string, string] => Boolean(item[1]));
  const relatedVideos = videos.filter((video) => video.players.includes(player.displayName)).slice(0, 8);
  const bio = safePlayerBio(player.bio);

  return <div className={`site-shell page-stack ${styles.playerPage}`}>
    <section className={`character-hero ${styles.hero}`}>
      <div className={styles.heroCopy}><p className="eyebrow">プレイヤープロフィール</p><h1>{player.displayName}</h1>{player.realName ? <p className={styles.realName}>{player.realName}</p> : null}<p>{bio ?? "公開情報を確認できた項目から掲載しています。"}</p>
        <dl className={styles.facts}><div><dt>種別</dt><dd>{playerTypeLabel(player.playerType)}</dd></div><div><dt>チーム</dt><dd>{player.teamName ?? "チーム情報は未登録です"}</dd></div><div><dt>地域</dt><dd>{playerRegionLabel(player.region, player.countryCode)}</dd></div><div><dt>主なキャラクター</dt><dd>{player.characters.find((item) => item.role === "main")?.characterName ?? player.characters[0]?.characterName ?? "使用キャラクター情報は未登録です"}</dd></div></dl>
      </div>
      <PlayerIdentity name={player.displayName} imageUrl={player.imageUrl} team={player.teamName} region={player.region ?? player.countryCode} characters={player.characters.map((item) => item.characterName)} />
    </section>
    <section className={styles.detailGrid}>
      <article className="info-panel"><h2>使用キャラクター</h2>{player.characters.length ? <div className={styles.characterLinks}>{player.characters.map((item) => <Link href={`/characters/${item.characterSlug}`} key={`${item.characterId}:${item.role}`}><strong>{item.characterName}</strong><small>{playerRoleLabel(item.role)}</small></Link>)}</div> : <p>確認済みの使用キャラクターはまだありません。</p>}</article>
      <article className="info-panel"><h2>SNS・外部リンク</h2>{externalLinks.length ? <div className={styles.actionLinks}>{externalLinks.map(([label, href]) => <a href={href} target="_blank" rel="noopener noreferrer" key={label}>{label} ↗</a>)}</div> : <p>確認済みのSNS・外部リンクはまだありません。</p>}</article>
    </section>
    <section className="info-panel"><h2>大会実績</h2>{player.tournamentResults.length ? <ul className={styles.resultList}>{player.tournamentResults.map((result) => <li key={`${result.tournamentId}:${result.placement ?? "na"}`}><Link href={`/tournaments/${result.tournamentSlug}`}>{result.tournamentName}</Link>{result.placement ? <strong>{result.placement}位</strong> : null}{result.note ? <small>{result.note}</small> : null}</li>)}</ul> : <p>公開済みの大会実績はまだありません。確認できた情報から追加します。</p>}</section>
    <section className={styles.section}><div className={styles.sectionHead}><div><p className="eyebrow">関連コンテンツ</p><h2>関連動画</h2></div><Link className="text-link" href={`/videos?q=${encodeURIComponent(player.displayName)}`}>すべての動画を見る</Link></div>{relatedVideos.length ? <div className={styles.videoRail} tabIndex={0} aria-label={`${player.displayName}の関連動画`}>{relatedVideos.map((video) => <VideoCard video={video} publishedDate={formatVideoPublishedDate(video.publishedAt)} key={video.id} />)}</div> : <div className="empty-state"><p>このプレイヤーに紐づく公開動画はまだありません。</p><Link className="inline-button button-secondary" href="/videos">動画一覧を見る</Link></div>}</section>
    <section className="info-panel"><h2>情報源</h2>{player.sources.length ? <ul className={styles.sourceList}>{player.sources.map((source) => <li key={`${source.id}:${source.relationship}`}><a href={source.url} target="_blank" rel="noopener noreferrer"><strong>{playerSourceCta(source)}</strong><span>{source.title}{source.publisher ? ` / ${source.publisher}` : ""}</span></a></li>)}</ul> : <p>公開済みの情報源はまだありません。</p>}</section>
  </div>;
}
