import Image from "next/image";
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
  const motion = media.mediaType === "gif" ? (
    <Image
      alt={`${title}のモーション`}
      className={className}
      height={360}
      src={media.mediaUrl}
      unoptimized
      width={640}
    />
  ) : (
    <video
      aria-label={`${title}のモーション`}
      className={className}
      controls
      loop
      muted
      playsInline
      poster={media.posterUrl ?? undefined}
      preload="none"
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
