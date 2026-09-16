"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { VideoSummary } from "@/lib/event-media";

const WATCHED_KEY = "sf6dna:watched-videos:v1";

function readWatched(): string[] {
  try {
    const value = JSON.parse(window.localStorage.getItem(WATCHED_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function VideoCard({ video, publishedDate }: { video: VideoSummary; publishedDate: string | null }) {
  const [watched, setWatched] = useState(false);
  const [shareMessage, setShareMessage] = useState("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setWatched(readWatched().includes(video.id));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [video.id]);

  function toggleWatched() {
    const values = new Set(readWatched());
    if (values.has(video.id)) values.delete(video.id); else values.add(video.id);
    window.localStorage.setItem(WATCHED_KEY, JSON.stringify([...values]));
    setWatched(values.has(video.id));
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

  const relations = [...video.characters, ...video.players];
  return (
    <article className={`video-card${watched ? " video-card--watched" : ""}`}>
      <a className="video-card__thumbnail" href={video.url} target="_blank" rel="noopener noreferrer" aria-label={`${video.title}をYouTubeで見る`}>
        {video.thumbnailUrl ? <span style={{ backgroundImage: `url(${video.thumbnailUrl})` }} /> : <strong>YOUTUBE</strong>}
      </a>
      <div className="video-card__body">
        <span className="search-result__type">{[video.platform, video.videoType].filter(Boolean).join(" / ") || "VIDEO"}</span>
        <h2><Link href={`/videos/${video.slug}`}>{video.title}</Link></h2>
        {relations.length ? <p>{relations.join(" / ")}</p> : null}
        {publishedDate ? <small>{publishedDate}</small> : null}
        <div className="video-card__actions">
          <button className="button-secondary" type="button" onClick={() => void share()} aria-label={`${video.title}を共有`}>共有</button>
          <button className="button-secondary" type="button" onClick={toggleWatched} aria-pressed={watched}>{watched ? "視聴済みを解除" : "視聴済みにする"}</button>
        </div>
        <span className="video-card__status" aria-live="polite">{shareMessage}</span>
      </div>
    </article>
  );
}
