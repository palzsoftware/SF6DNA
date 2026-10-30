import type { DevicePreviewBundle } from "./device-preview";

export const ARJUN_CATEGORIES = ["normal", "unique", "special", "throw", "super"] as const;
type Category = typeof ARJUN_CATEGORIES[number];
type Scheme = "classic" | "modern" | "shared";
type CaptureKind = "commands" | "frame";
export type IntakeField = { value: string | number | null;
  status: "UNCONFIRMED" | "UNCLEAR" | "CONFLICT" | "CONFIRMED" | "OFFICIAL_NA";
  evidence: { captureId: string; rowKey: string; region: string }[];
  reviewedBy: string | null; reviewedAt: string | null };
export type ArjunCapture = { id: string; originalPath: string; sha256: string; url: string;
  capturedAt: string; characterSlug: "arjun"; kind: CaptureKind; scheme: Scheme; category: Category | "mixed";
  page: number; totalPages: number; patchLabel: string | null };
export type ArjunIntakeMove = { localKey: string; canonicalMoveId: string | null;
  canonicalIdentityVerified: boolean; category: Category; variantKey: string; parentLocalKey: string | null;
  name: IntakeField; classic: IntakeField; modern: IntakeField;
  classicCondition: IntakeField; modernCondition: IntakeField;
  startup: IntakeField; active: IntakeField; recovery: IntakeField; onHit: IntakeField;
  onBlock: IntakeField; damage: IntakeField; notes: IntakeField };
export type ArjunIntake = { schema: "sf6dna/arjun-official-intake/1"; characterSlug: "arjun";
  patch: { label: string | null; verified: boolean }; captures: ArjunCapture[]; moves: ArjunIntakeMove[];
  coverage: { kind: CaptureKind; scheme: Scheme; category: Category; complete: boolean; expectedRows: number | null }[] };
export const pendingIntakeField = (): IntakeField => ({ value: null, status: "UNCONFIRMED",
  evidence: [], reviewedBy: null, reviewedAt: null });
const fields = ["name", "classic", "modern", "classicCondition", "modernCondition", "startup",
  "active", "recovery", "onHit", "onBlock", "damage", "notes"] as const;
const frameFields = ["startup", "active", "recovery", "onHit", "onBlock", "damage"] as const;
function officialUrl(value: string) {
  try { const u = new URL(value); return u.protocol === "https:" && !u.username && !u.password &&
    ["streetfighter.com", "www.streetfighter.com"].includes(u.hostname) &&
    /\/character\/arjun(?:\/|$)/.test(u.pathname); } catch { return false; }
}
function present(value: unknown) { return typeof value === "number" ? Number.isFinite(value) : typeof value === "string" && !!value.trim(); }
function reviewed(field: IntakeField) { return !!field.reviewedBy?.trim() && !!field.reviewedAt && !Number.isNaN(Date.parse(field.reviewedAt)); }

