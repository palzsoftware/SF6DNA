import { notFound } from "next/navigation";
import { DiagnosisRunner } from "@/components/diagnosis-runner";
import { getDiagnosisBySlug } from "@/lib/diagnosis";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const diagnosis = await getDiagnosisBySlug(slug);
  return { title: diagnosis ? `${diagnosis.title} | SF6DNA` : "診断 | SF6DNA" };
}

export default async function DiagnosisDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const diagnosis = await getDiagnosisBySlug(slug);
  if (!diagnosis) notFound();

  return (
    <div className="site-shell page-stack">
      <section className="hero">
        <p className="eyebrow">DIAGNOSIS</p>
        <h1>{diagnosis.title}</h1>
        <p>{diagnosis.description ?? "短時間で傾向を整理します。"}</p>
      </section>
      <DiagnosisRunner diagnosis={diagnosis} />
    </div>
  );
}
