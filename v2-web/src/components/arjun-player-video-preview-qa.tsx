import { arjunPreviewQaEnabled } from "@/lib/arjun-preview-qa-auth";
import { ArjunVideoPreviewSearch } from "@/components/arjun-video-preview-search";
import { arjunLocalPlayerReviewCandidates, arjunLocalVideoCandidates } from "@/lib/arjun-player-video-local-candidates";
import styles from "./arjun-player-video-local-preview.module.css";
import playerEvidence from "@/data/arjun-player-evidence-review.json";

/** Preview-only display of evidence candidates, never an approved player relation. */
export function ArjunPlayerVideoPreviewQa() {
  if (!arjunPreviewQaEnabled()) return null;
  const players = arjunLocalPlayerReviewCandidates();
  const evidence = playerEvidence.rows;
  const videos = arjunLocalVideoCandidates();
  const evidenceLabel: Record<string, string> = {
    TOURNAMENT_USE_REPORTED: "大会使用実績の報道",
    RANKED_AND_VIDEO_CANDIDATE: "ランク戦統計・動画",
    VIDEO_TITLE_CANDIDATE: "動画タイトルに登場",
  };
  return <div className={`site-shell ${styles.root}`} data-arjun-player-video-preview="review-only">
    <section aria-label="アルジュン使用プレイヤー候補" className={styles.section}>
      <h2>アルジュン使用・出演候補（{evidence.length}名）</h2>
      <p>メインキャラクターでなくても、関連動画に登場した候補として掲載します。動画タイトルだけでは本人や使用キャラの確定にはなりません。</p>
      <p data-arjun-verified-player-count="0">正式な使用キャラ関連付け：0件（既存調査時点）。現在のDB状態は未再検証です。</p>
      <div className={styles.players} data-arjun-player-candidate-count={evidence.length}>
        {evidence.map(item => {
          const titleCandidate = players.find(player => player.labelFromVideoTitle === item.label);
          return <article className={styles.card} key={item.label} data-arjun-relation="unverified">
            <h3>{item.label}</h3>
            <p className={styles.playerStatus}>使用・出演候補 ／ メイン使用未確認</p>
            <dl className={styles.playerFacts}>
              <div><dt>確認できた根拠の種類</dt><dd>{evidenceLabel[item.evidence_tier] ?? "確認中"}</dd></div>
              <div><dt>Player図鑑の過去照合結果</dt><dd>Development：{item.development_status}<span className={styles.break}>Production：{item.production_status}</span></dd></div>
            </dl>
            <p className={styles.playerNote}>{item.note}</p>
            <div className={styles.playerLinks}>
              {titleCandidate ? <a href={titleCandidate.evidenceUrl} target="_blank" rel="noopener noreferrer">関連動画の候補を見る</a> : null}
              {item.external_source ? <a href={item.external_source} target="_blank" rel="noopener noreferrer">補足資料を見る</a> : null}
            </div>
          </article>;
        })}
      </div>
      <p className={styles.notice}>正式なPlayer図鑑への関連付けは、本人・使用キャラ・出典を確認した後に別途承認します。</p>
    </section>
    <section aria-label="アルジュン関連動画候補" className={styles.section}>
      <h2>関連動画候補（{videos.length}件・未確認）</h2>
      <p>動画ID・タイトルは研究候補です。再生可否、出演者、現行Patch、公開承認は未検証です。</p>
      <ArjunVideoPreviewSearch videos={videos} />
    </section>
  </div>;
}
