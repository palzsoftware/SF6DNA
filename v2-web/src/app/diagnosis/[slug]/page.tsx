import { cache, type CSSProperties } from "react";
import Link from "next/link";
import { diagnosisPresentation } from "@/lib/diagnosis-presentation";
import { notFound } from "next/navigation";
import { DiagnosisRunner } from "@/components/diagnosis-runner";
import { getDiagnosisBySlug } from "@/lib/diagnosis";

const loadDiagnosis = cache(async (slug: string) => {
  try {
    return { status: "loaded" as const, diagnosis: await getDiagnosisBySlug(slug) };
  } catch (error) {
    if (error instanceof Error && error.message === "diagnosis_service_unavailable") {
      return { status: "unavailable" as const };
    }
    throw error;
  }
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await loadDiagnosis(slug);
  if (result.status === "unavailable") {
    return { title: "診断を読み込めません", robots: { index: false, follow: false } };
  }
  const { diagnosis } = result;
  return { title: diagnosis ? diagnosisPresentation(diagnosis.title, diagnosis.description).title : "診断" };
}

export default async function DiagnosisDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await loadDiagnosis(slug);
  if (result.status === "unavailable") {
    return <div className="site-shell page-stack">
      <section className="empty-state" role="alert">
        <h1>診断を読み込めません</h1>
        <p>時間をおいて再度お試しください。</p>
        <Link className="button-primary inline-button" href="/diagnosis">診断一覧へ</Link>
        <Link className="button-secondary inline-button" href="/me/training">今日の15分練習へ</Link>
      </section>
    </div>;
  }
  const { diagnosis } = result;
  if (!diagnosis) notFound();
  const copy = diagnosisPresentation(diagnosis.title, diagnosis.description);

  return (
    <div
      className="site-shell page-stack experience-analysis"
      style={{
        "--accent": ({
          "improvement-check": "#ff7a18",
          "playstyle-check": "#3ad6ff",
          "character-fit-check": "#a78bfa",
          "comprehensive-check": "#38d996",
        } as Record<string, string>)[slug] ?? "#ff7a18",
        "--focus-ring": "var(--accent)",
      } as CSSProperties}
    >
      <section className="hero">
        <p className="eyebrow">DIAGNOSIS</p>
        <h1>{copy.title}</h1>
        <p>{copy.description}</p>
      </section>
      <DiagnosisRunner diagnosis={diagnosis} />
    </div>
  );
}
