import Link from "next/link";
import { playerTypeLabel } from "@/lib/player-labels";
import { listPlayers } from "@/lib/players";

export const metadata = {
  title: "プレイヤー情報",
  description: "SF6のプロ、競技プレイヤー、キャラ職人、配信者などの情報をキャラクターや参考情報と合わせて確認できます。",
};

export default async function PlayersPage() {
  const players = await listPlayers();

  return (
    <div className="site-shell page-stack">
      <section className="hero">
        <p className="eyebrow">PLAYERS</p>
        <h1>プレイヤー情報</h1>
        <p>プロ、競技プレイヤー、キャラ職人、配信者、攻略投稿者をキャラクター・大会・試合・動画と関連付けます。</p>
      </section>

      {players.length ? (
        <div className="character-grid">
          {players.map((player) => (
            <Link className="character-card" href={`/players/${player.slug}`} key={player.id}>
              <div className="character-card__media" aria-hidden="true">
                {player.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={player.imageUrl} alt="" width={720} height={480} loading="lazy" />
                ) : (
                  <span>{player.displayName.slice(0, 1)}</span>
                )}
                <div className="character-card__scrim" />
                <div className="character-card__nameplate">
                  <p className="eyebrow">{playerTypeLabel(player.playerType)}</p>
                  <h2>{player.displayName}</h2>
                </div>
              </div>
              <div className="character-card__body">
                <p>{[player.teamName, player.countryCode].filter(Boolean).join(" / ") || "プロフィールを見る"}</p>
                <div className="chip-row"><span className="chip chip--accent">PROFILE →</span></div>
              </div>
            </Link>
          ))}
        </div>
      ) : <div className="empty-state"><p>公開済みプレイヤーデータはまだありません。</p></div>}
    </div>
  );
}
