import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { archiveCharacter } from "./actions";

export const metadata = { title: "キャラクター管理 | SF6DNA" };

export default async function AdminCharactersPage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("characters")
    .select("id, slug, name_ja, name_en, status, is_playable, display_order")
    .order("display_order", { ascending: true, nullsFirst: false })
    .order("name_ja");

  if (error) throw new Error(error.message);

  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero">
        <p className="eyebrow">ADMIN / CHARACTERS</p>
        <h1>キャラクター管理</h1>
        <p>基本プロフィールのdraft / published / archivedを管理します。攻略データは別エンティティで管理します。</p>
        <Link className="button-primary inline-button" href="/admin/characters/new">新規キャラクター</Link>
      </section>

      <section className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>名前</th><th>Slug</th><th>Status</th><th>Playable</th><th>操作</th></tr></thead>
          <tbody>
            {(data ?? []).map((character) => (
              <tr key={character.id}>
                <td><strong>{character.name_ja}</strong>{character.name_en ? <small>{character.name_en}</small> : null}</td>
                <td><code>{character.slug}</code></td>
                <td>{character.status}</td>
                <td>{character.is_playable ? "Yes" : "No"}</td>
                <td className="admin-row-actions">
                  <Link className="button-secondary" href={`/admin/characters/${character.id}`}>編集</Link>
                  {character.status !== "archived" ? (
                    <form action={archiveCharacter.bind(null, character.id)}>
                      <button className="button-secondary" type="submit">Archive</button>
                    </form>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
