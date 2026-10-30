/** Daily15 read boundary only. No scoring, recommendation, diagnosis writes or migration. */
import { personalStorageKey, type PersonalOwner } from "@/lib/personalization-storage";
import { readSupabaseDiagnosisHistory, type DbDiagnosisHistoryRecord, type DiagnosisHistorySupabaseClient } from "@/lib/diagnosis-history-supabase";
import { mapCloudDiagnosisRows, type CloudDiagnosisHistoryRecord } from "@/lib/diagnosis-history-cloud";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export type DailyDiagnosisRecord = DbDiagnosisHistoryRecord;
export type DailyDiagnosisInput =
  | { state: "ready"; records: DailyDiagnosisRecord[] }
  | { state: "failed" | "stale"; records: [] };
const MAX_HISTORY_CHARS = 1_500_000;
const record = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

/** Retain existing mapper's first-six finite scores; never infer type from slug. */
export function cloudDailyDiagnosisRows(rows: unknown, ownerId: string): DailyDiagnosisRecord[] {
  if (!Array.isArray(rows)) throw new Error("diagnosis_response_shape");
  return rows.map((raw: unknown) => {
    if (!record(raw) || raw.user_id !== ownerId || !record(raw.result_payload)) throw new Error("diagnosis_owner_or_payload");
    const type = raw.result_payload.diagnosis_type;
    if (typeof type !== "string" || !type || !Array.isArray(raw.result_payload.top_results)) throw new Error("diagnosis_type_or_scores_missing");
    const mapped = mapCloudDiagnosisRows([raw])[0];
    if (!mapped || !Number.isFinite(Date.parse(mapped.completedAt))) throw new Error("diagnosis_row_unreadable");
    // The existing recommendation engine ignores unsupported diagnosis types,
    // future dates and unusable scores. It remains the only focus selector.
    return { ...mapped, diagnosisType: type };
  });
}

function guestDailyDiagnosisRows(raw: string | null): DailyDiagnosisRecord[] {
  if (raw === null) return [];
  if (raw.length > MAX_HISTORY_CHARS) throw new Error("guest_history_too_large");
  const rows: unknown = JSON.parse(raw);
  if (!Array.isArray(rows)) throw new Error("guest_history_shape");
  const valid = rows.map((row: unknown) => {
    if (!record(row) || typeof row.id !== "string" || typeof row.diagnosisSlug !== "string"
      || typeof row.diagnosisTitle !== "string" || typeof row.diagnosisType !== "string" || !row.diagnosisType
      || typeof row.completedAt !== "string" || !Number.isFinite(Date.parse(row.completedAt))
      || !Array.isArray(row.topResults) || row.topResults.some(item => !record(item)
        || typeof item.key !== "string" || typeof item.label !== "string"
        || typeof item.score !== "number" || !Number.isFinite(item.score))) throw new Error("guest_history_unreadable");
    return row as unknown as DailyDiagnosisRecord;
  });
  // Same ordering/limit as the existing guest history reader.
  return valid.sort((a,b) => b.completedAt.localeCompare(a.completedAt)).slice(0,50);
}

/** Owner was confirmed by usePersonalizationOwner. Reconfirm account before querying. */
export async function readDailyDiagnosisInput(owner: PersonalOwner | null, isCurrent: () => boolean): Promise<DailyDiagnosisInput> {
  if (!isCurrent()) return { state: "stale", records: [] };
  try {
    if (owner === "guest") {
      const records = guestDailyDiagnosisRows(window.localStorage.getItem(personalStorageKey("guest", "diagnosis_history")!));
      return isCurrent() ? { state: "ready", records } : { state: "stale", records: [] };
    }
    if (!owner?.startsWith("uid:")) return { state: "failed", records: [] };
    const client = getSupabaseBrowserClient() as unknown as DiagnosisHistorySupabaseClient;
    const guardedClient: DiagnosisHistorySupabaseClient = {
      auth: client.auth,
      from(table) {
        if (!isCurrent()) throw new Error("diagnosis_stale");
        return client.from(table);
      },
    };
    const result = await readSupabaseDiagnosisHistory(owner, guardedClient);
    if (!isCurrent()) return { state: "stale", records: [] };
    if (result.status !== "ok" || result.records.some(row => !Number.isFinite(Date.parse(row.completedAt)))) {
      return { state: "failed", records: [] };
    }
    // Keep R7's first-six score boundary; DB labels are deliberately not invented.
    return { state: "ready", records: result.records.map(row => ({ ...row, topResults: row.topResults.slice(0, 6) })) };
  } catch { return { state: isCurrent() ? "failed" : "stale", records: [] }; }
}
