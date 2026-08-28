import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { deleteOption, saveOption } from "../../../actions";

export default async function DiagnosisOptionsPage({ params, searchParams }: { params: Promise<{ id: string; questionId: string }>; searchParams: Promise<{ edit?: string }> }) {
  const { id, questionId } = await params;
  const { edit } = await searchParams;
  const { supabase } = await requireAdmin();
  const [{ data: diagnosis }, { data: question, error: questionError }, { data: options, error: optionsError }] = await Promise.all([
    supabase.from("diagnoses").select("title").eq("id", id).maybeSingle(),
    supabase.from("diagnosis_questions").select("id, prompt").eq("id", questionId).eq("diagnosis_id", id).maybeSingle(),
    supabase.from("diagnosis_options").select("id, label, value, score_payload, display_order").eq("question_id", questionId).order("display_order"),
  ]);
  if (questionError) throw new Error(questionError.message);
  if (optionsError) throw new Error(optionsError.message);
  if (!question) notFound();
  const rows = options ?? [];
  const editing = edit ? rows.find((row) => row.id === edit) ?? null : null;

  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero"><p className="eyebrow">ADMIN / DIAGNOSIS / OPTIONS</p><h1>{diagnosis?.title ?? "診断"}</h1><p>{question.prompt}</p></section>
      <section className="info-panel"><div className="admin-section-heading"><div><h2>{editing ? "選択肢を編集" : "選択肢を追加"}</h2><p>score_payloadはJSONで保存します。UIにスコアロジックをハードコードしません。</p></div>{editing ? <Link className="button-secondary" href={`/admin/diagnoses/${id}/questions/${questionId}`}>新規入力へ戻る</Link> : null}</div><form action={saveOption.bind(null, id, questionId, editing?.id ?? null)} className="admin-form"><div className="admin-form-grid"><label><span>表示ラベル *</span><input name="label" required defaultValue={editing?.label ?? ""} /></label><label><span>Value *</span><input name="value" required defaultValue={editing?.value ?? ""} /></label><label><span>表示順</span><input name="display_order" type="number" defaultValue={editing?.display_order ?? rows.length + 1} /></label><label className="admin-span-2"><span>score_payload JSON *</span><textarea name="score_payload" required rows={6} defaultValue={editing ? JSON.stringify(editing.score_payload, null, 2) : "{}"} /></label></div><button className="button-primary" type="submit">{editing ? "保存" : "追加"}</button></form></section>
      <section><div className="section-heading"><h2>選択肢一覧</h2></div>{rows.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>#</th><th>Label</th><th>Value</th><th>Score</th><th>操作</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td>{row.display_order}</td><td>{row.label}</td><td><code>{row.value}</code></td><td><code>{JSON.stringify(row.score_payload)}</code></td><td className="admin-actions"><Link className="text-link" href={`/admin/diagnoses/${id}/questions/${questionId}?edit=${row.id}`}>編集</Link><form action={deleteOption.bind(null, id, questionId, row.id)}><button className="button-secondary" type="submit">削除</button></form></td></tr>)}</tbody></table></div> : <div className="empty-state"><h2>選択肢がありません</h2></div>}</section>
      <p><Link className="text-link" href={`/admin/diagnoses/${id}`}>← 質問一覧へ</Link></p>
    </div>
  );
}
