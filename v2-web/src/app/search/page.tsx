import Link from "next/link";
import { searchAcrossContent } from "@/lib/search";

export const metadata = { title: "検索" };

const TYPE_LABELS: Record<string, string> = {
  character: "キャラクター",
  move: "技",
  combo: "コンボ",
  counter: "対策",
  training: "トレーニング",
  player: "プレイヤー",
  tournament: "大会",
  video: "動画",
  glossary: "用語",
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const results = q ? await searchAcrossContent(q) : [];

  return (
    <div className="site-shell page-stack">
      <section className="hero">
        <p className="eyebrow">SEARCH</p>
        <h1>横断検索</h1>
        <p>キャラクター、技、別名、コンボ、プレイヤー、用語を1か所から探します。</p>
      </section>

      <form className="search-form" action="/search">
        <input name="q" defaultValue={q} placeholder="例: コパ / 足刀 / JP / Nemo" aria-label="検索キーワード" />
        <button type="submit">検索</button>
      </form>

      {q ? (
        <section>
          <div className="section-heading"><h2>「{q}」の検索結果</h2><p>{results.length}件</p></div>
          {results.length ? (
            <div className="search-result-list">
              {results.map((item) => (
                <Link className="search-result" href={item.href} key={`${item.type}:${item.id}`}>
                  <span className="search-result__type">{TYPE_LABELS[item.type] ?? item.type}</span>
                  <strong>{item.title}</strong>
                  {item.subtitle ? <span>{item.subtitle}</span> : null}
                  {item.matchedBy === "alias" ? <small>別名一致</small> : null}
                </Link>
              ))}
            </div>
          ) : <div className="empty-state"><p>公開済みデータから一致する情報が見つかりませんでした。</p></div>}
        </section>
      ) : null}
    </div>
  );
}
