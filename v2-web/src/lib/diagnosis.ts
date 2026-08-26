import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { DiagnosisDefinition, DiagnosisQuestion } from "@/types/diagnosis";

function isConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function listDiagnoses(): Promise<Array<Pick<DiagnosisDefinition, "id" | "slug" | "title" | "description" | "questionCount">>> {
  if (!isConfigured()) return [];
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("diagnoses")
    .select("id, slug, title, description, question_count")
    .eq("status", "published")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[diagnosis] list failed", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    description: typeof row.description === "string" ? row.description : null,
    questionCount: Number(row.question_count ?? 0),
  }));
}

export async function getDiagnosisBySlug(slug: string): Promise<DiagnosisDefinition | null> {
  if (!isConfigured()) return null;
  const supabase = getSupabaseServerClient();
  const { data: diagnosis, error } = await supabase
    .from("diagnoses")
    .select("id, slug, title, description, question_count")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !diagnosis) {
    if (error) console.error("[diagnosis] detail failed", error.message);
    return null;
  }

  const { data: questions, error: questionError } = await supabase
    .from("diagnosis_questions")
    .select("id, prompt, help_text, display_order, diagnosis_options(id, label, value, score_payload, display_order)")
    .eq("diagnosis_id", diagnosis.id)
    .eq("status", "published")
    .order("display_order", { ascending: true });

  if (questionError) {
    console.error("[diagnosis] questions failed", questionError.message);
    return null;
  }

  const mapped: DiagnosisQuestion[] = (questions ?? []).map((row) => {
    const options = Array.isArray(row.diagnosis_options) ? row.diagnosis_options : [];
    return {
      id: String(row.id),
      prompt: String(row.prompt),
      helpText: typeof row.help_text === "string" ? row.help_text : null,
      sortOrder: Number(row.display_order ?? 0),
      options: options
        .map((option) => ({
          id: String(option.id),
          label: String(option.label),
          value: String(option.value),
          scorePayload:
            option.score_payload && typeof option.score_payload === "object"
              ? (option.score_payload as Record<string, number>)
              : {},
          displayOrder: Number(option.display_order ?? 0),
        }))
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map(({ displayOrder: _displayOrder, ...option }) => option),
    };
  });

  return {
    id: String(diagnosis.id),
    slug: String(diagnosis.slug),
    title: String(diagnosis.title),
    description: typeof diagnosis.description === "string" ? diagnosis.description : null,
    questionCount: Number(diagnosis.question_count ?? mapped.length),
    questions: mapped,
  };
}

export function aggregateDiagnosisScores(payloads: Array<Record<string, number>>) {
  const totals: Record<string, number> = {};
  for (const payload of payloads) {
    for (const [key, value] of Object.entries(payload)) totals[key] = (totals[key] ?? 0) + Number(value || 0);
  }
  return totals;
}
