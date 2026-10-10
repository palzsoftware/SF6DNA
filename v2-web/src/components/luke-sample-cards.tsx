import { MoveMotionMedia } from "@/components/move-motion-media";
import { PilotComboCard } from "@/components/pilot-combo-card";
import { Sf6CommandInput } from "@/components/sf6-command-input";
import { isLukeSampleRequest, lukeMoveSample, lukeComboSample } from "@/lib/luke-sample-cards";
import cardStyles from "./pilot-combo-card.module.css";
import styles from "./luke-sample-cards.module.css";

export function LukeSampleCards({ slug, requested, environment }: {
  slug: string;
  requested: string | string[] | undefined;
  environment: string | undefined;
}) {
  if (!isLukeSampleRequest(slug, requested, environment)) return null;
  return (
    <section id="luke-sample-cards" className={styles.section} aria-labelledby="luke-sample-title">
      <div className="section-heading">
        <h2 id="luke-sample-title">Luke カードサンプル・実機確認用</h2>
        <p>技1件・コンボ1件の試作です。未確認の数値は未確認のまま表示しています。</p>
      </div>
      <div className={styles.grid}>
        <article className={cardStyles.card} data-sample-move-id={lukeMoveSample.id}>
          <span className="chip">技カード・サンプル</span>
          <h3>{lukeMoveSample.name}</h3>
          <p>{lukeMoveSample.category}</p>
          <p>Classic: <Sf6CommandInput value={lukeMoveSample.classic} /></p>
          <p>Modern: このサンプルでは未確認</p>
          <MoveMotionMedia media={lukeMoveSample.media} className={styles.motion} title={lukeMoveSample.name} />
          <div className={cardStyles.detailBody}>
            <dl>{["発生", "ヒット時", "ガード時", "ダメージ"].map(label => (
              <div key={label}><dt>{label}</dt><dd>実機確認待ち</dd></div>
            ))}</dl>
          </div>
        </article>
        <PilotComboCard combo={lukeComboSample} sample />
      </div>
    </section>
  );
}
