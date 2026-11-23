import { notFound } from "next/navigation";
import { publicPageMetadata } from "@/lib/public-page-metadata";
import { isGlossaryIndexVisible, listPublishedGlossary } from "@/lib/public-glossary";

export const dynamic = "force-dynamic";

// Preview-only index: keep it out of search engines until a public release is approved.
export const metadata = publicPageMetadata("/glossary", {
  title: "用語集",
  description: "SF6DNAに掲載しているストリートファイター6の用語を一覧で確認できます。",
}, false);

export default async function GlossaryIndexPage() {
  if (!isGlossaryIndexVisible(process.env.VERCEL_ENV ?? process.env.NODE_ENV)) notFound();
  const { ok, items } = await listPublishedGlossary();
  return (
    <div className="site-shell page-stack experience-reference">
      <section className="hero">
        <p className="eyebrow">GLOSSARY</p>
        <h1>用語集</h1>
        <p>掲載している用語を一覧で確認できます。用語を選ぶと説明を表示します。</p>
      </section>
      {items.length ? (
        <section className="search-result-list" aria-label={`用語一覧（${items.length}件）`}>
          {items.map((item) => (
            <a className="search-result" href={`/glossary/${encodeURIComponent(item.slug)}`} key={item.id}>
              <strong>{item.term}</strong>
              {item.shortDefinition ? <span>{item.shortDefinition}</span> : null}
            </a>
          ))}
        </section>
      ) : ok ? (
        <section className="empty-state"><h2>掲載中の用語はまだありません</h2><p>用語の説明は確認が済んだものから順に掲載します。</p></section>
      ) : (
        <section className="empty-state"><h2>用語集を表示できません</h2><p>時間をおいて、もう一度ページを開いてください。</p></section>
      )}
    </div>
  );
}
