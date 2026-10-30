import type { CSSProperties } from "react";
import { diagnosisPresentation } from "@/lib/diagnosis-presentation";
import { notFound } from "next/navigation";
import { DiagnosisRunner } from "@/components/diagnosis-runner";
import { getDiagnosisBySlug } from "@/lib/diagnosis";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const diagnosis = await getDiagnosisBySlug(slug);
  return { title: diagnosis ? diagnosisPresentation(diagnosis.title, diagnosis.description).title : "診断" };
}

export default async function DiagnosisDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const diagnosis = await getDiagnosisBySlug(slug);
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
