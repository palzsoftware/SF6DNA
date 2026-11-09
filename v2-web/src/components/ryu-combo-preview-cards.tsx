import type { ReactNode } from "react";
import { Sf6CommandInput } from "@/components/sf6-command-input";
import type { StrategyCardView } from "@/components/strategy-card-explorer";
import { RYU_COMBO_PREVIEW_CANDIDATES, type RyuComboPreviewCandidate } from "@/data/ryu-combo-preview";
import styles from "./ryu-combo-preview-cards.module.css";

function RyuComboCandidateCard({ candidate }: { candidate: RyuComboPreviewCandidate }) {
  return <article className={styles.card} data-research-status="unverified">
    <small className={styles.tag}>資料候補 / 未検証</small>
    <h3>{candidate.title}</h3>
    <div className={styles.route}>
      <strong>コンボルート</strong>
      <Sf6CommandInput value={candidate.route} scheme="classic" iconSize={20} />
    </div>
    <p className={styles.summary}>{candidate.summary}</p>
    <details className={styles.details}>
      <summary>ダメージ・ゲージ・特徴・条件を開く</summary>
      <dl>
        <div><dt>ダメージ</dt><dd>{candidate.damageLabel}</dd></div>
        <div><dt>ドライブゲージ使用量</dt><dd>{candidate.driveGaugeLabel}</dd></div>
        <div><dt>SA使用・位置</dt><dd>{candidate.saUsage}</dd></div>
        <div><dt>このコンボの特徴</dt><dd>{candidate.feature}</dd></div>
        <div><dt>成立条件・その他</dt><dd>{candidate.conditions}</dd></div>
        <div><dt>資料上の難易度</dt><dd>{candidate.difficulty}</dd></div>
        <div><dt>参照Patch</dt><dd>{candidate.patch}</dd></div>
        <div><dt>確認状態</dt><dd>{candidate.evidenceStatus}</dd></div>
        <div><dt>GIF</dt><dd>未設定</dd></div>
        <div><dt>資料の原表記</dt><dd>{candidate.route}</dd></div>
      </dl>
      <p className={styles.source}>
        <span>{candidate.sourceLabel}（調査日 {candidate.researchDate}）:</span>{" "}
        <a href={candidate.sourceUrl} target="_blank" rel="noopener noreferrer">出典候補を開く ↗</a>
      </p>
    </details>
  </article>;
}

export function projectRyuComboPreviewCards(): StrategyCardView[] {
  return RYU_COMBO_PREVIEW_CANDIDATES.map(candidate => ({
    id: candidate.id,
    kind: "combo",
    title: candidate.title,
    category: "R5候補",
    categoryLabel: "R5資料候補",
    searchTerms: [candidate.route, candidate.summary, candidate.feature, candidate.conditions, candidate.saUsage],
    driveCost: null,
    saCost: candidate.saLevel,
    content: <RyuComboCandidateCard key={candidate.id} candidate={candidate} /> as ReactNode,
  }));
}

export function RyuComboPreviewNotice() {
  return <aside className={styles.notice} role="note">
    <strong>Preview限定：R5資料の候補19件</strong>
    <p>出典本文・現行Patchとの一致・実機成立は未確認です。ダメージとドライブゲージ使用量は資料に未記載のため、数値を補っていません。コンボ全体か中継パーツかの区別が残る候補も含みます。</p>
    <p>この候補はPreviewのみ表示し、ProductionとDBには反映しません。</p>
  </aside>;
}

