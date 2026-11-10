"use client";

import { useId, useMemo, useState } from "react";
import { VideoCard } from "@/components/video-card";
import { formatVideoPublishedDate, type VideoSummary } from "@/lib/event-media";
import {
  filterVideos,
  videoContentCategories,
  videoEntityOptions,
  videoInitialPlayerIds,
  sortVideos,
  VIDEO_CATEGORY_LABELS,
  VIDEO_CONTROL_LABELS,
  VIDEO_LANGUAGE_LABELS,
  VIDEO_LEVEL_LABELS,
  type VideoFilters,
  type VideoSort,
} from "@/lib/video-library";
import { applyReviewedVideoMetadata, videoLearningMetadata, VIDEO_LEARNING_TOPIC_LABELS, VIDEO_TARGET_RANK_LABELS } from "@/lib/video-learning";
import { PUBLISHED_VIDEO_LEARNING, type VideoLearningAnnotation } from "@/lib/video-learning-registry";
import { useOwnedVideoPreferences } from "@/lib/use-owned-video-preferences";
import styles from "./video-library.module.css";

const VIDEO_MODE_LABELS: Record<string, string> = { guide: "解説・講座", match: "対戦・大会" };
const VIDEO_PREFERENCE_LABELS: Record<string, string> = { favorite: "お気に入り", watched: "視聴済み", unwatched: "未視聴" };

const EMPTY_FILTERS: VideoFilters = {
  query: "",
  learningTopics: new Set(),
  targetRanks: new Set(),
  events: new Set(),
  players: new Set(),
  characters: new Set(),
  controls: new Set(),
  categories: new Set(),
  levels: new Set(),
  languages: new Set(),
  modes: new Set(),
  preference: new Set(),
};

function unique(values: string[]) { return [...new Set(values)].sort((a, b) => a.localeCompare(b, "ja")); }

function FilterGroup({ title, values, selected, labels, unavailable, disabled = false, onToggle }: {
  title: string;
  values: string[];
  selected: Set<string>;
  labels?: Record<string, string>;
  unavailable?: string;
  disabled?: boolean;
  onToggle: (value: string) => void;
}) {
  return (
    <details className={styles.filter}>
      <summary>{title}{selected.size ? `（${selected.size}）` : ""}</summary>
      <fieldset className={styles.filterChoices}>
      <legend className={styles.visuallyHidden}>{title}</legend>
      {values.length ? (
        <div className={styles.options}>
          {values.map((value) => (
            <label className={styles.option} key={value}>
              <input type="checkbox" disabled={disabled} checked={selected.has(value)} onChange={() => onToggle(value)} />
              {labels?.[value] ?? value}
            </label>
          ))}
        </div>
      ) : <p className={styles.unavailable}>{unavailable ?? "この条件で選べる項目はまだありません。"}</p>}
    </fieldset>
    </details>
  );
}

