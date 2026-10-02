import type { CharacterDetailV21Profile } from "@/lib/character-detail-v21";
import { normalizePublicCopy } from "@/lib/public-copy";
import styles from "./character-game-guide.module.css";

// Presentation only: original profile text and its cautions stay together.
export function CharacterGamePlan({ steps }: { steps: CharacterDetailV21Profile["gameplan"] }) {
  if (!steps.length) return <p>試合の組み立て方はまだ掲載していません。</p>;
  return <div className={styles.plan}>
    <p className={styles.hint}>気になるポイントを開くと、詳しい説明と注意点が読めます。</p>
    <ol className={styles.points}>{steps.map((step, index) => <li key={`${step.label}-${index}`}>
      <details className={styles.point}>
        <summary><span className={styles.number} aria-hidden="true">{index + 1}</span><span>{normalizePublicCopy(step.title)}</span></summary>
        <div className={styles.detail}><p>{normalizePublicCopy(step.body)}</p>
          {step.caution ? <div className={styles.caution}><strong>気をつけること</strong><p>{normalizePublicCopy(step.caution)}</p></div> : null}
        </div>
      </details>
    </li>)}</ol>
  </div>;
}

export function CharacterRangeGuide({ ranges }: { ranges: CharacterDetailV21Profile["ranges"] }) {
  if (!ranges.length) return <p>距離別の立ち回りはまだ掲載していません。</p>;
  return <ul className={styles.ranges}>{ranges.map((row) => <li key={row.range} data-range={row.range}>
    <article className={styles.rangeCard}>
      <h3><span className={styles.marker} aria-hidden="true" />{row.range}</h3>
      <div className={styles.rangeVisual} aria-hidden="true"><i /><span /><i /></div>
      <dl><div className={styles.purpose}><dt>狙い</dt><dd>{normalizePublicCopy(row.purpose)}</dd></div>
        <div><dt>主に使う技</dt><dd>{normalizePublicCopy(row.actions)}</dd></div>
        <div className={styles.caution}><dt>気をつけること</dt><dd>{normalizePublicCopy(row.caution)}</dd></div>
      </dl>
    </article>
  </li>)}</ul>;
}
