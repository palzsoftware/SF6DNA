export const dynamic = "force-dynamic";

import { listPublicSources } from "@/lib/public-sources";
import { localizeSourceType } from "@/lib/detail-localization";

export const metadata = {
  title: "情報源",
  description: "SF6DNAで使用する公式・一次情報源の一覧です。",
};

const RELIABILITY_LABELS: Record<string, string> = {
  official: "公式情報",
  primary: "一次情報",
};

function sourceKindLabel(reliabilityLevel: string, sourceType: string) {
  return RELIABILITY_LABELS[reliabilityLevel] ?? localizeSourceType(sourceType);
}

function sourceProviderLabel(publisher: string | null, url: string) {
  if (publisher?.trim()) return publisher.trim();
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "提供元情報なし";
  }
}

export default async function SourcesPage() {
  const sources = await listPublicSources();
  return (
    <div className="site-shell page-stack">
      <section className="hero">
        <p className="eyebrow">SOURCES</p>
        <h1>情報源</h1>
        <p>SF6DNAで参照している公式情報・一次情報を一覧で確認できます。各攻略ページで使用した補助情報は、それぞれのページから確認できます。</p>
      </section>
      {sources.length ? (
        <section className="search-result-list">
          {sources.map((source) => (
            <a className="search-result" href={source.url} target="_blank" rel="noopener noreferrer" key={source.id}>
              <span className="search-result__type">{sourceKindLabel(source.reliabilityLevel, source.sourceType)}</span>
              <strong>{source.title}</strong>
              <span>{sourceProviderLabel(source.publisher, source.url)}</span>
            </a>
          ))}
        </section>
      ) : (
        <section className="empty-state"><h2>表示できる情報源がありません</h2><p>情報源を取得できない場合は、未確認の情報源を代わりに表示しません。</p></section>
      )}
    </div>
  );
}
