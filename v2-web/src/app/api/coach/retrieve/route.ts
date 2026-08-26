import { NextResponse } from "next/server";
import { attachSourcesToEvidence, getCurrentPatch } from "@/lib/coach-evidence";
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

  const searchResults = (await searchAcrossContent(question)).slice(0, 12);
  const [evidence, currentPatch] = await Promise.all([
    attachSourcesToEvidence(searchResults),
    getCurrentPatch(),
  ]);

  return NextResponse.json({
    question,
    currentPatch,
    evidence,
    generationEnabled: false,
    note: "Trusted retrieval is active. Generative answers remain disabled until verified gameplay data is sufficiently populated and the backend AI contract is finalized.",
  });
}
