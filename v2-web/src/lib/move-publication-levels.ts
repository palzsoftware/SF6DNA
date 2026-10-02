/** Proposed field-level projection. Not connected to public loaders or RLS.
 * Enabling a new identity acquisition contract requires separate approval.
 */
export type PublicationValue<T> = {
  state: "verified" | "not_applicable" | "unavailable";
  value: T | null;
};
type FrameField = "startup" | "active" | "recovery" | "onHit" | "onBlock";
type DamageField = "damage" | "driveDamage";
export type MovePublicationInput = {
  id: string; slug: string; name: string; category: string; strengthVariant: string | null;
  status: string; identityOfficial: boolean;
  commands: { scheme: "classic" | "modern"; text: string; official: boolean }[];
  detail: null | {
    current: boolean; active: boolean; unique: boolean; verificationStatus: string;
    frameOfficial: boolean; damageOfficial: boolean;
    values: Record<FrameField, string | null> & Record<DamageField, number | null>;
    // Explicit applicability evidence, never inferred from category or NULL.
    notApplicable?: Partial<Record<FrameField | DamageField, boolean>>;
  };
  media: { url: string; poster: string | null; status: string; identityApproved: boolean }[];
};

function field<T>(value: T | null, eligible: boolean, notApplicable = false): PublicationValue<T> {
  if (!eligible) return { state: "unavailable", value: null };
  if (value !== null) return { state: "verified", value };
  return { state: notApplicable ? "not_applicable" : "unavailable", value: null };
}

export function projectMovePublication(input: MovePublicationInput) {
  if (input.status !== "published" || !input.identityOfficial || !input.id || !input.slug || !input.name.trim()) return null;
  const detail = input.detail;
  const currentVerified = Boolean(detail?.current && detail.active && detail.unique && detail.verificationStatus === "verified");
  const frameEligible = currentVerified && Boolean(detail?.frameOfficial);
  const damageEligible = currentVerified && Boolean(detail?.damageOfficial);
  const frames = Object.fromEntries((["startup", "active", "recovery", "onHit", "onBlock"] as const)
    .map((key) => [key, field(detail?.values[key] ?? null, frameEligible, detail?.notApplicable?.[key])])) as Record<FrameField, PublicationValue<string>>;
  const damage = Object.fromEntries((["damage", "driveDamage"] as const)
    .map((key) => [key, field(detail?.values[key] ?? null, damageEligible, detail?.notApplicable?.[key])])) as Record<DamageField, PublicationValue<number>>;
  return {
    id: input.id, slug: input.slug, name: input.name, category: input.category, strengthVariant: input.strengthVariant,
    commands: input.commands.filter((command) => command.official && command.text.trim()).map(({ scheme, text }) => ({ scheme, text })),
    frames, damage,
    media: input.media.filter((media) => media.status === "published" && media.identityApproved).map(({ url, poster }) => ({ url, poster })),
  };
}
