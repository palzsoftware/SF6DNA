import { autoVideoEnabled, getAutoVideos } from "@/lib/auto-youtube-videos";
import { autoVideoFilterNames, autoVideoEnglishNames } from "@/lib/auto-video-filter-names";
import { VIDEO_SEARCH_KINDS, VIDEO_SEARCH_LABELS } from "@/lib/auto-video-search";
import { videoSearchNames, videoSearchQuery, VIDEO_SEARCH_TOPIC_LABELS, VIDEO_SEARCH_RANK_LABELS, VIDEO_SEARCH_LEVEL_LABELS, VIDEO_SEARCH_CONTROL_LABELS, type VideoSearchFilters, type VideoSearchParams } from "@/lib/video-search-filters";
import { AutoVideoResults } from "./auto-video-results";
import styles from "./auto-youtube-videos.module.css";

export function VideoSearchForm({ filters, params }: { filters: VideoSearchFilters; params: VideoSearchParams }) {
  const advancedCount = [filters.kind !== "all", Boolean(filters.topic), Boolean(filters.targetRank), Boolean(filters.level), Boolean(filters.control), filters.language !== "ja"].filter(Boolean).length;
  return <section className={styles.searchPanel} aria-labelledby="video-search-heading">
    <h2 id="video-search-heading">見たい動画を探す</h2>
    <p id="video-query-help">プレイヤー・キャラ・所属チーム・大会名をまとめて検索できます。複数の言葉はスペースで区切ってください。</p>
    <form action="/videos" method="get" className={styles.searchForm}>
      {["playerId", "characterId", "tournamentId", "player"].map(key => typeof params[key] === "string" ? <input key={key} type="hidden" name={key} value={params[key]} /> : null)}
      <div className={styles.searchMainRow}>
        <label>キーワード<input type="search" name="q" maxLength={60} defaultValue={videoSearchQuery(filters)} aria-describedby="video-query-help" placeholder="例：リュウ ときど Crazy Raccoon SFL" /></label>
        <div className={styles.searchActions}>
          <button type="submit">この条件で検索</button>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- Reset uses document navigation to discard stale streamed form state. */}
          <a href="/videos">条件をリセット</a>
        </div>
      </div>
      <details className={styles.advancedFilters}>
        <summary>詳細フィルター{advancedCount ? <span className={styles.filterCount}>{advancedCount}件指定中</span> : null}</summary>
        <div className={styles.advancedGrid}>
      <label>動画の種類<select name="kind" defaultValue={filters.kind}>{VIDEO_SEARCH_KINDS.map(kind => <option key={kind} value={kind}>{VIDEO_SEARCH_LABELS[kind]}</option>)}</select></label>
      <label>座学テーマ<select name="topic" defaultValue={filters.topic ?? ""}><option value="">指定なし</option>{Object.entries(VIDEO_SEARCH_TOPIC_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label>対象ランク・MR<select name="targetRank" defaultValue={filters.targetRank ?? ""}><option value="">指定なし</option>{Object.entries(VIDEO_SEARCH_RANK_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label>習熟度<select name="level" defaultValue={filters.level ?? ""}><option value="">指定なし</option>{Object.entries(VIDEO_SEARCH_LEVEL_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label>操作タイプ<select name="control" defaultValue={filters.control ?? ""}><option value="">指定なし</option>{Object.entries(VIDEO_SEARCH_CONTROL_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label>検索言語<select name="language" defaultValue={filters.language}><option value="ja">日本語優先</option><option value="en">海外動画を探す（英語）</option></select></label>
        </div>
      </details>
    </form>
    <p className={styles.note}>入力・選択した条件はYouTubeの検索語として使います。検索結果の対象ランク・操作タイプ・現行パッチ対応を確認済みにするものではありません。掲載動画の確認済み分類を探す場合は、下の掲載動画の絞り込みをご利用ください。</p>
  </section>;
}
export async function VideoSearchResults({ filters, exact }: {
  filters: VideoSearchFilters; exact: Parameters<typeof autoVideoFilterNames>[0];
}) {
  if (!filters.valid || exact.invalidFilter) return <p role="status">検索条件を確認してください。キーワードは60文字以内で入力できます。</p>;
  const resolved = await autoVideoFilterNames(exact);
  if (resolved === null) return <p role="status">指定された人物・大会の検索条件を確認できません。条件をリセットして名前を入力してください。</p>;
  const translated = filters.language === "en" ? await autoVideoEnglishNames(resolved, exact.characterId) : resolved;
  const names = videoSearchNames(filters, translated);
  if (!names) return <p role="status">検索条件が長すぎます。名前や大会名を短くしてください。</p>;
  const result = autoVideoEnabled() ? await getAutoVideos(names, filters.kind, filters.language) : { state: "UNAVAILABLE" as const, items: [] };
  return <AutoVideoResults key={JSON.stringify([names, filters.kind, filters.language])} result={result} names={names}
    selectedKind={filters.kind} language={filters.language} hideKindFilters hidePlayerSearch />;
}
