export const dynamic = "force-dynamic";

import Link from "next/link";
import { playerTypeLabel } from "@/lib/player-labels";
import { listPlayers } from "@/lib/players";
import styles from "./players.module.css";

export const metadata = { title: "プレイヤー情報", description: "SF6のプロ、競技プレイヤー、キャラ職人、配信者などの情報をキャラクターや参考情報と合わせて確認できます。" };

export default async function PlayersPage() {
  const players = await listPlayers();
  return <div className={`site-shell page-stack ${styles.playerPage}`}>
    <section className={`hero ${styles.listHero}`}><p className="eyebrow">プレイヤー</p><h1>プレイヤー情報</h1><p>使用キャラクター、チーム、地域、公開プロフィールを確認できます。</p></section>
    {players.length ? <div className={styles.playerGrid}>{players.map((player) => {
      const mainCharacter = player.characters.find((item) => item.role === "main") ?? player.characters[0];
      return <Link className={`${styles.playerCard}${player.imageUrl ? "" : " character-card--no-image"}`} href={`/players/${player.slug}`} key={player.id}><div className={styles.playerMark} aria-hidden="true">{Array.from(player.displayName)[0]}</div><div className={styles.cardBody}><p className="eyebrow">{playerTypeLabel(player.playerType)}</p><h2>{player.displayName}</h2><dl><div><dt>チーム</dt><dd>{player.teamName ?? "未登録"}</dd></div><div><dt>主なキャラクター</dt><dd>{mainCharacter?.characterName ?? "未登録"}</dd></div><div><dt>地域</dt><dd>{player.countryCode ?? "未登録"}</dd></div></dl><span>プロフィールを見る →</span></div></Link>;
    })}</div> : <div className="empty-state"><p>公開済みプレイヤーデータはまだありません。</p></div>}
  </div>;
}
