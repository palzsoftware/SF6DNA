import type { DailyTrainingPlan } from "@/lib/daily-training";

export const DAILY_PRACTICE_KEY = "sf6dna_v2_daily15_v1";
export const PRACTICE_LIMIT = 50;
const MAX_STORAGE_CHARS = 1_500_000;
export type PracticeSession = {
  id: string;
  planId: string;
  plan: DailyTrainingPlan;
  characterSlug: string | null;
  diagnosisId: string | null;
  startedAt: string;
  updatedAt: string;
  completedAt: string | null;
  completedIds: string[];
};
type StoragePort = Pick<Storage, "getItem" | "setItem">;
const sections = ["setup", "minute01", "minute13", "minute35", "successCondition", "commonFailure", "adjustment", "matchFocus"] as const;
const record = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const text = (v: unknown, max = 3000): v is string => typeof v === "string" && v.length > 0 && v.length <= max;
const time = (v: unknown): v is string => typeof v === "string" && /^\d{4}-\d{2}-\d{2}T/.test(v) && Number.isFinite(Date.parse(v));
export const isSessionId = (v: unknown): v is string => typeof v === "string" && /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(v);
export function planIdentity(plan: DailyTrainingPlan) { return `${plan.dateKey}:${plan.source}:${plan.items.map(i => i.id).join("|")}`; }
function validPlan(v: unknown): v is DailyTrainingPlan {
  if (!record(v) || !text(v.dateKey, 10) || !/^\d{4}-\d{2}-\d{2}$/.test(v.dateKey) || !text(v.theme) || !text(v.reason) || v.totalMinutes !== 15 || !["default", "diagnosis_link", "local_diagnosis", "match_issue"].includes(String(v.source)) || !Array.isArray(v.items) || v.items.length !== 3) return false;
  const day = new Date(`${v.dateKey}T00:00:00Z`);
  if (!Number.isFinite(day.getTime()) || day.toISOString().slice(0, 10) !== v.dateKey) return false;
  return new Set(v.items.map(i => record(i) ? i.id : null)).size === 3 && v.items.every(i => {
    if (!record(i) || !text(i.id, 120) || !text(i.title) || !text(i.goal) || i.minutes !== 5 || !record(i.detail)) return false;
    const detail = i.detail;
    return ["reaction", "execution", "decision"].includes(String(detail.category)) && text(detail.title) && text(detail.why) && sections.every(k => Array.isArray(detail[k]) && (detail[k] as unknown[]).length <= 12 && (detail[k] as unknown[]).every(line => text(line)));
  });
}
export function validSession(v: unknown): v is PracticeSession {
  if (!record(v) || !isSessionId(v.id) || !validPlan(v.plan) || v.planId !== planIdentity(v.plan) || !time(v.startedAt) || !time(v.updatedAt) || Date.parse(v.updatedAt) < Date.parse(v.startedAt) || !(v.completedAt === null || time(v.completedAt)) || !(v.characterSlug === null || (text(v.characterSlug, 80) && /^[a-z0-9-]+$/.test(v.characterSlug))) || !(v.diagnosisId === null || text(v.diagnosisId, 150)) || !Array.isArray(v.completedIds)) return false;
  const ids = v.completedIds;
  const plan = v.plan;
  return new Set(ids).size === ids.length && ids.every(id => plan.items.some(i => i.id === id)) && (ids.length === 3) === (v.completedAt !== null) && (v.completedAt === null || (Date.parse(v.completedAt) >= Date.parse(v.startedAt) && Date.parse(v.completedAt) <= Date.parse(v.updatedAt)));
}
function browserStorage(): StoragePort { return window.localStorage; }
export function readPractice(storage?: StoragePort): { sessions: PracticeSession[]; unavailable: boolean; invalid: boolean } {
  try {
    let raw: string | null;
    try { raw = (storage ?? browserStorage()).getItem(DAILY_PRACTICE_KEY); } catch { return { sessions: [], unavailable: true, invalid: false }; }
    if (!raw) return { sessions: [], unavailable: false, invalid: false };
    if (raw.length > MAX_STORAGE_CHARS) return { sessions: [], unavailable: false, invalid: true };
    const data: unknown = JSON.parse(raw);
    if (!record(data) || data.version !== 1 || !Array.isArray(data.sessions)) return { sessions: [], unavailable: false, invalid: true };
    const seen = new Set<string>();
    const valid = data.sessions.filter(validSession).sort((a,b) => b.updatedAt.localeCompare(a.updatedAt)).filter(s => { if (seen.has(s.id)) return false; seen.add(s.id); return true; }).slice(0, PRACTICE_LIMIT);
    return { sessions: valid, unavailable: false, invalid: valid.length !== data.sessions.length };
  } catch { return { sessions: [], unavailable: false, invalid: true }; }
}
export function savePractice(session: PracticeSession, storage?: StoragePort): boolean {
  if (!validSession(session)) return false;
  try {
    const port = storage ?? browserStorage();
    const read = readPractice(port);
    // Unknown schemas are never overwritten by this version.
    const raw = port.getItem(DAILY_PRACTICE_KEY);
    if (raw) { try { const data = JSON.parse(raw); if (record(data) && data.version !== undefined && data.version !== 1) return false; } catch { /* recover invalid JSON on an explicit action */ } }
    const sessions = [session, ...read.sessions.filter(s => s.id !== session.id)].sort((a,b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, PRACTICE_LIMIT);
    while (JSON.stringify({ version: 1, sessions }).length > MAX_STORAGE_CHARS && sessions.length > 1) sessions.pop();
    const value = JSON.stringify({ version: 1, sessions });
    if (value.length > MAX_STORAGE_CHARS) return false;
    port.setItem(DAILY_PRACTICE_KEY, value);
    if (typeof window !== "undefined") window.dispatchEvent(new Event("sf6dna-practice-change"));
    return true;
  } catch { return false; }
}
export function createPractice(plan: DailyTrainingPlan, id: string, now: string, characterSlug: string | null = null, diagnosisId: string | null = null): PracticeSession {
  return { id, planId: planIdentity(plan), plan: structuredClone(plan), characterSlug, diagnosisId, startedAt: now, updatedAt: now, completedAt: null, completedIds: [] };
}
export function togglePracticeItem(session: PracticeSession, id: string, now: string): PracticeSession {
  if (!session.plan.items.some(i => i.id === id)) return session;
  const completedIds = session.completedIds.includes(id) ? session.completedIds.filter(i => i !== id) : [...session.completedIds, id];
  const updatedAt = Date.parse(now) < Date.parse(session.updatedAt) ? session.updatedAt : now;
  return { ...session, completedIds, updatedAt, completedAt: completedIds.length === 3 ? updatedAt : null };
}
export function latestUnfinished(sessions: PracticeSession[]) { return sessions.find(s => !s.completedAt) ?? null; }
export function practiceHref(id: string) { return `/me/training?session=${encodeURIComponent(id)}`; }
