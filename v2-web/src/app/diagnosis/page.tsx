import Link from "next/link";
import { listDiagnoses } from "@/lib/diagnosis";

export const metadata = { title: "診断 | SF6DNA" };

export default async function DiagnosisPage() {
  const diagnoses = await listDiagnoses();

  return (
    <div className="site-shell page-stack">
      <section className="hero">
        <p className="eyebrow">DIAGNOSIS</p>
        <h1>診断</h1>
        <p>少数問でプレイ傾向・課題・キャラクター候補を整理し、SF6DNA内の情報へ接続する入口です。</p>
      </section>

      <section>
        <div className="section-heading"><h2>診断を選ぶ</h2><p>長大な100問診断ではなく、短時間で完了する診断を基本にします。</p></div>
        {diagnoses.length ? (
          <div className="card-grid">
            {diagnoses.map((diagnosis) => (
              <Link className="feature-card" href={`/diagnosis/${diagnosis.slug}`} key={diagnosis.id}>
                <div><h3>{diagnosis.title}</h3><p>{diagnosis.description ?? "診断内容を確認する"}</p></div>
                <span>{diagnosis.questionCount || "少数"}問 →</span>
              </Link>
            ))}
          </div>
        ) : <div className="empty-state"><p>公開済み診断はまだありません。診断エンジン自体はDB駆動で準備済みです。</p></div>}
      </section>
    </div>
  );
}
