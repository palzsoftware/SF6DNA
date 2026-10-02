import Image from "next/image";
import { resolveBeginnerMedia } from "./media-manifest";
import styles from "./page.module.css";

export function BeginnerMedia({ id }: { id: string }) {
  const asset = resolveBeginnerMedia(id, process.env.VERCEL_ENV);
  if (!asset) return null;
  return <figure className={styles.gameplayMedia} data-media-slot={asset.id}>
    {asset.mediaType === "video" ? <video
      controls muted loop playsInline preload="none"
      width={asset.width} height={asset.height} poster={asset.posterUrl}
      aria-label={asset.alt}
    ><source src={asset.mediaUrl} type={asset.mediaUrl.endsWith(".webm") ? "video/webm" : "video/mp4"}/>
      このブラウザでは動画を再生できません。<a href={asset.mediaUrl}>実演動画を開く</a>
    </video> : <Image src={asset.mediaUrl} alt={asset.alt} width={asset.width} height={asset.height} sizes="(max-width: 720px) 90vw, 600px" loading="lazy"/>}
    <figcaption>{asset.caption}</figcaption>
  </figure>;
}
