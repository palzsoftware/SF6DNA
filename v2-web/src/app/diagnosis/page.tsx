import Link from "next/link";
import { listDiagnoses } from "@/lib/diagnosis";

export const metadata = { title: "診断" };

export default async function DiagnosisPage() {
  const diagnoses = await listDiagnoses();

  return (
    <div className="site-shell page-stack experience-analysis">
      <section className="hero">
        <p className="eyebrow">DIAGNOSIS</p>
        <h1>自分のプレイを、振り返る。</h1><ol className="analysis-route" aria-label="診断の流れ"><li>回答する</li><li>傾向を知る</li><li>練習を決める</li></ol>
        <p>プレイ傾向や課題を知り、今日の練習を決めましょう。キャラクター選びに役立つ診断もあります。</p>
      </section>

      <section>
        <div className="section-heading">
          <h2>診断を選ぶ</h2>
          <p>知りたいことに合わせて、短い診断を選べます。</p>
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
                  <p>{diagnosis.description ?? "回答からプレイ傾向を振り返れます"}</p>
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
