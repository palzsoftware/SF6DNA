"use client";

import { useMemo, useState } from "react";
import { VideoCard } from "@/components/video-card";
import type { VideoSummary } from "@/lib/event-media";
import styles from "./arjun-player-video-local-preview.module.css";

const types = [
  ["all", "すべて"],
  ["guide", "解説"],
  ["match", "対戦"],
  ["counter", "対策"],
] as const;

export function ArjunVideoPreviewSearch({ videos }: { videos: VideoSummary[] }) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<string>("all");
  const results = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("ja");
    return videos.filter(video => (kind === "all" || video.videoType === kind) &&
      (!q || [video.title, video.channelName, video.description, video.videoType]
        .filter((value): value is string => typeof value === "string")
        .some(value => value.toLocaleLowerCase("ja").includes(q))));
  }, [videos, query, kind]);
  return <div>
    <div className={styles.videoSearch}>
      <label htmlFor="arjun-video-qa-search">動画を検索（タイトル・配信者・内容）</label>
      <input id="arjun-video-qa-search" type="search" value={query}
        onChange={event => setQuery(event.target.value)} placeholder="例：かずのこ・対策・コンボ" />
      <div className={styles.videoFilters} role="group" aria-label="動画の種類">
        {types.map(([value, label]) => <button key={value} type="button" aria-pressed={kind === value}
          onClick={() => setKind(value)}>{label}</button>)}
      </div>
      <p role="status">検索結果 {results.length}件 ／ 候補総数 {videos.length}件</p>
    </div>
    {results.length ? <div className={styles.videos} data-arjun-video-candidate-count={videos.length}>
      {results.map(video => <VideoCard key={video.id} video={video} publishedDate={null}
        previewCandidate previewLocalOnly />)}
    </div> : <p className={styles.empty}>一致する動画候補はありません。</p>}
  </div>;
}
