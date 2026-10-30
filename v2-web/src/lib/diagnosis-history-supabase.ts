import type { PersonalOwner } from "./personalization-storage";

export type DbDiagnosisHistoryRecord = {
  id: string;
  diagnosisSlug: string;
  diagnosisTitle: string;
  diagnosisType: string;
  topResults: Array<{ key: string; score: number }>;
  completedAt: string;
};

export type DiagnosisHistoryReadResult =
  | { status: "ok"; records: DbDiagnosisHistoryRecord[] }
  | { status: "failed" };

export type DiagnosisHistoryDeleteResult =
  | { status: "deleted" }
  | { status: "not-found" }
  | { status: "failed" };

type QueryResponse<T> = PromiseLike<{ data: T | null; error: unknown | null }>;
type QueryBuilder<T> = {
  select(columns: string): QueryBuilder<T>;
  eq(column: string, value: string): QueryBuilder<T>;
  in(column: string, values: string[]): QueryBuilder<T>;
  order(column: string, options: { ascending: boolean }): QueryBuilder<T>;
  limit(count: number): QueryBuilder<T>;
  delete(): QueryBuilder<T>;
} & QueryResponse<T>;

export type DiagnosisHistorySupabaseClient = {
  auth: {
    getUser(): Promise<{ data: { user: { id: string } | null }; error: unknown | null }>;
  };
  from(table: string): QueryBuilder<unknown>;
};

export type OwnerResponseToken = { owner: string; generation: number };

/** Small request fence used by the history UI to discard responses after an Owner switch. */
export function createOwnerResponseFence() {
  let generation = 0;
  return {
    begin(owner: string): OwnerResponseToken { return { owner, generation: ++generation }; },
    invalidate() { generation += 1; },
    isCurrent(token: OwnerResponseToken, owner: string, ownerIsCurrent: () => boolean) {
      return token.generation === generation && token.owner === owner && ownerIsCurrent();
    },
  };
}

type ResultRow = {
  id: string;
  user_id: string;
  diagnosis_id: string;
  result_payload: unknown;
  created_at: string;
};

type DiagnosisRow = { id: string; slug: string; title: string; diagnosis_type: string };
type TopResult = { key: string; score: number };

function ownerUuid(owner: PersonalOwner | null): string | null {
  if (!owner?.startsWith("uid:")) return null;
  const value = owner.slice(4);
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
    ? value.toLowerCase()
    : null;
}

function parseTopResults(payload: unknown): { diagnosisType: string; topResults: TopResult[] } | null {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return null;
  const value = payload as { diagnosis_type?: unknown; top_results?: unknown };
  if (typeof value.diagnosis_type !== "string" || !Array.isArray(value.top_results)) return null;
  const topResults: TopResult[] = [];
  for (const item of value.top_results) {
    if (!item || typeof item !== "object" || Array.isArray(item)) return null;
    const row = item as { key?: unknown; score?: unknown };
    if (typeof row.key !== "string" || typeof row.score !== "number" || !Number.isFinite(row.score)) return null;
    topResults.push({ key: row.key, score: row.score });
  }
  return { diagnosisType: value.diagnosis_type, topResults };
}

async function resolveAuthenticatedOwner(owner: PersonalOwner | null, client: DiagnosisHistorySupabaseClient): Promise<string | null> {
  const ownerId = ownerUuid(owner);
  if (!ownerId) return null; // Guest, loading/error, and malformed owners stop here.
  try {
    const { data, error } = await client.auth.getUser();
    const authId = data.user?.id?.toLowerCase() ?? null;
    return error || !authId || authId !== ownerId ? null : ownerId;
  } catch {
    return null;
  }
}

/** Reads only the signed-in Owner's existing DB history; it never falls back to local Guest data. */
export async function readSupabaseDiagnosisHistory(
  owner: PersonalOwner | null,
  client: DiagnosisHistorySupabaseClient,
): Promise<DiagnosisHistoryReadResult> {
  const userId = await resolveAuthenticatedOwner(owner, client);
  if (!userId) return { status: "failed" };
  try {
    const resultResponse = await client.from("diagnosis_results")
      .select("id,user_id,diagnosis_id,result_payload,created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);
    if (resultResponse.error || !Array.isArray(resultResponse.data)) return { status: "failed" };
    const rows = resultResponse.data as ResultRow[];
    if (!rows.every(row => row && row.user_id?.toLowerCase() === userId && typeof row.id === "string" &&
      typeof row.diagnosis_id === "string" && typeof row.created_at === "string")) return { status: "failed" };
    if (!rows.length) return { status: "ok", records: [] };

    const diagnosisIds = [...new Set(rows.map(row => row.diagnosis_id))];
    const diagnosisResponse = await client.from("diagnoses")
      .select("id,slug,title,diagnosis_type")
      .in("id", diagnosisIds);
    if (diagnosisResponse.error || !Array.isArray(diagnosisResponse.data)) return { status: "failed" };
    const diagnoses = diagnosisResponse.data as DiagnosisRow[];
    const diagnosisById = new Map(diagnoses.map(row => [row.id, row]));
    const records: DbDiagnosisHistoryRecord[] = [];
    for (const row of rows) {
      const diagnosis = diagnosisById.get(row.diagnosis_id);
      const payload = parseTopResults(row.result_payload);
      if (!diagnosis || typeof diagnosis.slug !== "string" || typeof diagnosis.title !== "string" ||
        typeof diagnosis.diagnosis_type !== "string" || !payload || payload.diagnosisType !== diagnosis.diagnosis_type) {
        return { status: "failed" };
      }
      records.push({
        id: row.id,
        diagnosisSlug: diagnosis.slug,
        diagnosisTitle: diagnosis.title,
        diagnosisType: diagnosis.diagnosis_type,
        topResults: payload.topResults,
        completedAt: row.created_at,
      });
    }
    return { status: "ok", records };
  } catch {
    return { status: "failed" };
  }
}

/**
 * Deletes the parent result under its authenticated Owner. The confirmed
 * diagnosis_answers(diagnosis_result_id, diagnosis_id) FK cascades atomically.
 */
export async function deleteSupabaseDiagnosisHistory(
  owner: PersonalOwner | null,
  resultId: string,
  client: DiagnosisHistorySupabaseClient,
): Promise<DiagnosisHistoryDeleteResult> {
  const userId = await resolveAuthenticatedOwner(owner, client);
  if (!userId || !resultId) return { status: "failed" };
  try {
    const response = await client.from("diagnosis_results")
      .delete()
      .eq("id", resultId)
      .eq("user_id", userId)
      .select("id");
    if (response.error || !Array.isArray(response.data)) return { status: "failed" };
    return response.data.length ? { status: "deleted" } : { status: "not-found" };
  } catch {
    return { status: "failed" };
  }
}
