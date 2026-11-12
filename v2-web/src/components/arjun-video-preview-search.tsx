"use client";

import { useMemo, useState } from "react";
import { VideoCard } from "@/components/video-card";
import type { VideoSummary } from "@/lib/event-media";
import { useOwnedVideoPreferences } from "@/lib/use-owned-video-preferences";
import styles from "./arjun-player-video-local-preview.module.css";

type SortOrder = "newest" | "oldest" | "title";
const types = [
  ["all", "すべて"],
  ["guide", "攻略"],
  ["counter", "対策"],
  ["match", "対戦"],
] as const;

function publishedTime(video: VideoSummary): number | null {
  if (!video.publishedAt) return null;
  const time = Date.parse(video.publishedAt);
  return Number.isFinite(time) ? time : null;
}

export function ArjunVideoPreviewSearch({ videos }: { videos: VideoSummary[] }) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [unwatchedOnly, setUnwatchedOnly] = useState(false);
  // Reuse the exact Preview-local preference store used by each VideoCard.
  const preferences = useOwnedVideoPreferences(true);
  const datesAvailable = videos.some(video => publishedTime(video) !== null);
  const results = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("ja");
    const filtered = videos.map((video, index) => ({ video, index })).filter(({ video }) =>
      (kind === "all" || video.videoType === kind) &&
      (!q || [video.title, video.channelName, video.description, video.videoType]
        .filter((value): value is string => typeof value === "string")
        .some(value => value.toLocaleLowerCase("ja").includes(q))) &&
      (!favoriteOnly || (preferences.status === "ready" && preferences.favorites.has(video.id))) &&
      (!unwatchedOnly || (preferences.status === "ready" && !preferences.watched.has(video.id)))
    );
    filtered.sort((a, b) => {
      if (sortOrder === "title") {
        return a.video.title.localeCompare(b.video.title, "ja") || a.index - b.index;
      }
      const aTime = publishedTime(a.video);
      const bTime = publishedTime(b.video);
      // Unknown dates remain last for either date order; original source order is stable.
      if (aTime === null && bTime === null) return a.index - b.index;
      if (aTime === null) return 1;
      if (bTime === null) return -1;
      return (sortOrder === "newest" ? bTime - aTime : aTime - bTime) || a.index - b.index;
    });
    return filtered.map(({ video }) => video);
  }, [videos, query, kind, sortOrder, favoriteOnly, unwatchedOnly,
      preferences.status, preferences.favorites, preferences.watched]);
  return <div>
    <div className={styles.videoSearch}>
      <label htmlFor="arjun-video-qa-search">動画を検索（タイトル・配信者・内容）</label>
      <input id="arjun-video-qa-search" type="search" value={query}
        onChange={event => setQuery(event.target.value)} placeholder="例：かずのこ・対策・コンボ" />
      <span className={styles.filterLabel}>動画の種類</span>
      <div className={styles.videoFilters} role="group" aria-label="動画の種類">
        {types.map(([value, label]) => <button key={value} type="button" aria-pressed={kind === value}
          onClick={() => setKind(value)}>{label}</button>)}
      </div>
      <label htmlFor="arjun-video-qa-sort">並び順</label>
      <select id="arjun-video-qa-sort" className={styles.videoSort} value={sortOrder}
        onChange={event => setSortOrder(event.target.value as SortOrder)}>
        <option value="newest">投稿日が新しい順</option>
        <option value="oldest">投稿日が古い順</option>
        <option value="title">タイトル順</option>
      </select>
      {!datesAvailable ? <p role="note">現在の49件は投稿日が未登録のため、投稿日順を選んでも登録順で表示します。投稿日が確認された動画から日付順に並びます。</p> : null}
      <div className={styles.videoChecks} role="group" aria-label="お気に入りと視聴状態">
        <label><input type="checkbox" checked={favoriteOnly} disabled={preferences.status !== "ready"}
          onChange={event => setFavoriteOnly(event.target.checked)} />お気に入りのみ</label>
        <label><input type="checkbox" checked={unwatchedOnly} disabled={preferences.status !== "ready"}
          onChange={event => setUnwatchedOnly(event.target.checked)} />未視聴のみ</label>
      </div>
      {preferences.status !== "ready" ? <p role="status">{preferences.message}</p> : null}
      <p role="status">検索結果 {results.length}件 ／ 候補総数 {videos.length}件</p>
    </div>
    {results.length ? <div className={styles.videos} data-arjun-video-candidate-count={videos.length}>
      {results.map(video => <VideoCard key={video.id} video={video} publishedDate={null}
        previewCandidate previewLocalOnly onPreferenceChange={preferences.refresh} />)}
    </div> : <p className={styles.empty}>一致する動画候補はありません。</p>}
  </div>;
}
