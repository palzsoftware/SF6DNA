import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { playerRoleLabel, playerTypeLabel } from "@/lib/player-labels";
import { getPlayerBySlug } from "@/lib/players";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const player = await getPlayerBySlug(slug);
  return {
    title: player ? `${player.displayName} | プレイヤー情報` : "プレイヤー情報",
    description: player ? `${player.displayName}の使用キャラクター、プロフィール、参考情報を確認できます。` : undefined,
  };
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
          <p>{player.bio ?? "公開できるプロフィール情報を準備中です。"}</p>
          <div className="chip-row">
            <span className="chip">{playerTypeLabel(player.playerType)}</span>
            {player.teamName ? <span className="chip">{player.teamName}</span> : null}
            {player.region ? <span className="chip">{player.region}</span> : null}
          </div>
        </div>
        {player.imageUrl ? (
          <Image
            className="character-hero__image"
            src={player.imageUrl}
            alt={player.displayName}
            width={760}
            height={760}
            sizes="(max-width: 720px) 100vw, 42vw"
            priority
          />
        ) : null}
      </section>

      <section className="character-columns">
        <article className="info-panel">
          <h2>使用キャラクター</h2>
          {player.characters.length ? (
            <ul>{player.characters.map((item) => <li key={`${item.characterId}:${item.role}`}><Link href={`/characters/${item.characterSlug}`}>{item.characterName}</Link> <small>（{playerRoleLabel(item.role)}）</small></li>)}</ul>
          ) : <p>公開済みの登録情報はまだありません。</p>}
        </article>
        <article className="info-panel">
          <h2>外部リンク</h2>
          {externalLinks.length ? <ul>{externalLinks.map(([label, href]) => <li key={label}><a href={href} target="_blank" rel="noopener noreferrer">{label}</a></li>)}</ul> : <p>登録情報はまだありません。</p>}
        </article>
      </section>

      <section className="info-panel">
        <h2>出典</h2>
        {player.sources.length ? (
          <ul>
            {player.sources.map((source) => (
              <li key={`${source.id}:${source.relationship}`}>
                <a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a>
                {source.publisher ? ` / ${source.publisher}` : ""}
              </li>
            ))}
          </ul>
        ) : <p>公開済みの出典情報はまだありません。</p>}
      </section>
    </div>
  );
}
