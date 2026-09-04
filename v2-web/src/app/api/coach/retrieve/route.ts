import { NextResponse } from "next/server";
import { attachSourcesToEvidence, getCurrentPatch } from "@/lib/coach-evidence";
import { releaseFeatures } from "@/lib/release-features";
import { searchAcrossContent } from "@/lib/search";

function bestSourceRank(sources: Array<{ reliabilityLevel: string | null }>) {
  const rank: Record<string, number> = {
    official: 0,
    primary: 1,
    secondary: 2,
    community: 3,
    internal_candidate: 4,
  };
  return sources.reduce(
    (best, source) => Math.min(best, rank[source.reliabilityLevel ?? ""] ?? 5),
    5,
  );
}

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
  const [rawEvidence, currentPatch] = await Promise.all([
    attachSourcesToEvidence(searchResults),
    getCurrentPatch(),
  ]);

  const evidence = rawEvidence
    .filter((item) => item.sources.length > 0)
    .sort((a, b) => bestSourceRank(a.sources) - bestSourceRank(b.sources));

  const ready = Boolean(currentPatch && evidence.length);

  return NextResponse.json({
    question,
    currentPatch,
    evidence,
    ready,
    message: !currentPatch
      ? "現行Patchを確認できないため、攻略根拠としての回答生成は行いません。"
      : !evidence.length
        ? "公開品質ゲートを通過し、Sourceが紐付いた根拠データが見つかりませんでした。"
        : "Current PatchとSourceを確認できるSF6DNA内部データのみを根拠候補として返しています。",
    generationEnabled: false,
    note: "Trusted retrieval is active. Generative answers remain disabled until verified gameplay data is sufficiently populated and the backend AI contract is finalized.",
  });
}
