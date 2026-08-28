import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { archiveQuestion, saveQuestion } from "../actions";

export default async function DiagnosisQuestionsPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ edit?: string }> }) {
  const { id } = await params;
  const { edit } = await searchParams;
  const { supabase } = await requireAdmin();
  const [{ data: diagnosis, error: diagnosisError }, { data: questions, error: questionsError }] = await Promise.all([
    supabase.from("diagnoses").select("id, title, slug, status").eq("id", id).maybeSingle(),
    supabase.from("diagnosis_questions").select("id, prompt, help_text, display_order, status").eq("diagnosis_id", id).neq("status", "archived").order("display_order"),
  ]);
  if (diagnosisError) throw new Error(diagnosisError.message);
  if (questionsError) throw new Error(questionsError.message);
  if (!diagnosis) notFound();
  const rows = questions ?? [];
  const editing = edit ? rows.find((row) => row.id === edit) ?? null : null;

  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero"><p className="eyebrow">ADMIN / DIAGNOSIS / QUESTIONS</p><h1>{diagnosis.title}</h1><p>質問の順序と文面を管理します。</p></section>
      <section className="info-panel"><div className="admin-section-heading"><div><h2>{editing ? "質問を編集" : "質問を追加"}</h2><p>選択肢は質問作成後に設定します。</p></div>{editing ? <Link className="button-secondary" href={`/admin/diagnoses/${id}`}>新規入力へ戻る</Link> : null}</div><form action={saveQuestion.bind(null, id, editing?.id ?? null)} className="admin-form"><div className="admin-form-grid"><label className="admin-span-2"><span>質問 *</span><textarea name="prompt" required rows={3} defaultValue={editing?.prompt ?? ""} /></label><label className="admin-span-2"><span>補足</span><textarea name="help_text" rows={2} defaultValue={editing?.help_text ?? ""} /></label><label><span>表示順</span><input name="display_order" type="number" defaultValue={editing?.display_order ?? rows.length + 1} /></label><label><span>Status</span><select name="status" defaultValue={editing?.status ?? "draft"}><option value="draft">draft</option><option value="published">published</option><option value="archived">archived</option></select></label></div><button className="button-primary" type="submit">{editing ? "保存" : "draftで作成"}</button></form></section>
      <section><div className="section-heading"><h2>質問一覧</h2></div>{rows.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>#</th><th>質問</th><th>Status</th><th>操作</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td>{row.display_order}</td><td>{row.prompt}</td><td>{row.status}</td><td className="admin-actions"><Link className="text-link" href={`/admin/diagnoses/${id}?edit=${row.id}`}>編集</Link><Link className="text-link" href={`/admin/diagnoses/${id}/questions/${row.id}`}>選択肢</Link><form action={archiveQuestion.bind(null, id, row.id)}><button className="button-secondary" type="submit">Archive</button></form></td></tr>)}</tbody></table></div> : <div className="empty-state"><h2>質問がありません</h2></div>}</section>
      <p><Link className="text-link" href="/admin/diagnoses">← 診断一覧へ</Link></p>
    </div>
  );
}
