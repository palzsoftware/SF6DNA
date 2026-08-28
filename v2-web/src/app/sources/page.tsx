import { listPublicSources } from "@/lib/public-sources";

export const metadata = {
  title: "情報源",
  description: "SF6DNAで使用する公式・一次情報源の一覧です。",
};

export default async function SourcesPage() {
  const sources = await listPublicSources();
  return (
    <div className="site-shell page-stack">
      <section className="hero">
        <p className="eyebrow">SOURCES</p>
        <h1>情報源</h1>
        <p>Public向け一覧ではofficial / primaryに分類した情報源を表示します。攻略ページ個別の補助Sourceは各コンテンツ側で確認できます。</p>
      </section>
      {sources.length ? (
        <section className="search-result-list">
          {sources.map((source) => (
            <a className="search-result" href={source.url} target="_blank" rel="noopener noreferrer" key={source.id}>
              <span className="search-result__type">{source.reliabilityLevel.toUpperCase()} / {source.sourceType}</span>
              <strong>{source.title}</strong>
              <span>{source.publisher ?? "Publisher未設定"}</span>
            </a>
          ))}
        </section>
      ) : (
        <section className="empty-state"><h2>公開できる情報源がありません</h2><p>Supabase未接続時、またはofficial / primary Sourceがない場合は一覧を表示しません。</p></section>
      )}
    </div>
  );
}
