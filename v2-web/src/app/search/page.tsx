import Link from "next/link";
import { searchAcrossContent } from "@/lib/search";
import type { SearchResultItem } from "@/types/search";
import styles from "./search.module.css";

export const metadata = { title: "検索" };

const TYPE_LABELS: Record<string, string> = {
  character: "キャラクター",
  player: "プレイヤー",
  video: "動画",
};

const TYPE_ORDER = [
  "character",
  "player",
  "video",
] as const;

const QUICK_START = [
  ["CHARACTER", "キャラクターから探す", "キャラクターの基本情報を確認", "/characters"],
  ["PLAYER", "プレイヤーから探す", "使用キャラクターや選手情報を確認", "/players"],
  ["VIDEO", "動画から探す", "関連動画を確認", "/videos"],
] as const;

function one(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

function typeHref(query: string, type: string) {
  const params = new URLSearchParams({ q: query });
  if (type !== "all") params.set("type", type);
  return `/search?${params.toString()}`;
}

function groupResults(results: SearchResultItem[]) {
  return TYPE_ORDER.flatMap((type) => {
    const items = results.filter((item) => item.type === type);
    return items.length ? [{ type, items }] : [];
  });
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; type?: string | string[] }>;
}) {
  const params = await searchParams;
  const q = one(params.q).slice(0, 100);
  const selectedType = one(params.type) || "all";
  const results = q ? await searchAcrossContent(q) : [];
  const counts = new Map<string, number>();
  for (const result of results) counts.set(result.type, (counts.get(result.type) ?? 0) + 1);
  const visibleResults = selectedType === "all" ? results : results.filter((item) => item.type === selectedType);
  const groups = groupResults(visibleResults);

  return (
    <div className={`site-shell page-stack ${styles.searchPage}`}>
      <section className={styles.searchHero}>
        <p className="eyebrow">SEARCH</p>
        <h1>必要な情報へ、最短で。</h1>
        <p>キャラクター、プレイヤー、動画の公開情報を横断して検索します。</p>
      </section>

      <form className={styles.searchBox} action="/search">
        <input
          name="q"
          defaultValue={q}
          placeholder="例: JP / Ryu / Nemo"
          aria-label="検索キーワード"
          autoComplete="off"
        />
        <button type="submit">検索</button>
      </form>

      {!q ? (
        <section className={styles.quickStart}>
          <div className="section-heading">
            <h2>目的から開く</h2>
            <p>検索語が決まっていない場合は、やりたいことから選べます。</p>
          </div>
          <div className={styles.quickGrid}>
            {QUICK_START.map(([code, title, description, href]) => (
              <Link className={styles.quickCard} href={href} key={href}>
                <span>{code}</span>
                <strong>{title}</strong>
                <small>{description}</small>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <>
          <section>
            <div className={styles.resultHead}>
              <div>
                <h2>「{q}」</h2>
                <p>{results.length}件の公開データが一致</p>
              </div>
              {selectedType !== "all" ? <Link className="text-link" href={typeHref(q, "all")}>すべて表示</Link> : null}
            </div>

            {results.length ? (
              <div className={styles.typeFilters} aria-label="検索結果の種類">
                <Link className={selectedType === "all" ? styles.typeFilterActive : styles.typeFilter} href={typeHref(q, "all")}>
                  すべて <span>{results.length}</span>
                </Link>
                {TYPE_ORDER.map((type) => {
                  const count = counts.get(type) ?? 0;
                  if (!count) return null;
                  return (
                    <Link
                      className={selectedType === type ? styles.typeFilterActive : styles.typeFilter}
                      href={typeHref(q, type)}
                      key={type}
                    >
                      {TYPE_LABELS[type] ?? type} <span>{count}</span>
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </section>

          {visibleResults.length ? (
            <div className={styles.groups}>
              {groups.map((group) => (
                <section className={styles.group} key={group.type}>
                  <div className={styles.groupHead}>
                    <h3>{TYPE_LABELS[group.type] ?? group.type}</h3>
                    <span>{group.items.length}件</span>
                  </div>
                  <div className={styles.resultList}>
                    {group.items.map((item) => (
                      <Link className={styles.result} href={item.href} key={`${item.type}:${item.id}`}>
                        <div className={styles.resultMain}>
                          <div className={styles.resultTitle}>
                            <strong>{item.title}</strong>
                            {item.matchedBy === "alias" ? <span className={styles.aliasBadge}>別名一致</span> : null}
                          </div>
                          {item.subtitle ? <p>{item.subtitle}</p> : null}
                        </div>
                        <span className={styles.open}>開く →</span>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <section className={`empty-state ${styles.emptyHelp}`}>
              <h2>{results.length ? "この種類では一致する情報がありません" : "一致する公開データが見つかりません"}</h2>
              <ul>
                <li>キャラクター名やプレイヤー名の一部でも検索できます。</li>
                <li>キャラクター名だけで検索してから詳細ページへ進む方法もあります。</li>
                <li>未公開データは通常検索には表示されません。</li>
              </ul>
              {results.length ? <Link className="inline-button button-secondary" href={typeHref(q, "all")}>すべての種類を見る</Link> : null}
            </section>
          )}
        </>
      )}
    </div>
  );
}
