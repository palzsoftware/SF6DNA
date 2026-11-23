import { cache } from "react";
import { notFound } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { publicPageMetadata } from "@/lib/public-page-metadata";

// One published-row read shared by metadata and page within a request (React cache).
const getPublishedGlossaryTerm = cache(async (slug: string) => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null;
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("glossary")
    .select("id, slug, term, short_definition, definition")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return error || !data ? null : data;
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getPublishedGlossaryTerm(slug);
  return publicPageMetadata(`/glossary/${encodeURIComponent(slug)}`, { title: data?.term ?? "用語", description: data?.short_definition ?? undefined }, Boolean(data));
}

export default async function GlossaryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getPublishedGlossaryTerm(slug);
  if (!data) notFound();

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
