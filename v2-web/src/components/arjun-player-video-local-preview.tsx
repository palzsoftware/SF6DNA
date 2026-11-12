import { VideoCard } from "@/components/video-card";
import { arjunLocalPlayerReviewCandidates, arjunLocalVideoCandidates } from "@/lib/arjun-player-video-local-candidates";
import styles from "./arjun-player-video-local-preview.module.css";
import playerEvidence from "@/data/arjun-player-evidence-review.json";

/** Non-public local audit: no writes, no PlayerDetail or false relation links. */
export function ArjunPlayerVideoLocalPreview() {
  if (process.env.NODE_ENV !== "development" || process.env.VERCEL_ENV ||
      process.env.SF6DNA_ARJUN_LOCAL_PREVIEW !== "1") return null;
  const players = arjunLocalPlayerReviewCandidates();
  const evidence = playerEvidence.rows;
  const videos = arjunLocalVideoCandidates();
  return <div className={`site-shell ${styles.root}`} data-arjun-player-video-local="review-only">
    <section aria-label="アルジュン使用プレイヤー候補" className={styles.section}>
      <h2>使用プレイヤー候補（未確認）</h2>
      <p>動画タイトルに登場する名前の調査一覧です。本人確認、アルジュン使用、Player図鑑との紐付けは未検証です。</p>
      <p data-arjun-verified-player-count="0">登録済みのアルジュン使用プレイヤー：0件（Development／Production DB確認時点）</p>
      <p>大会使用実績・ランク戦使用記録・動画タイトル上の候補を区別しています。メイン使用者の確認済み数は0です。人物の一致も自動承認しません。</p>
      <div className={styles.players} data-arjun-player-candidate-count={evidence.length}>
        {evidence.map(item => {
          const titleCandidate = players.find(player => player.labelFromVideoTitle === item.label);
          return <article className={styles.card} key={item.label} data-arjun-relation="unverified">
            <h3>{item.label} <small>（使用候補・メイン未確認）</small></h3>
            <p>根拠区分：{item.evidence_tier === "TOURNAMENT_USE_REPORTED" ? "大会使用実績の報道" : item.evidence_tier === "RANKED_AND_VIDEO_CANDIDATE" ? "ランク戦統計と動画候補" : "動画タイトル上の候補"}</p>
            <p>Player図鑑照合：Development {item.development_status} ／ Production {item.production_status}</p>
            <p>{item.note}</p>
            {titleCandidate ? <a href={titleCandidate.evidenceUrl} target="_blank" rel="noopener noreferrer">根拠動画の候補を見る</a> : null}
            {item.external_source ? <p><a href={item.external_source} target="_blank" rel="noopener noreferrer">補足資料を確認</a></p> : null}
          </article>;
        })}
      </div>
      <p>正式なPlayerカードは、Player図鑑の公開レコードと確認済み関連付けが得られた段階でのみ接続します。</p>
    </section>
    <section aria-label="アルジュン関連動画候補" className={styles.section}>
      <h2>関連動画候補（{videos.length}件・未確認）</h2>
      <p>既存GitHubのPreview研究候補を再利用します。タイトル・動画IDの登録は再生確認、出演者の確定、現行Patch適合、公開承認を意味しません。</p>
      <div className={styles.videos} data-arjun-video-candidate-count={videos.length}>
        {videos.map(video => <VideoCard key={video.id} video={video} publishedDate={null}
          previewCandidate previewLocalOnly />)}
      </div>
    </section>
  </div>;
}
