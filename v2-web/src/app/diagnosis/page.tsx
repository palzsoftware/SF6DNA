import { publicPageMetadata } from "@/lib/public-page-metadata";
import Link from "next/link";
import { listDiagnoses } from "@/lib/diagnosis";
import { diagnosisPresentation } from "@/lib/diagnosis-presentation";
import styles from "./diagnosis-entry.module.css";

export const metadata = publicPageMetadata("/diagnosis", { title: "診断" });

export default async function DiagnosisPage() {
  const diagnoses = await listDiagnoses();
  return (
    <div className={`site-shell page-stack ${styles.page}`}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>PLAY CHECK</p>
        <h1>あなたのプレイ、<br />どこを伸ばす？</h1>
        <p className={styles.intro}>あなたのプレイや課題を客観的に知り、今日の練習を決めよう。<br />キャラ選びに役立つ診断も用意！</p>
        <p className={styles.note}>普段の対戦を思い出して、近いものを選んでください。</p>
      </section>
      <section aria-labelledby="diagnosis-choice-title">
        <div className={styles.heading}>
          <h2 id="diagnosis-choice-title">今、何を知りたい？</h2>
          <p>気になるものから始めよう。</p>
        </div>
        {diagnoses.length ? <div className={styles.grid}>
          {diagnoses.map(diagnosis => {
            const copy = diagnosisPresentation(diagnosis.title, diagnosis.description);
            return <Link className={styles.card} href={`/diagnosis/${encodeURIComponent(diagnosis.slug)}`} key={diagnosis.id}>
              <span className={styles.purpose}>{copy.label}</span>
              <h3>{copy.title}</h3>
              <p className={styles.description}>{copy.description}</p>
              <span className={styles.action}><span>{diagnosis.questionCount > 0 ? `全${diagnosis.questionCount}問` : "質問に回答"}</span><strong>診断を始める <span aria-hidden="true">↗</span></strong></span>
            </Link>;
          })}
        </div> : <div className="empty-state"><p>現在利用できる診断はありません。公開準備が整った診断から順に表示します。</p></div>}
        <Link className={styles.consultation} href="/diagnosis/character-consultation"><span>使っているキャラの悩みなら</span><strong>キャラ別お悩み診断へ →</strong></Link>
      </section>
    </div>
  );
}
