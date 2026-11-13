import { Fragment, type ReactNode } from "react";
import type { StrategyCardView } from "@/components/strategy-card-explorer";
import { RYU_COMBO_PREVIEW_CANDIDATES, type RyuComboPreviewCandidate } from "@/data/ryu-combo-preview";
import styles from "./ryu-combo-preview-cards.module.css";

const moveReferences = [
  { match: "上げ突き", slug: "ryu-back-hp" },
  { match: "鎖骨割り", slug: "ryu-collarbone-breaker" },
  { match: "鳩尾砕き", slug: "ryu-solar-plexus-strike" },
  { match: "OD上段足刀蹴り", slug: "ryu-od-high-blade-kick" },
  { match: "強上段足刀蹴り", slug: "ryu-h-high-blade-kick" },
  { match: "中上段足刀蹴り", slug: "ryu-m-high-blade-kick" },
  { match: "弱上段足刀蹴り", slug: "ryu-l-high-blade-kick" },
  { match: "OD竜巻旋風脚", slug: "ryu-od-tatsumaki" },
  { match: "強竜巻旋風脚", slug: "ryu-h-tatsumaki" },
  { match: "中竜巻旋風脚", slug: "ryu-m-tatsumaki" },
  { match: "弱竜巻旋風脚", slug: "ryu-l-tatsumaki" },
  { match: "OD昇龍拳", slug: "ryu-od-shoryuken" },
  { match: "強昇龍拳", slug: "ryu-h-shoryuken" },
  { match: "中昇龍拳", slug: "ryu-m-shoryuken" },
  { match: "弱昇龍拳", slug: "ryu-l-shoryuken" },
  { match: "電刃OD波掌撃", slug: "ryu-denjin-od-hashogeki" },
  { match: "電刃波掌撃", slug: "ryu-denjin-hashogeki" },
  { match: "OD波掌撃", slug: "ryu-od-hashogeki" },
  { match: "強波掌撃", slug: "ryu-h-hashogeki" },
  { match: "中波掌撃", slug: "ryu-m-hashogeki" },
  { match: "弱波掌撃", slug: "ryu-l-hashogeki" },
  { match: "電刃錬気", slug: "ryu-denjin-charge" },
  { match: "強波動拳", slug: "ryu-h-hadoken" },
  { match: "中波動拳", slug: "ryu-m-hadoken" },
  { match: "弱波動拳", slug: "ryu-l-hadoken" },
  { match: "旋風脚", slug: "ryu-forward-hk" },
  { match: "SA3", slug: "ryu-sa3-shin-shoryuken" },
  { match: "SA2", slug: "ryu-sa2-shin-hashogeki" },
  { match: "SA1", slug: "ryu-sa1-shinku-hadoken" },
] as const;

function routePart(part: string, key: string) {
  const normalized = part
    .replace(/^4強P(?:（上げ突き）)?$/, "上げ突き")
    .replace(/^6中P(?:（鎖骨割り）)?$/, "鎖骨割り")
    .replace(/^6強P（ガード[+＋]3F）$/, "鳩尾砕き（ガード+3F）")
    .replace(/^6強P(?:（鳩尾砕き）)?$/, "鳩尾砕き");
  const reference = moveReferences.find(item => normalized.includes(item.match));
  if (reference) {
    const before = normalized.slice(0, normalized.indexOf(reference.match));
    const after = normalized.slice(normalized.indexOf(reference.match) + reference.match.length);
    return <span key={key}>{before}<a href={`#move-${reference.slug}`}>{reference.match}</a>{after}</span>;
  }

  const normal = part.match(/^(J|[2456])?(弱|中|強)(P|K)(.*)$/);
  if (!normal) return <span key={key}>{part}</span>;
  const [, position, strength, button, suffix] = normal;
  const posture = position === "J" ? "ジャンプ" : position === "2" ? "しゃがみ" : position === "5" ? "立ち" : position === "6" ? "前" : "";
  return <span key={key}>{posture}{strength}{button}{suffix}</span>;
}

export function RyuComboRoute({ route }: { route: string }) {
  return <span >
    {route.split(/\s*(?:→|>)\s*/u).map((part, index) => <Fragment key={index}>{index ? " → " : null}{routePart(part, `route-${index}`)}</Fragment>)}
  </span>;
}

function RyuComboCandidateCard({ candidate }: { candidate: RyuComboPreviewCandidate }) {
  return <article className={styles.card} data-research-status="unverified">
    <small className={styles.tag}>資料候補 / 未検証</small>
    <h3>{candidate.title}</h3>
    <div className={styles.route}>
      <strong>コンボルート</strong>
      <RyuComboRoute route={candidate.route} />
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
