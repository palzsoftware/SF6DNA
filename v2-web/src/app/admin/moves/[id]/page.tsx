import { notFound } from "next/navigation";
import { AdminMoveForm } from "@/components/admin-move-form";
import { requireAdmin } from "@/lib/admin";
import { updateMove } from "../actions";

export default async function EditMovePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const [{ data: move, error: moveError }, { data: characters, error: characterError }] = await Promise.all([
    supabase.from("moves").select("id, character_id, slug, name_ja, name_en, move_type, strength_variant, description, usage_summary, display_order, status").eq("id", id).maybeSingle(),
    supabase.from("characters").select("id, name_ja").neq("status", "archived").order("display_order"),
  ]);
  if (moveError) throw new Error(moveError.message);
  if (characterError) throw new Error(characterError.message);
  if (!move) notFound();

  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero"><p className="eyebrow">ADMIN / MOVES</p><h1>{move.name_ja}を編集</h1><p>基本情報のみ編集します。フレーム履歴はPatch単位で別レコードとして扱うため、この画面から既存履歴を上書きしません。</p></section>
      <AdminMoveForm
        action={updateMove.bind(null, id)}
        submitLabel="保存"
        value={move}
        includeEvidence={false}
        characters={(characters ?? []).map((item) => ({ id: item.id, label: item.name_ja }))}
        patches={[]}
        sources={[]}
      />
    </div>
  );
}
