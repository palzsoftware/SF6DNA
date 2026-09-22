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
        <p>SF6DNAが参照している公式情報・一次情報をまとめています。攻略ページで参照した情報は、それぞれのページからも開けます。</p>
      </section>
      <section className="card-grid" aria-label="情報の公開方針">
        <article className="info-panel"><h2>公式情報・一次情報</h2><p>掲載する情報には、できる限り参照先を添えます。</p></article>
        <article className="info-panel"><h2>ゲーム内での確認</h2><p>実機での確認が必要な内容は、確認が終わるまで推測で補いません。</p></article>
        <article className="info-panel"><h2>アップデート後の確認</h2><p>パッチで変わった可能性がある情報は、対象期間と内容を確かめてから掲載します。</p></article>
        <article className="info-panel"><h2>外部リンク</h2><p>情報源を開くと外部サイトへ移動します。リンク先の利用条件やプライバシー方針も確認してください。</p></article>
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
        <section className="empty-state"><h2>情報源を表示できません</h2><p>時間をおいて、もう一度ページを開いてください。</p></section>
      )}
    </div>
  );
}
