import { notFound } from "next/navigation";
import { AdminCharacterForm } from "@/components/admin-character-form";
import { requireAdmin } from "@/lib/admin";
import { updateCharacter } from "../actions";

export default async function EditCharacterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("characters")
    .select("id, slug, name_ja, name_en, short_name, summary, archetype, preferred_range, difficulty, release_date, display_order, image_url, strengths_summary, weaknesses_summary, is_playable, status")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) notFound();

  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero"><p className="eyebrow">ADMIN / CHARACTERS</p><h1>{data.name_ja}を編集</h1></section>
      <AdminCharacterForm action={updateCharacter.bind(null, id)} value={data} submitLabel="保存" />
    </div>
  );
}
