import { composeCoachAnswer } from "@/lib/coach-answer-composer";
import type { CoachAnalysisResult, CoachPersonaId } from "@/lib/coach-foundation";
import { buildCoachPromptInput } from "@/lib/coach-prompt-contract";
import { DeterministicCoachProvider, runCoachProvider } from "@/lib/coach-provider";

export async function runDeterministicCoachPreviewE2E(result: CoachAnalysisResult, personaId: CoachPersonaId) {
  const input = buildCoachPromptInput({
    evidence: result.evidence,
    uncertainties: result.uncertainty,
    personaId,
    userText: result.evidence.find((item) => item.kind === "PLAYER_STATEMENT")?.statement ?? "",
  });
  const provider = await runCoachProvider({ provider: new DeterministicCoachProvider(), input, evidence: result.evidence });
  return { provider, answer: composeCoachAnswer({ result, personaId }) };
}
