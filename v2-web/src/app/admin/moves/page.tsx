import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { archiveMove } from "./actions";

export const metadata = { title: "技・フレーム管理 | SF6DNA" };

export default async function AdminMovesPage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("moves")
    .select("id, slug, name_ja, name_en, move_type, strength_variant, status, characters(name_ja)")
    .order("character_id")
    .order("display_order")
    .limit(1000);
  if (error) throw new Error(error.message);

  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero">
        <p className="eyebrow">ADMIN / MOVES</p>
        <h1>技・フレーム管理</h1>
        <p>技本体、Classic/Modernコマンド、フレーム、Patch、Sourceを登録します。未検証データはdraftのまま保持します。</p>
        <Link className="button-primary inline-button" href="/admin/moves/new">新規技を登録</Link>
      </section>

      <section className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>キャラ</th><th>技名</th><th>種別</th><th>Status</th><th>操作</th></tr></thead>
          <tbody>
            {(data ?? []).map((move) => {
              const character = move.characters as unknown as { name_ja?: string } | null;
              return (
                <tr key={move.id}>
                  <td>{character?.name_ja ?? "-"}</td>
                  <td><strong>{move.name_ja}</strong>{move.name_en ? <small>{move.name_en}</small> : null}<small>{move.slug}</small></td>
                  <td>{move.move_type}{move.strength_variant ? ` / ${move.strength_variant}` : ""}</td>
                  <td>{move.status}</td>
                  <td className="admin-row-actions">
                    <Link className="button-secondary" href={`/admin/moves/${move.id}`}>編集</Link>
                    {move.status !== "archived" ? <form action={archiveMove.bind(null, move.id)}><button className="button-secondary" type="submit">Archive</button></form> : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
