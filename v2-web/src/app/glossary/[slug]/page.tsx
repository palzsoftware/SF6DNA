import { notFound } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function GlossaryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) notFound();

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("glossary")
    .select("id, slug, term, short_definition, definition")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) notFound();

  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero">
        <p className="eyebrow">GLOSSARY</p>
        <h1>{data.term}</h1>
        {data.short_definition ? <p>{data.short_definition}</p> : null}
      </section>
      <section className="info-panel"><p className="preline">{data.definition ?? "詳しい説明を準備中です。"}</p></section>
    </div>
  );
}
