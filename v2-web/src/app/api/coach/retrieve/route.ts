import { NextResponse } from "next/server";
import { searchAcrossContent } from "@/lib/search";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const question =
    body && typeof body === "object" && "question" in body
      ? String((body as { question?: unknown }).question ?? "").trim()
      : "";

  if (question.length < 2) {
    return NextResponse.json({ error: "question_too_short" }, { status: 400 });
  }

  if (question.length > 500) {
    return NextResponse.json({ error: "question_too_long" }, { status: 400 });
  }

  const evidence = await searchAcrossContent(question);

  return NextResponse.json({
    question,
    evidence: evidence.slice(0, 12),
    generationEnabled: false,
    note: "Phase11 retrieval foundation: generative answer is intentionally disabled until trusted data and backend integration are ready.",
  });
}
