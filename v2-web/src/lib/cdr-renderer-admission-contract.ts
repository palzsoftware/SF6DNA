/** WS12 local-only admission guard. Frozen 28-icon renderer remains untouched. */
import type { Sf6CommandToken } from "./sf6-command-tokens";
import {
  commandIconPresentation,
  type CommandIconPresentation,
  type ControlScheme,
} from "./sf6-command-icon-contract";

export const CDR_ASSET_ID = "control-cdr" as const;
export const CDR_ASSET_PATH = "candidate-assets/svg/control-cdr.svg" as const;
export const CDR_ASSET_SHA256 = "679eead1385a80883056db0ab2c8185e7777603aedd97c1d14868cb7c6edaef5" as const;

export type CdrAdoptionState = "HANDOFF_PENDING" | "LOCAL_APPROVED";
export type CdrAssetState = "AVAILABLE" | "MISSING" | "HASH_MISMATCH" | "NOT_CHECKED";
export type CdrRendererGate = {
  adoptionState: CdrAdoptionState;
  assetState: CdrAssetState;
  observedSha256: string | null;
};

export function isVerifiedCdrGate(gate: CdrRendererGate): boolean {
  return gate.adoptionState === "LOCAL_APPROVED"
    && gate.assetState === "AVAILABLE"
    && gate.observedSha256 === CDR_ASSET_SHA256;
}

/**
 * Resolves CDR only when local adoption and exact asset bytes are explicit.
 * Every other state delegates to the frozen renderer, preserving visible CDR text.
 */
export function commandIconPresentationWithCdrAdmission(
  token: Sf6CommandToken,
  scheme: ControlScheme,
  gate: CdrRendererGate,
): CommandIconPresentation {
  const base = commandIconPresentation(token, scheme);
  if (token.kind !== "system" || token.raw.toUpperCase() !== "CDR" || !isVerifiedCdrGate(gate)) {
    return base;
  }
  return {
    raw: token.raw,
    kind: token.kind,
    label: token.label,
    schemeMismatch: false,
    parts: [{ type: "icon", value: token.display, label: token.label, asset: CDR_ASSET_ID }],
  };
}

export const CDR_RENDERER_PUBLICATION_GRANT = false as const;
