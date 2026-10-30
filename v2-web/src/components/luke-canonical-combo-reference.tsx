import { lukeCanonicalCombo as combo } from "../lib/luke-canonical-combo";
import { Sf6CommandInput } from "./sf6-command-input";
import styles from "./character-unified-page.module.css";

// Display projection of existing Classic Move commands. Hold/just timing is not inferred.
// Source: ALL_CHARACTER_RELEASE_FIXTURE_20261004.json, characters.luke.moves.
export const lukeComboDisplayInputs = [
  { name: combo.recipe[0], command: "↓ + 中K", moveSlug: "luke-crouching-mk" },
  { name: combo.recipe[1], command: "CDR", moveSlug: null },
  { name: combo.recipe[2], command: "↓ + 中P", moveSlug: "luke-crouching-mp" },
  { name: combo.recipe[3], command: "↓ + 強P", moveSlug: "luke-crouching-hp" },
  { name: combo.recipe[4], command: "↓↙← + 中P", moveSlug: "luke-flash-knuckle-m" },
  { name: combo.recipe[5], command: "↓↙← + 弱P", moveSlug: "luke-flash-knuckle-l" },
] as const;

/** Existing local reference in the Combo section. No new publication or verification. */
export function LukeCanonicalComboReference({ characterSlug }: { characterSlug: string }) {
  if (characterSlug !== combo.character_slug ||
      !["development", "preview"].includes(process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "")) return null;
  return (
    <article id={`combo-${combo.combo_slug}`} className={`${styles.moveCard} ${styles.comboCard}`}
      data-combo-id={combo.combo_id} data-has-media="true" tabIndex={-1} aria-labelledby="luke-canonical-combo-title">
      <header><span className={styles.tag}>Classic・確認用コンボ</span>
        <h3 id="luke-canonical-combo-title">{combo.formal_card_name}</h3></header>
      <div className={styles.comboMedia}>
        <video controls playsInline preload="metadata" poster="/media/qa/luke/combo-clean-20261011-poster.jpg"
          className={styles.mediaAsset} aria-label="同じ6段Recipe構造の別録画">
          <source src={combo.media.clean.path} type="video/mp4" />
          動画を再生できません。下記の入力順をご確認ください。
        </video>
      </div>
      <div className={styles.comboRecipe} aria-label="クラシックのコンボ入力順">
        {lukeComboDisplayInputs.map((step, index) => <div className={styles.comboStep} key={index}>
          <small>{index + 1}. {step.name}</small>
          <Sf6CommandInput value={step.command} scheme="classic" accessibleName={`${step.name}：${step.command}`} />
        </div>)}
      </div>
      <dl className={styles.frames} aria-label="コンボの数値と終了状況">
        <div><dt>ダメージ</dt><dd>{combo.damage}</dd></div>
        <div><dt>Drive消費</dt><dd>{combo.drive_cost}本</dd></div>
        <div><dt>SA消費</dt><dd>{combo.sa_cost}本</dd></div>
        <div><dt>終了時の有利時間</dt><dd>+{combo.end_frame}F</dd></div>
        <div><dt>終了状況</dt><dd>相手ダウン</dd></div>
        <div><dt>難易度</dt><dd>未確認</dd></div>
      </dl>
      <div className={styles.comboDescription}>
        <h4>コンボの説明</h4>
        <p>{combo.purpose}。中フラッシュナックルから弱フラッシュナックルで締める、録画で観測した入力順です。</p>
        <p>ダメージ・消費ゲージ・終了状況は検証録画（Evidence）の記録です。動作映像は同じ入力順の別録画です。ホールドの長さ・ジャスト成功の客観確認と、現行バージョンでの成立条件は確認中です。</p>
      </div>
      <details className={styles.moveDetails}><summary>詳細（条件・確認状況）</summary>
        <dl className={styles.notes}>
          <div><dt>元の入力順</dt><dd>{combo.raw_recipe}</dd></div>
          <div><dt>位置・対応バージョン</dt><dd>未確認</dd></div>
          <div><dt>数値の根拠</dt><dd>Evidenceの実行を観測した記録です。参考映像で数値を再検証したものではありません。</dd></div>
          <div><dt>Modern</dt><dd>未確認</dd></div>
        </dl>
      </details>
    </article>
  );
}
