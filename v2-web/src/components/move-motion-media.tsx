"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { MoveMotionMedia as MoveMotionMediaRecord } from "@/lib/move-motion-media";

export function MoveMotionMedia({
  media,
  title,
  className,
  showSource = false,
}: {
  media: MoveMotionMediaRecord;
  title: string;
  className?: string;
  showSource?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const failed = failedUrl === media.mediaUrl;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let nearby = false;
    const syncPlayback = () => {
      if (reducedMotion.matches || !nearby || document.hidden) {
        video.pause();
        if (reducedMotion.matches) video.currentTime = 0;
        return;
      }
      void video.play().catch(() => {
        // Autoplay can still be blocked by a browser-level policy; the poster remains visible.
      });
    };

    const observer = new IntersectionObserver(([entry]) => {
      nearby = entry.isIntersecting;
      syncPlayback();
    }, { rootMargin: "120px" });
    observer.observe(video);
    reducedMotion.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
    };
  }, [media.mediaUrl, media.mediaType, failed]);

  if (failed) {
    return <div className={className} style={{ aspectRatio: "16 / 9", display: "grid", placeItems: "center" }}>
      <span>動作映像を読み込めませんでした。</span>
      {showSource && media.sourceUrl ? <a href={media.sourceUrl} rel="noopener noreferrer" target="_blank">
        {media.sourceLabel ?? "モーションの出典"} ↗
      </a> : null}
    </div>;
  }

  const motion = media.mediaType === "gif" ? (
    <Image
      alt={`${title}のモーション`}
      className={className}
      height={360}
      src={media.mediaUrl}
      unoptimized
      width={640}
      onError={() => setFailedUrl(media.mediaUrl)}
    />
  ) : (
    <video
      key={media.mediaUrl}
      aria-label={`${title}のモーション`}
      className={className}
      loop
      muted
      playsInline
      poster={media.posterUrl ?? undefined}
      ref={videoRef}
      preload="none"
      onError={() => setFailedUrl(media.mediaUrl)}
    >
      <source src={media.mediaUrl} />
      このブラウザでは動画を再生できません。
    </video>
  );

  return (
    <>
      {motion}
      {showSource && media.sourceUrl ? (
        <a href={media.sourceUrl} rel="noopener noreferrer" target="_blank">
          {media.sourceLabel ?? "モーションの出典"} ↗
        </a>
      ) : null}
    </>
  );
}
