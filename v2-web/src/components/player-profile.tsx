import { PlayerArchiveSections } from "@/components/player-archive-sections";
import { playerTeamAccent } from "@/lib/player-team-accent";
import type { ReactNode } from "react";
import { PlayerEvidenceSections } from "@/components/player-evidence-sections";
import { PlayerIdentity } from "@/components/player-identity";
import { VideoCard } from "@/components/video-card";
import { videoRetrievalMessage, type VideoRetrievalState } from "@/lib/video-retrieval-state";
import { playerRegionLabel, playerSourceCta, safePlayerBio, playerBioSummary } from "@/lib/player-presentation";
import { videoPlayerHref } from "@/lib/video-player-filter";
import Link from "next/link";
import styles from "@/app/players/players.module.css";

import { playerTypeLabel } from "@/lib/player-labels";
import { formatVideoPublishedDate } from "@/lib/event-media";
import type { VideoSummary } from "@/lib/event-media";
import type { PlayerDetail } from "@/types/player";
import { publicRecommendedVideos } from "@/lib/player-profile-contract";
import { safePlayerDirectoryReturn } from "@/lib/player-directory-navigation";
import { PlayerCharacterGroups } from "@/components/player-character-groups";

export function PlayerProfile({ player, relatedVideos, relatedVideoError = false, relatedVideoState, directoryHref, automaticVideos, researchSection, recommendedVideoSection }: { player: PlayerDetail; relatedVideos: VideoSummary[]; relatedVideoError?: boolean; relatedVideoState?: VideoRetrievalState; directoryHref?: string; automaticVideos?: ReactNode; researchSection?: ReactNode; recommendedVideoSection?: ReactNode }) {
  const externalLinks = [["YouTubeチャンネルを見る", player.youtubeUrl], ["Twitchを見る", player.twitchUrl], ["本人のXを見る", player.xUrl], ["Webサイトを見る", player.websiteUrl]].filter((item): item is [string, string] => Boolean(item[1]));
  const safeIntake = player.profileIntake ? { ...player.profileIntake, recommendedVideos: player.profileIntake.recommendedVideos?.filter(row => row.relationConfirmed === true) } : undefined;
  const hasRecommendations = publicRecommendedVideos(safeIntake?.recommendedVideos).length > 0;
  const bio = safePlayerBio(player.bio);
  const summary = playerBioSummary(bio);
  const videoState = relatedVideoState ?? (relatedVideoError ? "API_ERROR" : relatedVideos.length ? "SUCCESS_WITH_RESULTS" : "SUCCESS_EMPTY");
  const videoMessage = videoState === "RELATION_UNRESOLVED"
    ? "このプレイヤーとの関連情報を確認中です。"
    : videoState === "SUCCESS_EMPTY"
      ? "このプレイヤーの関連動画はまだ掲載していません。"
      : videoRetrievalMessage(videoState);
  return <div className={`site-shell page-stack ${styles.playerPage} experience-profile`}>
    <section className={`character-hero ${styles.hero}`}>
      <div className={styles.heroCopy}><p className="eyebrow">プレイヤープロフィール</p><h1>{player.displayName}</h1>{player.realName ? <p className={styles.realName}>{player.realName}</p> : null}<p>{summary ?? "公開情報を確認できた項目から掲載しています。"}</p>
        <dl className={styles.facts}><div><dt>種別</dt><dd>{playerTypeLabel(player.playerType)}</dd></div>{player.teamName ? <div><dt>掲載チーム</dt><dd style={{ color: playerTeamAccent(player.teamName) }}>{player.teamName}</dd></div> : null}<div><dt>地域</dt><dd>{playerRegionLabel(player.region, player.countryCode)}</dd></div><div><dt>使用関係のあるキャラクター</dt><dd>{player.characters.map((item) => item.characterName).join(" / ") || "確認中"}</dd></div></dl>
        <Link className="button-primary inline-button" href="#player-videos">この選手の動画を見る</Link>
      </div>
      <PlayerIdentity name={player.displayName} imageUrl={player.imageUrl} team={player.teamName} region={player.region ?? player.countryCode} characters={player.characters.map((item) => item.characterName)} />
    </section>
    <nav aria-label="プレイヤーの移動"><Link className="text-link" href={safePlayerDirectoryReturn(directoryHref)}>← プレイヤー一覧に戻る</Link></nav>
    <section className="info-panel"><h2>30秒でわかるプレイヤー</h2><p>使用キャラクター、大会実績、関連動画から活動をたどれます。掲載チーム・使用キャラクターは、現在の所属やメインを断定するものではありません。</p>{externalLinks.length ? <div className={styles.actionLinks}>{externalLinks.map(([label, href]) => <a href={href} target="_blank" rel="noopener noreferrer" key={label}>{label} ↗</a>)}</div> : null}</section>
    <PlayerEvidenceSections intake={safeIntake} />
    <PlayerArchiveSections display={player.archiveDisplay} />
    <section className={styles.detailGrid}>
      <article className="info-panel"><h2>使用キャラクター</h2><PlayerCharacterGroups characters={player.characters} /></article>
      <article className="info-panel"><h2>SNS・外部リンク</h2>{externalLinks.length ? <div className={styles.actionLinks}>{externalLinks.map(([label, href]) => <a href={href} target="_blank" rel="noopener noreferrer" key={label}>{label} ↗</a>)}</div> : <p>確認済みのSNS・外部リンクはまだありません。</p>}</article>
    </section>
    <section className="info-panel"><h2>大会実績</h2>{player.tournamentResults.length ? <ul className={styles.resultList}>{player.tournamentResults.map((result) => <li key={`${result.tournamentId}:${result.placement ?? "na"}`}><Link href={`/tournaments/${result.tournamentSlug}`}>{result.tournamentName}</Link>{result.placement ? <strong>{result.placement}位</strong> : null}{result.note ? <small>{result.note}</small> : null}</li>)}</ul> : <p>大会順位の掲載情報は確認できていません。実績がないことを意味しません。</p>}</section>
    {researchSection}
    {recommendedVideoSection ?? <section className="info-panel"><h2>おすすめ動画</h2>{hasRecommendations ? <p>確認済みのおすすめ動画を上の案内に掲載しています。</p> : <p>この選手のおすすめ動画は確認できていません。<Link href="/videos">動画一覧を見る</Link></p>}</section>}
    <section id="player-videos" className={styles.section}><div className={styles.sectionHead}><div><p className="eyebrow">関連コンテンツ</p><h2>{player.displayName}の動画を見る</h2><p>ここでは公開済みの関連動画を掲載しています。おすすめ動画は確認できたものから追加します。</p></div><Link className="text-link" href={videoPlayerHref(player.displayName, player.id)}>すべての動画を見る</Link></div>{videoState !== "SUCCESS_WITH_RESULTS" ? <div className="empty-state" role={videoState === "API_ERROR" ? "alert" : "status"} aria-live="polite" aria-busy={videoState === "LOADING"} data-video-state={videoState}><p>{videoMessage}</p><Link href="/videos">動画一覧を見る</Link></div> : relatedVideos.length ? <div className={styles.videoRail} tabIndex={0} aria-label={`${player.displayName}の関連動画`}>{relatedVideos.map((video) => <VideoCard video={video} publishedDate={formatVideoPublishedDate(video.publishedAt)} key={video.id} />)}</div> : <div className="empty-state"><p>このプレイヤーの関連動画はまだ掲載していません。</p><Link className="inline-button button-secondary" href="/videos">動画一覧を見る</Link></div>}{automaticVideos}</section>
    {bio && bio !== summary ? <details className="info-panel"><summary>プロフィールを詳しく読む</summary><p>{bio}</p></details> : null}
    <section className="info-panel"><h2>情報源</h2>{player.sources.length ? <ul className={styles.sourceList}>{player.sources.map((source) => <li key={`${source.id}:${source.relationship}`}><a href={source.url} target="_blank" rel="noopener noreferrer"><strong>{playerSourceCta(source)}</strong><span>{source.title}{source.publisher ? ` / ${source.publisher}` : ""}</span></a></li>)}</ul> : <p>確認できる公式情報を追加中です。</p>}</section>
  </div>;
}
