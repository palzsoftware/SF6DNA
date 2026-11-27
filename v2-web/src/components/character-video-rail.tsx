"use client";

import { useId, useState } from "react";
import { VideoCard } from "./video-card";
import { formatVideoPublishedDate, type VideoSummary } from "@/lib/event-media";
import { VIDEO_CATEGORY_LABELS } from "@/lib/video-library";
import styles from "./character-video-rail.module.css";

export type CharacterVideoRailGroup = { key: string; label: string; videos: VideoSummary[] };

const searchable = (video: VideoSummary) => [video.title, video.channelName, ...video.players, ...video.events,
  ...(video.categories ?? []).map(item => VIDEO_CATEGORY_LABELS[item] ?? item)].filter(Boolean).join(" ").toLowerCase();

/**
 * Character page related videos: one horizontally scrolling row of compact cards per group, with one search box
 * over every group (title, channel, players, events, category). Nothing is fetched here; the server passes the list.
 */
export function CharacterVideoRail({ groups, searchLabel = "関連動画を検索" }: { groups: CharacterVideoRailGroup[]; searchLabel?: string }) {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const visible = groups.map(group => ({ ...group, videos: terms.length ? group.videos.filter(video => {
    const text = searchable(video);
    return terms.every(term => text.includes(term));
  }) : group.videos })).filter(group => group.videos.length);
  const total = groups.reduce((sum, group) => sum + group.videos.length, 0);
  const shown = visible.reduce((sum, group) => sum + group.videos.length, 0);
  if (!total) return null;
  return <div className={styles.rail} data-character-video-rail="true">
    <div className={styles.search}>
      <label htmlFor={inputId}>{searchLabel}</label>
      <input id={inputId} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="例：コンボ、対空、選手名" />
      <p role="status" aria-live="polite">{terms.length ? `${shown} / ${total} 本` : `${total} 本`}</p>
      {terms.length ? <button type="button" onClick={() => setQuery("")}>検索を解除</button> : null}
    </div>
    {visible.length ? visible.map(group => <section key={group.key} className={styles.group} aria-label={group.label} data-video-group={group.key}>
      <h3>{group.label}<span>{group.videos.length}本</span></h3>
      <ul className={styles.row}>
        {group.videos.map(video => <li key={video.id} data-registered-video={video.id.replace("youtube:", "")}>
          <VideoCard video={video} publishedDate={formatVideoPublishedDate(video.publishedAt)} compact />
        </li>)}
      </ul>
    </section>) : <p className={styles.empty}>該当する動画がありません。言葉を変えて検索してください。</p>}
  </div>;
}
