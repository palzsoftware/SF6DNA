import type { ReactNode } from "react";
import type { StrategyCardView } from "@/components/strategy-card-explorer";
import { RyuComboRoute } from "@/components/ryu-combo-preview-cards";
import styles from "./ryu-combo-preview-cards.module.css";

type RyuSequenceCandidate = {
  id: string;
  title: string;
  route: string;
  summary: string;
  feature: string;
  conditions: string;
  guardAdvantage: string;
  difficulty: string;
  patch: string;
  sourceUrl: string;
  sourceRecordId: string;
  researchDate: string;
  evidenceStatus: string;
  tags: string[];
};

const candidates: RyuSequenceCandidate[] = [
  {
    id: "RYU-R5-P001",
    title: "鳩尾砕きガード後の投げ",
    route: "6強P（ガード+3） > 通常投げ",
    summary: "近距離で鳩尾砕きをガードさせた後の投げ択候補。",
    feature: "相手にガードを続けさせた場面で投げを選ぶ連携候補です。",
    conditions: "近距離。出典資料では2026年調整後にガードバックが縮小したと記載されていますが、投げ間合いは要確認です。",
    guardAdvantage: "資料記載：+3F（現行Patch・実機未確認）",
    difficulty: "資料記載：中級",
    patch: "資料記載：2026-08-03 Year4。個別の現行Patch照合は未実施。",
    sourceUrl: "https://sf6-genten.com/character/ryu",
    sourceRecordId: "RYU-R5-P001",
    researchDate: "2026-11-05",
    evidenceStatus: "source_or_frame_inferred_needs_in_game_check。実機未検証、公開承認なし",
    tags: ["投げ連携", "固め"],
  },
  {
    id: "RYU-R5-P002",
    title: "鳩尾砕きガード後の小技",
    route: "6強P（ガード+3） > 5弱P",
    summary: "近距離で鳩尾砕きをガードさせた後、小技を出す連携候補。",
    feature: "資料では相手の暴れに勝つ選択肢として記録されています。相手の技やタイミング別の成立は要確認です。",
    conditions: "近距離。出典資料記載の+3Fと技の発生を前提にした候補で、現行Patch・実機未確認です。",
    guardAdvantage: "資料記載：+3F（現行Patch・実機未確認）",
    difficulty: "資料記載：中級",
    patch: "資料記載：2026-08-03 Year4。個別の現行Patch照合は未実施。",
    sourceUrl: "https://sf6-genten.com/character/ryu",
    sourceRecordId: "RYU-R5-P002",
    researchDate: "2026-11-05",
    evidenceStatus: "source_or_frame_inferred_needs_in_game_check。実機未検証、公開承認なし",
    tags: ["暴れ潰し", "固め"],
  },
  {
    id: "RYU-R5-P003",
    title: "鳩尾砕きガード後の下段",
    route: "6強P > 2弱K",
    summary: "近距離で鳩尾砕きをガードさせた後、下段を選ぶ連携候補。",
    feature: "資料では後退歩きなどへの下段として記録されています。相手の行動別のヒット確認は要検証です。",
    conditions: "近距離。出典資料記載の+3Fを含む候補ですが、現行Patch・実機・距離条件は未確認です。",
    guardAdvantage: "資料記載：+3F（現行Patch・実機未確認）",
    difficulty: "資料記載：中級",
    patch: "資料記載：2026-08-03 Year4。個別の現行Patch照合は未実施。",
    sourceUrl: "https://sf6-genten.com/character/ryu",
    sourceRecordId: "RYU-R5-P003",
    researchDate: "2026-11-05",
    evidenceStatus: "source_or_frame_inferred_needs_in_game_check。実機未検証、公開承認なし",
    tags: ["中下段", "固め"],
  },
];

function RyuSequenceCandidateCard({ candidate }: { candidate: RyuSequenceCandidate }) {
  return <article className={styles.card} data-research-status="unverified">
    <small className={styles.tag}>R5資料候補 / 未検証</small>
    <h3>{candidate.title}</h3>
    <div className={styles.route}>
      <strong>連携ルート</strong>
      <RyuComboRoute route={candidate.route} />
    </div>
    <p className={styles.summary}>{candidate.summary}</p>
    <details className={styles.details}>
      <summary>有利フレーム・特徴・条件を開く</summary>
      <dl>
        <div><dt>ガード時の有利フレーム</dt><dd>{candidate.guardAdvantage}</dd></div>
        <div><dt>この連携の特徴</dt><dd>{candidate.feature}</dd></div>
        <div><dt>成立条件・その他</dt><dd>{candidate.conditions}</dd></div>
        <div><dt>資料上の難易度</dt><dd>{candidate.difficulty}</dd></div>
        <div><dt>参照Patch</dt><dd>{candidate.patch}</dd></div>
        <div><dt>確認状態</dt><dd>{candidate.evidenceStatus}</dd></div>
        <div><dt>GIF</dt><dd>未設定</dd></div>
      </dl>
      <p className={styles.source}>
        <span>Drive候補ID {candidate.sourceRecordId}・調査日 {candidate.researchDate}:</span>{" "}
        <a href={candidate.sourceUrl} target="_blank" rel="noopener noreferrer">出典候補を開く ↗</a>
      </p>
    </details>
  </article>;
}

export function projectRyuSequencePreviewCards(): StrategyCardView[] {
  return candidates.map(candidate => ({
    id: candidate.id,
    kind: "sequence",
    title: candidate.title,
    category: "R5候補",
    categoryLabel: "R5資料候補",
    searchTerms: [candidate.route, candidate.summary, candidate.feature, candidate.conditions, ...candidate.tags],
    driveCost: null,
    saCost: null,
    content: <RyuSequenceCandidateCard key={candidate.id} candidate={candidate} /> as ReactNode,
  }));
}

export function RyuSequencePreviewNotice() {
  return <aside className={styles.notice} role="note">
    <strong>Preview限定：R5連携候補3件</strong>
    <p>DriveのRYU-R5-P001〜P003から作成した候補です。出典記載の+3F、現行Patchとの一致、距離別の成立、相手の行動に対する結果は未検証です。ダメージ・ゲージ・SA消費は資料に数値がないため補っていません。</p>
    <p>実機検証・公開承認は未完了です。ProductionとDBには反映しません。</p>
  </aside>;
}