/** Validates received transcription, not the pixels. Evidence review is explicit. */
export function validateArjunIntake(batch: ArjunIntake) {
  const errors: string[] = [], gaps: string[] = [];
  if (batch.schema !== "sf6dna/arjun-official-intake/1" || batch.characterSlug !== "arjun") errors.push("BATCH_IDENTITY");
  if (batch.patch.verified && !batch.patch.label?.trim()) errors.push("PATCH_LABEL");
  if (!batch.patch.verified) gaps.push("PATCH_UNCONFIRMED");
  const captures = new Map<string, ArjunCapture>(), pages = new Set<string>(), imageHashes = new Set<string>();
  for (const c of batch.captures) {
    if (captures.has(c.id)) errors.push("DUPLICATE_CAPTURE:" + c.id);
    if (imageHashes.has(c.sha256)) errors.push("DUPLICATE_IMAGE_SHA:" + c.id);
    imageHashes.add(c.sha256);
    const pageKey = [c.kind, c.scheme, c.category, c.page].join(":");
    if (pages.has(pageKey)) errors.push("DUPLICATE_PAGE:" + pageKey);
    pages.add(pageKey); captures.set(c.id, c);
    if (!c.id || !officialUrl(c.url) || c.characterSlug !== "arjun" || !/^[a-f0-9]{64}$/.test(c.sha256) ||
      !c.originalPath?.trim() || Number.isNaN(Date.parse(c.capturedAt)) || !(c.category === "mixed" || ARJUN_CATEGORIES.includes(c.category)) ||
      !["commands", "frame"].includes(c.kind) || !["classic", "modern", "shared"].includes(c.scheme) ||
      !Number.isInteger(c.page) || c.page < 1 || !Number.isInteger(c.totalPages) || c.totalPages < c.page ||
      (c.kind === "commands" && c.scheme === "shared")) errors.push("INVALID_CAPTURE:" + c.id);
    if (batch.patch.verified && c.patchLabel !== batch.patch.label) errors.push("CAPTURE_PATCH_MISMATCH:" + c.id);
  }
  for (const c of batch.captures) {
    const group = batch.captures.filter(row => row.kind === c.kind && row.scheme === c.scheme && row.category === c.category);
    if (group.some(row => row.totalPages !== c.totalPages)) errors.push("PAGE_TOTAL_CONFLICT:" + c.id);
    for (let page = 1; page <= Math.min(c.totalPages, 500); page++)
      if (!group.some(row => row.page === page)) gaps.push("PAGE_MISSING:" + [c.kind,c.scheme,c.category,page].join(":"));
    if (c.totalPages > 500) errors.push("PAGE_TOTAL_LIMIT:" + c.id);
  }
  const keys = new Set<string>(), variants = new Set<string>(), canonical = new Set<string>();
  for (const move of batch.moves) {
    if (!/^arjun-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(move.localKey) || keys.has(move.localKey)) errors.push("MOVE_KEY:" + move.localKey);
    keys.add(move.localKey);
    if (!ARJUN_CATEGORIES.includes(move.category) || !move.variantKey.trim()) errors.push("MOVE_CATEGORY_VARIANT:" + move.localKey);
    const variant = [move.category,move.name.value,move.variantKey].join(":");
    if (variants.has(variant)) errors.push("DUPLICATE_VARIANT:" + move.localKey);
    variants.add(variant);
    if (move.canonicalIdentityVerified && (!move.canonicalMoveId || !/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/.test(move.canonicalMoveId))) errors.push("CANONICAL_ID:" + move.localKey);
    if (move.canonicalMoveId) {
      if (canonical.has(move.canonicalMoveId)) errors.push("DUPLICATE_CANONICAL_ID:" + move.localKey);
      canonical.add(move.canonicalMoveId);
    }
    for (const key of fields) {
      const field = move[key];
      if (!["UNCONFIRMED","UNCLEAR","CONFLICT","CONFIRMED","OFFICIAL_NA"].includes(field.status)) errors.push("FIELD_STATUS:" + move.localKey + ":" + key);
      if (field.status !== "CONFIRMED" && field.status !== "OFFICIAL_NA") { gaps.push("FIELD_PENDING:" + move.localKey + ":" + key); continue; }
      if (!reviewed(field) || !field.evidence.length || (field.status === "CONFIRMED" && !present(field.value)) ||
        (field.status === "OFFICIAL_NA" && field.value !== null) || (key === "name" && (field.status !== "CONFIRMED" || typeof field.value !== "string"))) errors.push("UNREVIEWED_FIELD:" + move.localKey + ":" + key);
      for (const ref of field.evidence) {
        const c = captures.get(ref.captureId), kind = frameFields.includes(key as typeof frameFields[number]) ? "frame" : "commands";
        const scheme = key.startsWith("classic") ? "classic" : key.startsWith("modern") ? "modern" : null;
        if (!c || c.kind !== kind || (c.category !== "mixed" && c.category !== move.category) || (scheme && c.scheme !== scheme) ||
          !ref.rowKey?.trim() || !ref.region?.trim()) errors.push("FIELD_EVIDENCE:" + move.localKey + ":" + key);
        if (c && kind === "frame" && c.scheme !== "shared") gaps.push("FRAME_CONTROL_SCOPE_PENDING:" + move.localKey + ":" + key);
      }
    }
  }
  for (const move of batch.moves) {
    if (move.parentLocalKey && (!keys.has(move.parentLocalKey) || move.parentLocalKey === move.localKey)) errors.push("PARENT_KEY:" + move.localKey);
    const ancestors = new Set([move.localKey]); let parent = move.parentLocalKey;
    while (parent && keys.has(parent)) { if (ancestors.has(parent)) { errors.push("PARENT_CYCLE:" + move.localKey); break; }
      ancestors.add(parent); parent = batch.moves.find(row => row.localKey === parent)?.parentLocalKey ?? null; }
  }
  for (const category of ARJUN_CATEGORIES) for (const [kind,scheme] of [["commands","classic"],["commands","modern"],["frame","shared"]] as const) {
    const rows = batch.coverage.filter(row => row.kind === kind && row.scheme === scheme && row.category === category);
    const key = [kind,scheme,category].join(":");
    if (rows.length > 1) errors.push("DUPLICATE_COVERAGE:" + key);
    if (!rows.some(row => row.complete)) gaps.push("COVERAGE_PENDING:" + key);
    for (const row of rows.filter(row => row.complete)) {
      if (!Number.isInteger(row.expectedRows) || row.expectedRows === null || row.expectedRows < 0) errors.push("COVERAGE_ROW_COUNT:" + key);
      if (!batch.captures.some(c => c.kind === kind && c.scheme === scheme && (c.category === category || c.category === "mixed"))) errors.push("COVERAGE_NO_CAPTURE:" + key);
      const field = kind === "commands" ? scheme : "name";
      const found = batch.moves.filter(m => m.category === category && (m[field].status === "CONFIRMED" || m[field].status === "OFFICIAL_NA")).length;
      if (found !== row.expectedRows) errors.push("COVERAGE_COUNT_MISMATCH:" + key);
    }
  }
  return { errors: [...new Set(errors)], gaps: [...new Set(gaps)], readiness: "LOCAL_INTAKE_ONLY_NOT_PUBLIC" as const };
}

