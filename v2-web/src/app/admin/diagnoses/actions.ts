"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";

const text = (fd: FormData, key: string) => {
  const value = fd.get(key);
  return typeof value === "string" ? value.trim() : "";
};
const nullable = (fd: FormData, key: string) => text(fd, key) || null;
const integer = (fd: FormData, key: string, fallback = 0) => {
  const value = Number(text(fd, key));
  return Number.isInteger(value) ? value : fallback;
};

type AdminSupabase = Awaited<ReturnType<typeof requireAdmin>>["supabase"];

export async function saveDiagnosis(id: string | null, formData: FormData) {
  const { supabase } = await requireAdmin();
  const requestedStatus = text(formData, "status") || "draft";
  const payload = {
    slug: text(formData, "slug"),
    title: text(formData, "title"),
    description: nullable(formData, "description"),
    diagnosis_type: text(formData, "diagnosis_type"),
    question_count: integer(formData, "question_count"),
    display_order: integer(formData, "display_order"),
    status: requestedStatus,
  };
  if (!payload.slug || !payload.title || !payload.diagnosis_type) throw new Error("slug, title and diagnosis_type are required");

  if (requestedStatus === "published") {
    if (!id) {
      throw new Error("新規診断はdraftで作成し、質問と選択肢を登録してからpublishedへ変更してください");
    }
    payload.question_count = await ensureDiagnosisPublishable(supabase, id);
  }

  const query = id ? supabase.from("diagnoses").update(payload).eq("id", id) : supabase.from("diagnoses").insert(payload);
  const { error } = await query;
  if (error) throw new Error(error.message);
  revalidatePath("/admin/diagnoses");
  revalidatePath("/diagnosis");
  redirect("/admin/diagnoses");
}

export async function archiveDiagnosis(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("diagnoses").update({ status: "archived" }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/diagnoses");
  revalidatePath("/diagnosis");
}

export async function saveQuestion(diagnosisId: string, id: string | null, formData: FormData) {
  const { supabase } = await requireAdmin();
  const requestedStatus = text(formData, "status") || "draft";
  const payload = {
    diagnosis_id: diagnosisId,
    prompt: text(formData, "prompt"),
    help_text: nullable(formData, "help_text"),
    display_order: integer(formData, "display_order"),
    status: requestedStatus,
  };
  if (!payload.prompt) throw new Error("prompt is required");

  if (requestedStatus === "published") {
    if (!id) {
      throw new Error("新規質問はdraftで作成し、選択肢を登録してからpublishedへ変更してください");
    }
    await ensureQuestionHasOptions(supabase, diagnosisId, id);
  }

  const query = id ? supabase.from("diagnosis_questions").update(payload).eq("id", id).eq("diagnosis_id", diagnosisId) : supabase.from("diagnosis_questions").insert(payload);
  const { error } = await query;
  if (error) throw new Error(error.message);
  await syncQuestionCount(supabase, diagnosisId);
  revalidatePath(`/admin/diagnoses/${diagnosisId}`);
  revalidatePath("/diagnosis");
  redirect(`/admin/diagnoses/${diagnosisId}`);
}

export async function archiveQuestion(diagnosisId: string, id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("diagnosis_questions").update({ status: "archived" }).eq("id", id).eq("diagnosis_id", diagnosisId);
  if (error) throw new Error(error.message);
  await syncQuestionCount(supabase, diagnosisId);
  revalidatePath(`/admin/diagnoses/${diagnosisId}`);
  revalidatePath("/diagnosis");
}

export async function saveOption(diagnosisId: string, questionId: string, id: string | null, formData: FormData) {
  const { supabase } = await requireAdmin();
  const scoreText = text(formData, "score_payload") || "{}";
  let scorePayload: unknown;
  try { scorePayload = JSON.parse(scoreText); } catch { throw new Error("score_payload must be valid JSON"); }
  const payload = {
    question_id: questionId,
    label: text(formData, "label"),
    value: text(formData, "value"),
    score_payload: scorePayload,
    display_order: integer(formData, "display_order"),
  };
  if (!payload.label || !payload.value) throw new Error("label and value are required");
  const query = id ? supabase.from("diagnosis_options").update(payload).eq("id", id).eq("question_id", questionId) : supabase.from("diagnosis_options").insert(payload);
  const { error } = await query;
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/diagnoses/${diagnosisId}/questions/${questionId}`);
  revalidatePath("/diagnosis");
  redirect(`/admin/diagnoses/${diagnosisId}/questions/${questionId}`);
}

export async function deleteOption(diagnosisId: string, questionId: string, id: string) {
  const { supabase } = await requireAdmin();
  await ensureOptionDeletionSafe(supabase, diagnosisId, questionId, id);
  const { error } = await supabase.from("diagnosis_options").delete().eq("id", id).eq("question_id", questionId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/diagnoses/${diagnosisId}/questions/${questionId}`);
  revalidatePath("/diagnosis");
}

