import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlayerBySlug } from "@/lib/players";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const player = await getPlayerBySlug(slug);
  return { title: player ? `${player.displayName} | プレイヤー情報 | SF6DNA` : "プレイヤー情報 | SF6DNA" };
}

export default async function PlayerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const player = await getPlayerBySlug(slug);
  if (!player) notFound();

  const externalLinks = [
    ["YouTube", player.youtubeUrl],
    ["Twitch", player.twitchUrl],
    ["X", player.xUrl],
    ["Web", player.websiteUrl],
  ].filter((item): item is [string, string] => Boolean(item[1]));

  return (
    <div className="site-shell page-stack">
      <section className="character-hero">
        <div>
          <p className="eyebrow">PLAYER</p>
          <h1>{player.displayName}</h1>
          <p>{player.bio ?? "プレイヤー情報を準備中です。"}</p>
          <div className="chip-row">
            {player.playerType ? <span className="chip">{player.playerType}</span> : null}
            {player.teamName ? <span className="chip">{player.teamName}</span> : null}
            {player.region ? <span className="chip">{player.region}</span> : null}
          </div>
        </div>
        {player.imageUrl ? <img className="character-hero__image" src={player.imageUrl} alt={player.displayName} /> : null}
      </section>

      <section className="character-columns">
        <article className="info-panel">
          <h2>使用キャラクター</h2>
          {player.characters.length ? (
            <ul>{player.characters.map((item) => <li key={`${item.characterId}:${item.role}`}><Link href={`/characters/${item.characterSlug}`}>{item.characterName}</Link> <small>({item.role})</small></li>)}</ul>
          ) : <p>登録情報はまだありません。</p>}
        </article>
        <article className="info-panel">
          <h2>外部リンク</h2>
          {externalLinks.length ? <ul>{externalLinks.map(([label, href]) => <li key={label}><a href={href} target="_blank" rel="noreferrer">{label}</a></li>)}</ul> : <p>登録情報はまだありません。</p>}
        </article>
      </section>
    </div>
  );
}
