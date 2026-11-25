/** Read-only adapter for the authenticated diagnosis history view.
 * This does not change scoring, saving, deletion, or publication policy.
 */
import { diagnosisAxisLabel } from "@/lib/diagnosis-axis-labels";

export type CloudDiagnosisHistoryRecord = {
  id: string;
  diagnosisSlug: string;
  diagnosisTitle: string;
  completedAt: string;
  topResults: Array<{ key: string; label: string; score: number }>;
};


function record(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>) : null;
}

/** Accept PostgREST single-object or array embed shape; discard untrusted malformed rows. */
export function mapCloudDiagnosisRows(rows: unknown): CloudDiagnosisHistoryRecord[] {
  if (!Array.isArray(rows)) return [];
  const mapped: CloudDiagnosisHistoryRecord[] = [];
  for (const value of rows) {
    const row = record(value);
    if (!row || typeof row.id !== "string" || typeof row.created_at !== "string") continue;
    const relation = Array.isArray(row.diagnoses) ? row.diagnoses[0] : row.diagnoses;
    const diagnosis = record(relation);
    if (!diagnosis || typeof diagnosis.slug !== "string" || !/^[a-z0-9_-]+$/i.test(diagnosis.slug)
        || typeof diagnosis.title !== "string") continue;
    const payload = record(row.result_payload);
    const rawResults = payload?.top_results;
    const topResults = (Array.isArray(rawResults) ? rawResults : [])
      .map((value) => record(value))
      .filter((item): item is Record<string, unknown> => item !== null)
      .filter((item) => typeof item.key === "string" && typeof item.score === "number" && Number.isFinite(item.score))
      .slice(0, 6)
      .map((item) => ({
        key: item.key as string,
        label: diagnosisAxisLabel(item.key as string),
        score: item.score as number,
      }));
    mapped.push({
      id: row.id,
      diagnosisSlug: diagnosis.slug,
      diagnosisTitle: diagnosis.title,
      completedAt: row.created_at,
      topResults,
    });
  }
  return mapped;
}
