import Image from "next/image";
import Link from "next/link";
import type { PlayerDetail } from "@/types/player";
import { playerRoleLabel } from "@/lib/player-labels";
import { safePlayerBio } from "@/lib/player-presentation";
import styles from "./character-player-card.module.css";

export function CharacterPlayerCard({ player, characterSlug }: { player: PlayerDetail; characterSlug: string }) {
  const relation = player.characters.find((item) => item.characterSlug === characterSlug);
  const bio = safePlayerBio(player.bio);
  const links = [["YouTube", player.youtubeUrl], ["Twitch", player.twitchUrl], ["X", player.xUrl], ["Webサイト", player.websiteUrl]]
    .filter((item): item is [string, string] => typeof item[1] === "string" && item[1].startsWith("https://"));
  return <article className={styles.card}>
    <header className={styles.header}>
      {player.imageUrl ? <Image src={player.imageUrl} alt="" width={64} height={64} sizes="64px" /> : <span className={styles.initial} aria-hidden="true">{player.displayName.slice(0, 1)}</span>}
      <div><h3><Link href={`/players/${player.slug}`}>{player.displayName}</Link></h3>
        {relation ? <p>{relation.characterName} · {playerRoleLabel(relation.role)}</p> : null}
        {player.teamName || player.region || player.countryCode ? <p>{[player.teamName, player.region ?? player.countryCode].filter(Boolean).join(" / ")}</p> : null}
      </div>
    </header>
    {bio ? <p className={styles.bio}>{bio}</p> : null}
    {player.tournamentResults.slice(0, 2).map((result) => <p className={styles.result} key={result.tournamentId}>{result.tournamentName}{result.placement !== null ? ` · ${result.placement}位` : ""}</p>)}
    <footer className={styles.links}>
      <Link href={`/players/${player.slug}`}>プロフィール・使用キャラを見る →</Link>
      {links.map(([label, href]) => <a key={label} href={href} target="_blank" rel="noopener noreferrer">{label} ↗</a>)}
      {player.sources.slice(0, 2).map((source) => <a key={source.id} href={source.url} target="_blank" rel="noopener noreferrer">{source.title} ↗</a>)}
    </footer>
  </article>;
}
