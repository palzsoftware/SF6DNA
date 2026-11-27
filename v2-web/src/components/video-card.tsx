"use client";

import Link from "next/link";
import { VisualIcon } from "./visual-icon";
import { videoPresentationUrl } from "@/lib/video-presentation";
import { useState } from "react";
import type { VideoSummary } from "@/lib/event-media";
import { formatVideoDuration, VIDEO_CATEGORY_LABELS } from "@/lib/video-library";
import { useOwnedVideoPreferences } from "@/lib/use-owned-video-preferences";

/** `compact`: smaller card for horizontal rails (thumbnail, type, title, channel, date/length, play and favorite only). */
export function VideoCard({ video, publishedDate, onPreferenceChange, compact = false }: { video: VideoSummary; publishedDate: string | null; onPreferenceChange?: () => void; compact?: boolean }) {
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

  // Compact cards keep event notes such as 「2025年の過去大会」; characters/players are implied by the page.
  const relations = compact ? [...video.events] : [...video.events, ...video.characters, ...video.players];
  const duration = formatVideoDuration(video.durationSeconds);
  const category = video.videoType ? VIDEO_CATEGORY_LABELS[video.videoType] ?? video.videoType : null;
  // Reviewed content tags after the card type (e.g. コンボ / Patch解説), shown on compact cards only.
  const contentLabels = compact ? (video.categories ?? []).filter(item => item !== video.videoType && VIDEO_CATEGORY_LABELS[item]).map(item => VIDEO_CATEGORY_LABELS[item]) : [];
  const youtubeHost = videoUrl ? ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"].includes(new URL(videoUrl).hostname) : false;
  const watchLabel = youtubeHost ? "YouTubeで再生 ↗" : "外部サイトで再生 ↗";
  // Supporting links are YouTube only (never Twitch or other hosts).
  const supportingLinks = (video.supportingLinks ?? []).flatMap(link => {
    const url = videoPresentationUrl(link.url);
    return url && ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"].includes(new URL(url).hostname) ? [{ url, label: link.label }] : [];
  });
  return (
    <article className={`video-card${watched ? " video-card--watched" : ""}${compact ? " video-card--compact" : ""}`}>
      {videoUrl ? <a className="video-card__thumbnail" href={videoUrl} target="_blank" rel="noopener noreferrer" aria-label={`${video.title}を外部サイトで再生`}>
        {thumbnailUrl && failedThumbnailUrl !== thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- external thumbnails reserve their aspect ratio.
          <img src={thumbnailUrl} alt="" width={480} height={270} loading="lazy" decoding="async"
            onError={() => setFailedThumbnailUrl(thumbnailUrl)}
            style={{ width: "100%", height: "auto", aspectRatio: "16 / 9", objectFit: "cover" }} />
        ) : <strong>{youtubeHost ? "YOUTUBE" : "VIDEO"}</strong>}
      </a> : <div className="video-card__thumbnail"><strong>動画リンクを確認できません</strong></div>}
      <div className="video-card__body">
        <span className="search-result__type">{[video.platform, category, ...contentLabels].filter(Boolean).join(" / ") || "VIDEO"}</span>
        {compact ? null : <div className="video-card__flags"><span><VisualIcon kind="saved" />{preferenceReady ? favorite ? "保存済み" : "未保存" : pendingLabel}</span><span>{preferenceReady ? watched ? "視聴済み" : "未視聴" : pendingLabel}</span></div>}
        <h2>{video.detailHref === null ? video.title : <Link href={video.detailHref ?? `/videos/${encodeURIComponent(video.slug)}`}>{video.title}</Link>}</h2>
        {video.channelName ? <p>{video.channelName}</p> : null}
        {relations.length ? <ul className="video-card__relations" aria-label="関連する人物・キャラクター・大会">{relations.map((name, index) => <li key={`${name}-${index}`}>{name}</li>)}</ul> : null}
        {publishedDate || duration ? <small>{[publishedDate, duration].filter(Boolean).join(" / ")}</small> : null}
        {!compact && supportingLinks.length ? <p className="video-card__supporting">{supportingLinks.map(link => <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>)}</p> : null}
        <div className="video-card__actions">
          {videoUrl ? <a className="video-card__watch" href={videoUrl} target="_blank" rel="noopener noreferrer"><VisualIcon kind="video" />{watchLabel}</a> : <span role="status">安全な動画リンクを確認できません。</span>}
          <button className="button-secondary" type="button" onClick={toggleFavorite} disabled={!preferenceReady} aria-pressed={preferenceReady ? favorite : undefined} aria-label={`${video.title}を${favorite ? "お気に入りから外す" : "お気に入りに追加"}`}>{preferenceReady ? favorite ? "★ お気に入り" : "☆ お気に入り" : `お気に入り（${pendingLabel}）`}</button>
          {compact ? null : <button className="button-secondary" type="button" onClick={() => void share()} disabled={!videoUrl} aria-label={`${video.title}を共有`}>共有</button>}
          {compact ? null : <button className="button-secondary" type="button" onClick={toggleWatched} disabled={!preferenceReady} aria-pressed={preferenceReady ? watched : undefined}>{preferenceReady ? watched ? "視聴済みを解除" : "視聴済みにする" : `視聴状態（${pendingLabel}）`}</button>}
        </div>
        <span className="video-card__status" aria-live="polite">{preferences.message || shareMessage}</span>
      </div>
    </article>
  );
}
