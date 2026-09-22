export const dynamic = "force-dynamic";

import { listPlayers } from "@/lib/players";
import { PlayerDirectory } from "@/components/player-directory";
import styles from "./players.module.css";

export const metadata = { title: "プレイヤー情報", description: "SF6のプロ、競技プレイヤー、キャラ職人、配信者などを使用キャラクターや参考情報と合わせて探せます。" };

export default async function PlayersPage() {
  const players = await listPlayers();
  return <div className={`site-shell page-stack ${styles.playerPage}`}>
    <section className={`hero ${styles.listHero}`}><p className="eyebrow">プレイヤー</p><h1>プレイヤー情報</h1><p>使用キャラクターやチーム、地域からプレイヤーを探せます。</p></section>
    {players.length ? <PlayerDirectory players={players} /> : <div className="empty-state"><p>掲載中のプレイヤーはまだいません。</p></div>}
  </div>;
}
