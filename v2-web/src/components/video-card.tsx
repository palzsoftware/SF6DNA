"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { VideoSummary } from "@/lib/event-media";
import { formatVideoDuration, VIDEO_CATEGORY_LABELS } from "@/lib/video-library";
import { readVideoPreference, toggleVideoPreference, VIDEO_FAVORITES_KEY, VIDEO_WATCHED_KEY } from "@/lib/video-preferences";

export function VideoCard({ video, publishedDate, onPreferenceChange }: { video: VideoSummary; publishedDate: string | null; onPreferenceChange?: () => void }) {
  const [watched, setWatched] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [shareMessage, setShareMessage] = useState("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setWatched(readVideoPreference(VIDEO_WATCHED_KEY).has(video.id));
      setFavorite(readVideoPreference(VIDEO_FAVORITES_KEY).has(video.id));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [video.id]);

  function toggleWatched() {
    setWatched(toggleVideoPreference(VIDEO_WATCHED_KEY, video.id));
    onPreferenceChange?.();
  }

  function toggleFavorite() {
    setFavorite(toggleVideoPreference(VIDEO_FAVORITES_KEY, video.id));
    onPreferenceChange?.();
  }

  async function share() {
    try {
      if (navigator.share) await navigator.share({ title: video.title, url: video.url });
      else {
        await navigator.clipboard.writeText(video.url);
        setShareMessage("URLをコピーしました");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareMessage("共有できませんでした");
    }
  }

  const relations = [...video.events, ...video.characters, ...video.players];
  const duration = formatVideoDuration(video.durationSeconds);
  const category = video.videoType ? VIDEO_CATEGORY_LABELS[video.videoType] ?? video.videoType : null;
  const watchLabel = video.platform?.toLowerCase() === "youtube" ? "YouTubeで再生 ↗" : "外部サイトで再生 ↗";
  return (
    <article className={`video-card${watched ? " video-card--watched" : ""}`}>
      <a className="video-card__thumbnail" href={video.url} target="_blank" rel="noopener noreferrer" aria-label={`${video.title}を外部サイトで再生`}>
        {video.thumbnailUrl ? <span style={{ backgroundImage: `url(${video.thumbnailUrl})` }} /> : <strong>YOUTUBE</strong>}
      </a>
      <div className="video-card__body">
        <span className="search-result__type">{[video.platform, category].filter(Boolean).join(" / ") || "VIDEO"}</span>
        <h2><Link href={`/videos/${video.slug}`}>{video.title}</Link></h2>
        {video.channelName ? <p>{video.channelName}</p> : null}
        {relations.length ? <p>{relations.join(" / ")}</p> : null}
        {publishedDate || duration ? <small>{[publishedDate, duration].filter(Boolean).join(" / ")}</small> : null}
        <div className="video-card__actions">
          <a className="video-card__watch" href={video.url} target="_blank" rel="noopener noreferrer">{watchLabel}</a>
          <button className="button-secondary" type="button" onClick={toggleFavorite} aria-pressed={favorite} aria-label={`${video.title}を${favorite ? "お気に入りから外す" : "お気に入りに追加"}`}>{favorite ? "★ お気に入り" : "☆ お気に入り"}</button>
          <button className="button-secondary" type="button" onClick={() => void share()} aria-label={`${video.title}を共有`}>共有</button>
          <button className="button-secondary" type="button" onClick={toggleWatched} aria-pressed={watched}>{watched ? "視聴済みを解除" : "視聴済みにする"}</button>
        </div>
        <span className="video-card__status" aria-live="polite">{shareMessage}</span>
      </div>
    </article>
  );
}
