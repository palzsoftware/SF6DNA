"use client";

import { useEffect, useMemo, useState } from "react";
import { VideoCard } from "@/components/video-card";
import { formatVideoPublishedDate, type VideoSummary } from "@/lib/event-media";
import {
  filterVideos,
  sortVideos,
  VIDEO_CATEGORY_LABELS,
  VIDEO_CONTROL_LABELS,
  VIDEO_LANGUAGE_LABELS,
  VIDEO_LEVEL_LABELS,
  type VideoFilters,
  type VideoSort,
} from "@/lib/video-library";
import { readVideoPreference, VIDEO_FAVORITES_KEY, VIDEO_WATCHED_KEY } from "@/lib/video-preferences";
import styles from "./video-library.module.css";

const EMPTY_FILTERS: VideoFilters = {
  query: "",
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

function FilterGroup({ title, values, selected, labels, unavailable, onToggle }: {
  title: string;
  values: string[];
  selected: Set<string>;
  labels?: Record<string, string>;
  unavailable?: string;
  onToggle: (value: string) => void;
}) {
  return (
    <fieldset className={styles.filter}>
      <legend>{title}</legend>
      {values.length ? (
        <div className={styles.options}>
          {values.map((value) => (
            <label className={styles.option} key={value}>
              <input type="checkbox" checked={selected.has(value)} onChange={() => onToggle(value)} />
              {labels?.[value] ?? value}
            </label>
          ))}
        </div>
      ) : <p className={styles.unavailable}>{unavailable ?? "該当する公開metadataはありません"}</p>}
    </fieldset>
  );
}

export function VideoLibrary({ videos, lockedCharacter }: { videos: VideoSummary[]; lockedCharacter?: string }) {
  const [filters, setFilters] = useState<VideoFilters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<VideoSort>("recommended");
  const [visible, setVisible] = useState(12);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [watched, setWatched] = useState<Set<string>>(new Set());

  function refreshPreferences() {
    setFavorites(readVideoPreference(VIDEO_FAVORITES_KEY));
    setWatched(readVideoPreference(VIDEO_WATCHED_KEY));
  }

  useEffect(() => {
    const frame = window.requestAnimationFrame(refreshPreferences);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const options = useMemo(() => ({
    events: unique(videos.flatMap((video) => video.events)),
    players: unique(videos.flatMap((video) => video.players)),
    characters: unique(videos.flatMap((video) => video.characters)),
    controls: unique(videos.flatMap((video) => video.controlTypes)),
    categories: unique(videos.flatMap((video) => video.categories.length ? video.categories : video.videoType ? [video.videoType] : [])),
    levels: unique(videos.flatMap((video) => video.level === "unknown" ? [] : [video.level])),
    languages: unique(videos.flatMap((video) => video.language ? [video.language] : [])),
    modes: unique(videos.flatMap((video) => {
      const type = video.videoType?.toLowerCase();
      return ["guide", "official_guide"].includes(type ?? "") ? ["guide"] : ["match", "tournament"].includes(type ?? "") ? ["match"] : [];
    })),
  }), [videos]);

  const effectiveFilters = useMemo(() => lockedCharacter
    ? { ...filters, characters: new Set([lockedCharacter]) }
    : filters, [filters, lockedCharacter]);
  const results = useMemo(
    () => sortVideos(filterVideos(videos, effectiveFilters, favorites, watched), sort, favorites, watched),
    [videos, effectiveFilters, favorites, watched, sort],
  );

  function toggle(group: keyof Pick<VideoFilters, "events" | "players" | "characters" | "controls" | "categories" | "levels" | "languages" | "modes" | "preference">, value: string) {
    setFilters((current) => {
      const next = new Set(current[group] as Set<string>);
      if (next.has(value)) next.delete(value); else next.add(value);
      return { ...current, [group]: next } as VideoFilters;
    });
    setVisible(12);
  }

  return (
    <div className={styles.library}>
      <div className={styles.toolbar}>
        <div className={styles.topRow}>
          <label>動画を検索<input value={filters.query} onChange={(event) => { setFilters((current) => ({ ...current, query: event.target.value })); setVisible(12); }} placeholder="例：JP SA2 上級者、翔 試合" /></label>
          <label>並び順<select value={sort} onChange={(event) => setSort(event.target.value as VideoSort)}>
            <option value="recommended">おすすめ順</option><option value="newest">新しい順</option><option value="oldest">古い順</option>
            <option value="view_count" disabled={!videos.some((video) => video.viewCount !== null)}>再生回数順</option>
            <option value="favorite">お気に入り優先</option><option value="unwatched">未視聴優先</option><option value="watched">視聴済み優先</option>
            <option value="shortest" disabled={!videos.some((video) => video.durationSeconds !== null)}>短い順</option>
            <option value="longest" disabled={!videos.some((video) => video.durationSeconds !== null)}>長い順</option>
          </select></label>
        </div>
        <div className={styles.filters}>
          <FilterGroup title="大会・イベント" values={options.events} selected={filters.events} onToggle={(value) => toggle("events", value)} unavailable="大会relationの公開metadata待ち" />
          <FilterGroup title="プレイヤー（1P / 2P）" values={options.players} selected={filters.players} onToggle={(value) => toggle("players", value)} />
          {lockedCharacter ? (
            <fieldset className={styles.filter}><legend>キャラクター</legend><p className={styles.unavailable}>{lockedCharacter}で自動絞り込み中</p></fieldset>
          ) : <FilterGroup title="キャラクター（1P / 2P）" values={options.characters} selected={filters.characters} onToggle={(value) => toggle("characters", value)} />}
          <FilterGroup title="操作タイプ" values={options.controls} selected={filters.controls} labels={VIDEO_CONTROL_LABELS} onToggle={(value) => toggle("controls", value)} unavailable="Classic / Modern metadata待ち" />
          <FilterGroup title="カテゴリ" values={options.categories} selected={filters.categories} labels={VIDEO_CATEGORY_LABELS} onToggle={(value) => toggle("categories", value)} />
          <FilterGroup title="習熟度" values={options.levels} selected={filters.levels} labels={VIDEO_LEVEL_LABELS} onToggle={(value) => toggle("levels", value)} unavailable="初心者 / 中級者 / 上級者 metadata待ち" />
          <FilterGroup title="ガイド / 対戦" values={options.modes} selected={filters.modes} labels={{ guide: "ガイド", match: "対戦" }} onToggle={(value) => toggle("modes", value)} />
          <FilterGroup title="言語" values={options.languages} selected={filters.languages} labels={VIDEO_LANGUAGE_LABELS} onToggle={(value) => toggle("languages", value)} unavailable="日本語 / 英語 / その他 metadata待ち" />
          <FilterGroup title="ライブラリ" values={["favorite", "watched", "unwatched"]} selected={filters.preference} labels={{ favorite: "お気に入り", watched: "視聴済み", unwatched: "未視聴" }} onToggle={(value) => toggle("preference", value)} />
        </div>
        <div className={styles.summary}>
          <span>{results.length}件中 {Math.min(visible, results.length)}件を表示</span>
          <button className={styles.clear} type="button" onClick={() => { setFilters(EMPTY_FILTERS); setSort("recommended"); setVisible(12); }}>条件をクリア</button>
        </div>
      </div>

      {results.length ? (
        <>
          <div className="video-card-grid">
            {results.slice(0, visible).map((video) => <VideoCard video={video} publishedDate={formatVideoPublishedDate(video.publishedAt)} onPreferenceChange={refreshPreferences} key={video.id} />)}
          </div>
          {visible < results.length ? <button className={`button-secondary ${styles.more}`} type="button" onClick={() => setVisible((count) => count + 12)}>さらに12件表示</button> : null}
        </>
      ) : <section className="empty-state"><h2>条件に一致する動画がありません</h2><p>条件を減らすか、検索語を変えてください。</p></section>}
    </div>
  );
}