async function ensureDiagnosisPublishable(supabase: AdminSupabase, diagnosisId: string) {
  const { data: questions, error: questionError } = await supabase
    .from("diagnosis_questions")
    .select("id")
    .eq("diagnosis_id", diagnosisId)
    .eq("status", "published");
  if (questionError) throw new Error(questionError.message);
  if (!questions?.length) throw new Error("published診断にはpublished質問が1件以上必要です");

  const questionIds = questions.map((question) => question.id);
  const { data: options, error: optionError } = await supabase
    .from("diagnosis_options")
    .select("question_id")
    .in("question_id", questionIds);
  if (optionError) throw new Error(optionError.message);

  const questionsWithOptions = new Set((options ?? []).map((option) => option.question_id));
  const missing = questionIds.filter((questionId) => !questionsWithOptions.has(questionId));
  if (missing.length) throw new Error("published診断の全質問に選択肢が必要です");

  return questionIds.length;
}

async function ensureQuestionHasOptions(supabase: AdminSupabase, diagnosisId: string, questionId: string) {
  const { data: question, error: questionError } = await supabase
    .from("diagnosis_questions")
    .select("id")
    .eq("id", questionId)
    .eq("diagnosis_id", diagnosisId)
    .maybeSingle();
  if (questionError) throw new Error(questionError.message);
  if (!question) throw new Error("質問が診断に属していません");

  const { count, error: optionError } = await supabase
    .from("diagnosis_options")
    .select("id", { count: "exact", head: true })
    .eq("question_id", questionId);
  if (optionError) throw new Error(optionError.message);
  if (!count) throw new Error("published質問には選択肢が1件以上必要です");
}

async function ensureOptionDeletionSafe(
  supabase: AdminSupabase,
  diagnosisId: string,
  questionId: string,
  optionId: string,
) {
  const [{ data: diagnosis, error: diagnosisError }, { data: question, error: questionError }, { count, error: optionError }] = await Promise.all([
    supabase.from("diagnoses").select("status").eq("id", diagnosisId).maybeSingle(),
    supabase.from("diagnosis_questions").select("status").eq("id", questionId).eq("diagnosis_id", diagnosisId).maybeSingle(),
    supabase.from("diagnosis_options").select("id", { count: "exact", head: true }).eq("question_id", questionId),
  ]);
  if (diagnosisError) throw new Error(diagnosisError.message);
  if (questionError) throw new Error(questionError.message);
  if (optionError) throw new Error(optionError.message);

  const { data: option, error: targetError } = await supabase
    .from("diagnosis_options")
    .select("id")
    .eq("id", optionId)
    .eq("question_id", questionId)
    .maybeSingle();
  if (targetError) throw new Error(targetError.message);
  if (!option) throw new Error("選択肢が質問に属していません");

  if (diagnosis?.status === "published" && question?.status === "published" && (count ?? 0) <= 1) {
    throw new Error("公開中の質問から最後の選択肢は削除できません。先に質問をdraftへ変更してください");
  }
}

async function syncQuestionCount(supabase: AdminSupabase, diagnosisId: string) {
  const { data: diagnosis, error: diagnosisError } = await supabase
    .from("diagnoses")
    .select("status")
    .eq("id", diagnosisId)
    .maybeSingle();
  if (diagnosisError) throw new Error(diagnosisError.message);
  if (!diagnosis) throw new Error("診断が見つかりません");

  let query = supabase
    .from("diagnosis_questions")
    .select("id", { count: "exact", head: true })
    .eq("diagnosis_id", diagnosisId);
  query = diagnosis.status === "published"
    ? query.eq("status", "published")
    : query.neq("status", "archived");

  const { count, error } = await query;
  if (error) throw new Error(error.message);
  const { error: updateError } = await supabase.from("diagnoses").update({ question_count: count ?? 0 }).eq("id", diagnosisId);
  if (updateError) throw new Error(updateError.message);
}
