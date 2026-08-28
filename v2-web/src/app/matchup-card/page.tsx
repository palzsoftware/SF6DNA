import Link from "next/link";
import { getMatchupCardData } from "@/lib/matchup-card";
import { listCharacters } from "@/lib/repositories/app-repository";

export const metadata = {
  title: "対面ナレッジカード | SF6DNA",
  description: "検証済み・Source付きデータだけで、自キャラ対相手キャラの確認事項を1画面にまとめます。",
};

export default async function MatchupCardPage({ searchParams }: { searchParams: Promise<{ own?: string; opponent?: string }> }) {
  const params = await searchParams;
  const characters = await listCharacters();
  const own = characters.find((item) => item.slug === params.own) ?? characters[0];
  const opponent = characters.find((item) => item.slug === params.opponent) ?? characters.find((item) => item.id !== own?.id) ?? characters[0];

  if (!own || !opponent) {
    return <div className="site-shell"><section className="empty-state"><h1>キャラクターデータを読み込めません</h1></section></div>;
  }

  const card = await getMatchupCardData(own.id, opponent.id);

  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero">
        <p className="eyebrow">MATCHUP CARD</p>
        <h1>{own.name} vs {opponent.name}</h1>
        <p>Public Gateを通過した技情報と、published + verified + Source付き対策だけを表示します。</p>
      </section>

      <form className="search-form" action="/matchup-card">
        <label>自キャラ
          <select name="own" defaultValue={own.slug}>
            {characters.map((character) => <option key={character.id} value={character.slug}>{character.name}</option>)}
          </select>
        </label>
        <label>相手キャラ
          <select name="opponent" defaultValue={opponent.slug}>
            {characters.map((character) => <option key={character.id} value={character.slug}>{character.name}</option>)}
          </select>
        </label>
        <button type="submit">表示</button>
      </form>

      <section className="info-panel">
        <h2>{opponent.name}の公開済み代表技</h2>
        {card.opponentMoves.length ? (
          <div className="search-result-list">
            {card.opponentMoves.map((item) => (
              <Link className="search-result" href={item.href} key={item.id}>
                {item.meta ? <span className="search-result__type">{item.meta}</span> : null}
                <strong>{item.title}</strong>
                {item.subtitle ? <span>{item.subtitle}</span> : null}
              </Link>
            ))}
          </div>
        ) : <div className="empty-state"><p>現在のPublic Gateを通過した技データはありません。</p></div>}
      </section>

      <section className="info-panel">
        <h2>{own.name}側の検証済み対策</h2>
        {card.counters.length ? (
          <div className="search-result-list">
            {card.counters.map((item) => (
              <Link className="search-result" href={item.href} key={item.id}>
                {item.meta ? <span className="search-result__type">{item.meta}</span> : null}
                <strong>{item.title}</strong>
                {item.summary ? <span>{item.summary}</span> : null}
              </Link>
            ))}
          </div>
        ) : <div className="empty-state"><p>この組み合わせで公開可能なverified + Source付き対策はまだありません。未検証情報は補完表示しません。</p></div>}
      </section>

      <section className="info-panel">
        <h2>次に確認する</h2>
        <p><Link href={`/characters/${own.slug}/training`}>{own.name}のTraining</Link></p>
        <p><Link href={`/characters/${opponent.slug}/moves`}>{opponent.name}の全公開技</Link></p>
        <p><Link href="/improve">対戦ログ・Replay復習へ戻る</Link></p>
      </section>
    </div>
  );
}
