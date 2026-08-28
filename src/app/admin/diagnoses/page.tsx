import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { archiveDiagnosis, saveDiagnosis } from "./actions";

export default async function DiagnosesAdminPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const { edit } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("diagnoses").select("id, slug, title, description, diagnosis_type, question_count, display_order, status").neq("status", "archived").order("display_order");
  if (error) throw new Error(error.message);
  const rows = data ?? [];
  const editing = edit ? rows.find((row) => row.id === edit) ?? null : null;

  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero"><p className="eyebrow">ADMIN / DIAGNOSIS</p><h1>診断管理</h1><p>診断本体、質問、選択肢、score_payloadをDB駆動で管理します。</p></section>
      <section className="info-panel">
        <div className="admin-section-heading"><div><h2>{editing ? "診断を編集" : "診断を追加"}</h2><p>公開前に質問数と結果ロジックを確認します。</p></div>{editing ? <Link className="button-secondary" href="/admin/diagnoses">新規入力へ戻る</Link> : null}</div>
        <form action={saveDiagnosis.bind(null, editing?.id ?? null)} className="admin-form"><div className="admin-form-grid">
          <label><span>Slug *</span><input name="slug" required defaultValue={editing?.slug ?? ""} /></label>
          <label><span>タイトル *</span><input name="title" required defaultValue={editing?.title ?? ""} /></label>
          <label><span>診断タイプ *</span><input name="diagnosis_type" required defaultValue={editing?.diagnosis_type ?? ""} placeholder="improvement / character_fit / playstyle" /></label>
          <label><span>表示順</span><input name="display_order" type="number" defaultValue={editing?.display_order ?? 0} /></label>
          <label><span>質問数</span><input name="question_count" type="number" readOnly value={editing?.question_count ?? 0} /></label>
          <label><span>Status</span><select name="status" defaultValue={editing?.status ?? "draft"}><option value="draft">draft</option><option value="published">published</option><option value="archived">archived</option></select></label>
          <label className="admin-span-2"><span>説明</span><textarea name="description" rows={4} defaultValue={editing?.description ?? ""} /></label>
        </div><button className="button-primary" type="submit">{editing ? "保存" : "draftで作成"}</button></form>
      </section>
      <section><div className="section-heading"><h2>診断一覧</h2></div>{rows.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>タイトル</th><th>Type</th><th>Questions</th><th>Status</th><th>操作</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td>{row.title}<small><code>{row.slug}</code></small></td><td>{row.diagnosis_type}</td><td>{row.question_count}</td><td>{row.status}</td><td className="admin-actions"><Link className="text-link" href={`/admin/diagnoses?edit=${row.id}`}>編集</Link><Link className="text-link" href={`/admin/diagnoses/${row.id}`}>質問</Link>{row.status === "published" ? <Link className="text-link" href={`/diagnosis/${row.slug}`}>公開ページ</Link> : null}<form action={archiveDiagnosis.bind(null, row.id)}><button className="button-secondary" type="submit">Archive</button></form></td></tr>)}</tbody></table></div> : <div className="empty-state"><h2>診断がありません</h2></div>}</section>
    </div>
  );
}
