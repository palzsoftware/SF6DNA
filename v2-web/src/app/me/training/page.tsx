import type { Metadata } from "next";
import { DailyTrainingPlanner } from "@/components/daily-training-planner";
import { getJstDateKey, parseDailyTrainingRequest } from "@/lib/daily-training";
import { loadDailyTrainingContext, type DailyTrainingContext } from "@/lib/daily-training-data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "今日の15分練習",
  description: "診断で見つけた課題から、今日取り組む5分ずつの練習を決めます。ログインなしでも利用できます。",
  robots: { index: false, follow: false },
};

export default async function DailyTrainingPage({ searchParams }: {
  searchParams: Promise<{ diagnosis?: string | string[]; focus?: string | string[] }>;
}) {
  const request = parseDailyTrainingRequest(await searchParams);
  const context: DailyTrainingContext = request?.focus
    ? { primaryIssue: null, state: "empty" }
    : await loadDailyTrainingContext();
  const dateKey = getJstDateKey(new Date());
  return <DailyTrainingPlanner key={`${dateKey}:${request?.diagnosisType ?? "auto"}:${request?.focus ?? "none"}`}
    dateKey={dateKey} request={request} context={context} />;
}
