import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminStrategyForm } from "@/components/admin-strategy-form";
import { requireAdmin } from "@/lib/admin";
import { isStrategyKind, STRATEGY_META } from "@/lib/admin-strategy";
import { archiveStrategyContent, saveStrategyContent } from "./actions";

export default async function StrategyAdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ kind: string }>;
  searchParams: Promise<{ edit?: string }>;
}) {
  const { kind: kindValue } = await params;
  if (!isStrategyKind(kindValue)) notFound();
  const kind = kindValue;
  const { edit } = await searchParams;
  const { supabase } = await requireAdmin();
  const meta = STRATEGY_META[kind];

  const [rowsResult, charactersResult, patchesResult, sourcesResult] = await Promise.all([
    supabase.from(meta.table).select("*").neq("status", "archived").order("updated_at", { ascending: false }).limit(100),
    supabase.from("characters").select("id, name_ja").neq("status", "archived").order("display_order"),
    supabase.from("patches").select("id, version_label, name, is_current").order("released_at", { ascending: false }),
    supabase.from("sources").select("id, title, publisher").order("created_at", { ascending: false }).limit(200),
  ]);

  if (rowsResult.error) throw new Error(rowsResult.error.message);
  if (charactersResult.error) throw new Error(charactersResult.error.message);
  if (patchesResult.error) throw new Error(patchesResult.error.message);
  if (sourcesResult.error) throw new Error(sourcesResult.error.message);

  const rows = (rowsResult.data ?? []) as Array<Record<string, string | number | boolean | null>>;
  const editing = edit ? rows.find((row) => String(row.id) === edit) ?? null : null;
  const titleColumn = meta.titleColumn;

  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero">
        <p className="eyebrow">ADMIN / STRATEGY</p>
        <h1>{meta.label}管理</h1>
        <p>検証前はdraft、SourceとPatchを確認してからpublishedへ切り替えます。Archiveは論理削除です。</p>
      </section>

      <section className="info-panel">
        <div className="admin-section-heading">
          <div><h2>{editing ? "編集" : "新規作成"}</h2><p>{editing ? String(editing[titleColumn] ?? editing.slug) : `${meta.label}を追加します。`}</p></div>
          {editing ? <Link className="button-secondary" href={`/admin/content/${kind}`}>新規入力へ戻る</Link> : null}
        </div>
        <AdminStrategyForm
          kind={kind}
          action={saveStrategyContent.bind(null, kind, editing ? String(editing.id) : null)}
          value={editing}
          characters={(charactersResult.data ?? []).map((row) => ({ id: String(row.id), label: String(row.name_ja) }))}
          patches={(patchesResult.data ?? []).map((row) => ({ id: String(row.id), label: `${row.is_current ? "[CURRENT] " : ""}${row.version_label}${row.name ? ` ${row.name}` : ""}` }))}
          sources={(sourcesResult.data ?? []).map((row) => ({ id: String(row.id), label: `${row.publisher ? `${row.publisher} / ` : ""}${row.title}` }))}
        />
      </section>

      <section>
        <div className="section-heading"><h2>登録済み</h2><p>最大100件を更新順に表示します。</p></div>
        {rows.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>名称</th><th>Slug</th><th>検証</th><th>Status</th><th>操作</th></tr></thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={String(row.id)}>
                    <td>{String(row[titleColumn] ?? "-")}</td>
                    <td><code>{String(row.slug ?? "-")}</code></td>
                    <td>{String(row.verification_status ?? "-")}</td>
                    <td>{String(row.status ?? "-")}</td>
                    <td className="admin-actions">
                      <Link className="text-link" href={`/admin/content/${kind}?edit=${row.id}`}>編集</Link>
                      {row.status === "published" && row.slug ? <Link className="text-link" href={`${meta.publicPath}/${row.slug}`}>公開ページ</Link> : null}
                      <form action={archiveStrategyContent.bind(null, kind, String(row.id))}><button className="button-secondary" type="submit">Archive</button></form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <div className="empty-state"><h2>まだデータがありません</h2><p>上のフォームからdraftデータを作成できます。</p></div>}
      </section>
    </div>
  );
}
