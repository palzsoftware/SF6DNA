import { AdminMoveForm } from "@/components/admin-move-form";
import { requireAdmin } from "@/lib/admin";
import { createMove } from "../actions";

export const metadata = { title: "新規技登録 | SF6DNA" };

export default async function NewMovePage() {
  const { supabase } = await requireAdmin();
  const [{ data: characters, error: characterError }, { data: patches, error: patchError }, { data: sources, error: sourceError }] = await Promise.all([
    supabase.from("characters").select("id, name_ja").neq("status", "archived").order("display_order"),
    supabase.from("patches").select("id, version_label, name").order("released_at", { ascending: false, nullsFirst: false }),
    supabase.from("sources").select("id, title, publisher").order("published_at", { ascending: false, nullsFirst: false }).limit(200),
  ]);
  if (characterError) throw new Error(characterError.message);
  if (patchError) throw new Error(patchError.message);
  if (sourceError) throw new Error(sourceError.message);

  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero"><p className="eyebrow">ADMIN / MOVES</p><h1>新規技を登録</h1><p>SourceとPatchが確認できる場合だけフレーム情報を入力し、検証前はdraft / unverifiedで保存します。</p></section>
      <AdminMoveForm
        action={createMove}
        submitLabel="技を登録"
        characters={(characters ?? []).map((item) => ({ id: item.id, label: item.name_ja }))}
        patches={(patches ?? []).map((item) => ({ id: item.id, label: `${item.version_label}${item.name ? ` / ${item.name}` : ""}` }))}
        sources={(sources ?? []).map((item) => ({ id: item.id, label: `${item.publisher ? `${item.publisher} / ` : ""}${item.title}` }))}
      />
    </div>
  );
}
