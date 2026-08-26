import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminReferenceForm } from "@/components/admin-reference-form";
import { requireAdmin } from "@/lib/admin";
import { isReferenceKind, REFERENCE_META } from "@/lib/admin-reference";
import { archiveReferenceContent, saveReferenceContent } from "./actions";

export default async function ReferenceAdminPage({ params, searchParams }: { params: Promise<{ kind: string }>; searchParams: Promise<{ edit?: string }> }) {
  const { kind: kindValue } = await params;
  if (!isReferenceKind(kindValue)) notFound();
  const kind = kindValue;
  const { edit } = await searchParams;
  const { supabase } = await requireAdmin();
  const meta = REFERENCE_META[kind];

  const { data, error } = await supabase.from(meta.table).select("*").neq("status", "archived").order("updated_at", { ascending: false }).limit(100);
  if (error) throw new Error(error.message);
  const rows = (data ?? []) as Array<Record<string, string | number | boolean | null>>;
  const editing = edit ? rows.find((row) => String(row.id) === edit) ?? null : null;

  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero"><p className="eyebrow">ADMIN / REFERENCE</p><h1>{meta.label}管理</h1><p>公開前に内容・公式性・時点を確認し、draftからpublishedへ切り替えます。</p></section>
      <section className="info-panel">
        <div className="admin-section-heading"><div><h2>{editing ? "編集" : "新規作成"}</h2><p>{editing ? String(editing[meta.titleColumn] ?? editing.slug ?? "") : `${meta.label}を追加します。`}</p></div>{editing ? <Link className="button-secondary" href={`/admin/reference/${kind}`}>新規入力へ戻る</Link> : null}</div>
        <AdminReferenceForm kind={kind} action={saveReferenceContent.bind(null, kind, editing ? String(editing.id) : null)} value={editing} />
      </section>
      <section>
        <div className="section-heading"><h2>登録済み</h2><p>最大100件を更新順に表示します。</p></div>
        {rows.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>名称</th><th>Slug</th><th>Status</th><th>操作</th></tr></thead><tbody>{rows.map((row) => <tr key={String(row.id)}><td>{String(row[meta.titleColumn] ?? "-")}</td><td><code>{String(row.slug ?? "-")}</code></td><td>{String(row.status ?? "-")}</td><td className="admin-actions"><Link className="text-link" href={`/admin/reference/${kind}?edit=${row.id}`}>編集</Link>{row.status === "published" && row.slug ? <Link className="text-link" href={`${meta.publicPath}/${row.slug}`}>公開ページ</Link> : null}<form action={archiveReferenceContent.bind(null, kind, String(row.id))}><button className="button-secondary" type="submit">Archive</button></form></td></tr>)}</tbody></table></div> : <div className="empty-state"><h2>まだデータがありません</h2><p>上のフォームからdraftデータを作成できます。</p></div>}
      </section>
    </div>
  );
}
