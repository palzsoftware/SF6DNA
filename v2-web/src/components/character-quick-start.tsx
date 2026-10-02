import Image from "next/image";
import { getPilotIllustration } from "@/lib/illustration-pilot";
import Link from "next/link";
import styles from "./character-quick-start.module.css";

const steps = [
  ["pilot-overview", "特徴を知る", "特徴と得意な距離を見る"],
  ["pilot-moves", "技を確認する", "技名・コマンドを調べる"],
  ["pilot-first-lesson", "練習する", "最初の練習内容を見る"],
  ["related-players", "プレイヤーを見る", "関連プレイヤーを探す"],
  ["related-videos", "動画を見る", "関連動画を探す"],
] as const;

export function CharacterQuickStart({ characterSlug = "" }: { characterSlug?: string } = {}) {
  const illustration = getPilotIllustration(characterSlug);
  return <nav className={styles.panel} aria-labelledby="character-quick-start-heading">
    <div className={styles.heading}>
      <h2 id="character-quick-start-heading">このキャラを始めるなら</h2>
      {illustration ? <Image className={styles.guide} src={illustration.url} alt="" width={80} height={108} unoptimized loading="lazy" /> : null}
    </div>
    <ol className={styles.steps}>{steps.map(([id, title, description], index) =>
      <li key={id}><a href={`#${id}`}><span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
        <span><strong>{title}</strong><small>{description}</small></span></a></li>
    )}</ol>
    <Link className={styles.dailyLink} href="/me/training">
      今日の15分練習を決める <span aria-hidden="true">→</span>
    </Link>
  </nav>;
}
