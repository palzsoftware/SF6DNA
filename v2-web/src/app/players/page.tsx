import Link from "next/link";
import { listPlayers } from "@/lib/players";

export const metadata = { title: "プレイヤー情報" };

const TYPE_LABELS: Record<string, string> = {
  pro: "プロ",
  non_pro_top: "非プロ強豪",
  legend: "Legend上位",
  specialist: "キャラ職人",
  streamer: "ストリーマー",
  vtuber: "VTuber",
  creator: "攻略投稿者",
  coach: "コーチ",
  other: "プレイヤー",
};

export default async function PlayersPage() {
  const players = await listPlayers();

  return (
    <div className="site-shell page-stack">
      <section className="hero">
        <p className="eyebrow">PLAYERS</p>
        <h1>プレイヤー情報</h1>
        <p>プロ、強豪、キャラ職人、配信者、攻略投稿者をキャラクター・大会・試合・動画と関連付けます。</p>
      </section>

      {players.length ? (
        <div className="card-grid">
          {players.map((player) => (
            <Link className="feature-card" href={`/players/${player.slug}`} key={player.id}>
              <div>
                <p className="eyebrow">{TYPE_LABELS[player.playerType ?? "other"] ?? player.playerType}</p>
                <h3>{player.displayName}</h3>
                <p>{[player.teamName, player.countryCode].filter(Boolean).join(" / ") || "プロフィールを見る"}</p>
              </div>
              <span>詳細 →</span>
            </Link>
          ))}
        </div>
      ) : <div className="empty-state"><p>公開済みプレイヤーデータはまだありません。</p></div>}
    </div>
  );
}
