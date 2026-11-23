import { notFound } from "next/navigation";
import { publicPageMetadata } from "@/lib/public-page-metadata";
import { formatTournamentPeriod, isTournamentIndexVisible, listPublishedTournaments } from "@/lib/public-tournaments";

export const dynamic = "force-dynamic";

// Preview-only index: keep it out of search engines until a public release is approved.
export const metadata = publicPageMetadata("/tournaments", {
  title: "大会一覧",
  description: "SF6DNAに掲載しているストリートファイター6の大会を一覧で確認できます。",
}, false);

export default async function TournamentIndexPage() {
  if (!isTournamentIndexVisible(process.env.VERCEL_ENV ?? process.env.NODE_ENV)) notFound();
  const { ok, items } = await listPublishedTournaments();
  return (
    <div className="site-shell page-stack experience-reference">
      <section className="hero">
        <p className="eyebrow">TOURNAMENTS</p>
        <h1>大会一覧</h1>
        <p>掲載している大会を開催日の新しい順に表示します。大会を選ぶと詳細を表示します。</p>
      </section>
      {items.length ? (
        <section className="search-result-list" aria-label={`大会一覧（${items.length}件）`}>
          {items.map((item) => {
            const period = formatTournamentPeriod(item.startDate, item.endDate);
            const meta = [period ?? "開催日確認中", item.region, item.seriesName].filter(Boolean).join("・");
            return (
              <a className="search-result" href={`/tournaments/${encodeURIComponent(item.slug)}`} key={item.id}>
                <strong>{item.name}</strong>
                <span>{meta}</span>
              </a>
            );
          })}
        </section>
      ) : ok ? (
        <section className="empty-state"><h2>掲載中の大会はまだありません</h2><p>大会情報は確認が済んだものから順に掲載します。</p></section>
      ) : (
        <section className="empty-state"><h2>大会一覧を表示できません</h2><p>時間をおいて、もう一度ページを開いてください。</p></section>
      )}
    </div>
  );
}
