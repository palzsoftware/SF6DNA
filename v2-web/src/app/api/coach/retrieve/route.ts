import { NextResponse } from "next/server";
import { attachSourcesToEvidence, getCurrentPatch } from "@/lib/coach-evidence";
import { releaseFeatures } from "@/lib/release-features";
import { searchAcrossContent } from "@/lib/search";
import {
  buildRetrievalEvidenceList,
  normalizeTrustedRetrievalItems,
  sanitizeRetrievalText,
} from "@/lib/coach-trusted-retrieval";
import { enrichRetrievalItemsWithPublicEntityMetadata } from "@/lib/public-entity-enrichment";

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
  if (!releaseFeatures.aiCoach) {
    return NextResponse.json(
      { error: "feature_disabled" },
      { status: 404 },
    );
  }
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

  const requestedRetrievalQuery =
    body && typeof body === "object" && "retrievalQuery" in body
      ? String((body as { retrievalQuery?: unknown }).retrievalQuery ?? "")
      : question;
  const sanitizedRetrievalQuery = sanitizeRetrievalText(requestedRetrievalQuery || question);
  const retrievalQuery = sanitizedRetrievalQuery.text;

  const scope =
    body && typeof body === "object" && "scope" in body && (body as { scope?: unknown }).scope && typeof (body as { scope?: unknown }).scope === "object"
      ? (body as { scope: { characterId?: unknown; playerId?: unknown } }).scope
      : null;
  const safeEntityId = (value: unknown) =>
    typeof value === "string" && /^[A-Za-z0-9_-]{1,100}$/.test(value) ? value : null;
  const exactCharacterId = safeEntityId(scope?.characterId);
  const exactPlayerId = safeEntityId(scope?.playerId);

  const searchResults = (await searchAcrossContent(retrievalQuery)).slice(0, 12);
  const [rawEvidence, currentPatch] = await Promise.all([
    attachSourcesToEvidence(searchResults),
    getCurrentPatch(),
  ]);

  const evidence = rawEvidence
    .filter((item) => item.sources.length > 0)
    .sort((a, b) => bestSourceRank(a.sources) - bestSourceRank(b.sources));

  const normalizedRetrieval = normalizeTrustedRetrievalItems(evidence);
  const enrichedRetrieval = await enrichRetrievalItemsWithPublicEntityMetadata(normalizedRetrieval);
  const retrievalBundle = buildRetrievalEvidenceList(enrichedRetrieval.items, currentPatch, {
    publicStrategyContent: releaseFeatures.publicStrategyContent,
    training: releaseFeatures.training,
    exactCharacterId,
    exactPlayerId,
  });
  retrievalBundle.uncertainty.unshift(...enrichedRetrieval.uncertainty);
  if (sanitizedRetrievalQuery.omittedSensitiveInput) {
    retrievalBundle.uncertainty.unshift("検索語から識別子・秘密値候補を除外しました。");
  }

  const ready = Boolean(currentPatch && evidence.length);

  return NextResponse.json({
    question,
    currentPatch,
    evidence,
    retrievalEvidence: retrievalBundle.evidence,
    retrievalUncertainty: retrievalBundle.uncertainty,
    retrievalExcludedCount: retrievalBundle.excludedIds.length,
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
