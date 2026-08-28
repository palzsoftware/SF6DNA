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

export async function saveDiagnosis(id: string | null, formData: FormData) {
  const { supabase } = await requireAdmin();
  const payload = {
    slug: text(formData, "slug"),
    title: text(formData, "title"),
    description: nullable(formData, "description"),
    diagnosis_type: text(formData, "diagnosis_type"),
    question_count: integer(formData, "question_count"),
    display_order: integer(formData, "display_order"),
    status: text(formData, "status") || "draft",
  };
  if (!payload.slug || !payload.title || !payload.diagnosis_type) throw new Error("slug, title and diagnosis_type are required");
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
}

export async function saveQuestion(diagnosisId: string, id: string | null, formData: FormData) {
  const { supabase } = await requireAdmin();
  const payload = {
    diagnosis_id: diagnosisId,
    prompt: text(formData, "prompt"),
    help_text: nullable(formData, "help_text"),
    display_order: integer(formData, "display_order"),
    status: text(formData, "status") || "draft",
  };
  if (!payload.prompt) throw new Error("prompt is required");
  const query = id ? supabase.from("diagnosis_questions").update(payload).eq("id", id) : supabase.from("diagnosis_questions").insert(payload);
  const { error } = await query;
  if (error) throw new Error(error.message);
  await syncQuestionCount(supabase, diagnosisId);
  revalidatePath(`/admin/diagnoses/${diagnosisId}`);
  redirect(`/admin/diagnoses/${diagnosisId}`);
}

export async function archiveQuestion(diagnosisId: string, id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("diagnosis_questions").update({ status: "archived" }).eq("id", id);
  if (error) throw new Error(error.message);
  await syncQuestionCount(supabase, diagnosisId);
  revalidatePath(`/admin/diagnoses/${diagnosisId}`);
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
  const query = id ? supabase.from("diagnosis_options").update(payload).eq("id", id) : supabase.from("diagnosis_options").insert(payload);
  const { error } = await query;
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/diagnoses/${diagnosisId}/questions/${questionId}`);
  redirect(`/admin/diagnoses/${diagnosisId}/questions/${questionId}`);
}

export async function deleteOption(diagnosisId: string, questionId: string, id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("diagnosis_options").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/diagnoses/${diagnosisId}/questions/${questionId}`);
}

async function syncQuestionCount(supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"], diagnosisId: string) {
  const { count, error } = await supabase.from("diagnosis_questions").select("id", { count: "exact", head: true }).eq("diagnosis_id", diagnosisId).neq("status", "archived");
  if (error) throw new Error(error.message);
  const { error: updateError } = await supabase.from("diagnoses").update({ question_count: count ?? 0 }).eq("id", diagnosisId);
  if (updateError) throw new Error(updateError.message);
}