export function VideoLibrary({ videos: suppliedVideos, lockedCharacter, initialPlayer, learningRecords = PUBLISHED_VIDEO_LEARNING, previewCandidates = false, initialQuery = "", hideSearchInput = false, listingOnly = false, initialSort = "recommended", initialPreviewKind = "all", initialPreviewPlayer = "all" }: { videos: VideoSummary[]; lockedCharacter?: string; initialPlayer?: string | null; learningRecords?: readonly VideoLearningAnnotation[]; previewCandidates?: boolean; initialQuery?: string; hideSearchInput?: boolean; listingOnly?: boolean; initialSort?: VideoSort; initialPreviewKind?: string; initialPreviewPlayer?: string }) {
  const videos = useMemo(() => suppliedVideos.map(video => applyReviewedVideoMetadata(video, learningRecords)), [suppliedVideos, learningRecords]);
  const panelId = useId();
  const scopeId = useId();
  const [filters, setFilters] = useState<VideoFilters>(() => ({
    ...EMPTY_FILTERS,
    query: initialQuery,
    players: initialPlayer ? new Set(videoInitialPlayerIds(videos, initialPlayer)) : new Set(),
  }));
  const [sort, setSort] = useState<VideoSort>(initialSort);
  const [previewKind, setPreviewKind] = useState(initialPreviewKind);
  const [previewPlayer, setPreviewPlayer] = useState(initialPreviewPlayer);
  const previewPlayers = useMemo(() => unique(videos.flatMap(video => video.players)), [videos]);
  const previewFiltered = useMemo(() => !previewCandidates ? videos : videos.filter(video =>
    (previewKind === "all" || video.videoType === previewKind) &&
    (previewPlayer === "all" || video.players.includes(previewPlayer))),
    [videos, previewCandidates, previewKind, previewPlayer]);
  const [visible, setVisible] = useState(24);
  const preferences = useOwnedVideoPreferences(previewCandidates);
  const preferenceReady = preferences.status === "ready";
  const favorites = useMemo(() => new Set(preferences.favorites), [preferences.favorites]);
  const watched = useMemo(() => new Set(preferences.watched), [preferences.watched]);
  const preferenceWaiting = !preferenceReady && (filters.preference.size > 0 || ["favorite", "unwatched", "watched"].includes(sort));
  const [filtersOpen, setFiltersOpen] = useState(false);

  const refreshPreferences = preferences.refresh;

  const options = useMemo(() => ({
    learningTopics: unique(videos.flatMap(video => videoLearningMetadata(video, learningRecords).topics)),
    targetRanks: unique(videos.flatMap(video => videoLearningMetadata(video, learningRecords).targetRanks)),
    events: videoEntityOptions(videos, "tournaments"),
    players: videoEntityOptions(videos, "players"),
    characters: videoEntityOptions(videos, "characters"),
    controls: unique(videos.flatMap((video) => video.controlTypes)),
    categories: unique(videos.flatMap(videoContentCategories)),
    levels: unique(videos.flatMap((video) => video.level === "unknown" ? [] : [video.level])),
    languages: unique(videos.flatMap((video) => video.language ? [video.language] : [])),
    modes: unique(videos.flatMap((video) => {
      const type = video.videoType?.toLowerCase();
      return ["guide", "official_guide", "theory"].includes(type ?? "") ? ["guide"] : ["match", "tournament"].includes(type ?? "") ? ["match"] : [];
    })),
  }), [videos, learningRecords]);

  const effectiveFilters = useMemo(() => lockedCharacter
    ? { ...filters, characters: new Set(options.characters.some(ref => ref.label === lockedCharacter) ? options.characters.filter(ref => ref.label === lockedCharacter).map(ref => ref.id) : [lockedCharacter]) }
    : filters, [filters, lockedCharacter, options.characters]);
  const results = useMemo(
    () => preferenceWaiting ? [] : sortVideos(filterVideos(previewFiltered, effectiveFilters, favorites, watched, learningRecords), sort, favorites, watched),
    [previewFiltered, effectiveFilters, favorites, watched, sort, preferenceWaiting, learningRecords],
  );
  const activeFilterCount = useMemo(() => (
    Number(Boolean(filters.query.trim())) + filters.events.size + filters.players.size + (lockedCharacter ? 0 : filters.characters.size) +
    filters.controls.size + filters.categories.size + filters.levels.size +
    filters.languages.size + filters.modes.size + filters.preference.size + (filters.learningTopics?.size ?? 0) + (filters.targetRanks?.size ?? 0)
  ), [filters, lockedCharacter]);

  const activeSelections = [
    ...[...(filters.learningTopics ?? [])].map(value => ({ group: "learningTopics" as const, value, label: `座学：${VIDEO_LEARNING_TOPIC_LABELS[value] ?? value}` })),
    ...[...(filters.targetRanks ?? [])].map(value => ({ group: "targetRanks" as const, value, label: `対象ランク・MR：${VIDEO_TARGET_RANK_LABELS[value] ?? value}` })),
    ...([...filters.events].map(value => ({ group: "events" as const, value, label: `大会：${options.events.find(ref => ref.id === value)?.label ?? "確認中"}` }))),
    ...([...filters.players].map(value => ({ group: "players" as const, value, label: `プレイヤー：${options.players.find(ref => ref.id === value)?.label ?? initialPlayer ?? "確認中"}` }))),
    ...(!lockedCharacter ? [...filters.characters].map(value => ({ group: "characters" as const, value, label: `キャラ：${options.characters.find(ref => ref.id === value)?.label ?? value}` })) : []),
    ...([...filters.controls].map(value => ({ group: "controls" as const, value, label: `操作タイプ：${VIDEO_CONTROL_LABELS[value] ?? value}` }))),
    ...([...filters.categories].map(value => ({ group: "categories" as const, value, label: `内容・技術：${VIDEO_CATEGORY_LABELS[value] ?? value}` }))),
    ...([...filters.levels].map(value => ({ group: "levels" as const, value, label: `習熟度：${VIDEO_LEVEL_LABELS[value] ?? value}` }))),
    ...([...filters.languages].map(value => ({ group: "languages" as const, value, label: `言語：${VIDEO_LANGUAGE_LABELS[value] ?? value}` }))),
    ...([...filters.modes].map(value => ({ group: "modes" as const, value, label: `動画の種類：${VIDEO_MODE_LABELS[value] ?? value}` }))),
    ...([...filters.preference].map(value => ({ group: "preference" as const, value, label: `ライブラリ：${VIDEO_PREFERENCE_LABELS[value] ?? value}` }))),
  ];

  function clearFilters() {
    setFilters({ ...EMPTY_FILTERS, query: initialQuery });
    setSort("recommended");
    setPreviewKind("all");
    setPreviewPlayer("all");
    setVisible(24);
  }

  function toggle(group: keyof Pick<VideoFilters, "events" | "players" | "characters" | "controls" | "categories" | "levels" | "languages" | "modes" | "preference" | "learningTopics" | "targetRanks">, value: string) {
    setFilters((current) => {
      const next = new Set(current[group] as Set<string>);
      if (next.has(value)) next.delete(value); else next.add(value);
      return { ...current, [group]: next } as VideoFilters;
    });
    setVisible(24);
  }

  return (
    <div className={`${styles.library} experience-video-library`}>
      {!listingOnly ? <div className={styles.toolbar}>
        {previewCandidates ? <div className={styles.previewFilters} aria-label="候補動画の絞り込み">
          <label>動画の種類<select aria-label="動画種類で絞り込み" value={previewKind} onChange={event => { setPreviewKind(event.target.value); setVisible(24); }}>
            <option value="all">すべて</option><option value="guide">解説・コンボ</option><option value="counter">このキャラへの対策</option><option value="match">対戦・大会</option>
          </select></label>
          <label>使用プレイヤー（タイトル等の候補）<select aria-label="使用プレイヤーで絞り込み" value={previewPlayer} onChange={event => { setPreviewPlayer(event.target.value); setVisible(24); }}>
            <option value="all">全プレイヤー</option>{previewPlayers.map(player => <option key={player} value={player}>{player}</option>)}
          </select></label>
        </div> : null}
        <div className={styles.topRow}>
          {!hideSearchInput ? <label>掲載動画を検索<input type="search" aria-describedby={scopeId} value={filters.query} onChange={(event) => { setFilters((current) => ({ ...current, query: event.target.value })); setVisible(24); }} placeholder="例：ダイヤ帯 モダン、初心者、座学 MR1600" /></label> : null}
          <div className={styles.sortControls}>
          <button className={styles.clear} type="button" onClick={clearFilters}>条件をクリア</button>
          <label>並び順<select value={sort} onChange={(event) => setSort(event.target.value as VideoSort)}>
            <option value="recommended">おすすめ順</option><option value="newest">新しい順</option><option value="oldest">古い順</option>
            <option value="view_count" disabled={!videos.some((video) => video.viewCount !== null)}>再生回数順</option>
            <option value="favorite" disabled={!preferenceReady}>お気に入り優先</option><option value="unwatched" disabled={!preferenceReady}>未視聴優先</option><option value="watched" disabled={!preferenceReady}>視聴済み優先</option>
            <option value="shortest" disabled={!videos.some((video) => video.durationSeconds !== null)}>短い順</option>
            <option value="longest" disabled={!videos.some((video) => video.durationSeconds !== null)}>長い順</option>
          </select></label>
          </div>
        </div>
        <p id={scopeId} className={styles.searchScope}>{previewCandidates ? "Preview用の検証候補を含みます。お気に入りと視聴済みはPreview専用のブラウザ保存を使用します。出演・使用キャラ名や公開日は未確認の場合があります。" : "現在登録されている公開動画を検索します。"}YouTube全体の検索ではありません。大会の年度は、確認済みの大会名にある場合のみ絞り込めます。座学はテーマ別、対象ランク・MRは講座の対象者として確認した情報で絞り込みます。ダイヤ帯・プラチナ帯、初心者、モダンなども組み合わせて検索できます。分類が未確認の動画は、その条件に含めません。</p>
        <button
          className={styles.filterToggle}
          type="button"
          aria-expanded={filtersOpen}
          aria-controls={panelId}
          onClick={() => setFiltersOpen((open) => !open)}
        >
          絞り込み{activeFilterCount ? `（${activeFilterCount}）` : ""}
          <span aria-hidden="true">{filtersOpen ? "閉じる −" : "開く ＋"}</span>
        </button>
        {activeFilterCount ? <div className={styles.activeSummary} aria-live="polite">
          <span>{activeFilterCount}件の条件を選択中</span>
        </div> : null}
        {activeSelections.length || (!hideSearchInput && filters.query) ? <div className={styles.selectedConditions} aria-label="選択中の検索条件">
          {!hideSearchInput && filters.query ? <button type="button" onClick={() => { setFilters(current => ({ ...current, query: "" })); setVisible(24); }} aria-label="キーワードを解除">キーワード：{filters.query} ×</button> : null}
          {activeSelections.map(item => <button type="button" key={`${item.group}:${item.value}`} onClick={() => toggle(item.group, item.value)} aria-label={`${item.label}を解除`}>{item.label} ×</button>)}
        </div> : null}
        <div className={`${styles.filters} ${filtersOpen ? styles.filtersOpen : ""}`} id={panelId}>
          <FilterGroup title="大会・イベント" values={options.events.map(ref => ref.id)} labels={Object.fromEntries(options.events.map(ref => [ref.id, ref.label]))} selected={filters.events} onToggle={(value) => toggle("events", value)} unavailable="大会との関連を確認できた動画はまだありません。" />
          <FilterGroup title="プレイヤー（1P / 2P）" values={options.players.map(ref => ref.id)} labels={Object.fromEntries(options.players.map(ref => [ref.id, ref.label]))} selected={filters.players} onToggle={(value) => toggle("players", value)} unavailable="出演を確認できた動画はまだありません。" />
          {lockedCharacter ? (
            <fieldset className={styles.filter}><legend>キャラクター</legend><p className={styles.unavailable}>{lockedCharacter}で自動絞り込み中</p></fieldset>
          ) : <FilterGroup title="キャラクター（1P / 2P）" values={options.characters.map(ref => ref.id)} labels={Object.fromEntries(options.characters.map(ref => [ref.id, ref.label]))} selected={filters.characters} onToggle={(value) => toggle("characters", value)} />}
          <FilterGroup title="操作タイプ" values={options.controls} selected={filters.controls} labels={VIDEO_CONTROL_LABELS} onToggle={(value) => toggle("controls", value)} unavailable="クラシック・モダンの情報は順次追加予定です。" />
          <FilterGroup title="学びたいテーマ（座学）" values={options.learningTopics} selected={filters.learningTopics ?? new Set()} labels={VIDEO_LEARNING_TOPIC_LABELS} onToggle={(value) => toggle("learningTopics", value)} unavailable="テーマを確認できた座学動画はまだありません。" />
          <FilterGroup title="対象ランク・MR" values={options.targetRanks} selected={filters.targetRanks ?? new Set()} labels={VIDEO_TARGET_RANK_LABELS} onToggle={(value) => toggle("targetRanks", value)} unavailable="講座の対象ランク・MRを確認できた動画はまだありません。配信者のMRからは分類しません。" />
          <FilterGroup title="内容・技術" values={options.categories} selected={filters.categories} labels={VIDEO_CATEGORY_LABELS} onToggle={(value) => toggle("categories", value)} />
          <FilterGroup title="習熟度" values={options.levels} selected={filters.levels} labels={VIDEO_LEVEL_LABELS} onToggle={(value) => toggle("levels", value)} unavailable="難易度別の絞り込みは順次追加予定です。" />
          <FilterGroup title="動画の種類" values={options.modes} selected={filters.modes} labels={VIDEO_MODE_LABELS} onToggle={(value) => toggle("modes", value)} />
          <FilterGroup title="言語" values={options.languages} selected={filters.languages} labels={VIDEO_LANGUAGE_LABELS} onToggle={(value) => toggle("languages", value)} unavailable="言語別の絞り込みは順次追加予定です。" />
          <FilterGroup title="ライブラリ" values={["favorite", "watched", "unwatched"]} selected={filters.preference} disabled={!preferenceReady} labels={VIDEO_PREFERENCE_LABELS} onToggle={(value) => toggle("preference", value)} />
        </div>
        <div className={styles.summary}>
          <span role="status" aria-live="polite">{preferenceWaiting ? preferences.message : `${results.length}件中 ${Math.min(visible, results.length)}件を表示`}</span>

        </div>
      </div> : <p role="status" aria-live="polite">{preferenceWaiting ? preferences.message : `${results.length}件中 ${Math.min(visible, results.length)}件を表示`}</p>}

      {preferences.message && !preferenceWaiting ? <p role="status">{preferences.message}</p> : null}
      {preferenceWaiting ? <section className="empty-state" role="status"><p>{preferences.message}</p></section> : results.length ? (
        <>
          <div className="video-card-grid">
            {results.slice(0, visible).map((video) => <VideoCard video={video} publishedDate={formatVideoPublishedDate(video.publishedAt)} onPreferenceChange={refreshPreferences} previewCandidate={previewCandidates && video.id.startsWith("preview-")} previewLocalOnly={previewCandidates} key={video.id} />)}
          </div>
          {visible < results.length ? <button className={`button-secondary ${styles.more}`} type="button" onClick={() => setVisible((count) => count + 24)}>さらに24件表示</button> : null}
        </>
      ) : <section className="empty-state"><h2>現在登録されている公開動画に該当するものがありません</h2><p>条件を減らすか、検索語を変えてください。確認できていないプレイヤー・大会・対象MR情報は検索対象に含めません。座学やMRの条件は、分類情報が登録された動画のみが対象です。</p></section>}
    </div>
  );
}
