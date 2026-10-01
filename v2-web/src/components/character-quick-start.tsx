import styles from "./character-quick-start.module.css";

const steps = [
  ["pilot-overview", "特徴を知る", "特徴と得意な距離を見る"],
  ["pilot-moves", "技を確認する", "技名・コマンドを調べる"],
  ["pilot-first-lesson", "練習する", "最初の練習内容を見る"],
  ["related-players", "プレイヤーを見る", "関連プレイヤーを探す"],
  ["related-videos", "動画を見る", "関連動画を探す"],
] as const;

export function CharacterQuickStart() {
  return <nav className={styles.panel} aria-labelledby="character-quick-start-heading">
    <h2 id="character-quick-start-heading">このキャラを始めるなら</h2>
    <ol className={styles.steps}>{steps.map(([id, title, description], index) =>
      <li key={id}><a href={`#${id}`}><span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
        <span><strong>{title}</strong><small>{description}</small></span></a></li>
    )}</ol>
  </nav>;
}