/** Only reviewed current-patch fields enter a draft. No DB/publication action. */
export function arjunIntakeToDraftBundle(batch: ArjunIntake): DevicePreviewBundle {
  const result = validateArjunIntake(batch);
  if (result.errors.length) throw new Error(result.errors.join("\n"));
  const accepted = (field: IntakeField) => batch.patch.verified && field.status === "CONFIRMED" ? field.value : null;
  const sharedFrame = (field: IntakeField) => field.evidence.length > 0 && field.evidence.every(ref =>
    batch.captures.find(c => c.id === ref.captureId)?.scheme === "shared");
  const moves = batch.moves.filter(move => accepted(move.name) !== null).map<DevicePreviewBundle["moves"][number]>(move => {
    const id = move.canonicalIdentityVerified && move.canonicalMoveId ? move.canonicalMoveId : move.localKey;
    const commands = (["classic","modern"] as const).flatMap((scheme,sortOrder) => {
      const value = accepted(move[scheme]); if (typeof value !== "string" || !value.trim()) return [];
      const condition = accepted(move[scheme === "classic" ? "classicCondition" : "modernCondition"]);
      return [{moveId:id,scheme,commandText:value,numericNotation:null,buttonNotation:null,sortOrder,
        conditionText:typeof condition === "string" ? condition : null}];
    });
    const frameValue = (field: IntakeField) => sharedFrame(field) ? accepted(field) : null;
    const text = (field: IntakeField) => { const value = frameValue(field); return value === null ? null : String(value); };
    const frame = { startup:text(move.startup), active:text(move.active), recovery:text(move.recovery),
      onHit:text(move.onHit), onBlock:text(move.onBlock), damage:frameValue(move.damage), verificationStatus:null };
    const frameFieldStatus = Object.fromEntries(frameFields.map(key => [key,batch.patch.verified && sharedFrame(move[key]) && move[key].status === "OFFICIAL_NA" ? "OFFICIAL_NA" : frame[key] !== null ? "CURRENT_OFFICIAL_SNAPSHOT_ACCEPTED" : "DETAIL_PENDING"]));
    return {id,slug:move.localKey,name:String(accepted(move.name)),moveType:move.category,status:"draft",
      usageSummary:null,commands,frame,frameFieldStatus,media:null};
  });
  // Structural contract above deliberately produces local placeholder IDs until owner mapping.
  return {guideSections:[],moves,combos:[],setups:[],sequences:[],matchups:[],training:[]};
}

/** Exact names are comparison candidates, never proof of canonical identity. */
export function compareArjunExistingNames(batch: ArjunIntake, existing: { id: string; name: string }[]) {
  const seen = new Set<string>();
  const rows = batch.moves.map(move => {
    const confirmed = batch.patch.verified && move.name.status === "CONFIRMED" && typeof move.name.value === "string";
    const matches = confirmed ? existing.filter(row => row.name === move.name.value) : [];
    for (const row of matches) seen.add(row.id);
    return { localKey: move.localKey, legacyPlaceholderIds: matches.map(row => row.id),
      status: !confirmed ? "UNCONFIRMED" : matches.length === 1 ? "EXACT_NAME_CANDIDATE" : "NEW_OR_NAME_MISMATCH",
      canonicalMapping: "OWNER_REVIEW_REQUIRED" };
  });
  return { rows, oldNamesNotSeen: existing.filter(row => !seen.has(row.id)).map(row => ({...row,status:"NOT_SEEN_IN_PARTIAL_INTAKE"})),
    removalAllowed: false };
}
