/** Read-only adapter for the authenticated diagnosis history view.
 * This does not change scoring, saving, deletion, or publication policy.
 */
export type CloudDiagnosisHistoryRecord = {
  id: string;
  diagnosisSlug: string;
  diagnosisTitle: string;
  completedAt: string;
  topResults: Array<{ key: string; label: string; score: number }>;
};

const AXIS_LABELS: Record<string, string> = {
  anti_air: "対空", drive_rush_defense: "ドライブラッシュ対応", impact_response: "インパクト返し", punish: "確定反撃",
  defense: "防御・切り返し", offense: "攻めの選択肢", meter: "ゲージ管理", matchup: "キャラ対策",
  execution: "コンボ・セットプレイ精度", neutral: "中距離・立ち回り", corner_defense: "画面端の守り", decision: "観察・判断",
  aggression: "前に出る攻め", patience: "待ち・観察", keepout: "遠距離・けん制", rushdown: "近距離ラッシュ",
  grappling: "投げ・コマンド投げ", setup: "設置・セットプレイ", footsies: "差し合い・地上戦", mobility: "機動力・位置調整",
  simplicity: "操作の分かりやすさ", technicality: "テクニカル操作", defense_preference: "守りから組み立てる", explosive: "一気に試合を動かす",
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
        label: AXIS_LABELS[item.key as string] ?? (item.key as string),
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
