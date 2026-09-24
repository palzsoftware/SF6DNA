import { NextResponse } from "next/server";
import { attachSourcesToEvidence, getCurrentPatch } from "@/lib/coach-evidence";
import { releaseFeatures } from "@/lib/release-features";
import { isCoachSurfaceEnabled } from "@/lib/coach-preview-activation";
import { runDeterministicCoachPreviewE2E } from "@/lib/coach-preview-e2e";
import { COACH_PERSONAS, DEFAULT_COACH_PERSONA_ID, type CoachPersonaId } from "@/lib/coach-foundation";
import { adaptUserText, analyzeCoachContext, emptyCoachInputContext } from "@/lib/coach-shared-analysis";
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
  if (!isCoachSurfaceEnabled(releaseFeatures.aiCoach)) {
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

  const requestedPersona = body && typeof body === "object" && "personaId" in body
    ? String((body as { personaId?: unknown }).personaId ?? "")
    : DEFAULT_COACH_PERSONA_ID;
  const personaId: CoachPersonaId = COACH_PERSONAS.some((persona) => persona.id === requestedPersona)
    ? requestedPersona as CoachPersonaId
    : DEFAULT_COACH_PERSONA_ID;

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

  // Only evidence that passed the trusted retrieval gate can support an answer.
  const ready = Boolean(currentPatch && retrievalBundle.evidence.length);
  const userMessage = adaptUserText(question);
  const analysis = analyzeCoachContext({
    ...emptyCoachInputContext(personaId),
    ...(userMessage ? { userMessage } : {}),
    retrievalEvidence: retrievalBundle.evidence,
    retrievalUncertainty: retrievalBundle.uncertainty,
  });
  const previewE2E = ready ? await runDeterministicCoachPreviewE2E(analysis, personaId) : null;

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
      : !retrievalBundle.evidence.length
        ? "この質問に使える根拠を確認できませんでした。別の質問を試すか、情報源を追加してからご利用ください。"
        : "Current PatchとSourceを確認できるSF6DNA内部データのみを根拠候補として返しています。",
    generationEnabled: false,
    deterministicPreviewEnabled: true,
    providerDraft: previewE2E?.provider.draft ?? null,
    providerMeta: previewE2E ? {
      providerId: previewE2E.provider.providerId,
      finishReason: previewE2E.provider.finishReason,
      fallbackReason: previewE2E.provider.fallbackReason,
    } : null,
    note: "Trusted retrieval is active. Generative answers remain disabled until verified gameplay data is sufficiently populated and the backend AI contract is finalized.",
  });
}
