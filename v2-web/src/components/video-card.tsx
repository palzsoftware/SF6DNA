"use client";

import Link from "next/link";
import { VisualIcon } from "./visual-icon";
import { videoPresentationUrl } from "@/lib/video-presentation";
import { useState } from "react";
import type { VideoSummary } from "@/lib/event-media";
import { formatVideoDuration, VIDEO_CATEGORY_LABELS } from "@/lib/video-library";
import { useOwnedVideoPreferences } from "@/lib/use-owned-video-preferences";

export function VideoCard({ video, publishedDate, onPreferenceChange, previewCandidate = false }: { video: VideoSummary; publishedDate: string | null; onPreferenceChange?: () => void; previewCandidate?: boolean }) {
  const videoUrl = videoPresentationUrl(video.url);
  const thumbnailUrl = videoPresentationUrl(video.thumbnailUrl);
  const preferences = useOwnedVideoPreferences();
  const preferenceReady = preferences.status === "ready";
  const watched = preferenceReady && preferences.watched.has(video.id);
  const favorite = preferenceReady && preferences.favorites.has(video.id);
  const pendingLabel = preferences.status === "loading" ? "確認中" : "確認できません";
  const [shareMessage, setShareMessage] = useState("");
  const [failedThumbnailUrl, setFailedThumbnailUrl] = useState<string | null>(null);

  function toggleWatched() {
    if (preferences.toggle("watched", video.id)) onPreferenceChange?.();
  }

  function toggleFavorite() {
    if (preferences.toggle("favorite", video.id)) onPreferenceChange?.();
  }

  async function share() {
    if (!videoUrl) { setShareMessage("動画リンクを確認できません。"); return; }
    setShareMessage("");
    try {
      if (navigator.share) await navigator.share({ title: video.title, url: videoUrl });
      else {
        await navigator.clipboard.writeText(videoUrl);
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
  const youtubeHost = videoUrl ? ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"].includes(new URL(videoUrl).hostname) : false;
  const watchLabel = youtubeHost ? "YouTubeで再生 ↗" : "外部サイトで再生 ↗";
  return (
    <article className={`video-card${watched ? " video-card--watched" : ""}`}>
      <div className="video-card__media">
      {videoUrl ? <a className="video-card__thumbnail" href={videoUrl} target="_blank" rel="noopener noreferrer" aria-label={`${video.title}を外部サイトで再生`}>
        {thumbnailUrl && failedThumbnailUrl !== thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- external thumbnails reserve their aspect ratio.
          <img src={thumbnailUrl} alt="" width={480} height={270} loading="lazy" decoding="async"
            onError={() => setFailedThumbnailUrl(thumbnailUrl)}
            style={{ width: "100%", height: "auto", aspectRatio: "16 / 9", objectFit: "cover" }} />
        ) : <strong>{youtubeHost ? "YOUTUBE" : "VIDEO"}</strong>}
      </a> : <div className="video-card__thumbnail"><strong>動画リンクを確認できません</strong></div>}
      <button className={`video-card__favorite${favorite ? " video-card__favorite--active" : ""}`} type="button" onClick={toggleFavorite}
        disabled={!preferenceReady} aria-busy={preferences.status === "loading"} aria-pressed={preferenceReady ? favorite : undefined}
        aria-label={`${video.title}：${preferenceReady ? favorite ? "お気に入りから外す" : "お気に入りに追加" : `お気に入り状態を${pendingLabel}`}`}>
        <span aria-hidden="true">{favorite ? "★" : "☆"}</span>
      </button>
      </div>
      <div className="video-card__body">
        <span className="search-result__type">{[video.platform, category].filter(Boolean).join(" / ") || "VIDEO"}</span>
        <div className="video-card__flags"><span className={watched ? "video-card__watched-label" : undefined}>{preferenceReady ? watched ? "視聴済み" : "未視聴" : pendingLabel}</span></div>
        <h2>{previewCandidate ? video.title : <Link href={`/videos/${encodeURIComponent(video.slug)}`}>{video.title}</Link>}</h2>
        {previewCandidate ? <small role="status">確認用候補・公開未承認（出演・使用キャラ名は候補情報）</small> : null}
        {video.channelName ? <p>{video.channelName}</p> : null}
        {relations.length ? <ul className="video-card__relations" aria-label="関連する人物・キャラクター・大会">{relations.map((name, index) => <li key={`${name}-${index}`}>{name}</li>)}</ul> : null}
        {publishedDate || duration ? <small>{[publishedDate, duration].filter(Boolean).join(" / ")}</small> : null}
        <div className="video-card__actions">
          {videoUrl ? <a className="video-card__watch" href={videoUrl} target="_blank" rel="noopener noreferrer"><VisualIcon kind="video" />{watchLabel}</a> : <span role="status">安全な動画リンクを確認できません。</span>}
          <button className="button-secondary" type="button" onClick={() => void share()} disabled={!videoUrl} aria-label={`${video.title}を共有`}>共有</button>
          <button className="button-secondary" type="button" onClick={toggleWatched} disabled={!preferenceReady} aria-pressed={preferenceReady ? watched : undefined}>{preferenceReady ? watched ? "視聴済みを解除" : "視聴済みにする" : `視聴状態（${pendingLabel}）`}</button>
        </div>
        <span className="video-card__status" aria-live="polite">{preferences.message || shareMessage}</span>
      </div>
    </article>
  );
}
