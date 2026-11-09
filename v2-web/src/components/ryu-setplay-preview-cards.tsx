import type { ReactNode } from "react";
import type { StrategyCardView } from "@/components/strategy-card-explorer";
import { RyuComboRoute } from "@/components/ryu-combo-preview-cards";
import styles from "./ryu-combo-preview-cards.module.css";

type RyuSetplayCandidate = {
  id: string;
  title: string;
  route: string;
  summary: string;
  feature: string;
  conditions: string;
  damageLabel: string;
  driveGaugeLabel: string;
  saUsage: string;
  difficulty: string;
  patch: string;
  sourceUrl: string;
  sourceRecordId: string;
  checkedAt: string;
  researchDate: string;
  evidenceStatus: string;
};

const candidates: RyuSetplayCandidate[] = [
  {
    id: "RYU-SETPLAY-0336",
    title: "昇龍拳締め後の重ね",
    route: "強昇龍拳 > 前ステップ > 鳩尾砕き",
    summary: "前ステップから鳩尾砕き",
    feature: "強昇龍拳締め後の起き攻め候補。外部ガイドに掲載された構成です。",
    conditions: "強昇龍拳の地上ヒット想定。出典掲載の+37F、前ステップ後+18Fを前提とします。起き上がり・受け身別の成立は要検証です。",
    damageLabel: "未確認（Drive資料はnull）",
    driveGaugeLabel: "未確認（Drive資料はnull）",
    saUsage: "資料に記載なし（SA不使用を意味しません）",
    difficulty: "未確認（資料はnull）",
    patch: "2026-08-03 guide baseline（資料記載・個別再照合未実施）",
    sourceUrl: "https://sf6-lab.net/fighters/ryu/combo",
    sourceRecordId: "SF6DNA-RES-0336",
    checkedAt: "2026-11-04",
    researchDate: "2026-11-04",
    evidenceStatus: "needs_verification。実機未検証、公開承認なし",
  },
  {
    id: "RYU-SETPLAY-0337",
    title: "画面端前投げ後の投げループ候補",
    route: "画面端前投げ > 5弱P空振り > 投げ",
    summary: "弱P空振りから再投げ",
    feature: "画面端での投げループ候補。外部ガイド掲載の+17Fを前提とした構成です。",
    conditions: "画面端。受け身・距離を要確認です。掲載値+17Fを含め、実機成立は未検証です。",
    damageLabel: "未確認（Drive資料はnull）",
    driveGaugeLabel: "未確認（Drive資料はnull）",
    saUsage: "資料に記載なし（SA不使用を意味しません）",
    difficulty: "未確認（資料はnull）",
    patch: "2026-08-03 guide baseline（資料記載・個別再照合未実施）",
    sourceUrl: "https://sf6-lab.net/fighters/ryu/combo",
    sourceRecordId: "SF6DNA-RES-0337",
    checkedAt: "2026-11-04",
    researchDate: "2026-11-04",
    evidenceStatus: "needs_verification。実機未検証、公開承認なし",
  },
];

function RyuSetplayCandidateCard({ candidate }: { candidate: RyuSetplayCandidate }) {
  return <article className={styles.card} data-research-status="unverified">
    <small className={styles.tag}>資料候補 / 未検証</small>
    <h3>{candidate.title}</h3>
    <div className={styles.route}>
      <strong>セットプレイルート</strong>
      <RyuComboRoute route={candidate.route} />
    </div>
    <p className={styles.summary}>{candidate.summary}</p>
    <details className={styles.details}>
      <summary>ダメージ・ゲージ・特徴・条件を開く</summary>
      <dl>
        <div><dt>ダメージ</dt><dd>{candidate.damageLabel}</dd></div>
        <div><dt>ドライブゲージ使用量</dt><dd>{candidate.driveGaugeLabel}</dd></div>
        <div><dt>SA使用・位置</dt><dd>{candidate.saUsage}</dd></div>
        <div><dt>このセットプレイの特徴</dt><dd>{candidate.feature}</dd></div>
        <div><dt>成立条件・その他</dt><dd>{candidate.conditions}</dd></div>
        <div><dt>資料上の難易度</dt><dd>{candidate.difficulty}</dd></div>
        <div><dt>参照Patch</dt><dd>{candidate.patch}</dd></div>
        <div><dt>確認状態</dt><dd>{candidate.evidenceStatus}</dd></div>
        <div><dt>GIF</dt><dd>未設定</dd></div>
      </dl>
      <p className={styles.source}>
        <span>Drive候補ID {candidate.sourceRecordId}・資料確認日 {candidate.checkedAt}・調査日 {candidate.researchDate}:</span>{" "}
        <a href={candidate.sourceUrl} target="_blank" rel="noopener noreferrer">出典候補を開く ↗</a>
      </p>
    </details>
  </article>;
}

export function projectRyuSetplayPreviewCards(): StrategyCardView[] {
  return candidates.map(candidate => ({
    id: candidate.id,
    kind: "setplay",
    title: candidate.title,
    category: "Drive資料候補",
    categoryLabel: "未検証候補",
    searchTerms: [candidate.route, candidate.summary, candidate.feature, candidate.conditions, "起き攻め", "投げ重ね", "画面端"],
    driveCost: null,
    saCost: null,
    content: <RyuSetplayCandidateCard key={candidate.id} candidate={candidate} /> as ReactNode,
  }));
}

export function RyuSetplayPreviewNotice() {
  return <aside className={styles.notice} role="note">
    <strong>Preview限定：Driveの具体候補2件</strong>
    <p>具体候補のみを表示しています。どちらも実機未検証・公開承認なしです。ダメージとドライブゲージ量は資料に未記載のため補っていません。記載されたフレーム値やPatchとの一致も再確認が必要です。</p>
    <p>ProductionとDBには反映しません。</p>
  </aside>;
}
