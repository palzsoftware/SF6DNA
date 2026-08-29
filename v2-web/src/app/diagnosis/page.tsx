import Link from "next/link";
import { listDiagnoses } from "@/lib/diagnosis";

export const metadata = { title: "診断" };

export default async function DiagnosisPage() {
  const diagnoses = await listDiagnoses();

  return (
    <div className="site-shell page-stack">
      <section className="hero">
        <p className="eyebrow">DIAGNOSIS</p>
        <h1>診断</h1>
        <p>短時間でプレイ傾向・課題・キャラクター候補を整理し、そのまま攻略・練習データへつなげます。</p>
      </section>

      <section>
        <div className="section-heading">
          <h2>診断を選ぶ</h2>
          <p>長大な100問診断ではなく、目的ごとに10〜20問前後へ分けた短時間診断を基本にしています。</p>
        </div>
        {diagnoses.length ? (
          <div className="card-grid diagnosis-grid">
            {diagnoses.map((diagnosis, index) => (
              <Link
                className="feature-card"
                data-icon={String(index + 1).padStart(2, "0")}
                href={`/diagnosis/${diagnosis.slug}`}
                key={diagnosis.id}
              >
                <div>
                  <p className="diagnosis-card__index">DIAGNOSIS {String(index + 1).padStart(2, "0")}</p>
                  <h3>{diagnosis.title}</h3>
                  <p>{diagnosis.description ?? "診断内容を確認する"}</p>
                </div>
                <span>{diagnosis.questionCount || "少数"}問で診断 →</span>
              </Link>
            ))}
          </div>
        ) : <div className="empty-state"><p>現在利用できる診断はありません。公開準備が整った診断から順に表示します。</p></div>}
      </section>
    </div>
  );
}
