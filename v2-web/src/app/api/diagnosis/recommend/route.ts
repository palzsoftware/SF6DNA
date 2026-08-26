import { NextResponse } from "next/server";
import { recommendCharacters } from "@/lib/character-recommendations";

function sanitizeScores(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const result: Record<string, number> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    if (!/^[a-z0-9_]{1,64}$/.test(key)) continue;
    const score = Number(raw);
    if (!Number.isFinite(score) || score < 0 || score > 100) continue;
    result[key] = score;
  }
  return Object.keys(result).length ? result : null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const scores = sanitizeScores(body?.scores);
    if (!scores) {
      return NextResponse.json({ error: "invalid_scores", recommendations: [] }, { status: 400 });
    }

    const recommendations = await recommendCharacters(scores, Number(body?.limit ?? 5));
    return NextResponse.json({
      recommendations,
      ready: recommendations.length > 0,
      message: recommendations.length
        ? null
        : "verified + published のキャラクター特性マッピングが十分に揃っていません。",
    });
  } catch (error) {
    console.error("[diagnosis/recommend] failed", error);
    return NextResponse.json({ error: "recommendation_failed", recommendations: [] }, { status: 500 });
  }
}
